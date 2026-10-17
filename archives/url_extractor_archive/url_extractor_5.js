
import fs from 'node:fs/promises';
import path from 'node:path';
import axios from 'axios';

// BIG HEAVY SEARCHER
const PAGE_SIZE = 100;
const MAX_PAGES_PER_SOURCE = 5;
const MAX_RETRIES = 2;
const TIMEOUT = 15000;
const CONCURRENCY = 5;

export async function url_extractor(task_state) {
  const { task_id, search_prompt } = task_state ?? {};

  if (
    typeof task_id !== 'string' || !task_id.trim() ||
    typeof search_prompt !== 'string' || !search_prompt.trim()
  ) {
    throw new Error('task_id and search_prompt are required.');
  }

  if (
    task_id !== path.basename(task_id) ||
    task_id === '.' || task_id === '..'
  ) {
    throw new Error('Invalid task_id.');
  }

  const root = path.join(
    process.cwd(), 'agents', 'researcher', 'workspace'
  );
  const workspaceDir = path.join(root, task_id);
  const urlsFile = path.join(workspaceDir, 'research_urls.json');
  const stateFile = path.join(workspaceDir, 'task_state.json');

  await fs.mkdir(workspaceDir, { recursive: true });

  let state = {};

  try {
    state = JSON.parse(await fs.readFile(stateFile, 'utf8'));
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
  }

  const reset =
    state.process_states?.url_collection === 'failed';

  let existing = [];

  try {
    const data = JSON.parse(await fs.readFile(urlsFile, 'utf8'));

    if (!Array.isArray(data)) {
      throw new Error('research_urls.json must contain an array.');
    }

    existing = data
      .map(x => typeof x === 'string' ? x : x?.url)
      .filter(isHttpUrl);
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
  }

  const query = search_prompt.trim();
  const q = encodeURIComponent(query);
  const qp = new URLSearchParams({ q: query }).toString();

  // Each source has its own pagination strategy.
  const sources = [
    {
      name: 'DuckDuckGo',
      pages: 5,
      get: p => `https://html.duckduckgo.com/html/?q=${q}&s=${(p - 1) * 30}`,
      parse: parseHtml,
      size: 30
    },
    {
      name: 'Wikipedia',
      pages: 1,
      get: () => `https://en.wikipedia.org/w/api.php?action=opensearch&search=${q}&limit=10&namespace=0&format=json`,
      parse: d => JSON.parse(d)[3] || []
    },
    {
      name: 'Wikipedia REST',
      pages: 3,
      get: p => `https://en.wikipedia.org/w/rest.php/v1/search/page?q=${q}&limit=100&offset=${(p - 1) * 100}`,
      parse: d => (JSON.parse(d).pages || []).map(
        x => `https://en.wikipedia.org/wiki/${encodeURIComponent(x.key)}`
      ),
      size: 100
    },
    {
      name: 'Wikidata',
      pages: 1,
      get: () => `https://www.wikidata.org/w/api.php?action=wbsearchentities&search=${q}&language=en&format=json&limit=50`,
      parse: d => (JSON.parse(d).search || []).map(
        x => `https://www.wikidata.org/wiki/${x.id}`
      )
    },
    {
      name: 'Wikimedia Commons',
      pages: 3,
      get: p => `https://commons.wikimedia.org/w/api.php?action=query&list=search&srsearch=${q}&srlimit=50&sroffset=${(p - 1) * 50}&format=json`,
      parse: d => (JSON.parse(d).query?.search || []).map(
        x => `https://commons.wikimedia.org/wiki/${encodeURIComponent(x.title.replace(/ /g, '_'))}`
      ),
      size: 50
    },
    {
      name: 'arXiv',
      pages: 5,
      get: p => `https://export.arxiv.org/api/query?search_query=all:${q}&start=${(p - 1) * 100}&max_results=100`,
      parse: d => [...d.matchAll(/<id>\s*(https?:\/\/[^<]+)\s*<\/id>/gi)]
        .map(m => decodeEntities(m[1].trim())),
      size: 100
    },
    {
      name: 'Crossref',
      pages: 5,
      get: p => `https://api.crossref.org/works?query.bibliographic=${q}&rows=100&offset=${(p - 1) * 100}`,
      parse: d => (JSON.parse(d).message?.items || []).map(x => x.URL),
      size: 100
    },
    {
      name: 'OpenAlex',
      pages: 5,
      get: p => `https://api.openalex.org/works?search=${q}&per-page=100&page=${p}`,
      parse: d => (JSON.parse(d).results || []).map(
        x => x.doi || x.primary_location?.landing_page_url
      ),
      size: 100
    },
    {
      name: 'Semantic Scholar',
      pages: 5,
      get: p => `https://api.semanticscholar.org/graph/v1/paper/search?query=${q}&limit=100&offset=${(p - 1) * 100}&fields=url,openAccessPdf`,
      parse: d => (JSON.parse(d).data || []).flatMap(
        x => [x.url, x.openAccessPdf?.url]
      ),
      size: 100
    },
    {
      name: 'Europe PMC',
      pages: 5,
      get: p => `https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=${q}&format=json&pageSize=100&page=${p}`,
      parse: d => (JSON.parse(d).resultList?.result || []).map(
        x => x.doi
          ? `https://doi.org/${x.doi}`
          : x.pmid ? `https://europepmc.org/article/MED/${x.pmid}` : null
      ),
      size: 100
    },
    {
      name: 'PubMed',
      pages: 5,
      get: p => `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&term=${q}&retmax=100&retstart=${(p - 1) * 100}&retmode=json`,
      parse: d => (JSON.parse(d).esearchresult?.idlist || []).map(
        id => `https://pubmed.ncbi.nlm.nih.gov/${id}/`
      ),
      size: 100
    },
    {
      name: 'Hacker News',
      pages: 5,
      get: p => `https://hn.algolia.com/api/v1/search?query=${q}&hitsPerPage=100&page=${p - 1}`,
      parse: d => (JSON.parse(d).hits || []).map(
        x => x.url || `https://news.ycombinator.com/item?id=${x.objectID}`
      ),
      size: 100
    },
    {
      name: 'Stack Overflow',
      pages: 5,
      get: p => `https://api.stackexchange.com/2.3/search/advanced?order=desc&sort=relevance&q=${q}&site=stackoverflow&pagesize=100&page=${p}`,
      parse: d => (JSON.parse(d).items || []).map(x => x.link),
      size: 100
    },
    {
      name: 'Reddit',
      pages: 3,
      get: p => `https://www.reddit.com/search.json?q=${q}&limit=100&sort=relevance`,
      parse: d => (JSON.parse(d).data?.children || []).map(
        x => x.data?.url
      ),
      size: 100,
      onePage: true
    },
    {
      name: 'GitHub',
      pages: 5,
      get: p => `https://api.github.com/search/repositories?q=${q}&per_page=100&page=${p}`,
      parse: d => (JSON.parse(d).items || []).map(x => x.html_url),
      size: 100
    },
    {
      name: 'GitLab',
      pages: 5,
      get: p => `https://gitlab.com/api/v4/projects?search=${q}&per_page=100&page=${p}`,
      parse: d => JSON.parse(d).map(x => x.web_url),
      size: 100
    },
    {
      name: 'Google Books',
      pages: 5,
      get: p => `https://www.googleapis.com/books/v1/volumes?q=${q}&maxResults=40&startIndex=${(p - 1) * 40}`,
      parse: d => (JSON.parse(d).items || []).map(
        x => x.volumeInfo?.infoLink
      ),
      size: 40
    },
    {
      name: 'Open Library',
      pages: 5,
      get: p => `https://openlibrary.org/search.json?q=${q}&limit=100&page=${p}`,
      parse: d => (JSON.parse(d).docs || []).map(
        x => x.key ? `https://openlibrary.org${x.key}` : null
      ),
      size: 100
    },
    {
      name: 'Internet Archive',
      pages: 5,
      get: p => `https://archive.org/advancedsearch.php?q=${q}&fl%5B%5D=identifier&rows=100&page=${p}&output=json`,
      parse: d => (JSON.parse(d).response?.docs || []).map(
        x => `https://archive.org/details/${x.identifier}`
      ),
      size: 100
    },
    {
      name: 'GDELT',
      pages: 5,
      get: p => `https://api.gdeltproject.org/api/v2/doc/doc?query=${q}&mode=ArtList&maxrecords=250&startrecord=${(p - 1) * 250}&format=json`,
      parse: d => (JSON.parse(d).articles || []).map(x => x.url),
      size: 250
    },
    {
      name: 'DEV Community',
      pages: 5,
      get: p => `https://dev.to/api/articles?per_page=100&page=${p}&tag=${q}`,
      parse: d => JSON.parse(d).map(x => x.url),
      size: 100
    },
    {
      name: 'Hugging Face',
      pages: 5,
      get: p => `https://huggingface.co/api/models?search=${q}&limit=100&sort=downloads`,
      parse: d => JSON.parse(d).map(x => `https://huggingface.co/${x.id}`),
      size: 100,
      onePage: true
    },
    {
      name: 'npm',
      pages: 5,
      get: p => `https://registry.npmjs.org/-/v1/search?text=${q}&size=250&from=${(p - 1) * 250}`,
      parse: d => (JSON.parse(d).objects || []).map(
        x => x.package?.links?.npm
      ),
      size: 250
    },
    {
      name: 'Super User',
      pages: 5,
      get: p => `https://api.stackexchange.com/2.3/search/advanced?order=desc&sort=relevance&q=${q}&site=superuser&pagesize=100&page=${p}`,
      parse: d => (JSON.parse(d).items || []).map(x => x.link),
      size: 100
    },
    {
      name: 'Qwant',
      pages: 1,
      get: () => `https://api.qwant.com/v3/search/web?t=web&q=${q}&count=10&locale=en_US`,
      parse: d => (JSON.parse(d).data?.result?.items?.main || []).map(x => x.url)
    },
    {
      name: 'Mojeek',
      pages: 5,
      get: p => `https://www.mojeek.com/search?q=${q}&page=${p}`,
      parse: parseHtml,
      size: 10
    },
    {
      name: 'Brave Search',
      pages: 5,
      get: p => `https://search.brave.com/search?q=${q}&offset=${(p - 1) * 20}`,
      parse: parseHtml,
      size: 20
    },
    {
      name: 'Yahoo Search',
      pages: 5,
      get: p => `https://search.yahoo.com/search?p=${q}&b=${(p - 1) * 10 + 1}`,
      parse: parseHtml,
      size: 10
    },
    {
      name: 'Bing Search',
      pages: 5,
      get: p => `https://www.bing.com/search?q=${q}&first=${(p - 1) * 10 + 1}`,
      parse: parseHtml,
      size: 10
    },
    {
      name: 'Google Search',
      pages: 5,
      get: p => `https://www.google.com/search?q=${q}&start=${(p - 1) * 10}`,
      parse: parseHtml,
      size: 10
    },
    {
      name: 'Wikipedia Category Search',
      pages: 1,
      get: () => `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${q}&srlimit=50&format=json`,
      parse: d => (JSON.parse(d).query?.search || []).map(
        x => `https://en.wikipedia.org/wiki/${encodeURIComponent(x.title.replace(/ /g, '_'))}`
      )
    }
  ];

  console.log({length: sources.length})

  const discovered = [];
  const succeeded = [];
  const failedSources = [];
  const sourceCounts = {};

  async function request(url) {
    let lastError;

    for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
      try {
        const response = await axios.get(url, {
          timeout: TIMEOUT,
          maxRedirects: 5,
          responseType: 'text',
          headers: {
            'User-Agent': 'Mozilla/5.0 (compatible; ResearchURLCollector/1.0)',
            Accept: 'application/json, application/xml, text/html, */*'
          }
        });

        return response.data;
      } catch (error) {
        lastError = error;

        if (attempt < MAX_RETRIES) {
          await new Promise(resolve =>
            setTimeout(resolve, 500 * (attempt + 1))
          );
        }
      }
    }

    throw lastError;
  }

  async function collectSource(source) {
    const found = [];
    const maxPages = Math.min(
      source.pages ?? MAX_PAGES_PER_SOURCE,
      MAX_PAGES_PER_SOURCE
    );

    for (let page = 1; page <= maxPages; page++) {
      try {
        const data = await request(source.get(page));
        const urls = source.parse(data).filter(isHttpUrl);

        found.push(...urls);

        console.log(
          `${source.name} page ${page}: ${urls.length} URLs`
        );

        if (
          source.onePage ||
          (source.size && urls.length < source.size) ||
          urls.length === 0
        ) {
          break;
        }
      } catch (error) {
        console.error(
          `${source.name} page ${page} failed: ${error.message}`
        );

        if (page === 1) throw error;
        break;
      }
    }

    return { name: source.name, urls: found };
  }

  // Limit concurrent sources to reduce rate limiting.
  for (let i = 0; i < sources.length; i += CONCURRENCY) {
    const batch = sources.slice(i, i + CONCURRENCY);

    const outcomes = await Promise.allSettled(
      batch.map(collectSource)
    );

    for (let j = 0; j < outcomes.length; j++) {
      const result = outcomes[j];
      const source = batch[j];

      if (result.status === 'fulfilled') {
        succeeded.push(source.name);
        sourceCounts[source.name] = result.value.urls.length;
        discovered.push(...result.value.urls);
      } else {
        failedSources.push(source.name);
        sourceCounts[source.name] = 0;
      }
    }
  }

  if (succeeded.length === 0) {
    await fs.writeFile(stateFile, JSON.stringify({
      ...state,
      process_states: {
        ...state.process_states,
        url_collection: 'failed'
      }
    }, null, 2), 'utf8');

    throw new Error('All sources failed. Existing URLs were preserved.');
  }

  const combined = [...(reset ? [] : existing), ...discovered];
  const seen = new Set();
  const results = [];

  for (const value of combined) {
    const url = normalizeUrl(value);

    if (!url || seen.has(url)) continue;

    seen.add(url);
    results.push({ id: results.length + 1, url });
  }

  await fs.writeFile(
    urlsFile,
    JSON.stringify(results, null, 2),
    'utf8'
  );

  const status = results.length > 0
    ? 'completed'
    : 'completed_with_few_results';

  await fs.writeFile(stateFile, JSON.stringify({
    ...state,
    process_states: {
      ...state.process_states,
      url_collection: status
    }
  }, null, 2), 'utf8');

  return {
    success: results.length > 0,
    urls_collected: results.length,
    new_urls_collected: discovered.length,
    sources_attempted: sources.length,
    sources_succeeded: succeeded.length,
    sources_failed: failedSources.length,
    failed_sources: failedSources,
    source_counts: sourceCounts,
    max_pages_per_source: MAX_PAGES_PER_SOURCE,
    workspace: workspaceDir
  };
}

function isHttpUrl(value) {
  if (typeof value !== 'string') return false;

  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

function normalizeUrl(value) {
  try {
    const url = new URL(value);

    if (!['http:', 'https:'].includes(url.protocol)) return null;

    url.hash = '';

    for (const key of [...url.searchParams.keys()]) {
      if (/^(utm_.+|fbclid|gclid)$/i.test(key)) {
        url.searchParams.delete(key);
      }
    }

    return url.href;
  } catch {
    return null;
  }
}

function parseHtml(html) {
  const urls = [];
  const regex = /<a\b[^>]*\bhref\s*=\s*(["'])(.*?)\1[^>]*>/gi;
  let match;

  while ((match = regex.exec(html)) !== null) {
    let href = decodeEntities(match[2].trim());

    try {
      const parsed = new URL(href, 'https://example.com');

      if (
        parsed.hostname.endsWith('duckduckgo.com') &&
        parsed.searchParams.has('uddg')
      ) {
        href = parsed.searchParams.get('uddg');
      }

      if (isHttpUrl(href)) urls.push(href);
    } catch {
      // Ignore malformed links.
    }
  }

  return urls;
}

function decodeEntities(value) {
  return value
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&apos;/g, "'");
}

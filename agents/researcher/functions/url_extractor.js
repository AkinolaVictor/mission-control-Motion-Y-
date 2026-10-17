
import fs from 'node:fs/promises';
import path from 'node:path';
import axios from 'axios';

// GOOD HEAVY SEARCHER
const LIMIT = 10;
const TIMEOUT = 12000;
const MAX_RETRIES = 1;

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

  const reset = state.process_states?.url_collection === 'failed';
  let existing = [];

  try {
    const data = JSON.parse(await fs.readFile(urlsFile, 'utf8'));

    if (!Array.isArray(data)) {
      throw new Error('research_urls.json must contain an array.');
    }

    existing = data
      .map(item => typeof item === 'string' ? item : item?.url)
      .filter(isHttpUrl);
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
  }

  const query = search_prompt.trim();
  const q = encodeURIComponent(query);
  const qPlus = encodeURIComponent(query).replace(/%20/g, '+');

  // Thirty independently queried sources.
  const sources = [
    {
      name: 'DuckDuckGo',
      url: `https://html.duckduckgo.com/html/?q=${qPlus}`,
      parse: parseHtml
    },
    {
      name: 'Wikipedia',
      url: `https://en.wikipedia.org/w/api.php?action=opensearch&search=${q}&limit=10&namespace=0&format=json`,
      parse: d => {
        const x = JSON.parse(d);
        return (x[3] || []).concat(
          (x[1] || []).map(t =>
            `https://en.wikipedia.org/wiki/${encodeURIComponent(t.replace(/ /g, '_'))}`
          )
        );
      }
    },
    {
      name: 'Wikidata',
      url: `https://www.wikidata.org/w/api.php?action=wbsearchentities&search=${q}&language=en&format=json&limit=10`,
      parse: d => (JSON.parse(d).search || [])
        .map(x => `https://www.wikidata.org/wiki/${x.id}`)
    },
    {
      name: 'Wikimedia Commons',
      url: `https://commons.wikimedia.org/w/api.php?action=query&list=search&srsearch=${q}&srnamespace=0&srlimit=10&format=json`,
      parse: d => (JSON.parse(d).query?.search || [])
        .map(x => `https://commons.wikimedia.org/wiki/${encodeURIComponent(x.title.replace(/ /g, '_'))}`)
    },
    {
      name: 'arXiv',
      url: `https://export.arxiv.org/api/query?search_query=all:${q}&start=0&max_results=10`,
      parse: d => [...d.matchAll(/<id>\s*(https?:\/\/[^<]+)\s*<\/id>/gi)]
        .map(m => decodeEntities(m[1].trim()))
    },
    {
      name: 'Crossref',
      url: `https://api.crossref.org/works?query.bibliographic=${q}&rows=10`,
      parse: d => (JSON.parse(d).message?.items || [])
        .map(x => x.URL)
    },
    {
      name: 'OpenAlex',
      url: `https://api.openalex.org/works?search=${q}&per-page=10`,
      parse: d => (JSON.parse(d).results || [])
        .map(x => x.doi || x.primary_location?.landing_page_url)
    },
    {
      name: 'Semantic Scholar',
      url: `https://api.semanticscholar.org/graph/v1/paper/search?query=${q}&limit=10&fields=url,openAccessPdf`,
      parse: d => (JSON.parse(d).data || [])
        .flatMap(x => [x.url, x.openAccessPdf?.url])
    },
    {
      name: 'Europe PMC',
      url: `https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=${q}&format=json&pageSize=10`,
      parse: d => (JSON.parse(d).resultList?.result || [])
        .map(x => x.doi
          ? `https://doi.org/${x.doi}`
          : `https://europepmc.org/article/MED/${x.pmid}`)
    },
    {
      name: 'PubMed',
      url: `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&term=${q}&retmax=10&retmode=json`,
      parse: d => (JSON.parse(d).esearchresult?.idlist || [])
        .map(id => `https://pubmed.ncbi.nlm.nih.gov/${id}/`)
    },
    {
      name: 'Hacker News',
      url: `https://hn.algolia.com/api/v1/search?query=${q}&hitsPerPage=10`,
      parse: d => (JSON.parse(d).hits || [])
        .map(x => x.url || `https://news.ycombinator.com/item?id=${x.objectID}`)
    },
    {
      name: 'Stack Overflow',
      url: `https://api.stackexchange.com/2.3/search/advanced?order=desc&sort=relevance&q=${q}&site=stackoverflow&pagesize=10`,
      parse: d => (JSON.parse(d).items || []).map(x => x.link)
    },
    {
      name: 'Reddit',
      url: `https://www.reddit.com/search.json?q=${q}&limit=10&sort=relevance`,
      parse: d => (JSON.parse(d).data?.children || [])
        .map(x => x.data?.url)
    },
    {
      name: 'GitHub',
      url: `https://api.github.com/search/repositories?q=${q}&per_page=10`,
      parse: d => (JSON.parse(d).items || []).map(x => x.html_url)
    },
    {
      name: 'GitLab',
      url: `https://gitlab.com/api/v4/projects?search=${q}&per_page=10`,
      parse: d => JSON.parse(d).map(x => x.web_url)
    },
    {
      name: 'Google Books',
      url: `https://www.googleapis.com/books/v1/volumes?q=${q}&maxResults=10`,
      parse: d => (JSON.parse(d).items || [])
        .map(x => x.volumeInfo?.infoLink)
    },
    {
      name: 'Open Library',
      url: `https://openlibrary.org/search.json?q=${q}&limit=10`,
      parse: d => (JSON.parse(d).docs || [])
        .map(x => x.key ? `https://openlibrary.org${x.key}` : null)
    },
    {
      name: 'Internet Archive',
      url: `https://archive.org/advancedsearch.php?q=${q}&fl%5B%5D=identifier&rows=10&page=1&output=json`,
      parse: d => (JSON.parse(d).response?.docs || [])
        .map(x => `https://archive.org/details/${x.identifier}`)
    },
    {
      name: 'GDELT News',
      url: `https://api.gdeltproject.org/api/v2/doc/doc?query=${q}&mode=ArtList&maxrecords=10&format=json`,
      parse: d => (JSON.parse(d).articles || []).map(x => x.url)
    },
    {
      name: 'DEV Community',
      url: `https://dev.to/api/articles?per_page=10&tag=${q}`,
      parse: d => JSON.parse(d).map(x => x.url)
    },
    {
      name: 'Hugging Face',
      url: `https://huggingface.co/api/models?search=${q}&limit=10`,
      parse: d => JSON.parse(d)
        .map(x => `https://huggingface.co/${x.id}`)
    },
    {
      name: 'npm',
      url: `https://registry.npmjs.org/-/v1/search?text=${q}&size=10`,
      parse: d => (JSON.parse(d).objects || [])
        .map(x => x.package?.links?.npm)
    },
    {
      name: 'Stack Exchange Network',
      url: `https://api.stackexchange.com/2.3/search/advanced?order=desc&sort=relevance&q=${q}&site=superuser&pagesize=10`,
      parse: d => (JSON.parse(d).items || []).map(x => x.link)
    },
    {
      name: 'Wikipedia REST',
      url: `https://en.wikipedia.org/w/rest.php/v1/search/page?q=${q}&limit=10`,
      parse: d => (JSON.parse(d).pages || [])
        .map(x => x.key
          ? `https://en.wikipedia.org/wiki/${encodeURIComponent(x.key)}`
          : null)
    },
    {
      name: 'Qwant',
      url: `https://api.qwant.com/v3/search/web?t=web&q=${q}&count=10&locale=en_US`,
      parse: d => (JSON.parse(d).data?.result?.items?.main || [])
        .map(x => x.url)
    },
    {
      name: 'Mojeek',
      url: `https://www.mojeek.com/search?q=${qPlus}`,
      parse: parseHtml
    },
    {
      name: 'Brave Search',
      url: `https://search.brave.com/search?q=${qPlus}`,
      parse: parseHtml
    },
    {
      name: 'Yahoo Search',
      url: `https://search.yahoo.com/search?p=${qPlus}`,
      parse: parseHtml
    },
    {
      name: 'Bing Search',
      url: `https://www.bing.com/search?q=${qPlus}`,
      parse: parseHtml
    },
    {
      name: 'Google Search',
      url: `https://www.google.com/search?q=${qPlus}`,
      parse: parseHtml
    }
  ];

  const discovered = [];
  const succeeded = [];
  const failedSources = [];

  // Each source is isolated, so one failure cannot stop other searches.
  const outcomes = await Promise.allSettled(
    sources.map(async source => {
      console.log(`Searching ${source.name}...`);

      let lastError;

      for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
        try {
          const response = await axios.get(source.url, {
            timeout: TIMEOUT,
            maxRedirects: 5,
            responseType: 'text',
            headers: {
              'User-Agent': 'Mozilla/5.0 (compatible; ResearchURLCollector/1.0)',
              Accept: 'text/html,application/json,application/xml,*/*'
            }
          });
          const useLimit = source.name=="Wikipedia" || source.name=="Wikipedia REST"?
                            LIMIT*2:
                            LIMIT
          const found = source.parse(response.data)
            .filter(isHttpUrl)
            .map(normalizeUrl)
            .filter(Boolean)
            .slice(0, useLimit);

          if (found.length === 0) {
            throw new Error('No valid URLs returned');
          }

          console.log(`${source.name}: ${found.length} URLs`);
          return { name: source.name, urls: found };
        } catch (error) {
          lastError = error;

          if (attempt < MAX_RETRIES) {
            await new Promise(resolve => setTimeout(resolve, 500));
          }
        }
      }

      throw new Error(`${source.name}: ${lastError?.message}`);
    })
  );

  for (let i = 0; i < outcomes.length; i++) {
    const result = outcomes[i];

    if (result.status === 'fulfilled') {
      succeeded.push(result.value.name);
      discovered.push(...result.value.urls);
    } else {
      failedSources.push(sources[i].name);
      console.error(result.reason.message);
    }
  }

  if (succeeded.length === 0) {
    await fs.writeFile(stateFile, JSON.stringify({
      ...state,
      status:"failed",
      attempt: state.attempt+1,
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

  await fs.writeFile(stateFile, JSON.stringify({
    ...state,
    attempt: state.attempt+1,
    status: "ongoing",
    process_states: {
      ...state.process_states,
      url_collection: 'completed'
    //   url_collection: results.length >= LIMIT
    //     ? 'completed'
    //     : 'completed_with_few_results'
    }
  }, null, 2), 'utf8');

  return {
    success: results.length >= LIMIT,
    urls_collected: results.length,
    new_urls_collected: discovered.length,
    sources_attempted: sources.length,
    sources_succeeded: succeeded.length,
    sources_failed: failedSources.length,
    failed_sources: failedSources,
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

      // DuckDuckGo redirect URLs contain the real URL in uddg.
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

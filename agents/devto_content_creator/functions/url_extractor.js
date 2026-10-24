import fs from 'node:fs/promises';
import path from 'node:path';
import axios from 'axios';

const LIMIT = 5;
const TIMEOUT = 12000;
const MAX_RETRIES = 1;

export async function url_extractor(task_state) {
  const { task_id, search_prompt, sub_questions = [] } = task_state ?? {};

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

  if (!Array.isArray(sub_questions)) {
    throw new Error('sub_questions must be an array.');
  }

  const questions = sub_questions
    .filter(question => typeof question === 'string' && question.trim())
    .map(question => question.trim());

  // Search the main prompt and every sub-question.
  const queries = [...new Set([search_prompt.trim(), ...questions])];

  const root = path.join(
    process.cwd(),
    'agents',
    'devto_content_creator',
    'workspace'
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

  // Read existing URLs. Supports both the old array and new object format.
  let existing = {};

  try {
    const data = JSON.parse(await fs.readFile(urlsFile, 'utf8'));

    if (Array.isArray(data)) {
      existing[search_prompt.trim()] = data
        .map(item => typeof item === 'string' ? item : item?.url)
        .filter(isHttpUrl);
    } else if (data && typeof data === 'object') {
      for (const [query, urls] of Object.entries(data)) {
        if (Array.isArray(urls)) {
          existing[query] = urls.filter(isHttpUrl);
        }
      }
    } else {
      throw new Error(
        'research_urls.json must contain an object of URL arrays.'
      );
    }
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
  }

  const resultsByQuery = reset ? {} : { ...existing };
  const failedSources = [];
  const queryResults = [];

  let totalSourcesAttempted = 0;
  let totalSourcesSucceeded = 0;
  let totalNewUrls = 0;

  // Research each query independently.
  let i = 1
  for (const query of queries) {
    const sources = buildSources(query);
    i++

    totalSourcesAttempted += sources.length;

    const discovered = [];
    const succeeded = [];

    const outcomes = await Promise.allSettled(
      sources.map(async source => {
        // console.log(`[${query}] Searching ${source.name}...`);
        console.log(`Source ${i}/${queries.length}: Searching ${source.name}...`);

        let lastError;

        for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
          try {
            const response = await axios.get(source.url, {
              timeout: TIMEOUT,
              maxRedirects: 5,
              responseType: 'text',
              headers: {
                'User-Agent':
                  'Mozilla/5.0 (compatible; ResearchURLCollector/1.0)',
                Accept: 'text/html,application/json,application/xml,*/*'
              }
            });

            const useLimit =
              source.name === 'Wikipedia' ||
              source.name === 'Wikipedia REST'
                ? LIMIT * 2
                : LIMIT;

            const found = source.parse(response.data)
              .filter(isHttpUrl)
              .map(normalizeUrl)
              .filter(Boolean)
              .filter(url => !isSearchOrTrackingUrl(url))
              .slice(0, useLimit);

            if (found.length === 0) {
              throw new Error('No valid URLs returned');
            }

            console.log(
              `[${query}] ${source.name}: ${found.length} URLs`
            );

            return {
              name: source.name,
              urls: found
            };
          } catch (error) {
            lastError = error;

            if (attempt < MAX_RETRIES) {
              await new Promise(resolve => setTimeout(resolve, 500));
            }
          }
        }

        throw new Error(
          `${source.name}: ${lastError?.message}`
        );
      })
    );

    // Collect successful source results.
    for (let i = 0; i < outcomes.length; i++) {
      const result = outcomes[i];

      if (result.status === 'fulfilled') {
        succeeded.push(result.value.name);
        discovered.push(...result.value.urls);
      } else {
        failedSources.push({
          query,
          source: sources[i].name
        });

        console.error(
          `[${query}] ${result.reason.message}`
        );
      }
    }

    // Merge and deduplicate URLs for this query only.
    if (succeeded.length > 0) {
      const combined = [
        ...(reset ? [] : (resultsByQuery[query] || [])),
        ...discovered
      ];

      const seen = new Set();
      resultsByQuery[query] = [];

      for (const value of combined) {
        const url = normalizeUrl(value);

        if (!url || seen.has(url)) continue;

        seen.add(url);
        resultsByQuery[query].push(url);
      }
    } else if (!Array.isArray(resultsByQuery[query])) {
      resultsByQuery[query] = [];
    }

    totalSourcesSucceeded += succeeded.length;
    totalNewUrls += discovered.length;

    queryResults.push({
      query,
      urls_collected: (resultsByQuery[query] || []).length,
      new_urls_collected: new Set(
        discovered.map(normalizeUrl).filter(Boolean)
      ).size,
      sources_succeeded: succeeded.length,
      sources_failed: sources.length - succeeded.length
    });
  }

  // If every source failed, preserve existing files and mark failure.
  if (totalSourcesSucceeded === 0) {
    await fs.writeFile(
      stateFile,
      JSON.stringify({
        ...state,
        status: 'failed',
        attempt: (state.attempt || 0) + 1,
        process_states: {
          ...state.process_states,
          url_collection: 'failed'
        }
      }, null, 2),
      'utf8'
    );

    throw new Error(
      'All sources failed. Existing URLs were preserved.'
    );
  }

  // Ensure every requested query has its own array.
  for (const query of queries) {
    if (!Array.isArray(resultsByQuery[query])) {
      resultsByQuery[query] = [];
    }
  }

  // Save the new research_urls.json format.
  await fs.writeFile(
    urlsFile,
    JSON.stringify(resultsByQuery, null, 2),
    'utf8'
  );

  // Update task state.
  await fs.writeFile(
    stateFile,
    JSON.stringify({
      ...state,
      attempt: (state.attempt || 0) + 1,
      status: 'ongoing',
      process_states: {
        ...state.process_states,
        url_collection: 'completed'
      }
    }, null, 2),
    'utf8'
  );

  const totalUrls = queries.reduce(
    (sum, query) =>
      sum + (resultsByQuery[query]?.length || 0),
    0
  );

  return {
    success: queryResults.every(
      item => item.urls_collected >= LIMIT
    ),
    urls_collected: totalUrls,
    new_urls_collected: totalNewUrls,
    queries_processed: queries.length,
    sources_attempted: totalSourcesAttempted,
    sources_succeeded: totalSourcesSucceeded,
    sources_failed: failedSources.length,
    failed_sources: failedSources,
    query_results: queryResults,
    workspace: workspaceDir
  };
}

function buildSources(query) {
  const q = encodeURIComponent(query);
  const qPlus = q.replace(/%20/g, '+');

  return [
    {
      name: 'DuckDuckGo',
      url: `https://html.duckduckgo.com/html/?q=${qPlus}`,
      parse: parseHtml
    },
    {
      name: 'Wikipedia',
      url: `https://en.wikipedia.org/w/api.php?action=opensearch&search=${q}&limit=10&namespace=0&format=json`,
      parse: data => {
        const x = JSON.parse(data);

        return (x[3] || []).concat(
          (x[1] || []).map(title =>
            `https://en.wikipedia.org/wiki/${encodeURIComponent(
              title.replace(/ /g, '_')
            )}`
          )
        );
      }
    },
    {
      name: 'Wikidata',
      url: `https://www.wikidata.org/w/api.php?action=wbsearchentities&search=${q}&language=en&format=json&limit=10`,
      parse: data =>
        (JSON.parse(data).search || [])
          .map(item => `https://www.wikidata.org/wiki/${item.id}`)
    },
    {
      name: 'Wikimedia Commons',
      url: `https://commons.wikimedia.org/w/api.php?action=query&list=search&srsearch=${q}&srnamespace=0&srlimit=10&format=json`,
      parse: data =>
        (JSON.parse(data).query?.search || [])
          .map(item =>
            `https://commons.wikimedia.org/wiki/${encodeURIComponent(
              item.title.replace(/ /g, '_')
            )}`
          )
    },
    {
      name: 'arXiv',
      url: `https://export.arxiv.org/api/query?search_query=all:${q}&start=0&max_results=10`,
      parse: data =>
        [...data.matchAll(/<id>\s*(https?:\/\/[^<]+)\s*<\/id>/gi)]
          .map(match => decodeEntities(match[1].trim()))
    },
    {
      name: 'Crossref',
      url: `https://api.crossref.org/works?query.bibliographic=${q}&rows=10`,
      parse: data =>
        (JSON.parse(data).message?.items || [])
          .map(item => item.URL)
    },
    {
      name: 'OpenAlex',
      url: `https://api.openalex.org/works?search=${q}&per-page=10`,
      parse: data =>
        (JSON.parse(data).results || [])
          .map(item =>
            item.doi || item.primary_location?.landing_page_url
          )
    },
    {
      name: 'Semantic Scholar',
      url: `https://api.semanticscholar.org/graph/v1/paper/search?query=${q}&limit=10&fields=url,openAccessPdf`,
      parse: data =>
        (JSON.parse(data).data || [])
          .flatMap(item => [
            item.url,
            item.openAccessPdf?.url
          ])
    },
    {
      name: 'Europe PMC',
      url: `https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=${q}&format=json&pageSize=10`,
      parse: data =>
        (JSON.parse(data).resultList?.result || [])
          .map(item =>
            item.doi
              ? `https://doi.org/${item.doi}`
              : item.pmid
                ? `https://europepmc.org/article/MED/${item.pmid}`
                : null
          )
    },
    {
      name: 'PubMed',
      url: `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&term=${q}&retmax=10&retmode=json`,
      parse: data =>
        (JSON.parse(data).esearchresult?.idlist || [])
          .map(id => `https://pubmed.ncbi.nlm.nih.gov/${id}/`)
    },
    {
      name: 'Hacker News',
      url: `https://hn.algolia.com/api/v1/search?query=${q}&hitsPerPage=10`,
      parse: data =>
        (JSON.parse(data).hits || [])
          .map(item =>
            item.url ||
            `https://news.ycombinator.com/item?id=${item.objectID}`
          )
    },
    {
      name: 'Stack Overflow',
      url: `https://api.stackexchange.com/2.3/search/advanced?order=desc&sort=relevance&q=${q}&site=stackoverflow&pagesize=10`,
      parse: data =>
        (JSON.parse(data).items || [])
          .map(item => item.link)
    },
    {
      name: 'Reddit',
      url: `https://www.reddit.com/search.json?q=${q}&limit=10&sort=relevance`,
      parse: data =>
        (JSON.parse(data).data?.children || [])
          .map(item => item.data?.url)
    },
    {
      name: 'GitHub',
      url: `https://api.github.com/search/repositories?q=${q}&per_page=10`,
      parse: data =>
        (JSON.parse(data).items || [])
          .map(item => item.html_url)
    },
    {
      name: 'GitLab',
      url: `https://gitlab.com/api/v4/projects?search=${q}&per_page=10`,
      parse: data =>
        JSON.parse(data).map(item => item.web_url)
    },
    {
      name: 'Google Books',
      url: `https://www.googleapis.com/books/v1/volumes?q=${q}&maxResults=10`,
      parse: data =>
        (JSON.parse(data).items || [])
          .map(item => item.volumeInfo?.infoLink)
    },
    {
      name: 'Open Library',
      url: `https://openlibrary.org/search.json?q=${q}&limit=10`,
      parse: data =>
        (JSON.parse(data).docs || [])
          .map(item =>
            item.key ? `https://openlibrary.org${item.key}` : null
          )
    },
    {
      name: 'Internet Archive',
      url: `https://archive.org/advancedsearch.php?q=${q}&fl%5B%5D=identifier&rows=10&page=1&output=json`,
      parse: data =>
        (JSON.parse(data).response?.docs || [])
          .map(item => `https://archive.org/details/${item.identifier}`)
    },
    {
      name: 'GDELT News',
      url: `https://api.gdeltproject.org/api/v2/doc/doc?query=${q}&mode=ArtList&maxrecords=10&format=json`,
      parse: data =>
        (JSON.parse(data).articles || [])
          .map(item => item.url)
    },
    {
      name: 'DEV Community',
      url: `https://dev.to/api/articles?per_page=10&tag=${q}`,
      parse: data =>
        JSON.parse(data).map(item => item.url)
    },
    {
      name: 'Hugging Face',
      url: `https://huggingface.co/api/models?search=${q}&limit=10`,
      parse: data =>
        JSON.parse(data)
          .map(item => `https://huggingface.co/${item.id}`)
    },
    {
      name: 'npm',
      url: `https://registry.npmjs.org/-/v1/search?text=${q}&size=10`,
      parse: data =>
        (JSON.parse(data).objects || [])
          .map(item => item.package?.links?.npm)
    },
    {
      name: 'Stack Exchange Network',
      url: `https://api.stackexchange.com/2.3/search/advanced?order=desc&sort=relevance&q=${q}&site=superuser&pagesize=10`,
      parse: data =>
        (JSON.parse(data).items || [])
          .map(item => item.link)
    },
    {
      name: 'Wikipedia REST',
      url: `https://en.wikipedia.org/w/rest.php/v1/search/page?q=${q}&limit=10`,
      parse: data =>
        (JSON.parse(data).pages || [])
          .map(item =>
            item.key
              ? `https://en.wikipedia.org/wiki/${encodeURIComponent(item.key)}`
              : null
          )
    },
    {
      name: 'Qwant',
      url: `https://api.qwant.com/v3/search/web?t=web&q=${q}&count=10&locale=en_US`,
      parse: data =>
        (JSON.parse(data).data?.result?.items?.main || [])
          .map(item => item.url)
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
    },
    // 31. Wiktionary — definitions and terminology
    {
      name: 'Wiktionary',
      url: `https://en.wiktionary.org/w/api.php?action=query&list=search&srsearch=${q}&srlimit=10&format=json`,
      parse: data =>
        (JSON.parse(data).query?.search || [])
          .map(item =>
            `https://en.wiktionary.org/wiki/${encodeURIComponent(
              item.title.replace(/ /g, '_')
            )}`
          )
    },

    // 32. Google News RSS
    {
      name: 'Google News',
      url: `https://news.google.com/rss/search?q=${q}&hl=en-US&gl=US&ceid=US:en`,
      parse: parseRssLinks
    },

    // 33. Bing News
    {
      name: 'Bing News',
      url: `https://www.bing.com/news/search?q=${qPlus}&format=RSS`,
      parse: parseRssLinks
    },

    // 34. Startpage Search
    {
      name: 'Startpage',
      url: `https://www.startpage.com/sp/search?query=${qPlus}`,
      parse: parseHtml
    },

    // 35. Ecosia Search
    {
      name: 'Ecosia',
      url: `https://www.ecosia.org/search?q=${qPlus}`,
      parse: parseHtml
    },

    // 36. Swisscows Search
    {
      name: 'Swisscows',
      url: `https://swisscows.com/en/web?query=${qPlus}`,
      parse: parseHtml
    },

    // 37. Library of Congress
    {
      name: 'Library of Congress',
      url: `https://www.loc.gov/search/?q=${q}&fo=json&c=10`,
      parse: data =>
        (JSON.parse(data).results || [])
          .map(item => item.url)
    },

    // 38. World Bank Documents
    {
      name: 'World Bank Documents',
      url: `https://search.worldbank.org/api/v2/wds?format=json&search=${q}&rows=10`,
      parse: data => {
        const json = JSON.parse(data);
        const docs = json.documents || {};
        return Object.values(docs)
          .filter(item => item && typeof item === 'object')
          .map(item =>
            item.pdfurl ||
            item.url ||
            (item.id
              ? `https://documents.worldbank.org/en/publication/documents-reports/documentdetail/${item.id}`
              : null)
          );
      }
    },

    // 39. Zenodo — research, datasets and publications
    {
      name: 'Zenodo',
      url: `https://zenodo.org/api/records?q=${q}&size=10`,
      parse: data =>
        (JSON.parse(data).hits?.hits || [])
          .map(item => item.links?.html)
    },

    // 40. DataCite — research outputs and DOI records
    {
      name: 'DataCite',
      url: `https://api.datacite.org/dois?query=${q}&page[size]=10`,
      parse: data =>
        (JSON.parse(data).data || [])
          .map(item =>
            item.attributes?.url ||
            (item.attributes?.doi
              ? `https://doi.org/${item.attributes.doi}`
              : null)
          )
    },

    // 41. DOAJ — open-access journal articles
    {
      name: 'DOAJ',
      url: `https://doaj.org/api/search/articles/${q}?page=1&pageSize=10`,
      parse: data =>
        (JSON.parse(data).results || [])
          .map(item =>
            item.bibjson?.link?.find(link => link.type === 'fulltext')?.url
          )
    },

    // 42. ERIC — education research
    {
      name: 'ERIC',
      url: `https://api.ies.ed.gov/eric/?search=${q}&format=json&rows=10`,
      parse: data =>
        (JSON.parse(data).response?.docs || [])
          .map(item =>
            item.url ||
            (item.id ? `https://eric.ed.gov/?id=${item.id}` : null)
          )
    },

    // 43. USGS ScienceBase — scientific data and reports
    {
      name: 'USGS ScienceBase',
      url: `https://www.sciencebase.gov/catalog/items?q=${q}&format=json&max=10`,
      parse: data =>
        (JSON.parse(data).items || [])
          .map(item => item.link?.url || item.webLink)
    },

    // 44. NASA Technical Reports Server
    {
      name: 'NASA NTRS',
      url: `https://ntrs.nasa.gov/api/citations/search?q=${q}&page.size=10`,
      parse: data =>
        (JSON.parse(data).results || [])
          .map(item =>
            item.id ? `https://ntrs.nasa.gov/citations/${item.id}` : null
          )
    },

    // 45. World Health Organization
    {
      name: 'WHO',
      url: `https://www.who.int/search?query=${q}`,
      parse: parseHtml
    },

    // 46. Encyclopaedia Britannica
    {
      name: 'Britannica',
      url: `https://www.britannica.com/search?query=${q}`,
      parse: parseHtml
    },

    // 47. Stanford Encyclopedia of Philosophy
    {
      name: 'Stanford Encyclopedia of Philosophy',
      url: `https://plato.stanford.edu/search/searcher.py?query=${qPlus}`,
      parse: parseHtml
    },

    // 48. Openverse — openly licensed media
    {
      name: 'Openverse',
      url: `https://api.openverse.org/v1/images/?q=${q}&page_size=10`,
      parse: data =>
        (JSON.parse(data).results || [])
          .map(item => item.foreign_landing_url || item.url)
    },

    // 49. Project Gutenberg — books and historical texts
    {
      name: 'Project Gutenberg',
      url: `https://www.gutenberg.org/ebooks/search/?query=${qPlus}`,
      parse: parseHtml
    },

    // 50. Google Dataset Search
    {
      name: 'Google Dataset Search',
      url: `https://datasetsearch.research.google.com/search?query=${qPlus}`,
      parse: parseHtml
    }

  ];
}

function parseRssLinks(xml) {
  const urls = [];
  const regex = /<link(?:\s[^>]*)?>([\s\S]*?)<\/link>/gi;

  let match;

  while ((match = regex.exec(xml)) !== null) {
    const value = decodeEntities(match[1].trim());

    if (isHttpUrl(value)) {
      urls.push(value);
    }
  }

  return urls;
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

function isSearchOrTrackingUrl(value) {
  try {
    const url = new URL(value);
    const host = url.hostname.toLowerCase();

    return [
      'google.com',
      'www.google.com',
      'bing.com',
      'www.bing.com',
      'search.yahoo.com',
      'search.brave.com',
      'www.mojeek.com',
      'html.duckduckgo.com',
      'api.qwant.com'
    ].includes(host);
  } catch {
    return true;
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

      if (isHttpUrl(href)) {
        urls.push(href);
      }
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
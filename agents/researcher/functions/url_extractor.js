
import fs from 'node:fs/promises';
import path from 'node:path';
import axios from 'axios';

const LIMIT = 7;
const TIMEOUT = 60000;

const client = axios.create({
  timeout: TIMEOUT,
  headers: {
    'User-Agent': 'MotionY-Researcher/1.0 (research URL collector)',
    Accept: 'application/json, application/xml, text/html, */*'
  }
});

function isHttpUrl(value) {
  try {
    const url = new URL(value);
    return ['http:', 'https:'].includes(url.protocol);
  } catch {
    return false;
  }
}

function normalizeUrl(value) {
  try {
    const url = new URL(value.trim());

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

function decodeEntities(value = '') {
  return value
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&apos;/g, "'");
}

function getXmlEntries(xml) {
  return [...xml.matchAll(/<entry\b[^>]*>([\s\S]*?)<\/entry>/gi)]
    .map(match => match[1]);
}

function getXmlTag(xml, tag) {
  const escaped = tag.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const match = xml.match(
    new RegExp(`<${escaped}\\b[^>]*>([\\s\\S]*?)<\\/${escaped}>`, 'i')
  );

  return match ? decodeEntities(match[1].replace(/<[^>]+>/g, '').trim()) : '';
}

function getDoiUrl(doi) {
  if (!doi) return null;
  return `https://doi.org/${doi.replace(/^https?:\/\/doi\.org\//i, '')}`;
}

// 1. DuckDuckGo
async function searchDuckDuckGo(query) {
  const { data } = await client.get(
    'https://html.duckduckgo.com/html/',
    { params: { q: query }, responseType: 'text' }
  );

  const urls = [];
  const regex = /<a\b[^>]*class=["'][^"']*\bresult__a\b[^"']*["'][^>]*href=["']([^"']+)["']/gi;

  for (const match of data.matchAll(regex)) {
    let href = decodeEntities(match[1]);

    try {
      const parsed = new URL(href, 'https://html.duckduckgo.com');

      if (parsed.hostname.endsWith('duckduckgo.com')) {
        href = parsed.searchParams.get('uddg') || href;
      }
    } catch {
      continue;
    }

    if (isHttpUrl(href)) urls.push(href);

    if (urls.length >= LIMIT) break;
  }

  return urls;
}

// 2. Wikipedia — use the URLs returned by its API directly.
async function searchWikipedia(query) {
  const { data } = await client.get(
    'https://en.wikipedia.org/w/api.php',
    {
      params: {
        action: 'opensearch',
        search: query,
        limit: LIMIT,
        namespace: 0,
        format: 'json',
        redirects: 'resolve'
      }
    }
  );

  if (!Array.isArray(data) || !Array.isArray(data[3])) {
    throw new Error('Unexpected Wikipedia API response.');
  }

  return data[3];
}

// 3. OpenAlex — scholarly publications
async function searchOpenAlex(query) {
  const { data } = await client.get(
    'https://api.openalex.org/works',
    {
      params: {
        search: query,
        per_page: LIMIT
      }
    }
  );

  return (data.results || []).map(item =>
    item.primary_location?.landing_page_url ||
    item.ids?.doi ||
    getDoiUrl(item.doi)
  ).filter(Boolean);
}

// 4. Crossref — research papers and publications
async function searchCrossref(query) {
  const { data } = await client.get(
    'https://api.crossref.org/works',
    {
      params: {
        query,
        rows: LIMIT,
        select: 'DOI,title,URL,type'
      }
    }
  );

  return (data.message?.items || [])
    .map(item => item.URL || getDoiUrl(item.DOI))
    .filter(Boolean);
}

// 5. arXiv — scientific papers
async function searchArxiv(query) {
  const { data } = await client.get(
    'https://export.arxiv.org/api/query',
    {
      params: {
        search_query: `all:${query}`,
        start: 0,
        max_results: LIMIT
      },
      responseType: 'text'
    }
  );

  return getXmlEntries(data)
    .map(entry => getXmlTag(entry, 'id'))
    .filter(Boolean);
}

// 6. Europe PMC — biomedical and life-science literature
async function searchEuropePMC(query) {
  const { data } = await client.get(
    'https://www.ebi.ac.uk/europepmc/webservices/rest/search',
    {
      params: {
        query,
        format: 'json',
        pageSize: LIMIT,
        resultType: 'core'
      }
    }
  );

  return (data.resultList?.result || []).map(item => {
    if (item.pmcid) {
      return `https://europepmc.org/articles/${item.pmcid}`;
    }

    if (item.doi) return getDoiUrl(item.doi);

    if (item.id) {
      return `https://europepmc.org/article/MED/${encodeURIComponent(item.id)}`;
    }

    return null;
  }).filter(Boolean);
}

// 7. Stack Exchange — technical questions and answers
async function searchStackExchange(query) {
  const { data } = await client.get(
    'https://api.stackexchange.com/2.3/search/advanced',
    {
      params: {
        order: 'desc',
        sort: 'relevance',
        q: query,
        site: 'stackoverflow',
        pagesize: LIMIT
      }
    }
  );

  return (data.items || []).map(item => item.link);
}

// 8. Hacker News — technology discussions
async function searchHackerNews(query) {
  const { data } = await client.get(
    'https://hn.algolia.com/api/v1/search',
    {
      params: {
        query,
        tags: 'story',
        hitsPerPage: LIMIT
      }
    }
  );

  return (data.hits || []).map(item =>
    item.url || item.story_url ||
    `https://news.ycombinator.com/item?id=${item.objectID}`
  );
}

// 9. GitHub — code repositories
async function searchGitHub(query) {
  const { data } = await client.get(
    'https://api.github.com/search/repositories',
    {
      params: {
        q: query,
        sort: 'stars',
        order: 'desc',
        per_page: LIMIT
      },
      headers: {
        Accept: 'application/vnd.github+json'
      }
    }
  );

  return (data.items || []).map(item => item.html_url);
}

// 10. Internet Archive — archived documents and media
async function searchInternetArchive(query) {
  const { data } = await client.get(
    'https://archive.org/advancedsearch.php',
    {
      params: {
        q: query,
        fl: ['identifier'],
        rows: LIMIT,
        page: 1,
        output: 'json'
      }
    }
  );

  return (data.response?.docs || []).map(item =>
    `https://archive.org/details/${encodeURIComponent(item.identifier)}`
  );
}

// 11. Open Library — books and publications
async function searchOpenLibrary(query) {
  const { data } = await client.get(
    'https://openlibrary.org/search.json',
    {
      params: {
        q: query,
        limit: LIMIT,
        fields: 'key,title'
      }
    }
  );

  return (data.docs || []).map(item =>
    item.key ? `https://openlibrary.org${item.key}` : null
  ).filter(Boolean);
}

const SOURCES = [
  ['DuckDuckGo', searchDuckDuckGo],
  ['Wikipedia', searchWikipedia],
  ['OpenAlex', searchOpenAlex],
  ['Crossref', searchCrossref],
  ['arXiv', searchArxiv],
  ['Europe PMC', searchEuropePMC],
  ['Stack Exchange', searchStackExchange],
  ['Hacker News', searchHackerNews],
  ['GitHub', searchGitHub],
  ['Internet Archive', searchInternetArchive],
  ['Open Library', searchOpenLibrary]
];

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
  const stateFile = path.join(root, `${task_id}`,`task_state.json`);

  await fs.mkdir(workspaceDir, { recursive: true });

  let state = {};

  try {
    state = JSON.parse(await fs.readFile(stateFile, 'utf8'));
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
  }
  
  // await fs.writeFile(stateFile, JSON.stringify({
  //   ...state,
  //   attempt: state.attempt+1,
  //   status: "ongoing",
  //   process_states: {
  //     ...state.process_states,
  //     url_collection: 'working'
  //   }
  // }, null, 2), 'utf8');
  
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

  // Run every source independently. A failure in one won't stop others.
  const outcomes = await Promise.allSettled(
    SOURCES.map(async ([name, search]) => {
      const urls = await search(search_prompt.trim());

      return {
        name,
        urls: [...new Set(urls.map(normalizeUrl).filter(Boolean))].slice(0, LIMIT)
      };
    })
  );

  const sourceResults = outcomes.map((outcome, index) => {
    if (outcome.status === 'fulfilled') {
      const { name, urls } = outcome.value;

      console.log(`${name}: ${urls.length} URLs found.`);

      return { name, success: true, count: urls.length, urls };
    }

    const name = SOURCES[index][0];

    console.error(`${name} failed:`, outcome.reason?.message);

    return {
      name,
      success: false,
      count: 0,
      urls: [],
      error: outcome.reason?.message || 'Unknown error'
    };
  });

  const succeeded = sourceResults.filter(source => source.success);
  const failed = sourceResults.filter(source => !source.success);

  // Do not erase previous results if every source fails.
  if (succeeded.length === 0) {
    await fs.writeFile(stateFile, JSON.stringify({
      ...state,
      attempt: state.attempt+1,
      process_states: {
        ...state.process_states,
        url_collection: 'failed'
      }
    }, null, 2), 'utf8');

    throw new Error('All search sources failed. Existing URLs were preserved.');
  }

  const combined = [
    ...(reset ? [] : existing),
    ...sourceResults.flatMap(source => source.urls)
  ];

  const seen = new Set();
  const resultList = [];

  for (const value of combined) {
    const url = normalizeUrl(value);

    if (!url || seen.has(url)) continue;

    seen.add(url);
    resultList.push({
      id: resultList.length + 1,
      url
    });
  }

  await fs.writeFile(
    urlsFile,
    JSON.stringify(resultList, null, 2),
    'utf8'
  );

  await fs.writeFile(stateFile, JSON.stringify({
    ...state,
    attempt: state.attempt+1,
    status: "ongoing",
    process_states: {
      ...state.process_states,
      url_collection: 'completed'
    }
  }, null, 2), 'utf8');

  return {
    success: true,
    urls_collected: resultList.length,
    sources_attempted: SOURCES.length,
    sources_succeeded: succeeded.length,
    sources_failed: failed.length,
    source_report: sourceResults.map(({ name, success, count, error }) => ({
      name,
      success,
      urls_found: count,
      ...(error ? { error } : {})
    })),
    workspace: workspaceDir
  };
}

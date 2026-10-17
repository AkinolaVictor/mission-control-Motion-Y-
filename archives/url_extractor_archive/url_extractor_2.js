
import fs from 'node:fs/promises';
import path from 'node:path';
import axios from 'axios';

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
  const stateFile = path.join(root, `${task_id}`, `task_state.json`);

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

  const query = encodeURIComponent(search_prompt.trim());

  const sources = [
    {
      name: 'DuckDuckGo',
      url: `https://html.duckduckgo.com/html/?q=${query}`,
      parse: parseDuckDuckGo
    },
    {
      name: 'Wikipedia',
      url: `https://en.wikipedia.org/w/api.php?action=opensearch&search=${query}&limit=5&namespace=0&format=json`,
      parse: parseWikipedia
    },
    {
      name: 'arXiv',
      url: `https://export.arxiv.org/api/query?search_query=all:${query}&start=0&max_results=5`,
      parse: parseArxiv
    }
  ];

  const discovered = [];
  const failedSources = [];

  for (const source of sources) {
    try {
      console.log(`Searching ${source.name}...`);

      const response = await axios.get(source.url, {
        timeout: 15000,
        headers: {
          'User-Agent': 'Mozilla/5.0 ResearchURLCollector/1.0',
          Accept: 'text/html,application/json,application/xml'
        },
        responseType: 'text'
      });

      const found = source.parse(response.data)
        .filter(isHttpUrl)
        .slice(0, 5);

      discovered.push(...found);

      console.log(`${source.name}: ${found.length} URLs found.`);
    } catch (error) {
      failedSources.push(source.name);
      console.error(`${source.name} failed: ${error.message}`);
    }
  }

  // Do not erase existing URLs if every search source fails.
  if (failedSources.length === sources.length) {
    await fs.writeFile(stateFile, JSON.stringify({
      ...state,
      process_states: {
        ...state.process_states,
        url_collection: 'failed'
      }
    }, null, 2));

    throw new Error('All search sources failed. Existing URLs were preserved.');
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
    process_states: {
      ...state.process_states,
      url_collection: 'completed'
    }
  }, null, 2), 'utf8');

  return {
    success: true,
    urls_collected: results.length,
    workspace: workspaceDir,
    sources_succeeded: sources.length - failedSources.length,
    sources_failed: failedSources.length
  };
}

function isHttpUrl(value) {
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

function parseDuckDuckGo(html) {
  const urls = [];
  const regex =
    /<a\b[^>]*class=["'][^"']*\bresult__a\b[^"']*["'][^>]*href=["']([^"']+)["']/gi;

  let match;

  while ((match = regex.exec(html)) !== null) {
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
  }

  return urls;
}

function parseWikipedia(data) {
  const parsed = JSON.parse(data);
  const titles = Array.isArray(parsed?.[1]) ? parsed[1] : [];

  return titles.map(title =>
    `https://en.wikipedia.org/wiki/${encodeURIComponent(
      title.replace(/ /g, '_')
    )}`
  );
}

function parseArxiv(xml) {
  const urls = [];
  const regex = /<entry\b[^>]*>([\s\S]*?)<\/entry>/gi;
  let match;

  while ((match = regex.exec(xml)) !== null) {
    const id = match[1].match(/<id>\s*(https?:\/\/[^<]+)\s*<\/id>/i);

    if (id) urls.push(decodeEntities(id[1].trim()));
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

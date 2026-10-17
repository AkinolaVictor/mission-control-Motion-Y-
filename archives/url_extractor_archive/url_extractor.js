import fs from 'fs/promises';
import path from 'path';
import axios from 'axios';

/**
 * URL Extractor for the Researcher Agent.
 * Searches the web for relevant sources and stores them in the task workspace.
 *
 * @param {Object} task_state - Object containing task_id and search_prompt.
 */
// test the code you just wrote with this data {task_id: "jsjsja", search_prompt: "importance of tomatoes"} as the task_state props passed in
export async function url_extractor(task_state) {
  const { task_id, search_prompt } = task_state;

  if (!task_id || !search_prompt) {
    throw new Error('Missing mandatory props: task_id and search_prompt are required.');
  }

  const workspaceDir = path.join(process.cwd(), 'agents', 'researcher', 'workspace', task_id);
  const urlsFile = path.join(workspaceDir, 'research_urls.json');
  const stateFile = path.join(process.cwd(), 'agents', 'researcher', 'workspace', `${task_id}`, `task_state.json`);

  try {
    // Ensure workspace exists
    await fs.mkdir(workspaceDir, { recursive: true });

    // 1. Check the current process state of url_collection
    let currentTaskState = {};
    try {
      const stateData = await fs.readFile(stateFile, 'utf8');
      currentTaskState = JSON.parse(stateData);
    } catch (e) {
      // State file might not exist yet, which is fine.
    }

    const isUrlCollectionFailed = currentTaskState.process_states?.url_collection === 'failed';

    // 2. Handle research_urls.json initialization/reset
    let urls = [];
    try {
      const urlsData = await fs.readFile(urlsFile, 'utf8');
      urls = JSON.parse(urlsData);

      if (isUrlCollectionFailed) {
        console.log('url_collection was failed, resetting existing URLs...');
        urls = []; // Erase all existing URLs if state was failed
      }
    } catch (e) {
      // File doesn't exist, start with empty array
    }

    // 3. Search Sources
    // Using a mix of free, open search endpoints (DuckDuckGo, etc.)
    // and targeted queries for diverse sources.
    const sources = [
      { name: 'DuckDuckGo', url: `https://html.duckduckgo.com/html/?q=${encodeURIComponent(search_prompt)}` },
      { name: 'Wikipedia', url: `https://en.wikipedia.org/w/api.php?action=opensearch&search=${encodeURIComponent(search_prompt)}&limit=5&namespace=0` },
      { name: 'YouTube', url: `https://www.youtube.com/results?search_query=${encodeURIComponent(search_prompt)}` },
      { name: 'Bing', url: `https://www.bing.com/search?q=${encodeURIComponent(search_prompt)}` },
      { name: 'Google', url: `https://www.google.com/search?q=${encodeURIComponent(search_prompt)}` },
      { name: 'Reddit', url: `https://www.reddit.com/search/?q=${encodeURIComponent(search_prompt)}` },
      { name: 'arXiv', url: `https://arxiv.org/search/?query=${encodeURIComponent(search_prompt)}&search_type=all` },
    ];

    const allExtractedUrls = [];

    for (const source of sources) {
      try {
        console.log(`Searching ${source.name}...`);
        const response = await axios.get(source.url, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
          }
        });

        const html = response.data;
        // A basic regex to extract URLs from HTML for free sources.
        // This captures common URL patterns from search results.
        const urlRegex = /href="([^"]*)"/g;
        let match;
        const sourceUrls = [];

        while ((match = urlRegex.exec(html)) !== null) {
          const url = match[1];

          // Standardize relative URLs
          let absoluteUrl = url;
          if (url.startsWith('/')) {
            const sourceUrl = new URL(source.url);
            absoluteUrl = `${sourceUrl.protocol}//${sourceUrl.hostname}${url}`;
          }

          // Filter out common non-content links (favicons, manifests, internal search, assets)
          const isAsset = /\.(png|jpg|jpeg|gif|ico|svg|webp|manifest|css|js)$/i.test(absoluteUrl);
          const isInternalSearch = absoluteUrl.includes('google.com/search') ||
                                   absoluteUrl.includes('bing.com/search') ||
                                   absoluteUrl.includes('duckduckgo.com') ||
                                   absoluteUrl.includes('youtube.com/results');

          if (absoluteUrl.startsWith('http') && !isAsset && !isInternalSearch) {
            sourceUrls.push(absoluteUrl);
          }
          if (sourceUrls.length >= 5) break;
        }

        allExtractedUrls.push(...sourceUrls);
      } catch (err) {
        console.error(`Error searching ${source.name}:`, err.message);
      }
    }

    // 4. Save the URLs to research_urls.json
    // Ensure uniqueness and assign proper IDs
    const uniqueUrls = [...new Set(allExtractedUrls)];
    const finalUrls = [];

    // If we didn't reset, we append to the existing list.
    // Otherwise, we start from scratch.
    const combinedUrls = isUrlCollectionFailed ? uniqueUrls : [...urls, ...uniqueUrls];

    // Remove duplicates between the existing list and new finds
    const seen = new Set();
    const resultList = [];
    for (const u of combinedUrls) {
      if (!seen.has(u)) {
        seen.add(u);
        resultList.push({
          id: resultList.length + 1,
          url: u
        });
      }
    }

    await fs.writeFile(urlsFile, JSON.stringify(resultList, null, 2), 'utf8');

    // 5. Update the task state
    const updatedTaskState = {
      ...currentTaskState,
      process_states: {
        ...currentTaskState.process_states,
        url_collection: 'completed'
      }
    };

    await fs.writeFile(stateFile, JSON.stringify(updatedTaskState, null, 2), 'utf8');

    return {
      success: true,
      urls_collected: resultList.length,
      workspace: workspaceDir
    };

  } catch (error) {
    console.error('URL Extractor Error:', error);

    // Try to mark the state as failed
    try {
      const stateFileFailure = path.join(process.cwd(), 'agents', 'researcher', 'workspace', `${task_id}`, `task_state.json`);
      let currentState = {};
      try {
        const stateData = await fs.readFile(stateFileFailure, 'utf8');
        currentState = JSON.parse(stateData);
      } catch (e) {}

      await fs.writeFile(stateFileFailure, JSON.stringify({
        ...currentState,
        process_states: {
          ...currentState.process_states,
          url_collection: 'failed'
        }
      }, null, 2), 'utf8');
    } catch (e) {
      console.error('State failure update failed:', e.message);
    }

    throw error;
  }
}

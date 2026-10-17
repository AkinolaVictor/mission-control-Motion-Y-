import fs from 'fs/promises';
import path from 'path';
import axios from 'axios';
import * as cheerio from 'cheerio';

/**
 * URL Scraper for the Researcher Agent.
 * Loops through acquired URLs and extracts main content into text files.
 *
 * @param {Object} task_state - Object containing task_id and process states.
 */
export async function url_scrapper(task_state) {
  const { task_id } = task_state;

  if (!task_id) {
    throw new Error('Missing mandatory prop: task_id is required in task_state.');
  }

  const workspaceDir = path.join(process.cwd(), 'agents', 'researcher', 'workspace', task_id);
  const urlsFile = path.join(workspaceDir, 'research_urls.json');
  const stateFile = path.join(workspaceDir, 'task_state.json');
  const extractionsDir = path.join(workspaceDir, 'extractions');

  try {
    // 1. Mandatory Pre-Check: Ensure url_collection is completed
    let currentTaskState = {};
    try {
      const stateData = await fs.readFile(stateFile, 'utf8');
      currentTaskState = JSON.parse(stateData);
    } catch (e) {
      throw new Error(`Could not read task state file at ${stateFile}. Scraping cannot proceed.`);
    }

    if (currentTaskState.process_states?.url_collection !== 'completed') {
      throw new Error('Pre-check failed: url_collection must be "completed" before scraping can be done.');
    }

    // 2. Load URLs to scrape
    let urls = [];
    try {
      const urlsData = await fs.readFile(urlsFile, 'utf8');
      urls = JSON.parse(urlsData);
    } catch (e) {
      throw new Error(`Could not read research_urls.json at ${urlsFile}. No URLs found to scrape.`);
    }

    if (!Array.isArray(urls) || urls.length === 0) {
      console.log('No URLs found to scrape.');
      return { success: true, message: 'No URLs to process.' };
    }

    // Ensure extractions directory exists
    await fs.mkdir(extractionsDir, { recursive: true });

    // 3. Sequential Scraping Loop
    let successCount = 0;
    let failureCount = 0;

    for (const entry of urls) {
      const url = typeof entry === 'string' ? entry : entry.url;
      if (!url) continue;

      try {
        console.log(`Scraping: ${url}...`);
        const response = await axios.get(url, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
          },
          timeout: 15000 // 15s timeout per page
        });

        const $ = cheerio.load(response.data);

        // Extract Title
        const title = $('title').text().trim() || 'No Title Found';

        // Extract Content
        // Remove noise elements
        $('script, style, nav, footer, header, aside, .ads, .sidebar').remove();

        // Target main content areas if they exist, otherwise use body
        const mainContent = $('article, main, #content, .main-content, body').first().text();

        // Clean up the extracted text (remove excessive whitespace)
        const cleanedContent = mainContent
          .replace(/\\s+/g, ' ')
          .replace(/\\n+/g, '\\n')
          .trim();

        // Generate unique ID for the file
        const generatedId = Buffer.from(url).toString('base64').substring(0, 12).replace(/[^a-z0-9]/gi, '_');
        const filePath = path.join(extractionsDir, `${generatedId}.txt`);

        // File format: Link -> Title -> Content
        const fileContent = `Link: ${url}\nTitle: ${title}\nContent:\n${cleanedContent}`;

        await fs.writeFile(filePath, fileContent, 'utf8');
        successCount++;

      } catch (err) {
        console.error(`Failed to scrape ${url}: ${err.message}`);
        failureCount++;
      }
    }

    // 4. Update task state to completed
    const updatedTaskState = {
      ...currentTaskState,
      process_states: {
        ...currentTaskState.process_states,
        url_scrapping: 'completed'
      }
    };

    await fs.writeFile(stateFile, JSON.stringify(updatedTaskState, null, 2), 'utf8');

    return {
      success: true,
      total: urls.length,
      scraped: successCount,
      failed: failureCount,
      workspace: workspaceDir
    };

  } catch (error) {
    console.error('URL Scrapper Error:', error.message);

    // Attempt to mark state as failed
    try {
      const stateData = await fs.readFile(stateFile, 'utf8');
      const currentTaskState = JSON.parse(stateData);

      await fs.writeFile(stateFile, JSON.stringify({
        ...currentTaskState,
        process_states: {
          ...currentTaskState.process_states,
          url_scrapping: 'failed'
        }
      }, null, 2), 'utf8');
    } catch (e) {
      // State file might be missing or corrupted
    }

    throw error;
  }
}

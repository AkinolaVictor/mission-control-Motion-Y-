import fs from 'fs/promises';
import path from 'path';
import crypto from 'crypto';
import axios from 'axios';
import * as cheerio from 'cheerio';

export async function url_scrapper(task_state) {
  const { task_id } = task_state;

  if (!task_id) {
    throw new Error('Missing mandatory prop: task_id.');
  }

  const workspaceDir = path.join(
    process.cwd(), 'agents', 'researcher', 'workspace', task_id
  );

  const urlsFile = path.join(workspaceDir, 'research_urls.json');
  const stateFile = path.join(workspaceDir, 'task_state.json');
  const extractionsDir = path.join(workspaceDir, 'extractions');

  let currentTaskState;

  try {
    currentTaskState = JSON.parse(
      await fs.readFile(stateFile, 'utf8')
    );

    if (currentTaskState.process_states?.url_collection !== 'completed') {
      throw new Error('url_collection must be completed first.');
    }

    const urls = JSON.parse(await fs.readFile(urlsFile, 'utf8'));

    if (!Array.isArray(urls)) {
      throw new Error('research_urls.json must contain an array.');
    }
    
    await fs.rm(extractionsDir, { recursive: true, force: true });
    await fs.mkdir(extractionsDir, { recursive: true });

    const results = [];
    let index = 0
    for (const entry of urls) {
      const url = typeof entry === 'string' ? entry : entry?.url;
      index++
      console.log(`progress: ${index} of ${urls.length}`)
      // Stable, collision-resistant filename for each URL.
      const generatedId = crypto
        .createHash('sha256')
        .update(String(url || JSON.stringify(entry)))
        .digest('hex')
        .slice(0, 20);

      const filePath = path.join(
        extractionsDir, `${generatedId}.txt`
      );

      let document = '';
      let status = null;
      let errorMessage = null;
      let success = false;

      try {
        if (!url) {
          throw new Error('Invalid URL entry: missing URL.');
        }

        // Reject malformed URLs and unsupported protocols.
        const parsedUrl = new URL(url);

        if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
          throw new Error('Only HTTP and HTTPS URLs are supported.');
        }

        let response;

        // Retry network errors, rate limits and server errors.
        for (let attempt = 1; attempt <= 3; attempt++) {
          try {
            response = await axios.get(url, {
              timeout: 60000,
              maxRedirects: 5,
              responseType: 'text',
              maxContentLength: 10 * 1024 * 1024,
              validateStatus: () => true,
              headers: {
                'User-Agent':
                  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) ' +
                  'AppleWebKit/537.36 (KHTML, like Gecko) ' +
                  'Chrome/131.0.0.0 Safari/537.36',
                'Accept':
                  'text/html,application/xhtml+xml;q=0.9,*/*;q=0.8',
                'Accept-Language': 'en-US,en;q=0.9'
              }
            });

            status = response.status;

            const retryable =
              status === 429 || status >= 500;

            if (!retryable || attempt === 3) break;

            const retryAfter = Number(
              response.headers['retry-after']
            );

            const delay = Number.isFinite(retryAfter) &&
              retryAfter > 0
              ? Math.min(retryAfter * 1000, 10000)
              : attempt * 1500;

            await new Promise(resolve => setTimeout(resolve, delay));
          } catch (err) {
            if (attempt === 3) throw err;

            // Do not retry permanent HTTP errors.
            if (err.response && err.response.status < 500) {
              throw err;
            }

            await new Promise(resolve =>
              setTimeout(resolve, attempt * 1500)
            );
          }
        }

        if (status < 200 || status >= 300) {
          const details = {
            403: 'Access forbidden; bot protection or permissions may apply.',
            419: 'Request rejected; the site may require a valid session or CSRF token.',
            429: 'Rate limited by the server.',
            503: 'Service unavailable.'
          };

          throw new Error(
            `HTTP ${status}: ${details[status] || 'Request failed.'}`
          );
        }

        const $ = cheerio.load(String(response.data ?? ''));

        const title =
          $('title').first().text().trim() ||
          $('meta[property="og:title"]').attr('content')?.trim() ||
          'No Title Found';

        // Remove non-content elements.
        $(
          'script, style, noscript, iframe, svg, canvas, ' +
          'nav, footer, header, aside, form, ' +
          '[role="navigation"], [role="banner"], ' +
          '.ads, .advertisement, .sidebar, .cookie-banner'
        ).remove();

        // Try specific content containers before falling back to body.
        let content = '';

        for (const selector of [
          'article',
          'main',
          '[role="main"]',
          '.post-content',
          '.entry-content',
          '.article-content',
          '#content',
          '.main-content',
          'body'
        ]) {
          content = $(selector).first().text().trim();

          if (content.length >= 100) break;
        }

        const cleanedContent = content
          .replace(/\r\n?/g, '\n')
          .replace(/[ \t]+/g, ' ')
          .replace(/\n[ \t]+/g, '\n')
          .replace(/\n{3,}/g, '\n\n')
          .trim();

        if (cleanedContent.length < 50) {
          throw new Error(
            `Insufficient extractable text (${cleanedContent.length} characters). ` +
            'The page may require JavaScript or contain blocked content.'
          );
        }

        document = [
          `Link: ${url}`,
          `HTTP Status: ${status}`,
          `Title: ${title}`,
          `Content:`,
          cleanedContent
        ].join('\n\n');

        success = true;
      } catch (err) {
        errorMessage = err.message || 'Unknown scraping error';

        // Preserve any HTTP response body for troubleshooting.
        if (!document && err.response?.data) {
          document = String(err.response.data)
            .replace(/<script[\s\S]*?<\/script>/gi, '')
            .replace(/<style[\s\S]*?<\/style>/gi, '')
            .replace(/<[^>]+>/g, ' ')
            .replace(/\s+/g, ' ')
            .slice(0, 3000);
        }

        console.error(`[SCRAPE FAILED] ${url}: ${errorMessage}`);
      }

      // Always save a file, including failures.
      const fileContent = success
        ? document
        : false
        // : [
        //     `Link: ${url || 'Invalid URL entry'}`,
        //     `HTTP Status: ${status ?? 'Unavailable'}`,
        //     `Scrape Status: FAILED`,
        //     `Error: ${errorMessage || 'Unknown error'}`,
        //     '',
        //     'Available response excerpt:',
        //     document || 'No response content available.'
        //   ].join('\n');

      try {

        if(fileContent) await fs.writeFile(filePath, fileContent, 'utf8');

        results.push({
          url: url || null,
          id: generatedId,
          file: filePath,
          status,
          success,
          error: errorMessage
        });
      } catch (fileError) {
        console.error(
          `[FILE WRITE FAILED] ${filePath}: ${fileError.message}`
        );

        results.push({
          url: url || null,
          id: generatedId,
          file: null,
          status,
          success: false,
          error: errorMessage,
          fileError: fileError.message
        });
      }
    }

    const scraped = results.filter(r => r.success).length;
    const failed = results.length - scraped;

    await fs.writeFile(
      stateFile,
      JSON.stringify({
        ...currentTaskState,
        attempt: currentTaskState.attempt+1,
        process_states: {
          ...currentTaskState.process_states,
          url_scrapping: 'completed'
          // url_scrapping: failed === 0 ? 'completed' : 'completed_with_errors'
        }
      }, null, 2),
      'utf8'
    );

    return {
      success: failed === 0,
      total: urls.length,
      scraped,
      failed,
      workspace: workspaceDir,
      results
    };
  } catch (error) {
    console.error('[URL SCRAPPER ERROR]', error.message);

    if (currentTaskState) {
      try {
        await fs.writeFile(
          stateFile,
          JSON.stringify({
            ...currentTaskState,
            attempt: currentTaskState.attempt+1,
            process_states: {
              ...currentTaskState.process_states,
              url_scrapping: 'failed'
            }
          }, null, 2),
          'utf8'
        );
      } catch {
        // Preserve the original error.
      }
    }

    throw error;
  }
}
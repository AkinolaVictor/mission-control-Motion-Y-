
import fs from 'fs/promises';
import path from 'path';
// import { agent_config } from '../../src/agents/config';

/**
 * Generates a comprehensive Markdown article from extracted research.
 *
 * @param {Object} task_state
 * @param {string} task_state.task_id
 * @param {string} task_state.search_prompt
 * @returns {Promise<Object>}
 */
export async function article_writter(task_state) {
  const { task_id, search_prompt } = task_state ?? {};

  if (!task_id || !search_prompt?.trim()) {
    throw new Error(
      'task_id and search_prompt are required.'
    );
  }

  const baseDir = path.join(
    process.cwd(),
    'agents',
    'researcher'
  );

  const workspaceDir = path.join(
    baseDir,
    'workspace',
    task_id
  );

  const extractionsDir = path.join(
    workspaceDir,
    'extractions'
  );

  const stateFile = path.join(
    workspaceDir,
    'task_state.json'
  );

  const guidePath = path.join(
    baseDir,
    'system',
    'ARTICLE.md'
  );

  const outputDir = path.join(baseDir, 'output');
  // const outputDir = extractionsDir;

  // Prevent invalid task IDs from escaping the workspace.
  const resolvedWorkspace = path.resolve(workspaceDir);
  const resolvedBase = path.resolve(baseDir);

  if (!resolvedWorkspace.startsWith(resolvedBase + path.sep)) {
    throw new Error('Invalid task_id: path traversal detected.');
  }

  // Update task state without discarding existing properties.
  async function updateTaskState(status, errorMessage) {
    try {
      const raw = await fs.readFile(stateFile, 'utf8');
      const state = JSON.parse(raw);
      
      if(status!=="start"){
        state.process_states = {
          ...(state.process_states ?? {}),
          article_generated: status
        };
      }
      
      if(status==="working"){
        state.status = "working"
      }
      
      if(status==="completed"){
        state.status = "completed"
      }

      state.attempt = state.attempt+1

      if (errorMessage) {
        state.article_writer_error = errorMessage;
      } else {
        delete state.article_writer_error;
      }

      await fs.writeFile(
        stateFile,
        JSON.stringify(state, null, 2),
        'utf8'
      );
    } catch (error) {
      console.error(
        'Could not update task state:',
        error.message
      );
    }
  }

  try {
    // 1. Load the writing guide.
    const writingGuide = await fs.readFile(
      guidePath,
      'utf8'
    );

    if (!writingGuide.trim()) {
      throw new Error('ARTICLE.md is empty.');
    }

    
    // await updateTaskState('working');

    // 2. Read and combine extracted research files.
    const files = await fs.readdir(extractionsDir);

    const txtFiles = files
      .filter(file => file.toLowerCase().endsWith('.txt'))
      .sort();

    if (txtFiles.length === 0) {
      throw new Error(
        `No .txt research files found in ${extractionsDir}`
      );
    }

    const researchParts = await Promise.all(
      txtFiles.map(async file => {
        const content = await fs.readFile(
          path.join(extractionsDir, file),
          'utf8'
        );

        if (!content.trim()) return '';

        return [
          `--- SOURCE: ${file} ---`,
          content.trim(),
          `--- END SOURCE: ${file} ---`
        ].join('\n');
      })
    );

    const researchEvidence = researchParts
      .filter(Boolean)
      .join('\n\n');

    if (!researchEvidence.trim()) {
      throw new Error(
        'All extracted research files are empty.'
      );
    }

    // 3. Select the configured researcher model.
    // const researcherAgent = agent_config?.agents?.find(
    //   agent => agent.id === 'researcher'
    // );
    // const researcherAgent = require("./../metadata.json")

    // const model =
    //   researcherAgent?.model || 'nemotron-3-ultra:cloud';

    
    // 3. Load metadata.json (ES module compatible).
    const metadataPath = new URL('../metadata.json', import.meta.url);

    const metadata = JSON.parse(
        await fs.readFile(metadataPath, 'utf8')
    );

    const researcherAgent = metadata.agents?.find(
        agent => agent.id === 'researcher'
    );

    const model =
        researcherAgent?.model ??
        metadata.model ??
        'gemma4:31b-cloud';

    // 4. Build the article-writing prompt.
    const prompt = `
ARTICLE TITLE:
${search_prompt.trim()}

RESEARCH EVIDENCE:
${researchEvidence}

ARTICLE WRITING GUIDE:
${writingGuide}

REQUIREMENTS:
- Write a detailed, comprehensive, well-structured article.
- Follow the writing guide and use the supplied title as the H1.
- Synthesize the sources instead of repeating them verbatim.
- Preserve factual accuracy and distinguish facts from uncertainty.
- Do not invent facts, statistics, quotations, or citations.
- Remove duplication and irrelevant extraction noise.
- Use relevant Markdown headings and paragraphs.
- Return ONLY the finished Markdown article.
- Do not include conversational introductions or explanations
  about your writing process.
`;

    // 5. Request article generation from Ollama.
    const response = await fetch(
      'http://localhost:11434/api/chat',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model,
          messages: [
            {
              role: 'system',
              content:
                'You are a professional research article writer. ' +
                'Follow the provided writing guide, use evidence ' +
                'carefully, and return a complete Markdown article.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          stream: false
        }),
        signal: AbortSignal.timeout(600000)
      }
    );

    // Check HTTP errors before parsing the response.
    if (!response.ok) {
      const errorBody = await response.text();

      throw new Error(
        `Ollama API error (${response.status}): ` +
        errorBody.slice(0, 1000)
      );
    }

    // IMPORTANT: Parse JSON and extract the actual article text.
    const data = await response.json();
    const article = data?.message?.content?.trim();

    if (!article) {
      throw new Error(
        'Ollama returned an empty article. ' +
        `Response: ${JSON.stringify(data).slice(0, 1000)}`
      );
    }

    // 6. Create the output directory and save the article.
    await fs.mkdir(outputDir, { recursive: true });

    const timestamp = new Date()
      .toISOString()
      .replace(/[:.]/g, '-')
      .slice(0, 19);

    const slug = search_prompt
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '_')
      .replace(/^_+|_+$/g, '')
      .slice(0, 60) || 'article';

      // const fileName = `summary.md`;
      const fileName = `${slug}_${timestamp}.md`;
    const filePath = path.join(outputDir, fileName);

    await fs.writeFile(filePath, article + '\n', 'utf8');

    // 7. Mark the task as completed.
    await updateTaskState('completed');

    return {
      success: true,
      filePath,
      fileName,
      workspace: workspaceDir,
      model,
      sourcesUsed: txtFiles.length,
      articleLength: article.length
    };

  } catch (error) {
    console.error(
      'Article Writer Error:',
      error.message
    );

    await updateTaskState('failed', error.message);

    throw error;
  }
}

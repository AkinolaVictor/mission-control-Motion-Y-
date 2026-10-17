import fs from 'fs/promises';
import path from 'path';

// import { chatWithResearcher } from 'C:/Users/Victor/Desktop/Workspace/Motion-Y (Mission Control)/agents/researcher/researcher';
// import { agent_config } from 'C:/Users/Victor/Desktop/Workspace/Motion-Y (Mission Control)/agents/config';

// import { chatWithResearcher } from './../researcher.js';
// import { agent_config } from './../../config.js';

// import { chatWithResearcher } from 'C:\Users\Victor\Desktop\Workspace\Motion-Y (Mission Control)\agents\researcher\researcher';
// import { agent_config } from '.C:\Users\Victor\Desktop\Workspace\Motion-Y (Mission Control)\agents\config';

/**
 * Model Research for the Researcher Agent.
 * Performs a deep-dive research on a specific prompt using scraped data and model knowledge.
 *
//  * @param {Object} task_state - Object containing task_id, search_prompt, and process states.
 */
export async function model_research(task_state) {
  const { task_id, search_prompt } = task_state;

  if (!task_id || !search_prompt) {
    throw new Error('Missing mandatory props: task_id and search_prompt are required in task_state.');
  }

  const workspaceDir = path.join(process.cwd(), 'agents', 'researcher', 'workspace', task_id);
  const extractionsDir = path.join(workspaceDir, 'extractions');
  const stateFile = path.join(workspaceDir, 'task_state.json');
  const outputFilePath = path.join(extractionsDir, 'agent_search_result.txt');

  try {
    // 1. Mandatory Pre-Check: Ensure url_scrapping is completed
    let currentTaskState = {};
    try {
      const stateData = await fs.readFile(stateFile, 'utf8');
      currentTaskState = JSON.parse(stateData);
    } catch (e) {
      throw new Error(`Could not read task state file at ${stateFile}. Model research cannot proceed.`);
    }

    if (currentTaskState.process_states?.url_scrapping !== 'completed') {
      throw new Error('Pre-check failed: url_scrapping must be "completed" before model research can be done.');
    }

    // 2. Context Assembly: Read all scraped text files
    let scrapedContext = '';
    try {
      const files = await fs.readdir(extractionsDir);
      const txtFiles = files.filter(f => f.endsWith('.txt') && f !== 'agent_search.txt' && f !== 'agent_search_result.txt');

      for (const file of txtFiles) {
        const content = await fs.readFile(path.join(extractionsDir, file), 'utf8');
        scrapedContext += `\\n--- Source: ${file} ---\\n${content}\\n`;
      }
    } catch (e) {
      console.error('Error reading extraction files:', e.message);
      // We continue even if some files are missing, but log the error
    }

    // 3. LLM Research Prompting
    // const researcherAgent = agent_config.agents.find(a => a.id === 'researcher') || { model: 'gemma4:31b-cloud' };
    const researcherAgent = "gemma4:31b-cloud" || require("../metadata.json");

    const prompt = `
You are a High-Level Research Specialist. Your objective is to conduct an exhaustive research on the following prompt:

RESEARCH PROMPT: "${search_prompt}"

To complete this task, you have been provided with the following evidence gathered from a web scraping process:

SCRAPED DATA:
${scrapedContext}

INSTRUCTIONS:
1. Use the provided SCRAPED DATA as your primary source of truth.
2. Supplement this data with your own internal advanced knowledge and any necessary internal "web-search" simulations to ensure the information is updated and accurate.
3. Produce a comprehensive, factual, and mature research outcome.
4. The output should be structured as a professional research report, ensuring it directly answers the research prompt with depth and technical precision.

Avoid conversational fillers. Provide the final research result directly.
`;

    // const response = await chatWithResearcher({
    //   model: researcherAgent.model,
    //   messages: [
    //     { role: 'system', content: 'You are an autonomous Model Researcher. You provide deep-dive, factual, and mature research results based on provided evidence and internal knowledge.' },
    //     { role: 'user', content: prompt }
    //   ]
    // });

    const response = await fetch('http://localhost:11434/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: researcherAgent.model,
        messages: [
          { role: 'system', content: 'You are an autonomous Model Researcher. You provide deep-dive, factual, and mature research results based on provided evidence and internal knowledge.' },
          { role: 'user', content: prompt }
        ],
        stream: false,
      }),
    });

    // 4. Save outcome to agent_search_result.txt
    await fs.writeFile(outputFilePath, response, 'utf8');

    // 5. Update task state to completed
    const updatedTaskState = {
      ...currentTaskState,
      process_states: {
        ...currentTaskState.process_states,
        agent_search: 'completed'
      }
    };

    await fs.writeFile(stateFile, JSON.stringify(updatedTaskState, null, 2), 'utf8');

    return {
      success: true,
      outputFile: outputFilePath,
      workspace: workspaceDir
    };

  } catch (error) {
    console.error('Model Research Error:', error.message);

    // Attempt to mark state as failed
    try {
      const stateData = await fs.readFile(stateFile, 'utf8');
      const currentTaskState = JSON.parse(stateData);

      await fs.writeFile(stateFile, JSON.stringify({
        ...currentTaskState,
        process_states: {
          ...currentTaskState.process_states,
          agent_search: 'failed'
        }
      }, null, 2), 'utf8');
    } catch (e) {
      // State file might be missing or corrupted
    }

    throw error;
  }
}

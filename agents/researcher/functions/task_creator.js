import fs from 'fs/promises';
import path from 'path';
import axios from 'axios';

/**
 * Task Creator for the Researcher Agent.
 * Transforms a raw assignment prompt into a structured task_state.json file.
 *
 * @param {Object} assigned_task - Object containing the prompt.
 */
export async function task_creator(assigned_task) {
  const { prompt } = assigned_task;

  if (!prompt) {
    throw new Error('Missing mandatory prop: prompt is required in assigned_task.');
  }

  const metadataPath = path.join(process.cwd(), 'agents', 'researcher', 'metadata.json');
  const systemDir = path.join(process.cwd(), 'agents', 'researcher', 'system');

  try {
    // 1. Read Metadata FRESH (no hardcoding)
    const metadataContent = await fs.readFile(metadataPath, 'utf8');
    const metadata = JSON.parse(metadataContent);
    const model = metadata.model;
    const prototype = metadata.task_state_prototype;

    // 2. Read all system files for context
    let systemContext = '';
    try {
      const sysFiles = await fs.readdir(systemDir);
      for (const file of sysFiles) {
        const content = await fs.readFile(path.join(systemDir, file), 'utf8');
        systemContext += `\\n--- ${file} ---\\n${content}\\n`;
      }
    } catch (e) {
      console.error('Warning: Could not read some system files:', e.message);
    }

    // 3. LLM Prompting via Ollama API
    const promptForLLM = `
You are the Task Intake Specialist for the Researcher Agent. Your job is to convert a raw user request into a structured "task_state" object.

USER REQUEST:
"${prompt}"

AGENT SYSTEM CONTEXT:
${systemContext}

TASK STATE PROTOTYPE (MUST FOLLOW EXACTLY):
${JSON.stringify(prototype, null, 2)}

INSTRUCTIONS:
1. Analyze the user request and determine the core research goal.
2. Create a unique, slug-style "task_id" (e.g., "ai_medicine_research_2026").
3. Define a high-quality "search_prompt" that the agent will use to gather URLs.
4. Populate all other fields from the prototype with appropriate values:
   - "status": "pending"
   - "created_at": current timestamp
   - "attempt": 0
   - "process_states": set all to "awaiting..."
5. You must return a valid JSON object that is a perfect mirror of the prototype's structure.

Return ONLY the JSON object. No conversational filler.
`;

    const response = await axios.post('http://localhost:11434/api/chat', {
      model: model,
      messages: [
        {
          role: 'system',
          content: `You are a system coordinator. Your only goal is to translate a prompt into a structured JSON task object. Prototype: ${JSON.stringify(prototype)}`
        },
        { role: 'user', content: promptForLLM }
      ],
      stream: false
    });

    const content = response.data.message.content;

    // Extract JSON from response
    const jsonMatch = content.match(/\\{.*\\}/s);
    if (!jsonMatch) {
      throw new Error('LLM failed to return a valid JSON task_state object.');
    }

    const generatedTaskState = JSON.parse(jsonMatch[0]);

    // 4. The task_func implementation
    await task_func(generatedTaskState);

    return {
      success: true,
      task_id: generatedTaskState.task_id,
      message: 'Task created successfully'
    };

  } catch (error) {
    console.error('Task Creator Error:', error.message);
    throw error;
  }
}

/**
 * task_func: The actual file system operation to persist the task.
 */
async function task_func(task_state) {
  const { task_id } = task_state;
  if (!task_id) throw new Error('task_state must contain a task_id to be saved.');

  const workspaceDir = path.join(process.cwd(), 'agents', 'researcher', 'workspace', task_id);
  const stateFilePath = path.join(workspaceDir, 'task_state.json');

  // Create workspace folder if it doesn't exist
  await fs.mkdir(workspaceDir, { recursive: true });

  // Save the task_state exactly as received
  await fs.writeFile(stateFilePath, JSON.stringify(task_state, null, 2), 'utf8');
}


import fs from 'fs/promises';
import path from 'path';
import axios from 'axios';

/**
 * Convert the metadata prototype into a JSON Schema.
 * This allows the tool schema to follow metadata.json dynamically.
 */
function prototypeToSchema(prototype) {
  if (Array.isArray(prototype)) {
    return {
      type: 'array',
      items: prototype.length
        ? prototypeToSchema(prototype[0])
        : {}
    };
  }

  if (prototype === null) {
    return { type: 'string' };
  }

  if (typeof prototype === 'object') {
    const properties = {};

    for (const [key, value] of Object.entries(prototype)) {
      properties[key] = prototypeToSchema(value);
    }

    return {
      type: 'object',
      properties,
      required: Object.keys(properties),
      additionalProperties: false
    };
  }

  if (typeof prototype === 'number') {
    return {
      type: Number.isInteger(prototype) ? 'integer' : 'number'
    };
  }

  if (typeof prototype === 'boolean') {
    return { type: 'boolean' };
  }

  return { type: 'string' };
}

/**
 * Task Creator for the devto_content_creator Agent.
 */
export async function task_creator(assigned_task) {
  const { prompt } = assigned_task ?? {};

  if (!prompt || typeof prompt !== 'string') {
    throw new Error('assigned_task.prompt must be a non-empty string.');
  }

  const agentDir = path.join(process.cwd(), 'agents', 'devto_content_creator');

  const metadataPath = path.join(agentDir, 'metadata.json');
  const systemDir = path.join(agentDir, 'system');

  // Always read fresh metadata.
  const metadata = JSON.parse(await fs.readFile(metadataPath, 'utf8'));

  const { model, task_state_prototype: prototype } = metadata;

  if (!model || !prototype || typeof prototype !== 'object') {
    throw new Error('metadata.json must contain model and task_state_prototype.');
  }

  // Read the agent's system files.
  let systemContext = '';

  try {
    const entries = await fs.readdir(systemDir, {
      withFileTypes: true
    });

    for (const entry of entries) {
      if (!entry.isFile()) continue;

      const content = await fs.readFile(
        path.join(systemDir, entry.name),
        'utf8'
      );

      systemContext +=
        `\n--- ${entry.name} ---\n${content}\n`;
    }
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
    console.warn('devto_content_creator system directory not found.');
  }

  // Define a REAL tool that Ollama can call.
  const tools = [
    {
      type: 'function',
      function: {
        name: 'task_func',
        description:
          'Create and persist a task_state.json file for the devto_content_creator agent. ' +
          'Pass the complete task_state object matching the supplied prototype.',
        parameters: prototypeToSchema(prototype)
      }
    }
  ];

  const response = await axios.post(
    'http://localhost:11434/api/chat',
    {
      model,
      stream: false,
      messages: [
        {
          role: 'system',
          content: `
You are the devto_content_creator Agent's task intake specialist.

Create one complete task_state object from the user's assignment.
Follow the supplied prototype's exact structure and field names.
Populate fields with values appropriate to this specific task.

Use a unique task_id.
Create a useful, specific search_prompt.
Use status "pending", attempt 0, and the appropriate initial
process_states values as specified by the prototype.

Do not invent extra fields or omit required fields.
Call task_func exactly once with the completed task_state.
Do not merely print JSON.

AGENT SYSTEM FILES:
${systemContext}

TASK STATE PROTOTYPE:
${JSON.stringify(prototype, null, 2)}
          `.trim()
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      tools,
      tool_choice: 'required'
    }
  );

  const message = response.data?.message;
  const toolCalls = message?.tool_calls;

  // Do not silently fall back to parsing JSON from message.content.
  if (!Array.isArray(toolCalls) || toolCalls.length === 0) {
    throw new Error(
      `Model "${model}" did not return a tool call. ` +
      `Response: ${JSON.stringify(message)}`
    );
  }

  const taskCall = toolCalls.find(call => call.function?.name === 'task_func');

  if (!taskCall) {
    throw new Error('Model did not call the task_func tool.');
  }

  let taskState = taskCall.function.arguments;

  // Ollama normally returns arguments as an object.
  // Handle string arguments too, if returned by the model/version.
  if (typeof taskState === 'string') {
    taskState = JSON.parse(taskState);
  }

  // Validate the essential fields before writing.
  if (
    !taskState ||
    typeof taskState !== 'object' ||
    Array.isArray(taskState) ||
    typeof taskState.task_id !== 'string' ||
    !taskState.task_id.trim() ||
    taskState.task_id === '.' ||
    taskState.task_id === '..' ||
    /[\\/]/.test(taskState.task_id)
  ) {
    throw new Error('Tool returned an invalid task_state.task_id.');
  }

  // Execute the actual local function using the tool arguments.
  await task_func(taskState);

  return {
    success: true,
    task_id: taskState.task_id,
    message: 'Task created successfully'
  };
}

/**
 * Actual tool implementation.
 * Saves exactly the task_state object received.
 */
async function task_func(task_state) {
  const { task_id } = task_state;

  if (!task_id) {
    throw new Error('task_state must contain task_id.');
  }

  const workspaceDir = path.join(
    process.cwd(),
    'agents',
    'devto_content_creator',
    'workspace',
    task_id
  );

  const stateFilePath = path.join(
    workspaceDir,
    'task_state.json'
  );

  await fs.mkdir(workspaceDir, { recursive: true });

  await fs.writeFile(
    stateFilePath,
    JSON.stringify(task_state, null, 2),
    'utf8'
  );
}

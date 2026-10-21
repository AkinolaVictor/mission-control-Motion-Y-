
const fs = require('node:fs');
const path = require('node:path');
const { pathToFileURL } = require('node:url');

const OLLAMA_URL = 'http://localhost:11434/api/chat';

let taskAssignerPromise;

async function getTaskAssigner() {
  // task_assigner.js uses ES module exports in your earlier code.
  if (!taskAssignerPromise) {
    const filePath = path.resolve(
      process.cwd(),
      'agents/orchestrator/functions/task_assigner_2.js'
    );

    taskAssignerPromise = import(pathToFileURL(filePath).href)
      .then(module => {
        const fn = module.task_assigner ?? module.default;

        if (typeof fn !== 'function') {
          throw new Error(
            'task_assigner.js must export task_assigner or a default function.'
          );
        }

        return fn;
      })
      .catch(error => {
        taskAssignerPromise = null;
        throw error;
      });
  }

  return taskAssignerPromise;
}

function getTools() {
  return [
    {
      type: 'function',
      function: {
        name: 'assign_task',
        description:
          'Assign a user-requested task to the most suitable agent. ' +
          'The task assigner checks agent suitability and required context. ' +
          'If context is missing, relay the missing information to the user ' +
          'and wait for their response before trying again.',
        parameters: {
          type: 'object',
          properties: {
            prompt: {
              type: 'string',
              description:
                'The user request and all relevant context collected so far.'
            }
          },
          required: ['prompt']
        }
      }
    }
  ];
}

function loadSystemPrompt() {
  const systemDir = path.resolve(
    process.cwd(),
    'agents/orchestrator/system'
  );

  const coreRules = `
You are the Orchestrator for Motion-Y Mission Control.

- Coordinate specialized agents and manage task assignment.
- Be professional, direct, and concise.
- Use Markdown.
- Follow the instructions loaded from the system directory.
- When a user requests a task for an agent, use the assign_task tool.
- If the tool reports missing information, ask the user for that
  information in natural language. Do not claim the task was created.
- Wait for the user's reply before trying to assign the task again.
- Once the task is successfully created, report the actual result.
- Never invent tool results or claim an action succeeded without evidence.
`;

  const files = fs.readdirSync(systemDir)
    .filter(file => /\.(md|txt)$/i.test(file))
    .sort();

  const instructions = files.map(file => {
    const content = fs.readFileSync(
      path.join(systemDir, file),
      'utf8'
    );

    return `\n\n# ${path.basename(file, path.extname(file))}\n${content}`;
  }).join('');

  return `${coreRules}\n\n# SYSTEM INSTRUCTIONS\n${instructions}`;
}

async function chatWithOrchestrator(payload = {}) {
  const {
    messages,
    model = 'gemma4:31b-cloud'
  } = payload;

  if (!Array.isArray(messages)) {
    throw new Error('payload.messages must be an array.');
  }

  const systemPrompt = loadSystemPrompt();
  const tools = getTools();

  // Avoid adding a duplicate system message from the frontend.
  const currentMessages = [
    { role: 'system', content: systemPrompt },
    ...messages.filter(message => message.role !== 'system')
  ];

  const MAX_ITERATIONS = 6;

  for (let iteration = 0; iteration < MAX_ITERATIONS; iteration++) {
    const response = await fetch(OLLAMA_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model,
        messages: currentMessages,
        tools,
        stream: false
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Ollama API error ${response.status}: ${errorText}`
      );
    }

    const data = await response.json();
    const assistantMessage = data.message;

    if (!assistantMessage) {
      throw new Error('Ollama returned no message.');
    }

    const toolCalls = assistantMessage.tool_calls ?? [];

    // No tool call: return the assistant's final response.
    if (toolCalls.length === 0) {
      return {
        role: 'assistant',
        content: assistantMessage.content ?? ''
      };
    }

    // Preserve the assistant's complete tool-call message.
    currentMessages.push(assistantMessage);

    // Execute each requested tool and append its corresponding result.
    for (const toolCall of toolCalls) {
      const toolName = toolCall.function?.name;

      if (toolName !== 'assign_task') {
        currentMessages.push({
          role: 'tool',
          tool_name: toolName ?? 'unknown',
          content: JSON.stringify({
            error: `Unknown tool: ${toolName}`
          })
        });
        continue;
      }

      let args = toolCall.function.arguments;

      if (typeof args === 'string') {
        try {
          args = JSON.parse(args);
        } catch {
          throw new Error(
            `Invalid JSON arguments for tool ${toolName}.`
          );
        }
      }

      if (!args || typeof args.prompt !== 'string' || !args.prompt.trim()) {
        currentMessages.push({
          role: 'tool',
          tool_name: toolName,
          content: JSON.stringify({
            error: 'A non-empty prompt is required.'
          })
        });
        continue;
      }

      let result;

      try {
        const {task_assigner} = await getTaskAssigner();
        result = await task_assigner({ prompt: args.prompt });
      } catch (error) {
        console.error('[Orchestrator] Task assignment failed:', error);

        result = {
          success: false,
          message: 'Task assignment failed.',
          error: error.message
        };
      }

      currentMessages.push({
        role: 'tool',
        tool_name: toolName,
        content: typeof result === 'string'
          ? result
          : JSON.stringify(result)
      });
    }
  }

  throw new Error(
    'Maximum tool-calling iterations reached. Try again with a simpler request.'
  );
}

module.exports = { chatWithOrchestrator };

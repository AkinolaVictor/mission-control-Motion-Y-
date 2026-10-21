
const fs = require('node:fs');
const path = require('node:path');
import { task_creator } from "./../researcher/functions/task_creator";


const OLLAMA_URL = 'http://localhost:11434/api/chat';

function prototypeToSchema(proto) {
  if (Array.isArray(proto)) {
    return {
      type: 'array',
      items: proto.length ? prototypeToSchema(proto[0]) : {}
    };
  }

  if (proto === null) return { type: 'string' };

  if (typeof proto === 'object') {
    const properties = {};

    for (const [key, value] of Object.entries(proto)) {
      properties[key] = prototypeToSchema(value);
    }

    return {
      type: 'object',
      properties,
      required: Object.keys(properties),
      additionalProperties: false
    };
  }

  if (typeof proto === 'number') {
    return {
      type: Number.isInteger(proto) ? 'integer' : 'number'
    };
  }

  if (typeof proto === 'boolean') {
    return { type: 'boolean' };
  }

  return { type: 'string' };
}

function getTools() {
  const metadataPath = path.resolve(
    process.cwd(),
    'agents/researcher/metadata.json'
  );

  const metadata = JSON.parse(
    fs.readFileSync(metadataPath, 'utf8')
  );

  if (!metadata.task_state_prototype) {
    throw new Error(
      'metadata.json is missing task_state_prototype.'
    );
  }

  return [
    {
      type: 'function',
      function: {
        name: 'create_research_task',
        description:
          'Create a research task using the Researcher agent. ' +
          'Use this when the user wants to start a research project.',
        parameters: prototypeToSchema(
          metadata.task_state_prototype
        )
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
- Follow instructions loaded from the system directory.
- For research requests, collect the required information
  and call create_research_task.
- Report success only when the tool confirms success.
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

export async function chatWithOrchestrator(payload = {}) {
  const {
    messages,
    model = 'gemma4:31b-cloud'
  } = payload;

  if (!Array.isArray(messages)) {
    throw new Error('payload.messages must be an array.');
  }

  const currentMessages = [
    { role: 'system', content: loadSystemPrompt() },
    ...messages.filter(message => message.role !== 'system')
  ];

  const tools = getTools();
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
      throw new Error(
        `Ollama API error ${response.status}: ${await response.text()}`
      );
    }

    const data = await response.json();
    const assistantMessage = data.message;

    if (!assistantMessage) {
      throw new Error('Ollama returned no message.');
    }

    const toolCalls = assistantMessage.tool_calls ?? [];

    if (toolCalls.length === 0) {
      return {
        role: 'assistant',
        content: assistantMessage.content ?? ''
      };
    }

    // Preserve the assistant message containing the tool calls.
    currentMessages.push(assistantMessage);

    for (const toolCall of toolCalls) {
      const toolName = toolCall.function?.name;
      let result;

      try {
        if (toolName !== 'create_research_task') {
          throw new Error(`Unknown tool: ${toolName}`);
        }

        let args = toolCall.function.arguments;

        if (typeof args === 'string') {
          args = JSON.parse(args);
        }

        if (!args || typeof args !== 'object' || Array.isArray(args)) {
          throw new Error('Tool arguments must be a JSON object.');
        }

        // Match the task_creator invocation in researcher.js.
        const prompt =
          typeof args.search_prompt === 'string' &&
          args.search_prompt.trim()
            ? args.search_prompt
            : JSON.stringify(args);

        // result = await taskCreator({ prompt });
        result = await task_creator({ prompt });
      } catch (error) {
        console.error('[Orchestrator] Tool failed:', error);

        result = {
          success: false,
          message: error.message
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
    'Maximum tool-calling iterations reached.'
  );
}

// module.exports = { chatWithOrchestrator };

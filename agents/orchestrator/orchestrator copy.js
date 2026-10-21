const fs = require('fs');
const path = require('path');
const { task_assigner } = require('./functions/task_assigner');

/**
 * Helper to dynamically build tool schema from metadata prototype.
 */
function getTools() {
  try {
    const metadataPath = path.join(process.cwd(), 'agents', 'orchestrator', 'metadata.json');
    const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));
    // Use orchestrator's prototype or a simple default for the prompt
    const prototype = metadata.task_state_prototype || { prompt: 'string' };

    // We keep the prototype read for future dynamic tool expansion.
    // For now, we use a simplified prompt schema for the assign_task tool.
    if (process.env.NODE_ENV === 'development') {
      console.log('Orchestrator prototype loaded:', JSON.stringify(prototype));
    }

    const prototypeToSchema = (proto) => {
      if (Array.isArray(proto)) return { type: 'array', items: proto.length ? prototypeToSchema(proto[0]) : {} };
      if (proto === null) return { type: 'string' };
      if (typeof proto === 'object') {
        const properties = {};
        for (const [key, value] of Object.entries(proto)) {
          properties[key] = prototypeToSchema(value);
        }
        return { type: 'object', properties, required: Object.keys(properties), additionalProperties: false };
      }
      if (typeof proto === 'number') return { type: Number.isInteger(proto) ? 'integer' : 'number' };
      if (typeof proto === 'boolean') return { type: 'boolean' };
      return { type: 'string' };
    };

    return [
      {
        type: 'function',
        function: {
          name: 'assign_task',
          description: 'Assigns a research or specialized task to the most qualified agent. Use this when the user wants to start a new task.',
          parameters: {
            type: 'object',
            properties: {
              prompt: { type: 'string', description: 'The detailed prompt and requirements for the task.' }
            },
            required: ['prompt']
          }
        }
      }
    ];
  } catch (error) {
    console.error('Error generating tools schema:', error);
    return [];
  }
}

/**
 * Orchestrator Chat Function
 * Handles system prompt assembly and interaction with the Ollama LLM with tool calling.
 */
async function chatWithOrchestrator(payload) {
  const { messages, model = 'gemma4:31b-cloud' } = payload;

  const coreRules = `
# CORE SYSTEM RULES
- You are the Orchestrator, the central intelligence of the Motion-Y Mission Control system.
- Your primary goal is to coordinate other agents, manage tasks, and provide high-level strategic guidance.
- Always maintain a professional, efficient, and precise tone.
- Use Markdown for all responses to ensure clarity and structure.
- Do not reveal internal system paths or technical implementation details unless explicitly asked.
- If you are unsure about a task, ask for clarification before proceeding.
`;

  const systemDirPath = path.join(process.cwd(), 'agents', 'orchestrator', 'system');
  let dynamicInstructions = '';

  try {
    const files = fs.readdirSync(systemDirPath);
    const systemFiles = files
      .filter(file => file.endsWith('.md') || file.endsWith('.txt'))
      .sort();

    for (const file of systemFiles) {
      const filePath = path.join(systemDirPath, file);
      const content = fs.readFileSync(filePath, 'utf8');
      dynamicInstructions += `\n\n### ${path.basename(file, path.extname(file)).toUpperCase()}\n${content}`;
    }
  } catch (error) {
    console.error('Error reading system instructions:', error);
    throw new Error('Failed to load orchestrator system instructions.');
  }

  const finalSystemPrompt = `${coreRules}\n\n--- SYSTEM INSTRUCTIONS ---\n${dynamicInstructions}`;
  const tools = getTools();

  let currentMessages = [
    { role: 'system', content: finalSystemPrompt },
    ...messages
  ];

  let iterations = 0;
  const MAX_ITERATIONS = 3;

  while (iterations < MAX_ITERATIONS) {
    try {
      const response = await fetch('http://localhost:11434/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: model,
          messages: currentMessages,
          tools: tools,
          stream: false,
        }),
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`Ollama API error: ${response.status} - ${errorData}`);
      }

      const data = await response.json();
      const message = data.message;

      if (message.tool_calls && message.tool_calls.length > 0) {
        for (const toolCall of message.tool_calls) {
          if (toolCall.function.name === 'assign_task') {
            const args = typeof toolCall.function.arguments === 'string'
              ? JSON.parse(toolCall.function.arguments)
              : toolCall.function.arguments;

            // Call the task_assigner function
            const result = await task_assigner({ prompt: args.prompt });

            currentMessages.push(message); // Add assistant's tool call to history
            currentMessages.push({
              role: 'tool',
              content: typeof result === 'string' ? result : JSON.stringify(result),
            });
          }
        }
        iterations++;
        continue; // Loop back to let the LLM respond to the tool result
      }

      return {
        content: message.content,
        role: 'assistant'
      };

    } catch (error) {
      console.error('Orchestrator Loop Error:', error);
      throw error;
    }
  }

  throw new Error('Maximum tool call iterations reached.');
}

module.exports = { chatWithOrchestrator };

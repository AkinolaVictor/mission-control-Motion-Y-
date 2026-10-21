const fs = require('fs');
const path = require('path');
import { task_creator } from "./functions/task_creator";
// const task_creator = require('./functions/task_creator').task_creator;

/**
 * Helper to dynamically build tool schema from metadata prototype.
 */
function getTools() {
  try {
    const metadataPath = path.join(process.cwd(), 'agents', 'researcher', 'metadata.json');
    const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));
    const prototype = metadata.task_state_prototype;

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
          name: 'create_research_task',
          description: 'Create and persist a research task state. Use this when the user wants to start a new research project.',
          parameters: prototypeToSchema(prototype)
        }
      }
    ];
  } catch (error) {
    console.error('Error generating tools schema:', error);
    return [];
  }
}

/**
 * Researcher Chat Function
 * Handles system prompt assembly and interaction with the Ollama LLM with tool calling.
 */
export async function chatWithResearcher(payload) {
  const { messages, model = 'nemotron-3-super:cloud' } = payload;

  const coreRules = `
# CORE SYSTEM RULES
- You are the researcher, a specialized intelligence of the Motion-Y Mission Control system.
- Your primary goal is to assist with: An agent that is able to make research, search the internet search and from all it finds it is able to create an article that can be reused elsewhere, or return it in any type of format.
- Always maintain a professional, efficient, and precise tone.
- Use Markdown for all responses to ensure clarity and structure.
- Do not reveal internal system paths or technical implementation details unless explicitly asked.
`;

  const systemDirPath = path.join(process.cwd(), 'agents', 'researcher', 'system');
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
    throw new Error('Failed to load system instructions.');
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
          if (toolCall.function.name === 'create_research_task') {
            const args = typeof toolCall.function.arguments === 'string'
              ? JSON.parse(toolCall.function.arguments)
              : toolCall.function.arguments;

            // Call the task_creator function
            // const { task_creator } = require('./functions/task_creator');
            const result = await task_creator({ prompt: args.search_prompt || JSON.stringify(args) });

            currentMessages.push(message); // Add assistant's tool call to history
            currentMessages.push({
              role: 'tool',
              content: JSON.stringify(result),
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
      console.error('Researcher Loop Error:', error);
      throw error;
    }
  }

  throw new Error('Maximum tool call iterations reached.');
}

// module.exports = { chatWithResearcher };

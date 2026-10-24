const fs = require('fs');
const path = require('path');
import { task_creator } from './functions/task_creator';

/**
 * Devto_content_creator Chat Function
 * Handles system prompt assembly and interaction with the Ollama LLM.
 */

function getTools() {
  try {
    const metadataPath = path.join(process.cwd(), 'agents', 'devto_content_creator', 'metadata.json');
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
          name: 'create_post',
          description: 'Create and persist a post task state. Use this when the user wants to start a create a new post.',
          parameters: prototypeToSchema(prototype)
        }
      }
    ];
  } catch (error) {
    console.error('Error generating tools schema:', error);
    return [];
  }
}
 
export async function chatWithDevto_content_creator(payload) {
// async function chatWithDevto_content_creator(payload) {
  const { messages, model = 'gemma4:31b-cloud' } = payload;

  const coreRules = `
# CORE SYSTEM RULES
- You are the devto_content_creator, a specialized intelligence of the Motion-Y Mission Control system.
- Your primary goal is to assist with: A content creator to create posts to promote Motion-Y on dev.to, these posts are fit for public consumption and help in getting leads, and in creating awareness on Motion-Y and their AI capabilities..
- Always maintain a professional, efficient, and precise tone.
- Use Markdown for all responses to ensure clarity and structure.
- Do not reveal internal system paths or technical implementation details unless explicitly asked.
`;

  const systemDirPath = path.join(process.cwd(), 'agents', 'devto_content_creator', 'system');
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

  const ollamaMessages = [
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
          messages: ollamaMessages,
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
          if (toolCall.function.name === 'create_post') {
            const args = typeof toolCall.function.arguments === 'string'
              ? JSON.parse(toolCall.function.arguments)
              : toolCall.function.arguments;

            // Call the task_creator function
            // const { task_creator } = require('./functions/task_creator');
            const result = await task_creator({ prompt: args.search_prompt || JSON.stringify(args) });

            ollamaMessages.push(message); // Add assistant's tool call to history
            ollamaMessages.push({
              role: 'tool',
              content: JSON.stringify(result),
            });
          }
        }

        iterations++;
        continue; // Loop back to let the LLM respond to the tool result
      }

      return {
        content: data.message.content,
        role: 'assistant'
      };
    } catch (error) {
      console.error('Ollama connection error:', error);
      throw error;
    }
  }
}

// module.exports = { chatWithDevto_content_creator };

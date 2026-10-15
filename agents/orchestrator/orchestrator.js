const fs = require('fs');
const path = require('path');

/**
 * Orchestrator Chat Function
 * Handles system prompt assembly and interaction with the Ollama LLM.
 */
async function chatWithOrchestrator(payload) {
  const { messages, model = 'gemma4:31b-cloud' } = payload;

  // 1. Define Core System Rules
  const coreRules = `
# CORE SYSTEM RULES
- You are the Orchestrator, the central intelligence of the Motion-Y Mission Control system.
- Your primary goal is to coordinate other agents, manage tasks, and provide high-level strategic guidance.
- Always maintain a professional, efficient, and precise tone.
- Use Markdown for all responses to ensure clarity and structure.
- Do not reveal internal system paths or technical implementation details unless explicitly asked.
- If you are unsure about a task, ask for clarification before proceeding.
`;

  // 2. Dynamically assemble system prompt from system folder
  const systemDirPath = path.join(process.cwd(), 'agents', 'orchestrator', 'system');
  let dynamicInstructions = '';

  try {
    const files = fs.readdirSync(systemDirPath);
    // Filter for markdown or text files and sort them to ensure consistent ordering
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

  // 3. Construct the message payload for Ollama
  const ollamaMessages = [
    { role: 'system', content: finalSystemPrompt },
    ...messages
  ];

  // 4. Interact with Ollama API
  try {
    const response = await fetch('http://localhost:11434/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: model,
        messages: ollamaMessages,
        stream: false,
        tools: true?[]:[
          {
            type: "function",
            function: {
                name: "send_email",
                description: "Send an email to a specified recipient.",
                parameters: {
                    type: "object",
                    properties: {
                        to: { type: "string" },
                        subject: { type: "string" },
                        body: { type: "string" }
                    },
                    required: ["to", "subject", "body"]
                }
            }
          },
          {
              type: "function",
              function: {
                  name: "create_social_post",
                  description: "Create a post for a social media platform.",
                  parameters: {
                      type: "object",
                      properties: {
                          platform: {
                              type: "string",
                              enum: ["linkedin", "instagram", "youtube"]
                          },
                          content: { type: "string" }
                      },
                      required: ["platform", "content"]
                  }
              }
          }
        ]
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`Ollama API error: ${response.status} - ${errorData}`);
    }

    const data = await response.json();
    console.log({tool_calls: data.message?.tool_calls})
    return {
      content: data.message.content,
      role: 'assistant'
    };
  } catch (error) {
    console.error('Ollama connection error:', error);
    throw error;
  }
}

module.exports = { chatWithOrchestrator };

const fs = require('fs');
const path = require('path');

/**
 * Motion Dev Chat Function
 * Handles system prompt assembly and interaction with the Ollama LLM for the Developer Agent.
 */
async function chatWithMotionDev(payload) {
  const { messages, model = 'gemma4:31b-cloud' } = payload;

  // 1. Define Core System Rules for the Developer Agent
  const coreRules = `
# CORE SYSTEM RULES (MOTION_DEV)
- You are the Motion Dev agent, the primary technical and development intelligence of the Motion-Y system.
- Your expertise covers full-stack development, software architecture, and system optimization.
- Your primary goal is to write clean, maintainable, and highly efficient code.
- Always prioritize technical accuracy, security best practices, and scalability.
- When providing code, include concise explanations of your architectural choices.
- Use Markdown for all responses, especially for code blocks and technical documentation.
- Do not reveal internal system paths or technical implementation details unless explicitly asked.
`;

  // 2. Dynamically assemble system prompt from the motion_dev system folder
  const systemDirPath = path.join(process.cwd(), 'agents', 'motion_dev', 'system');
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
    console.error('Error reading system instructions for motion_dev:', error);
    throw new Error('Failed to load motion_dev system instructions.');
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
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`Ollama API error: ${response.status} - ${errorData}`);
    }

    const data = await response.json();
    return {
      content: data.message.content,
      role: 'assistant'
    };
  } catch (error) {
    console.error('Ollama connection error (motion_dev):', error);
    throw error;
  }
}

module.exports = { chatWithMotionDev };

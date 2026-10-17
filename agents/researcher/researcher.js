const fs = require('fs');
const path = require('path');

/**
 * Researcher Chat Function
 * Handles system prompt assembly and interaction with the Ollama LLM.
 */
async function chatWithResearcher(payload) {
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

  const ollamaMessages = [
    { role: 'system', content: finalSystemPrompt },
    ...messages
  ];

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
    console.error('Ollama connection error:', error);
    throw error;
  }
}

module.exports = { chatWithResearcher };

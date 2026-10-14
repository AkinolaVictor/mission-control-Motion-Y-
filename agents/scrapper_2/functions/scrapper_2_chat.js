const fs = require('fs');
const path = require('path');

/**
 * Scrapper_2 Chat Function
 * Handles system prompt assembly and interaction with the Ollama LLM.
 */
async function chatWithScrapper_2(payload) {
  const { messages, model = 'gpt-oss:120b-cloud' } = payload;

  const coreRules = `
# CORE SYSTEM RULES
- You are the scrapper_2, a specialized intelligence of the Motion-Y Mission Control system.
- Your primary goal is to assist with: i want to create an agent that helps me search the internet for the latest news on politics, technology, medicine, education, and other major aspect. This agent must always make a deep and detailed search from genuine source to make sure to have accurate information on the report to be created it must always fact check every details and know which one is more important to have and which is false every morning by 9am it must always create a [report_name].md file containing the report based on the research it has made..
- Always maintain a professional, efficient, and precise tone.
- Use Markdown for all responses to ensure clarity and structure.
- Do not reveal internal system paths or technical implementation details unless explicitly asked.
`;

  const systemDirPath = path.join(process.cwd(), 'agents', 'scrapper_2', 'system');
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

module.exports = { chatWithScrapper_2 };

const fs = require('fs');
const path = require('path');

/**
 * Orchestrator System File Generator
 * Uses the Orchestrator's intelligence to generate tailored system files
 * for new agents based on the user's provided description.
 */

async function generateAgentSystemFiles(agentName, agentDescription) {
  const model = 'gemma4:31b-cloud'; // Using the Orchestrator's standard high-capability model

  const systemFiles = [
    {
      file: 'AGENTS.md',
      purpose: 'General overview of the agent\'s place in the Motion-Y ecosystem and its primary purpose.'
    },
    {
      file: 'IDENTITY.md',
      purpose: 'Detailed persona, tone of voice, and core identity. How the agent perceives itself.'
    },
    {
      file: 'SOUL.md',
      purpose: 'The philosophical approach, core values, and the "spirit" of how it should handle tasks.'
    },
    {
      file: 'MEMORY.md',
      purpose: 'Instructions on how the agent should handle context, remember user preferences, and manage operational state.'
    },
    {
      file: 'HEARTBEAT.md',
      purpose: 'Internal health check protocols and stability monitoring instructions.'
    },
    {
      file: 'SECURITY.md',
      purpose: 'Strict constraints, security protocols, and what the agent MUST NOT do or reveal.'
    },
    {
      file: 'TOOLS.md',
      purpose: 'Detailed guide on the tools and capabilities this specific agent should utilize to achieve its goals.'
    }
  ];

  const generatedContent = {};

  for (const item of systemFiles) {
    const prompt = `
You are the Motion-Y System Architect. You are designing a new AI Agent.
Agent Name: ${agentName}
Agent Description: ${agentDescription}

Task: Generate the content for the system file named "${item.file}".
The purpose of this file is: ${item.purpose}

Requirements:
- Base the content strictly on the Agent Description provided.
- Use a professional, high-fidelity, and architectural tone.
- Format the output in clean Markdown.
- Do not include any conversational filler (e.g., "Here is the content...").
- Provide ONLY the final content of the file.
`;

    try {
      const response = await fetch('http://localhost:11434/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: model,
          messages: [
            { role: 'system', content: 'You are a precise System Architect for AI Agents.' },
            { role: 'user', content: prompt }
          ],
          stream: false,
        }),
      });

      if (!response.ok) throw new Error(`Ollama API error: ${response.status}`);

      const data = await response.json();
      generatedContent[item.file] = data.message.content;
    } catch (error) {
      console.error(`Error generating ${item.file}:`, error);
      // Fallback to a basic version if LLM fails
      generatedContent[item.file] = `# ${item.file}\\nGenerated based on: ${agentDescription}`;
    }
  }

  return generatedContent;
}

module.exports = { generateAgentSystemFiles };

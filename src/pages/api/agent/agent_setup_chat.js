const agentMappings = require("./chat_modules/agent_mappings").agentMappings;
import fs from 'fs/promises';
import path from 'path';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { agent, model, messages } = req.body;

    if (!agent) {
      return res.status(400).json({ error: 'Agent ID is required' });
    }
    const chatAgent = agentMappings[agent]

    // 1. Load agent context to inform the Orchestrator
    // We assume agents are stored in the /agents/[agent_id] directory
    // const agentDir = path.join(process.cwd(), 'agents', agent);
    // let agentContext = '';

    // try {
    //   const files = await fs.readdir(agentDir);
    //   const systemFiles = files.filter(f => f.endsWith('.md') || f.endsWith('.json'));

    //   for (const file of systemFiles) {
    //     const content = await fs.readFile(path.join(agentDir, file), 'utf8');
    //     agentContext += `\n--- ${file} ---\n${content}\n`;
    //   }
    // } catch (err) {
    //   console.error('Error reading agent context:', err);
    //   // Continue even if context fails, but log it
    // }

    // 2. Construct the system prompt for the setup chat
    // CURRENT AGENT CONTEXT:
    // ${agentContext}
    const setupSystemPrompt = `
    You are the Orchestrator, the master architect of the Motion-Y Agent System.
    Your goal is to onboard a new agent and design its technical capabilities.
    

ONBOARDING GOALS:
1. Analyze the agent's intended purpose based on the provided context.
2. Chat with the user to refine requirements.
3. Propose a technical plan consisting of:
   - Necessary functions (Node.js files to be created in /functions).
   - Tools definitions (JSON schemas for metadata.json).
   - System instructions for TOOLS.md.

CONSTRAINTS:
- Be professional, technical, and proactive.
- When the user is satisfied, you MUST provide the final plan in a structured JSON format wrapped in a code block.
- The JSON should follow this structure:
  {
    "functions": [
      { "name": "function_name", "description": "...", "params": { "param1": "type" }, "logic": "..." }
    ],
    "tools_metadata": [
       { "name": "tool_name", "description": "...", "parameters": { ... } }
    ],
    "tools_md_content": "Detailed instructions for the agent on how to use these tools..."
  }

If this is the first message of the session, provide a warm welcome, analyze the agent's purpose, and suggest a preliminary list of functions.
`;

    // 3. Inject setup prompt into the conversation
    const setupMessages = [
      { role: 'system', content: setupSystemPrompt },
      ...messages
    ];

    // 4. Call the Orchestrator logic
    const response = await chatAgent({
      model: model || 'gemma4:31b-cloud',
      messages: setupMessages,
    });

    return res.status(200).json({ content: response });
  } catch (error) {
    console.error('Setup Chat Error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}

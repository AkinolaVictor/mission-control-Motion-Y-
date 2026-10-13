import { chatWithOrchestrator } from './../../../../agents/orchestrator/functions/orchestrator_chat';
import { chatWithMotionDev } from './../../../../agents/motion_dev/functions/motion_dev_chat';

/**
 * Agent Chat Gateway API Route
 * Routes chat requests to the appropriate agent function based on the payload.
 */
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed. Please use POST.' });
  }

  try {
    const { agent, messages, model } = req.body;

    // 1. Validation
    if (!agent) {
      return res.status(400).json({ error: 'The "agent" field is required in the request body.' });
    }
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'The "messages" field is required and must be an array.' });
    }

    // 2. Agent Routing Registry
    // As new agents are added, their chat functions are imported and added here.
    const agentRegistry = {
      orchestrator: chatWithOrchestrator,
      motion_dev: chatWithMotionDev,
    };

    const chatFunction = agentRegistry[agent];
      // researcher: chatWithResearcher, // Example for future agents
    };

    const chatFunction = agentRegistry[agent];

    if (!chatFunction) {
      return res.status(404).json({ error: `Agent "${agent}" not found or not configured.` });
    }

    // 3. Execute Agent Chat
    const payload = {
      messages,
      model: model || 'gemma4:31b-cloud', // Default model if not provided
    };

    const result = await chatFunction(payload);

    // 4. Return response
    return res.status(200).json(result);

  } catch (error) {
    console.error('Agent API Route Error:', error);

    // Handle specific Ollama connectivity errors
    if (error.message.includes('ECONNREFUSED') || error.message.includes('fetch failed')) {
      return res.status(503).json({ error: 'LLM Service (Ollama) is currently unavailable. Please ensure it is running locally.' });
    }

    return res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
}

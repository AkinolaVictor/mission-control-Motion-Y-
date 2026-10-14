import { agent_config } from './../../../../agents/config';
import { agentMappings } from './chat_modules/agent_mappings';

/**
 * Agent Chat Gateway API Route
 * Routes chat requests to the appropriate agent function using a static mapping.
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

    // 2. Route to Agent function via Mapping
    const chatFunction = agentMappings[agent];

    if (!chatFunction) {
      return res.status(404).json({ error: `Agent "${agent}" not found in chat mappings.` });
    }

    // 3. Resolve Model
    const agentMetadata = agent_config.agents.find(a => a.id === agent);
    const resolvedModel = model || agentMetadata?.model || 'gemma4:31b-cloud';

    // 4. Execute Agent Chat
    const payload = {
      messages,
      model: resolvedModel,
    };

    const result = await chatFunction(payload);

    // 5. Return response
    return res.status(200).json(result);

  } catch (error) {
    console.error('Agent API Route Error:', error);

    if (error.message.includes('ECONNREFUSED') || error.message.includes('fetch failed')) {
      return res.status(503).json({ error: 'LLM Service (Ollama) is currently unavailable.' });
    }

    return res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
}

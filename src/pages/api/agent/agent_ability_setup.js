import { buildAgentFunctions } from './agent_ability_setup_modules/agent_function_builder';
import { updateSystemFiles } from './agent_ability_setup_modules/system_file_updater';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { agentId, plan } = req.body;

    if (!agentId || !plan) {
      return res.status(400).json({ error: 'Agent ID and Implementation Plan are required' });
    }

    // 1. Build the physical function files
    const functionsCreated = await buildAgentFunctions(agentId, plan.functions || []);

    // 2. Update system instructions and metadata
    const filesUpdated = await updateSystemFiles(agentId, plan);

    return res.status(200).json({
      success: true,
      message: 'Agent abilities successfully implemented',
      details: {
        functionsCreated,
        filesUpdated
      }
    });
  } catch (error) {
    console.error('Ability Setup Error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}

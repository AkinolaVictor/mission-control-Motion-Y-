import { agent_config } from '../../../../agents/config';
import path from 'path';
import fs from 'fs';

/**
 * Get Agents API Route
 * Returns the list of all available agents from the config.
 */
export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed. Please use GET.' });
  }

  try {
    // In a production environment, you might want to dynamically re-scan the agents folder here.
    // For now, we read directly from the config.js file.
    const agents = agent_config.agents;

    if (!agents || agents.length === 0) {
      return res.status(404).json({ error: 'No agents found in configuration.' });
    }

    return res.status(200).json({ agents });
  } catch (error) {
    console.error('GetAgents API Error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}

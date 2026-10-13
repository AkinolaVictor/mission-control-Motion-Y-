import fs from 'fs';
import path from 'path';

/**
 * Agent System File Discovery and Reading API Route
 * Handles listing and reading system prompt files for agents.
 */
export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed. Please use GET.' });
  }

  const { agentId, action, file } = req.query;

  if (!agentId) {
    return res.status(400).json({ error: 'Agent ID is required.' });
  }

  const systemDir = path.join(process.cwd(), 'agents', agentId, 'system');

  try {
    if (!fs.existsSync(systemDir)) {
      return res.status(404).json({ error: 'System directory not found for this agent.' });
    }

    if (action === 'list') {
      // List all .md files in the system directory
      const files = fs.readdirSync(systemDir).filter(f => f.endsWith('.md'));
      return res.status(200).json({ files });
    }

    if (file) {
      // Read a specific system file
      const filePath = path.join(systemDir, file);
      if (!fs.existsSync(filePath)) {
        return res.status(404).json({ error: 'System file not found.' });
      }
      const content = fs.readFileSync(filePath, 'utf8');
      return res.status(200).json({ content });
    }

    return res.status(400).json({ error: 'Invalid request. Provide action=list or a file parameter.' });
  } catch (error) {
    console.error('GetAgentSystem API Error:', error);
    return res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
}

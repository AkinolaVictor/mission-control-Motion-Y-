import fs from 'fs';
import path from 'path';

/**
 * Agent System File Update API Route
 * Handles updating system prompt files for agents.
 */

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed. Please use POST.' });
  }
  try {
    const { agentId, fileName, content } = req.body;
    
    if (!agentId || !fileName || content === undefined) {
      return res.status(400).json({ error: 'agentId, fileName, and content are required.' });
    }
    
    const systemDir = path.join(process.cwd(), 'agents', agentId, 'system');
    const filePath = path.join(systemDir, fileName);
    
    // Ensure directory exists
    if (!fs.existsSync(systemDir)) {
      fs.mkdirSync(systemDir, { recursive: true });
    }
    
    // Security check: prevent directory traversal
    const relative = path.relative(systemDir, filePath);
    const check = !relative.startsWith('..') && path.isAbsolute(filePath);
    if (check) {
      fs.writeFileSync(filePath, content, 'utf8');
      return res.status(200).json({ success: true, message: 'System file updated successfully' });
    } else {
      return res.status(403).json({ error: 'Invalid file path.' });
    }
  } catch (error) {
    console.error('EditAgentSystem API Error:', error);
    return res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
}

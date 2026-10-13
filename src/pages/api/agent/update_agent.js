import fs from 'fs';
import path from 'path';

/**
 * Agent Management API Route
 * Handles updates to agent metadata and configuration files.
 */
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed. Please use POST.' });
  }

  try {
    const { agentId, updates } = req.body;

    if (!agentId) {
      return res.status(400).json({ error: 'Agent ID is required.' });
    }

    if (!updates || typeof updates !== 'object') {
      return res.status(400).json({ error: 'Updates object is required.' });
    }

    // Path to the agent's metadata.json
    const metadataPath = path.join(process.cwd(), 'agents', agentId, 'metadata.json');

    if (!fs.existsSync(metadataPath)) {
      return res.status(404).json({ error: 'Agent metadata file not found.' });
    }

    // 1. Read existing metadata
    const currentData = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));

    // 2. Merge updates
    const updatedData = {
      ...currentData,
      ...updates
    };

    // 3. Write updated metadata back to disk
    fs.writeFileSync(metadataPath, JSON.stringify(updatedData, null, 2), 'utf8');

    return res.status(200).json({
      success: true,
      message: 'Agent updated successfully',
      agent: updatedData
    });

  } catch (error) {
    console.error('UpdateAgent API Error:', error);
    return res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
}

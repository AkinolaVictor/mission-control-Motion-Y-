import fs from 'fs';
import path from 'path';

/**
 * Agent Deletion API Route
 * Handles the complete removal of an agent from the system.
 */
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { agentId } = req.body;

  if (!agentId) {
    return res.status(400).json({ error: 'Agent ID is required.' });
  }

  try {
    const agentsDir = path.join(process.cwd(), 'agents');
    const agentRoot = path.join(agentsDir, agentId);

    // 1. Delete Agent Folder
    if (fs.existsSync(agentRoot)) {
      fs.rmSync(agentRoot, { recursive: true, force: true });
    }

    // 2. Delete Chat Memory Folder
    const memoryPath = path.join(process.cwd(), 'agent_memory', 'chats', agentId);
    if (fs.existsSync(memoryPath)) {
      fs.rmSync(memoryPath, { recursive: true, force: true });
    }

    // 3. Update agents/registry.js
    const registryPath = path.join(agentsDir, 'registry.js');
    if (fs.existsSync(registryPath)) {
      let registryContent = fs.readFileSync(registryPath, 'utf8');
      const registryLine = `require("./${agentId}/metadata.json")`;

      // Remove the line containing the require statement
      const updatedRegistry = registryContent
        .split('\n')
        .filter(line => !line.includes(registryLine))
        .join('\n');

      fs.writeFileSync(registryPath, updatedRegistry, 'utf8');
    }

    // 4. Update agent_mappings.js
    const mappingPath = path.join(process.cwd(), 'src', 'pages', 'api', 'agent', 'chat_modules', 'agent_mappings.js');
    if (fs.existsSync(mappingPath)) {
      let mappingContent = fs.readFileSync(mappingPath, 'utf8');

      // Remove import statement
      const importPattern = new RegExp(`import \\{ chatWith${agentId.charAt(0).toUpperCase() + agentId.slice(1)} \\} from '.*${agentId}.*';?\\s*`, 'g');
      mappingContent = mappingContent.replace(importPattern, '');

      // Remove mapping entry
      const mappingPattern = new RegExp(`\\s*${agentId}: chatWith${agentId.charAt(0).toUpperCase() + agentId.slice(1)},?\\s*`, 'g');
      mappingContent = mappingContent.replace(mappingPattern, '\n  ');

      fs.writeFileSync(mappingPath, mappingContent, 'utf8');
    }

    return res.status(200).json({ success: true, message: `Agent ${agentId} deleted successfully.` });

  } catch (error) {
    console.error('DeleteAgent API Error:', error);
    return res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
}

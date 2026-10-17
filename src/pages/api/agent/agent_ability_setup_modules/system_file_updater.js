import fs from 'fs/promises';
import path from 'path';

/**
 * Logic to update system files (TOOLS.md, metadata.json, etc.)
 * @param {string} agentId - The ID of the agent.
 * @param {Object} plan - The structured plan from the Orchestrator.
 */
export async function updateSystemFiles(agentId, plan) {
  const agentDir = path.join(process.cwd(), 'agents', agentId);

  // 1. Update TOOLS.md
  const toolsMdPath = path.join(agentDir, 'TOOLS.md');
  await fs.writeFile(toolsMdPath, plan.tools_md_content || '# Tools\nNo tools defined.', 'utf8');

  // 2. Update metadata.json
  const metadataPath = path.join(agentDir, 'metadata.json');
  const metadataContent = await fs.readFile(metadataPath, 'utf8');
  const metadata = JSON.parse(metadataContent);

  metadata.setup = true;
  metadata.tools = plan.tools_metadata || [];

  await fs.writeFile(metadataPath, JSON.stringify(metadata, null, 2), 'utf8');

  return {
    toolsMdUpdated: true,
    metadataUpdated: true
  };
}

import fs from 'fs/promises';
import path from 'path';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const agentsBaseDir = path.join(process.cwd(), 'agents');
    const agentFolders = await fs.readdir(agentsBaseDir, { withFileTypes: true });

    const approvals = [];

    for (const folder of agentFolders) {
      if (!folder.isDirectory()) continue;

      const agentId = folder.name;
      const workspaceDir = path.join(agentsBaseDir, agentId, 'workspace');

      try {
        const taskFolders = await fs.readdir(workspaceDir);

        for (const taskFolder of taskFolders) {
          const stateFilePath = path.join(workspaceDir, taskFolder, 'task_state.json');

          try {
            const stateContent = await fs.readFile(stateFilePath, 'utf8');
            const taskState = JSON.parse(stateContent);

            if (taskState.await_approval) {
              approvals.push({
                ...taskState,
                agent_id: agentId,
                task_folder: taskFolder
              });
            }
          } catch (readError) {
            // Skip files that aren't JSON or are missing
            continue;
          }
        }
      } catch (workspaceError) {
        // Skip agents that don't have a workspace directory yet
        continue;
      }
    }

    return res.status(200).json(approvals);
  } catch (error) {
    console.error('Error fetching approvals:', error);
    return res.status(500).json({ error: 'Internal server error while fetching approvals.' });
  }
}

import fs from 'fs/promises';
import path from 'path';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { category = 'all' } = req.query;

  try {
    const agentsBaseDir = path.join(process.cwd(), 'agents');
    const agentFolders = await fs.readdir(agentsBaseDir, { withFileTypes: true });

    const allTasks = [];

    for (const folder of agentFolders) {
      if (!folder.isDirectory()) continue;

      const agentId = folder.name;

      // Define directories to scan for each agent
      const directoriesToScan = [
        { name: 'workspace', path: path.join(agentsBaseDir, agentId, 'workspace') },
        { name: 'finished', path: path.join(agentsBaseDir, agentId, 'finished') }
      ];

      for (const dirInfo of directoriesToScan) {
        try {
          const taskFolders = await fs.readdir(dirInfo.path);

          for (const taskFolder of taskFolders) {
            try {
              const stateFilePath = path.join(dirInfo.path, taskFolder, 'task_state.json');
              const stateContent = await fs.readFile(stateFilePath, 'utf8');
              const state = JSON.parse(stateContent);

              // State Logic & Priority Rules
              const isCompleted = state.status === 'completed';
              const isOngoing = state.status === 'ongoing';
              const isScheduled = state.scheduled === true && !isCompleted;

              let matchesCategory = false;

              if (category === 'all') {
                matchesCategory = true;
              } else if (category === 'completed' && isCompleted) {
                matchesCategory = true;
              } else if (category === 'ongoing' && isOngoing) {
                matchesCategory = true;
              } else if (category === 'scheduled' && isScheduled) {
                matchesCategory = true;
              }

              if (matchesCategory) {
                allTasks.push({
                  ...state,
                  agent_id: agentId,
                  location: dirInfo.name,
                  task_folder: taskFolder
                });
              }
            } catch (readError) {
              // Skip if task_state.json is missing or invalid
              continue;
            }
          }
        } catch (dirError) {
          // Skip if the directory (workspace/finished) doesn't exist for this agent
          continue;
        }
      }
    }

    return res.status(200).json(allTasks);
  } catch (error) {
    console.error('Error fetching all tasks:', error);
    return res.status(500).json({ error: 'Internal server error while fetching all tasks.' });
  }
}

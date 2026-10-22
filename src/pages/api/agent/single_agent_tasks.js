import fs from 'fs/promises';
import path from 'path';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { agent_id } = req.query;

  if (!agent_id) {
    return res.status(400).json({ error: 'Missing agent_id' });
  }

  try {
    const agentsBaseDir = path.join(process.cwd(), 'agents', agent_id);

    const ongoingTasks = [];
    const completedTasks = [];
    const awaitingTasks = [];

    // 1. Process Completed Tasks from finished/ folder
    const finishedDir = path.join(agentsBaseDir, 'finished');
    try {
      const finishedFolders = await fs.readdir(finishedDir);
      for (const folder of finishedFolders) {
        try {
          const statePath = path.join(finishedDir, folder, 'task_state.json');
          const content = await fs.readFile(statePath, 'utf8');
          const state = JSON.parse(content);
          completedTasks.push({ ...state, location: 'finished' });
        } catch (e) {
          continue;
        }
      }
    } catch (e) {
      // finished folder might not exist, which is fine
    }

    // 2. Process Workspace Tasks
    const workspaceDir = path.join(agentsBaseDir, 'workspace');
    try {
      const workspaceFolders = await fs.readdir(workspaceDir);
      for (const folder of workspaceFolders) {
        try {
          const statePath = path.join(workspaceDir, folder, 'task_state.json');
          const content = await fs.readFile(statePath, 'utf8');
          const state = JSON.parse(content);

          // Categorization logic
          const isAwaiting = state.await_approval === true || state.await_approval === 'true';

          if (isAwaiting) {
            awaitingTasks.push({ ...state, location: 'workspace' });
          } else if (state.status === 'ongoing') {
            ongoingTasks.push({ ...state, location: 'workspace' });
          } else if (state.status === 'completed') {
            completedTasks.push({ ...state, location: 'workspace' });
          }
        } catch (e) {
          continue;
        }
      }
    } catch (e) {
      // workspace folder might not exist
    }

    return res.status(200).json([
      { name: "Ongoing Tasks", tasks: ongoingTasks },
      { name: "Completed Tasks", tasks: completedTasks },
      { name: "Awaiting Tasks", tasks: awaitingTasks }
    ]);
  } catch (error) {
    console.error('Get Single Agent Tasks Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

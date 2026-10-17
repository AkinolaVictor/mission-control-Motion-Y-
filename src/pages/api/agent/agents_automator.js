import fs from 'fs/promises';
import path from 'path';
import { task_runner } from './../../../../agents/researcher/task_runner'
import { task_manager } from '../../../../agents/researcher/task_manager';
// const task = require("./../../../../agents/researcher/workspace/game_3_test/task_state.json")

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  const { task_id, agent } = req.body;
  if(!task_id || !agent) return res.status(405).json({ error: 'Method not allowed' });

  console.log({task_id, agent})
try {
    // const workspaceDir = path.join(process.cwd(), 'agents', 'researcher', 'workspace');
    // const folders = await fs.readdir(workspaceDir);
    const task_state = require(`./../../../../agents/${agent}/workspace/${task_id}/task_state.json`)
    
    if(!task_state) return res.status(405).json({ error: 'Method not allowed' });
    
        console.log("called api...")
        await task_runner(task_state);
    
    // const tasks = [];
    // for (const folder of folders) {
    //   const statePath = path.join(workspaceDir, folder, 'task_state.json');
    //   try {
    //     const stateData = await fs.readFile(statePath, 'utf8');
    //     const state = JSON.parse(stateData);
    //     // Include the folder name as task_id in case it's missing from the json
    //     tasks.push({ ...state, task_id: state.task_id || folder });
    //   } catch (e) {
    //     // Skip folders that don't have a task_state.json
    //     continue;
    //   }
    // }
    // // console.log(tasks)

    // const results = [];
    // for (const task of tasks) {
    //   try {
    //     await task_runner(task);
    //     results.push({ task_id: task.task_id, status: 'processed' });
    //   } catch (err) {
    //     results.push({ task_id: task.task_id, status: 'error', error: err.message });
    //   }
    // }
    console.log("automator working...")

    return res.status(200).json({
      success: true,
      // total_processed: tasks.length,
      // details: results
    });

  } catch (error) {
    console.error('Test Task Runner API Error:', error);
    return res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
}

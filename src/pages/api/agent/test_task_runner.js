import fs from 'fs/promises';
import path from 'path';
import { task_runner } from './../../../../agents/researcher/task_runner'
import chokidar from 'chokidar';
import { task_creator } from '../../../../agents/researcher/functions/task_creator_2';
// import { task_manager } from '../../../../agents/researcher/task_manager';
// const task = require("./../../../../agents/researcher/workspace/game_3_test/task_state.json")

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  console.log("called api...")
  try {
    // const workspaceDir = path.join(process.cwd(), 'agents', 'researcher', 'workspace');
    // const folders = await fs.readdir(workspaceDir);

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
    // console.log("working...")

    // task_manager()
    // stay_awake()
    console.log("started")
    await task_creator({
      prompt: "Importance of wild animals in local communities"
    })
    console.log("eended")


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


function stay_awake(){
  let working = false
  let timeout = false

  function delayer({working=false, timeout=false, time, func}){
    if(working){
        clearTimeout(timeout)
        working = false
    }
    
    working = true
    // working = true
    
    timeout = setTimeout(async() => {
        if(func) await func()
        working = false
    }, time||500);
  }
  
  
  const workspaceDir = path.join(process.cwd(), 'agents', 'researcher', 'workspace');
  const watcher = chokidar.watch(workspaceDir, {
      persistent: true,
      ignoreInitial: true,
  });

  let active = false

  watcher
  .on('change', async (filePath) => {
      const names = filePath.split('\\')
      const len = names.length-1
      const task_id = names[len-1]
      const agent = names[len-3]

      const name = path.basename(filePath);
      if(name=="task_state.json"){
        if(active == true) {
          console.log("blocked: already called...")
          return
        }
        active=true
        
        const filePath = path.join(process.cwd(), "agents", agent, "workspace", task_id, "task_state.json")
        const file = await fs.readFile(filePath, "utf8")
        const task_state = JSON.parse(file)
        delayer({
          time: 3000,
          working,
          timeout,
          func: async ()=>{
            console.log("Eventually called")
            active=false
            await task_runner(task_state)
          }
        })
        console.log("task called");
      }
  })
  .on('unlinkDir', dirPath => { 
    watcher.removeAllListeners();
    console.log("stopped watching, please reconnect...")
  })
}
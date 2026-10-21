import fs from 'fs/promises';
import path from 'path';
import { task_runner } from '../../../../agents/researcher/task_runner'
import chokidar from 'chokidar';
import { task_creator } from '../../../../agents/researcher/functions/task_creator';
// import { task_manager } from '../../../../agents/researcher/task_manager';
// const task = require("./../../../../agents/researcher/workspace/game_3_test/task_state.json")

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // console.log("called api...")
  try {
    
    const agentsDir = path.join(process.cwd(), 'agents');
    const agents = await fs.readdir(agentsDir);
    const tasks = []
    for (const agent of agents){
      const AgentWorkspaceDir = path.join(agentsDir, agent, 'workspace');
      try {
        
        const agentWorkspace = await fs.readdir(AgentWorkspaceDir);
        for (const eachTask of agentWorkspace) {
          const statePath = path.join(AgentWorkspaceDir, eachTask, 'task_state.json');
  
          try {
            const stateData = await fs.readFile(statePath, 'utf8');
            const state = JSON.parse(stateData);
            // console.log({status: "found", agent, eachTask})
            // Include the folder name as task_id in case it's missing from the json
            tasks.push({ ...state, task_id: state.task_id || folder });
          } catch (e) {
            // Skip folders that don't have a task_state.json
            continue;
          }
        }
      } catch (e) {
        // console.log("didnt find", agent)
        continue
      }
    }

    // console.log("task length", tasks.length)

    const results = [];
    for (let i=0; i<=tasks.length-1; i++) {
      const task = tasks[i]
      if(i==tasks.length-1) console.log("done running...")
      try {
        // await task_runner(task);
        task_runner(task);
        results.push({ task_id: task.task_id, status: 'processed' });
      } catch (err) {
        results.push({ task_id: task.task_id, status: 'error', error: err.message });
      }
    }
    
    // watch for changes
    stay_awake()
    // await task_creator({
    //   prompt: `Pros and cons of being a solo founder for a tech company`
    // })
    // console.log("eended")


    return res.status(200).json({
      success: true,
      total_processed: tasks.length,
      details: results
    });

  } catch (error) {
    console.error('Test Task Runner API Error:', error);
    return res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
}


function stay_awake(){
  // const workspaceDir = path.join(process.cwd(), 'agents', 'researcher', 'workspace');
  const workspaceDir = path.join(process.cwd(), 'agents');
  const watcher = chokidar.watch(workspaceDir, {
      persistent: true,
      ignoreInitial: true,
  });

  const monitor = {}

  watcher
  .on('change', async (filePath) => {await task_monitor(filePath, monitor)})
  .on('add', async (filePath) => {await task_monitor(filePath, monitor)})
  .on('unlinkDir', dirPath => { 
    watcher.removeAllListeners();
    console.log("stopped watching, please reconnect...")
  })
  // .on('unlink', (filePath) => {console.log('File deleted:', filePath)})
  // .on('addDir', dirPath => {console.log('Folder added:', dirPath)})
  // .on('error', error => console.error('Watcher error:', error));
}

async function task_monitor(filePath, monitor){

    const names = filePath.split('\\')

    // if(names.length < 8) return

    const len = names.length-1
    const task_id = names[len-1]
    const agent = names[len-3]
    
    const name = path.basename(filePath);

    if(name=="task_state.json"){
      if(monitor[`${task_id}_active`] == true) {
        console.log("blocked: already called...")
        return
      }
      monitor[`${task_id}_active`]=true
      
      const filePath = path.join(process.cwd(), "agents", agent, "workspace", task_id, "task_state.json")
      const file = await fs.readFile(filePath, "utf8")
      const task_state = JSON.parse(file)
      delayer({
        time: 5000,
        task_id,
        monitor,
        func: async ()=>{
          console.log("Eventually called")
          monitor[`${task_id}_active`]=false
          await task_runner(task_state)
        }
      })
      console.log("task called");
    }
}

function delayer({working=false, timeout=false, time, func, task_id, monitor}){
  if(monitor[`${task_id}_working`]){
      clearTimeout(monitor[`${task_id}_timeout`])
      monitor[`${task_id}_working`] = false
  }
  
  monitor[`${task_id}_working`] = true
  
  monitor[`${task_id}_timeout`] = setTimeout(async() => {
      if(func) await func()
      monitor[`${task_id}_working`] = false
  }, time||500);
}
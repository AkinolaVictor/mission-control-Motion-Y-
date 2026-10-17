import fs from 'node:fs';
import path from 'node:path';
import chokidar from 'chokidar';
// import { task_runner } from './task_runner';
import { automator } from '../../automator';


export async function task_manager(){
    
    // const workspaceDir = path.join(process.cwd(), 'agents', 'researcher', 'workspace', "metadata.json");
    // const workspaceDir = path.join(process.cwd(), 'agents', 'researcher', 'workspace', "game_3_test");

    // fs.watch(workspaceDir, (eventType, filename) => {
    //     console.log(`Event: ${eventType}`);
    //     console.log(`File changed: ${filename}`);
    // });

    
    const workspaceDir = path.join(process.cwd(), 'agents', 'researcher', 'workspace');
    const watcher = chokidar.watch(workspaceDir, {
        persistent: true,
        ignoreInitial: true,
    });

    console.log("watching...")

    watcher
    .on('change', (filePath) => {
        const names = filePath.split('\\')
        const len = names.length-1
        const task_id = names[len-1]
        const agent = names[len-3]
        console.log({task_id})
        const name = path.basename(filePath);
        if(name=="task_state.json"){
            // task_runner()
            console.log("runner called");
            task_monitor(task_id, agent)
        }
    })
    .on('unlinkDir', dirPath => { watcher.removeAllListeners()})
    // .on('add', (filePath) => {console.log('File added:', filePath)})
    // .on('unlink', (filePath) => {console.log('File deleted:', filePath)})
    // .on('addDir', dirPath => {console.log('Folder added:', dirPath)})
    // .on('error', error => console.error('Watcher error:', error));


    async function task_monitor (id, agent){
        await automator(id, agent)
    }
}

// Events monitored
// Event ==> Meaning
// add ==> A file is created
// change ==> A file is modified
// unlink ==> A file is deleted
// addDir ==> A directory is created
// unlinkDir ==> A directory is deleted
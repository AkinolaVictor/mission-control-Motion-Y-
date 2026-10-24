import fs from 'fs/promises';
import path from 'path';

/**
 * Task Cleanup for the devto_content_creator Agent.
 * Moves a completed task folder from the workspace to the finished directory.
 *
 * @param {Object} params - The parameters for cleanup.
 * @param {string} params.task_id - The unique ID of the task folder to move.
 * @returns {Promise<{success: boolean, message: string, path: string}>}
 */
export async function task_cleanup({ task_id }) {
  if (!task_id || typeof task_id !== 'string') {
    throw new Error('A valid task_id string is required for task_cleanup.');
  }
  console.log("cleanup started...")
  
  const devto_content_creator_dir = path.join(process.cwd(), 'agents', 'devto_content_creator');
  const workspaceDir = path.join(devto_content_creator_dir, 'workspace');
  const finishedDir = path.join(devto_content_creator_dir, 'finished');

  const sourcePath = path.join(workspaceDir, task_id);
  const destinationPath = path.join(finishedDir, task_id);

  try {
    // 1. Verify source directory exists
    try {
      await fs.access(sourcePath);
    } catch (error) {
      throw new Error(`Source task folder not found: ${task_id}`);
    }

    // 2. Ensure the 'finished' parent directory exists
    await fs.mkdir(finishedDir, { recursive: true });

    // 3. Move the folder
    // fs.rename is efficient for moving directories on the same partition
    await fs.rename(sourcePath, destinationPath);
    
    console.log("cleanup ended...")
    return {
      success: true,
      message: `Task ${task_id} has been moved to finished archive.`,
      path: destinationPath
    };
  } catch (error) {
    console.error(`Task Cleanup Error [${task_id}]:`, error.message);
    throw error;
  }
}

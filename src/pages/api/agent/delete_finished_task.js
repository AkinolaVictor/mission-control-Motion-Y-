import fs from 'fs/promises';
import path from 'path';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { agent_id, task_id, location } = req.body;

  if (!agent_id || !task_id || !location) {
    return res.status(400).json({ error: 'Missing agent_id, task_id, or location' });
  }

  try {
    const taskFolderPath = path.join(process.cwd(), 'agents', agent_id, location, task_id);

    await fs.rm(taskFolderPath, { recursive: true, force: true });

    return res.status(200).json({ success: true, message: 'Completed task deleted successfully' });
  } catch (error) {
    console.error('Delete Finished Task Error:', error);
    return res.status(500).json({ error: 'Failed to delete completed task' });
  }
}

import fs from 'fs/promises';
import path from 'path';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { agent_id, task_id } = req.body;

  if (!agent_id || !task_id) {
    return res.status(400).json({ error: 'Missing agent_id or task_id' });
  }

  try {
    const stateFilePath = path.join(process.cwd(), 'agents', agent_id, 'workspace', task_id, 'task_state.json');

    const content = await fs.readFile(stateFilePath, 'utf8');
    const taskState = JSON.parse(content);

    taskState.await_approval = false;

    await fs.writeFile(stateFilePath, JSON.stringify(taskState, null, 2), 'utf8');

    return res.status(200).json({ success: true, message: 'Task approved successfully' });
  } catch (error) {
    console.error('Approve Task Error:', error);
    return res.status(500).json({ error: 'Failed to approve task' });
  }
}

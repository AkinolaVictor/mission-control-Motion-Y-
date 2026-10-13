import fs from 'fs';
import path from 'path';

/**
 * Agent History DELETE Route
 * Deletes a specific chat history JSON file from agent_memory/chats/[agent_name]/
 */
export default async function handler(req, res) {
  if (req.method !== 'DELETE') {
    return res.status(405).json({ error: 'Method Not Allowed. Please use DELETE.' });
  }

  const { agent, chatId } = req.query;

  if (!agent || !chatId) {
    return res.status(400).json({ error: 'Both agent and chatId are required.' });
  }

  const filePath = path.join(process.cwd(), 'agent_memory', 'chats', agent, `${chatId}.json`);

  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      return res.status(200).json({ success: true, message: 'Chat history deleted successfully.' });
    } else {
      return res.status(404).json({ error: 'Chat history file not found.' });
    }
  } catch (error) {
    console.error('DeleteHistory API Error:', error);
    return res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
}

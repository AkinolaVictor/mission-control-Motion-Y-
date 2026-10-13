import fs from 'fs';
import path from 'path';

/**
 * Agent History SAVE Route
 * Updates persistent chat history in agent_memory/chats/[agent_name]/
 */
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed. Please use POST.' });
  }

  const { agent } = req.query;

  if (!agent) {
    return res.status(400).json({ error: 'Agent name is required in the query string.' });
  }

  const baseDir = path.join(process.cwd(), 'agent_memory', 'chats', agent);

  try {
    if (!fs.existsSync(baseDir)) {
      fs.mkdirSync(baseDir, { recursive: true });
    }

    const { chatId, messages } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Messages array is required in the request body.' });
    }

    // If no chatId provided, generate one with timestamp
    const finalChatId = chatId || `${Date.now()}_${new Date().toISOString().replace(/[:.]/g, '-')}`;
    const filePath = path.join(baseDir, `${finalChatId}.txt`);

    // Store as JSON string in a text file
    fs.writeFileSync(filePath, JSON.stringify(messages, null, 2), 'utf8');

    return res.status(200).json({ success: true, chatId: finalChatId });
  } catch (error) {
    console.error('SaveHistory API Error:', error);
    return res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
}

import fs from 'fs';
import path from 'path';

/**
 * Agent History GET Route
 * Fetches persistent chat history from agent_memory/chats/[agent_name]/.json files
 */
export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed. Please use GET.' });
  }

  const { agent, chatId } = req.query;

  if (!agent) {
    return res.status(400).json({ error: 'Agent name is required.' });
  }

  const baseDir = path.join(process.cwd(), 'agent_memory', 'chats', agent);

  try {
    if (!fs.existsSync(baseDir)) {
      return res.status(200).json({ chats: [] });
    }

    if (chatId) {
      // Case 1: Fetch specific chat content
      const filePath = path.join(baseDir, `${chatId}.json`);
      if (!fs.existsSync(filePath)) {
        return res.status(404).json({ error: 'Chat not found.' });
      }
      const content = fs.readFileSync(filePath, 'utf8');
      const chatData = JSON.parse(content);
      return res.status(200).json({
          messages: chatData.messages,
          chatId: chatId,
          title: chatData.title,
          timestamp: chatData.timestamp
      });
    }

    // Case 2: List all chats for this agent
    const files = fs.readdirSync(baseDir);
    const chatHistory = files
      .filter(file => file.endsWith('.json'))
      .map(file => {
        const name = file.replace('.json', '');
        const chatData = JSON.parse(fs.readFileSync(path.join(baseDir, file), 'utf8'));
        return {
          chatId: name,
          title: chatData.title || 'Untitled Chat',
          timestamp: chatData.timestamp || new Date().toISOString(),
          id: name.split('_')[0]
        };
      });

    return res.status(200).json({ chats: chatHistory });
  } catch (error) {
    console.error('GetHistory API Error:', error);
    return res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
}

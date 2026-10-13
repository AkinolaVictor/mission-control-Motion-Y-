import fs from 'fs';
import path from 'path';

/**
 * Agent History API Route
 * Manages persistent chat history using file storage in agent_memory/chats/[agent_name]/
 */
export default async function handler(req, res) {
  const { agent, chatId } = req.query;

  if (!agent) {
    return res.status(400).json({ error: 'Agent name is required.' });
  }

  const baseDir = path.join(process.cwd(), 'agent_memory', 'chats', agent);

  // Ensure agent directory exists
  if (!fs.existsSync(baseDir)) {
    fs.mkdirSync(baseDir, { recursive: true });
  }

  try {
    if (req.method === 'GET') {
      // Case 1: Fetch specific chat content
      if (chatId) {
        const filePath = path.join(baseDir, `${chatId}.txt`);
        if (!fs.existsSync(filePath)) {
          return res.status(404).json({ error: 'Chat not found.' });
        }
        const content = fs.readFileSync(filePath, 'utf8');
        return res.status(200).json({
            messages: JSON.parse(content),
            chatId: chatId
        });
      }

      // Case 2: List all chats for this agent
      const files = fs.readdirSync(baseDir);
      const chatHistory = files
        .filter(file => file.endsWith('.txt'))
        .map(file => {
          const name = file.replace('.txt', '');
          const [id, timestamp] = name.split('_');
          return {
            chatId: name,
            timestamp: timestamp,
            id: id
          };
        });

      return res.status(200).json({ chats: chatHistory });
    }

    if (req.method === 'POST') {
      const { chatId, messages } = req.body;

      // If no chatId provided, generate one with timestamp
      const finalChatId = chatId || `${Date.now()}_${new Date().toISOString().replace(/[:.]/g, '-')}`;
      const filePath = path.join(baseDir, `${finalChatId}.txt`);

      // Store as JSON string in a text file for easy reading/parsing
      fs.writeFileSync(filePath, JSON.stringify(messages, null, 2), 'utf8');

      return res.status(200).json({ success: true, chatId: finalChatId });
    }

    return res.status(405).json({ error: 'Method Not Allowed' });
  } catch (error) {
    console.error('History API Error:', error);
    return res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
}

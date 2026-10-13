import fs from 'fs';
import path from 'path';

/**
 * Agent History API Route
 * Manages persistent chat history using file storage in agent_memory/chats/[agent_name]/
 */
export default async function handler(req, res) {
  console.log("Got here.....")
  const { agent, chatId } = req.query;
  
  if (!agent) {
    return res.status(400).json({ error: 'Agent name is required.' });
  }

  // Use process.cwd() to ensure we are in the project root
  const baseDir = path.join(process.cwd(), 'agent_memory', 'chats', agent);
  
  try {
    // Ensure agent directory exists
    console.log("Got here 2")
    if (!fs.existsSync(baseDir)) {
      fs.mkdirSync(baseDir, { recursive: true });
    }
    
    console.log("Got here 3")
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
          const parts = name.split('_');
          return {
            chatId: name,
            timestamp: parts.length > 1 ? parts.slice(1).join('_') : 'Unknown',
            id: parts[0]
          };
        });
      console.log("Getting History")
      return res.status(200).json({ chats: chatHistory });
    }
    console.log("Got here 4")

    if (req.method === 'POST') {
      // Log request for debugging
      console.log(`[History API] POST request for agent: ${agent}, body:`, req.body);

      const { chatId, messages } = req.body;
      console.log(messages)

      if (!messages || !Array.isArray(messages)) {
        return res.status(400).json({ error: 'Messages array is required.' });
      }

      // If no chatId provided, generate one with timestamp
      const finalChatId = chatId || `${Date.now()}_${new Date().toISOString().replace(/[:.]/g, '-')}`;
      const filePath = path.join(baseDir, `${finalChatId}.txt`);

      // Store as JSON string in a text file
      fs.writeFileSync(filePath, JSON.stringify(messages, null, 2), 'utf8');

      console.log(`[History API] Successfully saved chat to: ${filePath}`);

      return res.status(200).json({ success: true, chatId: finalChatId });
    }

    return res.status(405).json({ error: 'Method Not Allowed' });
  } catch (error) {
    console.error('History API Error:', error);
    return res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
}

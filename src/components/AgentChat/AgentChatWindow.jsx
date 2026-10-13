import React, { useState, useEffect } from 'react';
import ChatHeader from './ChatHeader';
import ChatInput from './ChatInput';
import ChatNewState from './ChatNewState';
import ChatActiveState from './ChatActiveState';
import ChatMenu from './ChatMenu';
import ChatHistory from './ChatHistory';
import styles from './AgentChat.module.css';


export default function AgentChatWindow({ onClose, agentId, agentName }) {
  const [view, setView] = useState('new'); // 'new' | 'active'
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [currentChatId, setCurrentChatId] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem("motion_y_chat_history");
    if (saved) {
      const history = JSON.parse(saved);
      const chatIds = Object.keys(history);
      if (chatIds.length > 0) {
        const mostRecentId = chatIds.sort((a, b) =>
          new Date(history[b].timestamp) - new Date(history[a].timestamp)
        )[0];

        const lastChat = history[mostRecentId];
        const lastTimestamp = new Date(lastChat.timestamp).getTime();
        if (Date.now() - lastTimestamp < 60 * 60 * 1000) {
          setMessages(lastChat.messages);
          setCurrentChatId(mostRecentId);
          setView('active');
        }
      }
    }
  }, []);

  const saveChatToHistory = (msgs) => {
    const currentHistory = JSON.parse(localStorage.getItem("motion_y_chat_history") || "{}");
    const firstUserMsg = msgs.find(m => m.role === "user")?.content || "New Conversation";
    const title = firstUserMsg.substring(0, 30) + (firstUserMsg.length > 30 ? "..." : "");
    const chatId = currentChatId || Date.now().toString();

    currentHistory[chatId] = {
      title,
      messages: msgs,
      timestamp: new Date().toISOString(),
    };

    localStorage.setItem("motion_y_chat_history", JSON.stringify(currentHistory));
    setCurrentChatId(chatId);
  };

  const handleNewChat = () => {
    setMessages([]);
    setCurrentChatId(null);
    setView('new');
  };

  const handleLoadChat = (chatId) => {
    const history = JSON.parse(localStorage.getItem("motion_y_chat_history") || "{}");
    const chat = history[chatId];
    if (chat) {
      setMessages(chat.messages);
      setCurrentChatId(chatId);
      setView('active');
      setIsHistoryOpen(false);
    }
  };

  const handleDeleteChat = (chatId) => {
    const currentHistory = JSON.parse(localStorage.getItem("motion_y_chat_history") || "{}");
    delete currentHistory[chatId];
    localStorage.setItem("motion_y_chat_history", JSON.stringify(currentHistory));
    if (currentChatId === chatId) {
      handleNewChat();
    }
  };

  const handleClearHistory = () => {
    localStorage.removeItem("motion_y_chat_history");
    handleNewChat();
    setIsHistoryOpen(false);
  };

  const handleStartChat = async (text) => {
    setView('active');
    await handleSend(text);
  };

  const handleSend = async (text) => {
    const userMsg = { role: 'user', content: text };
    const newMsgs = [...messages, userMsg];
    setMessages(newMsgs);
    setIsTyping(true);

    try {
      const response = await fetch('/api/agent/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          agent: agentId || 'orchestrator',
          model: 'gemma4:31b-cloud',
          messages: newMsgs
        }),
      });

      if (!response.ok) throw new Error('API Error');
      const data = await response.json();

      const updatedMsgs = [...newMsgs, { role: 'assistant', content: data.content }];
      setMessages(updatedMsgs);
      saveChatToHistory(updatedMsgs);
    } catch (err) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `I'm having trouble connecting to the ${agentName || 'orchestrator'} agent. Please try again.`
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col h-full w-full bg-layer2 border border-border-subtle rounded-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-300 relative">
      <ChatHeader onClose={onClose} onOpenMenu={() => setIsMenuOpen(!isMenuOpen)} />

      <div className="flex-1 overflow-y-auto custom-scrollbar relative">
        {view === 'new' ? (
          <ChatNewState onStartChat={handleStartChat} />
        ) : (
          <ChatActiveState messages={messages} isTyping={isTyping} />
        )}
      </div>

      <ChatInput onSend={handleSend} isTyping={isTyping} />

      <ChatMenu
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        onNewChat={handleNewChat}
        onViewHistory={() => {
          setIsHistoryOpen(true);
          setIsMenuOpen(false);
        }}
      />

      <ChatHistory
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        onLoadChat={handleLoadChat}
        onDeleteChat={handleDeleteChat}
        onClearHistory={handleClearHistory}
      />
    </div>
  );
}

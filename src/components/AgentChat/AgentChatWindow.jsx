import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
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
  const scrollRef = useRef(null);

  const scrollIntoView = () => {
    if (scrollRef.current) {
      const element = scrollRef.current;
      // Instead of scrolling to the very bottom, we ensure the latest message
      // is at least partially visible. If it's a very long message, the user
      // can scroll manually.
      const scrollAmount = element.scrollHeight - element.clientHeight;
      if (scrollAmount > 0) {
        element.scrollTo({
          top: scrollAmount,
          behavior: 'smooth'
        });
      }
    }
  };

  useEffect(() => {
    // Only autoscroll when the agent has actually replied (isTyping becomes false)
    // or when the user sends a message.
    scrollIntoView();
    // if (!isTyping) {
    //   scrollIntoView();
    // }
  }, [messages, isTyping]);

  useEffect(() => {
    async function loadRecentChat() {
      // Reset state immediately when agent changes to prevent previous agent's messages from showing
      setMessages([]);
      setCurrentChatId(null);
      setView('new');

      try {
        const response = await axios.get(`/api/agent/gethistory?agent=${agentId || 'orchestrator'}`);
        const data = response.data;
        if (data.chats && data.chats.length > 0) {
          const mostRecentChatId = data.chats[0].chatId;
          const chatResponse = await axios.get(`/api/agent/gethistory?agent=${agentId || 'orchestrator'}&chatId=${mostRecentChatId}`);
          const chatData = chatResponse.data;
          if (chatData.messages) {
            setMessages(chatData.messages);
            setCurrentChatId(mostRecentChatId);
            setView('active');
          }
        }
      } catch (error) {
        console.error('Error loading recent chat:', error);
      }
    }
    loadRecentChat();
  }, [agentId]);

  const saveChatToHistory = async (msgs, overrideChatId = null) => {
    try {
      const chatIdToUse = overrideChatId || currentChatId;
      const response = await axios.post(`/api/agent/savehistory?agent=${agentId || 'orchestrator'}`, {
        chatId: chatIdToUse,
        messages: msgs
      });
      const data = response.data;
      if (data.chatId) {
        setCurrentChatId(data.chatId);
      }
    } catch (error) {
      console.error('Error saving chat to history:', error);
    }
  };

  const handleNewChat = () => {
    setMessages([]);
    setCurrentChatId(null);
    setView('new');
  };

  const handleLoadChat = async (chatId) => {
    try {
      const response = await axios.get(`/api/agent/gethistory?agent=${agentId || 'orchestrator'}&chatId=${chatId}`);
      const data = response.data;
      if (data.messages) {
        setMessages(data.messages);
        setCurrentChatId(chatId);
        setView('active');
        setIsHistoryOpen(false);
      }
    } catch (error) {
      console.error('Error loading chat:', error);
    }
  };

  const handleDeleteChat = async (chatId) => {
    try {
      await axios.delete(`/api/agent/deletehistory?agent=${agentId || 'orchestrator'}&chatId=${chatId}`);

      if (currentChatId === chatId) {
        handleNewChat();
      }
      // We don't need to explicitly trigger a refresh if ChatHistory handles its own fetching
      // but we can call a function to tell it to refresh if we pass one.
      // For now, we'll let the user close and reopen or the component re-mount.
      // Actually, a better UX is to trigger a refresh in the ChatHistory component.
      setIsHistoryOpen(false);
    } catch (error) {
      console.error('Error deleting chat:', error);
      alert('Failed to delete chat history. Please try again.');
    }
  };

  const handleClearHistory = async () => {
    // Similar to delete, would call a DELETE endpoint to clear agent folder
    handleNewChat();
    setIsHistoryOpen(false);
  };

  const handleStartChat = async (text) => {
    setView('active');
    await handleSend(text);
  };

  const handleSend = async (text) => {
    setView('active');

    // If this is a new chat, generate a unique ID immediately to prevent duplicate files
    let activeChatId = currentChatId;
    if (!activeChatId) {
      activeChatId = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      setCurrentChatId(activeChatId);
    }

    const userMsg = { role: 'user', content: text };
    const newMsgs = [...messages, userMsg];
    setMessages(newMsgs);

    // Sync user message immediately to history using the guaranteed ID
    await saveChatToHistory(newMsgs, activeChatId);

    setIsTyping(true);

    try {
      const response = await axios.post('/api/agent/chat', {
        agent: agentId || 'orchestrator',
        model: 'gemma4:31b-cloud',
        messages: newMsgs
      });

      const data = response.data;

      const updatedMsgs = [...newMsgs, { role: 'assistant', content: data.content }];
      setMessages(updatedMsgs);

      // Sync agent response to history using the guaranteed ID
      await saveChatToHistory(updatedMsgs, activeChatId);
    } catch (err) {
      const errorMsgs = [...newMsgs, {
        role: 'assistant',
        content: `I'm having trouble connecting to the ${agentName || 'orchestrator'} agent. Please try again.`
      }];
      setMessages(errorMsgs);
      await saveChatToHistory(errorMsgs, activeChatId);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col h-full w-full bg-layer2 border border-border-subtle rounded-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-300 relative">
      <ChatHeader onClose={onClose} onOpenMenu={() => setIsMenuOpen(!isMenuOpen)} agentName={agentName} />

      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto custom-scrollbar relative"
      >
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
        agentId={agentId}
      />
    </div>
  );
}

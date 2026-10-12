// ChatWindow — Main orchestrator for the AI Chat interface.
// Refined for precise alignment with reference photos.

import { useState, useEffect } from "react";
import ChatHeader from "./ChatHeader";
import ChatMenu from "./ChatMenu";
import ChatHistory from "./ChatHistory";
import ChatNewState from "./ChatNewState";
import ChatActiveState from "./ChatActiveState";
import ChatInput from "./ChatInput";

export default function ChatWindow({ onClose }) {
  const [view, setView] = useState("new"); // 'new' | 'active'
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [currentChatId, setCurrentChatId] = useState(null);
  const [history, setHistory] = useState({});

  // Load chat history from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("motion_y_chat_history");
    if (saved) {
      const history = JSON.parse(saved);
      setHistory(history);

      // Resume most recent chat if it's newer than 10 minutes
      const chatIds = Object.keys(history);
      if (chatIds.length > 0) {
        const mostRecentId = chatIds.sort((a, b) =>
          new Date(history[b].timestamp) - new Date(history[a].timestamp)
        )[0];

        const lastChat = history[mostRecentId];
        const lastTimestamp = new Date(lastChat.timestamp).getTime();
        const now = Date.now();
        const tenMinutesInMs = 60 * 60 * 1000;

        if (now - lastTimestamp < tenMinutesInMs) {
          setMessages(lastChat.messages);
          setCurrentChatId(mostRecentId);
          setView("active");
        } else {
          handleNewChat();
        }
      }
    }
  }, []);

  const saveChatToHistory = (msgs) => {
    const currentHistory = JSON.parse(localStorage.getItem("motion_y_chat_history") || "{}");

    // Create a title from the first user message
    const firstUserMsg = msgs.find(m => m.role === "user")?.content || "New Conversation";
    const title = firstUserMsg.substring(0, 30) + (firstUserMsg.length > 30 ? "..." : "");

    const chatId = currentChatId || Date.now().toString();

    currentHistory[chatId] = {
      title,
      messages: msgs,
      timestamp: new Date().toISOString(),
    };

    localStorage.setItem("motion_y_chat_history", JSON.stringify(currentHistory));
    setHistory(currentHistory);
    setCurrentChatId(chatId);
  };

  const handleNewChat = () => {
    setMessages([]);
    setCurrentChatId(null);
    setView("new");
  };

  const handleDeleteChat = (chatId) => {
    const currentHistory = JSON.parse(localStorage.getItem("motion_y_chat_history") || "{}");
    delete currentHistory[chatId];
    localStorage.setItem("motion_y_chat_history", JSON.stringify(currentHistory));
    setHistory(currentHistory);

    if (currentChatId === chatId) {
      handleNewChat();
    }
  };

  const handleLoadChat = (chatId) => {
    const currentHistory = history;
    const chat = currentHistory[chatId];
    if (chat) {
      setMessages(chat.messages);
      setCurrentChatId(chatId);
      setView("active");
      setIsHistoryOpen(false);
    }
  };

  const handleStartChat = async (text) => {
    setView("active");
    await handleSend(text);
  };

  const handleSend = async (text, explicitMsg = null) => {
    if (view === "new") {
      setView("active");
    }

    const userMsg = explicitMsg || { role: "user", content: text };
    const newMsgs = [...messages, userMsg];
    setMessages(newMsgs);
    setIsTyping(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMsgs }),
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const data = await response.json();
      const fullContent = data.content;

      setMessages(prev => [...prev, { role: "assistant", content: "" }]);
      setIsTyping(false);

      const words = fullContent.split(" ");
      let currentText = "";

      // Detect if content contains a form (typically indicated by specific markers or structured data)
      const containsForm = fullContent.includes("[FORM]") || fullContent.includes("[FORM_START]") || fullContent.includes("<form>");

      if (containsForm) {
        setMessages(prev => [...prev, { role: "assistant", content: fullContent }]);
      } else {
        for (let i = 0; i < words.length; i++) {
          currentText += (i === 0 ? "" : " ") + words[i];

          if ((i + 1) % 10 === 0 || i === words.length - 1) {
            setMessages(prev => {
              const updated = [...prev];
              updated[updated.length - 1] = {
                ...updated[updated.length - 1],
                content: currentText
              };
              return updated;
            });

            await new Promise(resolve => setTimeout(resolve, 40));
          }
        }
      }

      // LEAD SUBMISSION TRIGGER
      if (fullContent.includes("[SUBMIT_LEAD]")) {
        // Find the most recent lead data from messages
        const lastLead = [...newMsgs].reverse().find(m => m.leadData);
        if (lastLead) {
          const success = await submitLeadToApi(lastLead.leadData);
          if (success) {
            setMessages(prev => [...prev, {
              role: "assistant",
              content: "✅ Your information has been successfully sent to the Motion-Y team. We'll be in touch shortly!"
            }]);
          } else {
            setMessages(prev => [...prev, {
              role: "assistant",
              content: "❌ I encountered a problem sending your details. Please try again or contact us directly."
            }]);
          }
        }
      }

      const completedConversation = [...newMsgs, { role: "assistant", content: fullContent }];
      saveChatToHistory(completedConversation);

    } catch (err) {
      console.error("Chat Error:", err);
      setMessages(prev => [...prev, {
        role: "assistant",
        content: "Sorry, I'm having trouble connecting to my brain right now. Please try again later."
      }]);
      setIsTyping(false);
    }
  };

  const submitLeadToApi = async (leadData) => {
    try {
      const payload = {
        name: leadData.name || "Unknown",
        email: leadData.email || "Unknown",
        type: leadData.type || "other",
        message: `AI CHAT LEAD CAPTURE\n\n` +
                `The following lead was qualified and confirmed via the website AI agent:\n\n` +
                Object.entries(leadData)
          .filter(([key]) => !['name', 'email', 'type'].includes(key))
          .map(([key, val]) => `${key.replace(/_/g, " ").toUpperCase()}: ${val}`)
          .join('\n') +
                `\n\n---\nSent via Motion-Y AI Agent`
      };

      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      return response.ok;
    } catch (err) {
      console.error("Lead Submission Error:", err);
      return false;
    }
  };

  const handleFormSubmit = async (values) => {
    // Store the lead data in the messages state temporarily so the AI can review it
    const formattedData = Object.entries(values)
      .map(([key, value]) => `- ${key.replace(/_/g, " ").toUpperCase()}: ${value}`)
      .join("\\n");

    const userMsgText = `I have filled out the lead form. Here are the details:\\n\\n${formattedData}`;

    // Store the raw values as a metadata property on the message for easier retrieval later
    const userMsg = { role: "user", content: userMsgText, leadData: values };
    setMessages(prev => [...prev, userMsg]);

    // Trigger the AI response to review the data
    await handleSend(userMsgText, userMsg);
  };

  return (
    <div className="fixed bottom-24 right-6 z-50 w-[380px] h-[580px] max-w-[calc(100vw-48px)] max-h-[calc(100vh-120px)] flex flex-col rounded-[32px] border border-[var(--border-subtle)] bg-[var(--bg-surface)] shadow-2xl overflow-hidden animate-in slide-in-from-bottom-8 fade-in duration-300">

      <ChatHeader
        onClose={onClose}
        onOpenMenu={() => setIsMenuOpen(!isMenuOpen)}
      />

      <div className="flex-1 overflow-hidden relative min-h-0 bg-[var(--bg-base)]">
        {view === "new" ? (
          <ChatNewState onStartChat={handleStartChat} />
        ) : (
          <ChatActiveState
            messages={messages}
            isTyping={isTyping}
            onSubmitForm={handleFormSubmit}
          />
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
        onClearHistory={() => {
          localStorage.removeItem("motion_y_chat_history");
          setHistory({});
          setIsHistoryOpen(false);
        }}
      />
    </div>
  );
}

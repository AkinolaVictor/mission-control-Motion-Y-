import React, { useState, useEffect } from 'react';
import { X, Trash2 } from 'lucide-react';
import axios from 'axios';
import cn from "../../utils/cn";

export default function ChatHistory({ isOpen, onClose, onLoadChat, onClearHistory, onDeleteChat, agentId }) {
  const [entries, setEntries] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function fetchHistory() {
      if (!isOpen || !agentId) return;

      setIsLoading(true);
      try {
        const response = await axios.get(`/api/agent/gethistory?agent=${agentId}`);
        const data = response.data;

        if (data.chats && Array.isArray(data.chats)) {
          // Sort by timestamp descending
          const sorted = [...data.chats].sort((a, b) => {
            const timeA = a.timestamp ? new Date(a.timestamp).getTime() : 0;
            const timeB = b.timestamp ? new Date(b.timestamp).getTime() : 0;
            return timeB - timeA;
          });
          setEntries(sorted);
        }
      } catch (error) {
        console.error('Error fetching agent history:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchHistory();
  }, [isOpen, agentId]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] flex justify-end animate-in fade-in duration-300">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm pointer-events-auto"
        onClick={onClose}
      />

      {/* Panel */}
      <div
        className="relative w-full max-w-[380px] h-full bg-layer2 border-l border-border-subtle shadow-2xl pointer-events-auto flex flex-col animate-in slide-in-from-right duration-300"
      >
        <div className="p-6 border-b border-border-subtle flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">Chat History</h2>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-layer3 text-text-secondary hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-3 chat-scrollbar">
          {isLoading ? (
            <div className="flex justify-center items-center h-full text-sm text-text-secondary opacity-50">
              Loading history...
            </div>
          ) : entries.length > 0 ? (
            entries.map((chat) => (
              <div
                key={chat.chatId}
                className="group flex items-center justify-between p-4 rounded-xl bg-layer3 border border-border-subtle transition-all duration-200 hover:border-accent"
              >
                <button
                  onClick={() => onLoadChat(chat.chatId)}
                  className="flex-1 text-left truncate mr-2"
                >
                  <div className="text-sm text-white truncate font-medium">
                    {chat.chatId.split('_')[0]}
                  </div>
                  <div className="text-[11px] text-text-secondary opacity-60">
                    {chat.timestamp ? new Date(chat.timestamp).toLocaleString() : 'Unknown date'}
                  </div>
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteChat(chat.chatId);
                  }}
                  className="p-2 rounded-lg text-text-secondary hover:text-red-400 hover:bg-red-400/10 transition-all duration-200 opacity-0 group-hover:opacity-100"
                  title="Delete conversation"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))
          ) : (
            <div className="text-center text-sm text-text-secondary py-10 opacity-50">
              No previous chats found.
            </div>
          )}
        </div>

        <div className="p-6 border-t border-border-subtle">
          <button
            onClick={onClearHistory}
            className="w-full py-3 px-4 rounded-xl bg-layer3 border border-border-subtle text-xs uppercase tracking-wider text-text-secondary hover:text-white hover:border-accent transition-all duration-200"
          >
            Clear All Sessions
          </button>
        </div>
      </div>
    </div>
  );
}

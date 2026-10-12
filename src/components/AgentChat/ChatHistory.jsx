import React from 'react';
import { X, Trash2 } from 'lucide-react';
import cn from "../../utils/cn";

export default function ChatHistory({ isOpen, onClose, onLoadChat, onClearHistory, onDeleteChat }) {
  if (!isOpen) return null;

  const history = JSON.parse(localStorage.getItem("motion_y_chat_history") || "{}");
  const entries = Object.entries(history).sort((a, b) =>
    new Date(b[1].timestamp) - new Date(a[1].timestamp)
  );

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
          {entries.map(([id, chat]) => (
            <div
              key={id}
              className="group flex items-center justify-between p-4 rounded-xl bg-layer3 border border-border-subtle transition-all duration-200 hover:border-accent"
            >
              <button
                onClick={() => onLoadChat(id)}
                className="flex-1 text-left truncate mr-2"
              >
                <div className="text-sm text-white truncate font-medium">
                  {chat.title}
                </div>
                <div className="text-[11px] text-text-secondary opacity-60">
                  {new Date(chat.timestamp).toLocaleString()}
                </div>
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteChat(id);
                }}
                className="p-2 rounded-lg text-text-secondary hover:text-red-400 hover:bg-red-400/10 transition-all duration-200 opacity-0 group-hover:opacity-100"
                title="Delete conversation"
              >
                <Trash2 size={14} />
              </button>
            </div>
          )).reverse()}
          {entries.length === 0 && (
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

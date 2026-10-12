// ChatHistory — A sliding side-panel for browsing past conversations.
// Refined to match the exact visual layout of chat_history.jpg.

import { useEffect, useRef } from "react";
import { X, ChevronRight, Trash2 } from "lucide-react";
import gsap from "gsap";
import cn from "../../utils/cn";

export default function ChatHistory({ isOpen, onClose, onLoadChat, onClearHistory, onDeleteChat }) {
  const panelRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      gsap.to(panelRef.current, {
        x: 0,
        duration: 0.4,
        ease: "power3.out",
      });
    } else {
      gsap.to(panelRef.current, {
        x: "100%",
        duration: 0.3,
        ease: "power3.in",
      });
    }
  }, [isOpen]);

  return (
    <div className={`fixed inset-0 z-[70] pointer-events-none overflow-hidden ${isOpen ? "opacity-100" : "opacity-0"}`}>
      {/* Backdrop */}
      <div
        className={cn(
          "absolute inset-0 bg-black/20 backdrop-blur-[2px] transition-opacity duration-300 pointer-events-auto",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
      />

      {/* Panel - Positioned to align with the ChatWindow on the right */}
      <div
        ref={panelRef}
        className="absolute bottom-24 right-6 w-[380px] h-[580px] max-w-[calc(100vw-48px)] max-h-[calc(100vh-120px)] bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-[32px] shadow-2xl pointer-events-auto flex flex-col translate-x-full"
      >
        <div className="p-6 border-b border-[var(--border-subtle)] flex items-center justify-between">
          <h2 className="overpass text-[16px] font-medium text-[var(--text-primary)]">Chat History</h2>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-[var(--bg-elevated)] text-[var(--text-muted)] transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-3">
          {/* History Items - Dynamically rendered from localStorage */}
          {Object.entries(JSON.parse(localStorage.getItem("motion_y_chat_history") || "{}")).map(([id, chat]) => (
            <div
              key={id}
              className="group flex items-center justify-between p-4 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] transition-all duration-200 hover:border-[var(--accent)]"
            >
              <button
                onClick={() => onLoadChat(id)}
                className="flex-1 text-left truncate mr-2"
              >
                <div className="text-[14px] text-[var(--text-primary)] truncate font-medium">
                  {chat.title}
                </div>
                <div className="text-[11px] mono text-[var(--text-muted)] opacity-60">
                  {new Date(chat.timestamp).toLocaleString([], {
                    date: 'short',
                    time: 'short'
                  })}
                </div>
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteChat(id);
                }}
                className="p-2 rounded-lg text-[var(--text-muted)] hover:text-red-400 hover:bg-red-400/10 transition-all duration-200 opacity-0 group-hover:opacity-100"
                title="Delete conversation"
              >
                <Trash2 size={14} />
              </button>
            </div>
          )).reverse()}
          {Object.keys(JSON.parse(localStorage.getItem("motion_y_chat_history") || "{}")).length === 0 && (
            <div className="text-center text-[13px] text-[var(--text-muted)] py-10 opacity-50">
              No previous chats found.
            </div>
          )}
        </div>

        <div className="p-6 border-t border-[var(--border-subtle)]">
          <button
            onClick={onClearHistory}
            className="w-full py-3 px-4 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-[12px] mono uppercase tracking-wider text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:border-[var(--accent)] transition-all duration-200"
          >
            Clear All Sessions
          </button>
        </div>
      </div>
    </div>
  );
}

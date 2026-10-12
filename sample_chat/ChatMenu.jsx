// ChatMenu — Minimal dropdown menu for chat actions.
// Refined to match the exact visual style of chat_menu.jpg and support global theme.

import { RotateCcw, History } from "lucide-react";
import cn from "../../utils/cn";

export default function ChatMenu({ isOpen, onClose, onNewChat, onViewHistory }) {
  if (!isOpen) return null;

  return (
    <div
      className={cn(
        "absolute top-14 right-4 z-[60] w-44 rounded-xl border border-[var(--border-subtle)]",
        "bg-[var(--bg-surface)] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200",
        "text-[var(--text-primary)]"
      )}
    >
      <div className="flex flex-col p-1.5">
        <button
          onClick={() => { onNewChat(); onClose(); }}
          className="flex items-center gap-3 px-3 py-2 text-left text-[13px] hover:bg-[var(--bg-elevated)] rounded-lg transition-colors duration-200"
        >
          <RotateCcw size={14} className="text-[var(--text-muted)]" />
          <span>New Chat</span>
        </button>

        <button
          onClick={() => { onViewHistory(); onClose(); }}
          className="flex items-center gap-3 px-3 py-2 text-left text-[13px] hover:bg-[var(--bg-elevated)] rounded-lg transition-colors duration-200"
        >
          <History size={14} className="text-[var(--text-muted)]" />
          <span>Chat History</span>
        </button>
      </div>
    </div>
  );
}

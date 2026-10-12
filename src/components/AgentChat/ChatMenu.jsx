import React from 'react';
import { RotateCcw, History } from 'lucide-react';
import cn from "../../utils/cn";

export default function ChatMenu({ isOpen, onClose, onNewChat, onViewHistory }) {
  if (!isOpen) return null;

  return (
    <div
      className={cn(
        "absolute top-16 right-4 z-[60] w-48 rounded-xl border border-border-subtle",
        "bg-layer2 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200",
        "text-white"
      )}
    >
      <div className="flex flex-col p-1.5">
        <button
          onClick={() => { onNewChat(); onClose(); }}
          className="flex items-center gap-3 px-3 py-2 text-left text-sm hover:bg-layer3 rounded-lg transition-colors duration-200"
        >
          <RotateCcw size={14} className="text-text-secondary" />
          <span>New Chat</span>
        </button>

        <button
          onClick={() => { onViewHistory(); onClose(); }}
          className="flex items-center gap-3 px-3 py-2 text-left text-sm hover:bg-layer3 rounded-lg transition-colors duration-200"
        >
          <History size={14} className="text-text-secondary" />
          <span>Chat History</span>
        </button>
      </div>
    </div>
  );
}

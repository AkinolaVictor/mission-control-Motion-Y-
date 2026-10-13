import React from 'react';
import { X, MoreVertical } from 'lucide-react';

export default function ChatHeader({ onClose, onOpenMenu, agentName }) {
  return (
    <div className="flex items-center justify-between p-4 border-b border-border-subtle bg-layer2">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-layer3 flex items-center justify-center overflow-hidden border border-border-subtle">
          <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-hat-glasses preview-icon"><path d="M14 18a2 2 0 0 0-4 0"/><path d="m19 11-2.11-6.657a2 2 0,0 0-2.752-1.148l-1.276.61A2 2 0 0 1 12 4H8.5a2 2 0 0 0-1.925 1.456L5 11"/><path d="M2 11h20"/><circle cx="17" cy="18" r="3"/><circle cx="7" cy="18" r="3"/></svg>
        </div>
        <div>
          <h2 className="text-sm font-semibold text-white leading-tight">{agentName || "AI Agent"}</h2>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            <span className="text-[10px] text-text-secondary">Online</span>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={onOpenMenu}
          className="p-2 rounded-full hover:bg-layer3 text-text-secondary hover:text-white transition-colors"
        >
          <MoreVertical size={18} />
        </button>
      </div>
    </div>
  );
}

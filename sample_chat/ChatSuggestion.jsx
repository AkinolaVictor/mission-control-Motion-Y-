// ChatSuggestion — A friendly introductory bubble that guides the user to the AI chat.
// Appears by default and disappears when the chat is opened or the suggestion is closed.

import { X } from "lucide-react";
import cn from "../../utils/cn";

export default function ChatSuggestion({ isVisible, onClose }) {
  if (!isVisible) return null;

  return (
    <div
      className={cn(
        "fixed bottom-24 right-6 z-40",
        "max-w-[280px] animate-in fade-in slide-in-from-bottom-4 duration-500",
        "flex flex-col items-end gap-3"
      )}
    >
      {/* Close Button */}
      <button
        onClick={onClose}
        className="mono flex h-6 w-6 items-center justify-center rounded-full bg-[var(--bg-surface)] text-[var(--text-muted)] border border-[var(--border-subtle)] hover:text-[var(--text-primary)] hover:border-[var(--text-muted)] transition-colors duration-200"
        aria-label="Close suggestion"
      >
        <X size={12} />
      </button>

      {/* Suggestion Bubble */}
      <div
        className={cn(
          "relative rounded-2xl p-4 shadow-2xl border border-[var(--border-subtle)]",
          "bg-[var(--bg-surface)] text-[var(--text-primary)]",
          "text-[14px] leading-relaxed"
        )}
      >
        <p>
          Hello, I'm your <span className="text-[var(--accent)] font-medium">Motion-Y Assistant</span>.
          How can I help you today?
        </p>

        {/* Small pointer/arrow at the bottom */}
        <div className="absolute -bottom-2 right-6 w-4 h-4 bg-[var(--bg-surface)] border-r border-b border-[var(--border-subtle)] rotate-45" />
      </div>
    </div>
  );
}

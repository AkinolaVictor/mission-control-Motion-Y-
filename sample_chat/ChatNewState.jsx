// ChatNewState — The initial view of the chat when no conversation has started.
// Displays suggestive prompts as seen in core_chat.jpg.

import cn from "../../utils/cn";

export default function ChatNewState({ onStartChat }) {
  const prompts = [
    "Tell me more about Motion-Y",
    "How can Motion-Y help my business?",
    "What's the pricing for your automation service"
  ];

  return (
    <div className="flex-1 flex flex-col justify-end p-6 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col items-start gap-3 w-full max-w-[320px] ml-auto">
        {prompts.map((text, i) => (
          <button
            key={i}
            onClick={() => onStartChat(text)}
            className={cn(
              "text-left px-4 py-3 rounded-2xl rounded-br-none",
              "bg-[var(--bg-elevated)] border border-[var(--border-subtle)]",
              "text-[13px] text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:border-[var(--accent)]",
              "transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]",
              "shadow-sm"
            )}
          >
            {text}
          </button>
        ))}
      </div>
    </div>
  );
}

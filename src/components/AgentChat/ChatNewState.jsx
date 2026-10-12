import React from 'react';
import cn from "../../utils/cn";

export default function ChatNewState({ onStartChat }) {
  const prompts = [
    "Tell me more about Motion-Y",
    "How can Motion-Y help my business?",
    "What's the pricing for your automation service"
  ];

  return (
    <div className="flex-1 flex flex-col justify-center items-center p-6 text-center space-y-8 animate-in fade-in duration-700">
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-white">Welcome to the Agent Portal</h3>
        <p className="text-sm text-text-secondary max-w-[280px]">
          Select a prompt below or type your own question to get started.
        </p>
      </div>

      <div className="flex flex-col gap-3 w-full max-w-[300px]">
        {prompts.map((text, i) => (
          <button
            key={i}
            onClick={() => onStartChat(text)}
            className="text-left px-4 py-3 rounded-2xl bg-layer3 border border-border-subtle text-sm text-text-secondary hover:text-white hover:border-accent transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-sm"
          >
            {text}
          </button>
        ))}
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { Send } from 'lucide-react';

export default function ChatInput({ onSend, isTyping }) {
  const [input, setInput] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;
    onSend(input);
    setInput('');
  };

  return (
    <form onSubmit={handleSubmit} className="px-4 py-1.5 border-t border-border-subtle bg-layer2">
      <div className="relative flex items-center gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask your agent..."
          className="w-full bg-layer3 rounded-full py-3 px-4 text-sm text-white placeholder:text-text-secondary focus:outline-none focus:border-accent transition-all"
          disabled={isTyping}
        />
        <button
          type="submit"
          disabled={!input.trim() || isTyping}
          className="p-3 rounded-full bg-white text-black hover:bg-accent transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Send size={18} />
        </button>
      </div>
    </form>
  );
}

import React, { useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { User } from 'lucide-react';
import cn from "../../utils/cn";

export default function ChatActiveState({ messages, isTyping }) {
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-6 chat-scrollbar" ref={scrollRef}>
      {messages.map((msg, i) => (
        <div
          key={i}
          className={cn(
            "flex flex-col max-w-[85%] animate-in slide-in-from-bottom-2 fade-in duration-300",
            msg.role === 'user' ? "ml-auto items-end" : "mr-auto items-start"
          )}
        >
          <div className={cn(
            "p-3 rounded-2xl border shadow-sm",
            msg.role === 'user'
              ? "bg-layer3 border-border-subtle text-white rounded-tr-none"
              : "bg-layer2 border-border-subtle text-white rounded-tl-none"
          )}>
            <div className="flex items-center gap-2 mb-2 opacity-50">
              {msg.role === 'assistant' ? (
                <div className="flex items-center gap-1.5">
                  <div className="w-4 h-4 rounded-full bg-black flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-hat-glasses preview-icon"><path d="M14 18a2 2 0 0 0-4 0"/><path d="m19 11-2.11-6.657a2 2 0 0 0-2.752-1.148l-1.276.61A2 2 0 0 1 12 4H8.5a2 2 0 0 0-1.925 1.456L5 11"/><path d="M2 11h20"/><circle cx="17" cy="18" r="3"/><circle cx="7" cy="18" r="3"/></svg>
                  </div>
                  <span className="text-[10px] font-medium uppercase tracking-wider">AI Agent</span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5">
                  <div className="w-4 h-4 rounded-full bg-black flex items-center justify-center">
                    <User size={8} />
                  </div>
                  <span className="text-[10px] font-medium uppercase tracking-wider">User</span>
                </div>
              )}
            </div>
            <div className="text-sm leading-relaxed prose prose-invert max-w-none">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.content}</ReactMarkdown>
            </div>
          </div>
        </div>
      ))}

      {isTyping && (
        <div className="flex flex-col mr-auto items-start animate-in fade-in">
          <div className="flex items-center gap-2 mb-2 px-1 opacity-50">
            <div className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-hat-glasses preview-icon"><path d="M14 18a2 2 0 0 0-4 0"/><path d="m19 11-2.11-6.657a2 2 0 0 0-2.752-1.148l-1.276.61A2 2 0 0 1 12 4H8.5a2 2 0 0 0-1.925 1.456L5 11"/><path d="M2 11h20"/><circle cx="17" cy="18" r="3"/><circle cx="7" cy="18" r="3"/></svg>
            </div>
            <span className="text-[10px] font-medium uppercase tracking-wider">AI Agent</span>
          </div>
          <div className="bg-layer2 border border-border-subtle p-3 rounded-2xl rounded-tl-none flex gap-1">
            <span className="w-1.5 h-1.5 bg-text-secondary rounded-full animate-typing" style={{ animationDelay: '0s' }} />
            <span className="w-1.5 h-1.5 bg-text-secondary rounded-full animate-typing" style={{ animationDelay: '0.2s' }} />
            <span className="w-1.5 h-1.5 bg-text-secondary rounded-full animate-typing" style={{ animationDelay: '0.4s' }} />
          </div>
        </div>
      )}
    </div>
  );
}

// ChatActiveState — The conversation loop interface.
// Refined for precise alignment with reference active_chat.jpg and optimized for scrolling.

import { useEffect, useRef } from "react";
import { User } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import cn from "../../utils/cn";
import useThemeToggle from "../../hooks/useThemeToggle";
import DynamicLeadForm from "./DynamicLeadForm";

export default function ChatActiveState({ messages, isTyping, onSubmitForm }) {
  const { theme } = useThemeToggle();
  const scrollRef = useRef(null);

  const logoSrc = theme === "dark" ? "/logo_light.png" : "/logo_dark.png";

  const renderMessageContent = (content) => {
    const formRegex = /\[FORM_START\]([\s\S]*?)\[FORM_END\]/;
    const match = content.match(formRegex);

    if (match) {
      const preText = content.split("[FORM_START]")[0];
      const postText = content.split("[FORM_END]")[1];
      let formConfig = null;

      try {
        formConfig = JSON.parse(match[1].trim());
      } catch (e) {
        console.error("Failed to parse AI form JSON:", e);
      }

      return (
        <div className="flex flex-col gap-4">
          {preText && (
            <div className="text-[13px] leading-relaxed opacity-90 prose prose-invert max-w-none">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{preText}</ReactMarkdown>
            </div>
          )}
          {formConfig && (
            <DynamicLeadForm
              config={formConfig}
              onSubmit={onSubmitForm}
            />
          )}
          {postText && (
            <div className="text-[13px] leading-relaxed opacity-90 prose prose-invert max-w-none">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{postText}</ReactMarkdown>
            </div>
          )}
        </div>
      );
    }

    return (
      <div className="text-[13px] leading-relaxed opacity-90 prose prose-invert max-w-none prose-p:leading-relaxed prose-li:my-1 prose-strong:text-[var(--text-primary)] prose-headings:text-[var(--text-primary)] prose-headings:font-medium">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {content}
        </ReactMarkdown>
      </div>
    );
  };

  // Auto-scroll to bottom only when the number of messages changes
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages.length]);

  return (
    <div className="h-full flex flex-col overflow-hidden bg-[var(--bg-base)]">
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-3 space-y-8 custom-scrollbar"
      >
        {messages.map((msg, i) => (
          <div
            key={i}
            className={cn(
              "flex flex-col max-w-[85%] transition-all duration-300 animate-in slide-in-from-bottom-2 fade-in",
              msg.role === "user" ? "ml-auto items-end" : "mr-auto items-start"
            )}
          >
            {/* Message Bubble */}
            <div
              className={cn(
                "p-3 rounded-[24px] shadow-sm border",
                "bg-[var(--bg-elevated)] border-[var(--border-subtle)] text-[var(--text-primary)]",
                msg.role === "user" ? "rounded-tr-none" : "rounded-tl-none"
              )}
            >
              {/* Header - Inside the bubble */}
              <div className={cn(
                "flex items-center gap-2 mb-2",
                msg.role === "user" ? "justify-start" : "justify-start"
              )}>
                {msg.role === "assistant" ? (
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-[var(--bg-surface)] border border-[var(--border-subtle)] flex items-center justify-center">
                      <img src={logoSrc} alt="AI" className="w-3 h-3 object-contain" />
                    </div>
                    <span className="mono text-[11px] font-medium text-[var(--text-muted)]">Motion-Y AI</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-[var(--bg-surface)] border border-[var(--border-subtle)] flex items-center justify-center">
                      <User size={10} className="text-[var(--text-primary)]" />
                    </div>
                    <span className="mono text-[11px] font-medium text-[var(--text-muted)]">User</span>
                  </div>
                )}
              </div>
              {renderMessageContent(msg.content)}
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex flex-col mr-auto items-start animate-in fade-in duration-300">
            <div className="flex items-center gap-2 mb-2 px-1">
              <div className="w-5 h-5 rounded-full bg-[var(--bg-elevated)] border border-[var(--border-subtle)] flex items-center justify-center">
                <img src={logoSrc} alt="AI" className="w-3 h-3 object-contain" />
              </div>
              <span className="mono text-[11px] font-medium text-[var(--text-muted)] opacity-70">Motion-Y AI</span>
            </div>
            <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] p-4 rounded-2xl rounded-tl-none flex gap-1.5">
              <span className="w-1 h-1 bg-[var(--text-muted)] rounded-full animate-bounce [animation-delay:-0.3s]" />
              <span className="w-1 h-1 bg-[var(--text-muted)] rounded-full animate-bounce [animation-delay:-0.15s]" />
              <span className="w-1 h-1 bg-[var(--text-muted)] rounded-full animate-bounce" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

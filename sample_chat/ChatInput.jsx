// ChatInput — The input area for the chat interface.
// Implements a purely Native Web Speech approach with real-time appending.

import {  Mic, Send } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { startNativeRecognition, isSTTSupported } from "../../utils/stt";
import cn from "../../utils/cn";

export default function ChatInput({ onSend, isTyping }) {
  const [message, setMessage] = useState("");
  const [interimText, setInterimText] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const recognitionRef = useRef(null);
  const reco = useRef("");

  useEffect(() => {
    setIsSupported(isSTTSupported());
  }, []);


  const handleSubmit = (e) => {
    e.preventDefault();
    if (!message.trim() || isTyping) return;
    onSend(message);
    setMessage("");
  };

  const handleMicClick = async () => {
    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListening(false);
      return;
    }

    setIsListening(true);
    try {
      const recognition = await startNativeRecognition(
        (result) => {
          if (result.final) {
            setMessage(prev => (prev + " " + result.final).trim());
            setInterimText("");
          }
          if (result.interim) {
            setInterimText(result.interim);
          }
        },
        () => {
          setIsListening(false);
        }
      );
      recognitionRef.current = recognition;
    } catch (err) {
      console.error("STT Error:", err);
      setIsListening(false);
    }
  };

  return (
    <div className="px-4 py-2 bg-[var(--bg-surface)]">
      <form
        onSubmit={handleSubmit}
        className="relative flex items-center max-w-full"
      >
        <div
          className={cn(
            "flex-1 flex items-center gap-2 px-4 py-1.5 rounded-full border transition-all duration-300 shadow-sm",
            "bg-[var(--bg-elevated)] border-[var(--border-subtle)]",
            "focus-within:border-[var(--accent)]",
            isListening && "ring-2 ring-[var(--accent)]/30 border-[var(--accent)]"
          )}
        >
          <input
            type="text"
            value={message + (isListening ? " " + interimText : "")}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={isListening ? "Listening..." : "What's on your mind?"}
            style={{border: "none", outline: "none"}}
            className={`flex-1 bg-transparent border-none outline-none text-[13px] text-[var(--text-primary)] placeholder:text-[var(--text-muted)]/50 mono py-1`}
          />

          <div className="flex items-center gap-1">
            {isSupported && (
              <button
                type="button"
                onClick={handleMicClick}
                className={cn(
                  "p-2 rounded-full transition-all duration-300 relative",
                  isListening
                    ? "bg-[var(--accent)] text-[var(--accent-fg)] scale-110"
                    : "hover:bg-[var(--bg-surface)] text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                )}
                aria-label="Voice input"
              >
                <Mic size={16} />
                {isListening && (
                  <span className="absolute inset-0 rounded-full bg-[var(--accent)] animate-ping opacity-25" />
                )}
              </button>
            )}

            <button
              type="submit"
              disabled={!message.trim() || isTyping}
              className={cn(
                "p-2 rounded-full transition-all duration-200",
                message.trim() && !isTyping
                  ? "bg-[var(--accent)] text-[var(--accent-fg)] scale-100"
                  : "bg-transparent text-[var(--text-muted)] scale-90 opacity-50"
              )}
              aria-label="Send message"
            >
              <Send size={16} strokeWidth={2.5} />
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

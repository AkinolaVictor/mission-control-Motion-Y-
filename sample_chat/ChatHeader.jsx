// ChatHeader — Header for the chat window.
// Displays agent identity, real-time connection status, and control buttons.

import { useState, useEffect } from "react";
import { X, MoreHorizontal } from "lucide-react";
import cn from "../../utils/cn";
import useThemeToggle from "../../hooks/useThemeToggle";

export default function ChatHeader({ onClose, onOpenMenu }) {
  const { theme } = useThemeToggle();
  const [isOnline, setIsOnline] = useState(true);

  const logoSrc = theme === "dark" ? "/logo_light.png" : "/logo_dark.png";

  useEffect(() => {
    // Set initial status
    setIsOnline(navigator.onLine);

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return (
    <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border-subtle)] bg-[var(--bg-surface)]">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-[var(--bg-elevated)] border border-[var(--border-subtle)] flex items-center justify-center overflow-hidden">
          <img src={logoSrc} alt="AI" className="w-5 h-5 object-contain" />
        </div>
        <div className="flex flex-col">
          <span className="overpass font-medium text-[14px] text-[var(--text-primary)] leading-none">
            Motion-Y AI
          </span>
          <div className="flex items-center gap-1.5">
            <span className={cn(
              "h-1.5 w-1.5 rounded-full transition-colors duration-300",
              isOnline ? "bg-[var(--accent)] animate-pulse" : "bg-[var(--text-muted)]"
            )} />
            <span className="mono text-[10px] text-[var(--text-muted)] leading-tight">
              {isOnline ? "Online" : "Offline"}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-1">
        <button
          onClick={onOpenMenu}
          className="p-2 rounded-full hover:bg-[var(--bg-elevated)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors duration-200"
          aria-label="Options"
        >
          <MoreHorizontal size={18} />
        </button>
        <button
          onClick={onClose}
          className="p-2 rounded-full hover:bg-[var(--bg-elevated)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors duration-200"
          aria-label="Close chat"
        >
          <X size={18} />
        </button>
      </div>
    </div>
  );
}

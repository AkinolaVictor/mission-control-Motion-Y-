import React from 'react';

const Modal = ({ isOpen, onClose, children, title }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-layer2 border border-border-subtle rounded-3xl w-full max-w-lg max-h-[80vh] overflow-hidden flex flex-col animate-in fade-in zoom-in duration-200">
        {title && (
          <div className="flex items-center justify-between p-4 border-b border-border-subtle">
            <h2 className="text-lg font-semibold text-white tracking-tight">{title}</h2>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-layer3 flex items-center justify-center text-white hover:bg-zinc-700 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 6L6 18"/><path d="M6 6l12 12"/>
              </svg>
            </button>
          </div>
        )}
        <div className="p-4 overflow-y-auto custom-scrollbar">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;

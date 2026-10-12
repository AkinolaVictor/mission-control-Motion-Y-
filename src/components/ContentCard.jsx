import React from 'react';

const ContentCard = () => {
  return (
    <div className="bg-surface rounded-[32px] p-4 flex flex-col justify-between h-full w-full border border-border-subtle overflow-hidden">
      <div className="flex flex-col h-full">
        {/* Header Section */}
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-full bg-zinc-900 flex items-center justify-center text-lg">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-square-text preview-icon"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M7 8h8"/><path d="M7 12h10"/><path d="M7 16h6"/></svg>
          </div>
          <h2 className=" font-semibold text-white tracking-tight">Content</h2>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-2 gap-4 flex-grow">
          {/* Left side: Stats List */}
          <div className="bg-layer rounded-2xl px-4 py-2 h-auto flex flex-col justify-evenly">
            {[
              { label: "Content Created Today", val: "8" },
              { label: "Audience Engagements", val: "8" },
              { label: "Contents Views", val: "8" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-zinc-800 text-white text-[10px] flex items-center justify-center font-bold border border-white/10 shrink-0">
                  {item.val}
                </div>
                <span className="text-xs text-white font-medium truncate">{item.label}</span>
              </div>
            ))}
          </div>

          {/* Right side: Update Statuses */}
          <div className="space-y-3">
            {/* Last Updated */}
            <div className="px-3 py-1.5 rounded-2xl bg-layer border border-border-subtle flex flex-col h-[45%]">
              <p className="text-xs font-semibold text-white mb-1">Last Updated</p>
              <p className="text-[11px] text-text-secondary mb-2 line-clamp-1 truncate">
                12pm Mon, 11 Oct 2026
              </p>
              <p className="text-[10px] font-bold text-sharp text-center mt-auto">
                Clara
              </p>
            </div>

            {/* Next Update */}
            <div className="px-3 py-1.5 rounded-2xl bg-layer border border-border-subtle flex flex-col h-[45%]">
              <p className="text-xs font-semibold text-white mb-1">Next Update</p>
              <p className="text-[11px] text-text-secondary mb-2 line-clamp-1 truncate">
                1pm Mon, 11 Oct 2026
              </p>
              <p className="text-[10px] font-bold text-sharp text-center mt-auto">
                Soria
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Explore Button */}
      <button className="w-full py-3 rounded-2xl bg-layer text-sm font-medium text-white hover:bg-zinc-800 transition-colors mt-4 border border-border-subtle">
        Explore
      </button>
    </div>
  );
};

export default ContentCard;
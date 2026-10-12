import React from 'react';

const TasksCard = () => {
  return (
    <div className="bg-surface rounded-[32px] p-4 flex flex-col justify-between h-full w-full border border-border-subtle overflow-hidden">
      <div className="flex flex-col h-full">
        {/* Header Section */}
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-full bg-zinc-900 flex items-center justify-center text-lg">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-list-todo preview-icon"><path d="M13 5h8"/><path d="M13 12h8"/><path d="M13 19h8"/><path d="m3 17 2 2 4-4"/><rect x="3" y="4" width="6" height="6" rx="1"/></svg>
          </div>
          <h2 className="font-semibold text-white tracking-tight">Tasks</h2>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-2 gap-4 flex-grow">
          {/* Left side: Stats List */}
          <div className="bg-layer rounded-2xl p-4 h-auto flex flex-col justify-evenly ">
            {[
              { label: "Completed Tasks", val: "8" },
              { label: "Ongoing Tasks", val: "8" },
              { label: "Scheduled tasks", val: "8" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-zinc-800 text-white text-[10px] flex items-center justify-center font-bold border border-white/10 shrink-0">
                  {item.val}
                </div>
                <span className="text-xs text-white font-medium truncate">{item.label}</span>
              </div>
            ))}
          </div>

          {/* Right side: Task Statuses */}
          <div className="space-y-3">
            {/* Current Task */}
            <div className="px-3 py-1.5 rounded-2xl bg-layer border border-border-subtle flex flex-col h-[45%]">
              <p className="text-xs font-semibold text-white mb-1">Current Task</p>
              <p className="text-[11px] text-text-secondary mb-2 line-clamp-2 leading-tight">
                Creating next post...
              </p>
              <p className="text-[10px] font-bold text-sharp text-center mt-auto">
                Fushia
              </p>
            </div>

            {/* Upcoming Task */}
            <div className="px-3 py-1.5 rounded-2xl bg-layer border border-border-subtle flex flex-col h-[45%]">
              <p className="text-xs font-semibold text-white mb-1">Upcoming Task</p>
              <p className="text-[11px] text-text-secondary mb-2 line-clamp-2 leading-tight">
                Watching dev.to contents
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

export default TasksCard;
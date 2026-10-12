import React from 'react';

function AgentBoardCard(props) {
    return (
    <div className="bg-surface rounded-[32px] p-4 flex flex-col justify-between h-full w-full max-w-102 border border-border-subtle overflow-hidden">
      <div className="flex flex-col h-full">
        {/* Header Section */}
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-full bg-zinc-900 flex items-center justify-center text-lg">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-hat-glasses preview-icon"><path d="M14 18a2 2 0 0 0-4 0"/><path d="m19 11-2.11-6.657a2 2 0 0 0-2.752-1.148l-1.276.61A2 2 0 0 1 12 4H8.5a2 2 0 0 0-1.925 1.456L5 11"/><path d="M2 11h20"/><circle cx="17" cy="18" r="3"/><circle cx="7" cy="18" r="3"/></svg>
          </div>
          <h2 className="font-semibold text-white tracking-tight">Orchestrator</h2>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-2 gap-4 flex-grow">
          {/* Left side: Stats List */}
          <div className="bg-layer rounded-2xl p-4 h-auto flex flex-col justify-evenly ">
            {[
              { label: "Completed Tasks", val: "8" },
              { label: "Ongoing Tasks", val: "8" },
              { label: "Scheduled tasks", val: "8" },
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
            {
                [
                    { label: "Recent Operation", val: "Creating post on Local Image Generation. Creating next post. Local Image Generation" },
                    { label: "Upcoming Task", val: "Creating post on Local Image Generation. Creating next post. Local Image Generation" },
                ].map((item, index)=>{
                    return (
                        <div key={index} className="px-3 py-1.5 rounded-[12px] bg-layer border border-border-subtle flex flex-col h-auto">
                            <p className="text-xs font-semibold text-white mb-1">{item.label}</p>
                            <p className="text-[11px] opacity-70 text-text-secondary mb-2 line-clamp-2 leading-tight">
                                {item.val}
                            </p>
                        </div>
                    )
                })
            }
          </div>
        </div>
      </div>

      {/* Explore Button */}
        <div className="px-3 py-1.5 mt-4 rounded-[12px] bg-layer border border-border-subtle flex flex-col h-auto">
            <p className="text-xs font-semibold text-white mb-1">Recent Operation</p>
            <p className="text-[11px] text-text-secondary mb-2 line-clamp-2 leading-tight">
                Creating post on Local Image Generation. Creating next post. Local Image Generation
            </p>
        </div>

        {/* <div className="px-3 py-1.5 mt-4 rounded-[12px] bg-layer border border-border-subtle flex flex-col h-auto">
            <p className="text-xs font-semibold text-white mb-1">Recent Operation</p>
            <p className="text-[11px] text-text-secondary mb-2 line-clamp-2 leading-tight">
                Creating post on Local Image Generation. Creating next post. Local Image Generation
            </p>
        </div> */}
    </div>
    );
}

export default AgentBoardCard;
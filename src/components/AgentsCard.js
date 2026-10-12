import React from 'react';
import { useSelector } from 'react-redux';

const AgentsCard = () => {
  const { metrics, summary } = useSelector((state) => state.agents);

  return (
    <div className="bg-surface rounded-[32px] p-6 flex flex-col justify-between h-full w-full border border-border-subtle overflow-hidden">
      <div className="flex flex-col h-full">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-zinc-900 flex items-center justify-center text-lg">
              <svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-hat-glasses preview-icon"><path d="M14 18a2 2 0 0 0-4 0"/><path d="m19 11-2.11-6.657a2 2 0 0 0-2.752-1.148l-1.276.61A2 2 0 0 1 12 4H8.5a2 2 0 0 0-1.925 1.456L5 11"/><path d="M2 11h20"/><circle cx="17" cy="18" r="3"/><circle cx="7" cy="18" r="3"/></svg>
            </div>
            <h2 className=" font-semibold text-white tracking-tight">Agents</h2>
          </div>
          <span className="text-xs text-text-secondary font-medium">Weekly Overview</span>
        </div>

        {/* Metrics Grid */}
        <div className="bg-layer rounded-2xl px-4 py-4 mb-2">
          <div className="grid grid-cols-4 gap-2">
            {[
              { label: "Health", val: metrics.overallHealth },
              { label: "Works", val: metrics.tasksCompleted },
              { label: "Time (hr)", val: metrics.workTime },
              { label: "Logs", val: metrics.errorLogs },
            ].map((item, i) => (
              <div key={i} className="flex flex-col items-center text-center gap-3">
                <div className="w-14 h-14 rounded-full bg-zinc-800 text-white text-sm flex items-center justify-center font-bold border border-white/10 shadow-inner">
                  {item.val}
                </div>
                <span className="text-[10px] text-white font-medium leading-tight">
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Agent Summary */}
        <div className="flex flex-col gap-2">
          <div className="text-right">
            <span className="text-xs text-text-secondary font-medium">Quick Agent Summary</span>
          </div>
          <div className="bg-layer rounded-2xl p-4 flex items-center justify-around gap-4 border border-border-subtle">
            {[
              { label: "Working Now", val: summary.workingNow },
              { label: "Starts by 9am", val: summary.scheduledToday },
              { label: "Awaiting", val: summary.awaitingApproval },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-2 whitespace-nowrap">
                <div className="w-7 h-7 rounded-full bg-zinc-800 text-white text-[10px] flex items-center justify-center font-bold border border-white/10 shrink-0">
                  {item.val}
                </div>
                <span className="text-[10px] text-white">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentsCard;
import Link from 'next/link';
import React, { useEffect, useState } from 'react';

const TasksCard = () => {
  const [allTasks, setAllTasks] = useState([]);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await fetch('/api/agent/get_all_tasks?category=all');
        const data = await response.json();
        setAllTasks(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error fetching task analytics:', error);
      }
    };
    fetchAnalytics();
  }, []);

  // Analytics Calculations
  const completedCount = allTasks.filter(t => t.status === 'completed').length;
  const ongoingCount = allTasks.filter(t => t.status === 'ongoing').length;
  const scheduledCount = allTasks.filter(t => t.scheduled === true && t.status !== 'completed').length;
  const awaitingCount = allTasks.filter(t => t.await_approval === true).length;

  const stats = [
    { label: "Completed Tasks", val: completedCount },
    { label: "Ongoing Tasks", val: ongoingCount },
    { label: "Scheduled tasks", val: scheduledCount },
    { label: "Awaiting Approval", val: awaitingCount },
  ];

  const ongoingTask = allTasks.find(t => t.status === 'ongoing');
  const shortenedTitle = ongoingTask?.title
    ? ongoingTask.title.split(' ').slice(0, 9).join(' ') + (ongoingTask.title.split(' ').length > 9 ? '...' : '')
    : "No ongoing tasks";
  const assignedAgent = ongoingTask?.assigned_to || ongoingTask?.agent_id || "N/A";

  const awaitingTask = allTasks.find(t => t.await_approval === true);
  const awaitingShortenedTitle = awaitingTask?.title
    ? awaitingTask.title.split(' ').slice(0, 9).join(' ') + (awaitingTask.title.split(' ').length > 9 ? '...' : '')
    : "No awaiting tasks";
  const awaitingAssignedAgent = awaitingTask?.assigned_to || awaitingTask?.agent_id || "N/A";

  return (
    <div className="bg-surface rounded-[32px] p-4 flex flex-col justify-between h-full w-full border border-border-subtle overflow-hidden">
      <div className="flex flex-col h-full">
        {/* Header Section */}
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-full bg-zinc-900 flex items-center justify-center text-lg">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-list-todo preview-icon"><path d="M13 5h8"/><path d="M13 12h8"/><path d="M13 19h8"/><path d="m3 17 2 2 4-4"/><rect x="3" y="4" width="6" height="6" rx="1"/></svg>
          </div>
          <h2 className="font-semibold text-white tracking-tight">Tasks</h2>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-2 gap-4 flex-grow">
          {/* Left side: Stats List */}
          <div className="bg-layer rounded-2xl px-4 py-2 h-auto flex flex-col justify-evenly ">
            {stats.map((item, i) => (
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
            <div className="px-3 py-1.5 rounded-2xl bg-layer border border-border-subtle flex flex-col h-[45%]">
              <p className="text-xs font-semibold text-white mb-1">
                Ongoing Task
              </p>
              <p className="text-[11px] text-text-secondary mb-0 line-clamp-2 leading-tight">
                {shortenedTitle}
              </p>
              <p className="text-[10px] font-bold text-sharp text-center mt-auto">
                {assignedAgent}
              </p>
            </div>


            
            <div className="px-3 py-1.5 rounded-2xl bg-layer border border-border-subtle flex flex-col h-[45%]">
              <p className="text-xs font-semibold text-white mb-1">
                Awaiting Task
              </p>
              <p className="text-[11px] text-text-secondary mb-0 line-clamp-2 leading-tight">
                {awaitingShortenedTitle}
              </p>
              <p className="text-[10px] font-bold text-sharp text-center mt-auto">
                {awaitingAssignedAgent}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Explore Button */}
      <Link href={"/tasks"}>
        <button className="w-full py-3 rounded-2xl cursor-pointer bg-layer text-sm font-medium text-white hover:bg-zinc-800 transition-colors mt-4 border border-border-subtle">
          Explore
        </button>
      </Link>
    </div>
  );
};

export default TasksCard;

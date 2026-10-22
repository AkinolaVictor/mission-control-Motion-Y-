import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import DashboardLayout from "../../components/DashboardLayout";
import { setSelectedCategory, setSelectedIdeaId } from '../../store/slices/generalSlice';
import AgentChatWindow from "../../components/AgentChat/AgentChatWindow";
import Link from 'next/link';

export default function ApprovalsPage() {
  const dispatch = useDispatch();
  const { navHeight, selectedCategory, selectedIdeaId } = useSelector((state) => state.general);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [modalType, setModalType] = useState('category');
  const [approvals, setApprovals] = useState([]);
  const [selectedApproval, setSelectedApproval] = useState(null);
  const [h, setH] = useState(0);

  useEffect(() => {
    const hd = innerHeight - navHeight - 55;
    setH(hd);
  }, [navHeight]);

  // Fetch tasks awaiting approval on mount and refresh
  const fetchApprovals = async () => {
    try {
      // const response = await fetch('/api/agent/getApprovals');
      // const data = await response.json();

      // const response2 = await fetch('/api/agent/get_all_tasks');
      const response = await fetch('/api/agent/get_all_tasks?category=scheduled');
      const data = await response.json();
      console.log({data})

      setApprovals(Array.isArray(data) ? data : []);

      if (Array.isArray(data) && data.length > 0 && typeof data[0] === 'object') {
        dispatch(setSelectedIdeaId(data[0].task_id));
        setSelectedApproval(data[0]);
      }
    } catch (error) {
      console.error('Error fetching approvals:', error);
    }
  };

  useEffect(() => {
    fetchApprovals();
  }, []);

  const handleApprove = async () => {
    if (!selectedTask) return;
    setIsLoading(true);
    try {
      const response = await fetch('/api/agent/approve_task', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          agent_id: selectedTask.agent_id,
          task_id: selectedTask.task_id
        }),
      });
      if (response.ok) {
        await fetchApprovals();
        setSelectedApproval(null);
        dispatch(setSelectedIdeaId(null));
      }
    } catch (error) {
      console.error('Approval failed:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleDelete = async () => {
    if (!selectedTask) return;
    setIsLoading(true);
    try {
      const response = await fetch('/api/agent/delete_task', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          agent_id: selectedTask.agent_id,
          task_id: selectedTask.task_id,
          location: selectedTask.location
        }),
      });
      if (response.ok) {
        await fetchApprovals();
        setSelectedApproval(null);
        dispatch(setSelectedIdeaId(null));
      }
    } catch (error) {
      console.error('Deletion failed:', error);
    } finally {
      setIsLoading(false);
    }
  }

  const formatAgentName = (id) => {
    if (!id) return 'Unknown Agent';
    return id.charAt(0).toUpperCase() + id.slice(1);
  };

  const formatDateTime = (dateStr) => {
    if (!dateStr) return 'N/A';
    try {
      const date = new Date(dateStr);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return dateStr;
    }
  };

  // Find the selected task for the right pane
  const selectedTask = approvals.find(app => app.task_id === selectedIdeaId);

  return (
    <DashboardLayout activePill="Scheduled" where="Tasks">
      <div>
        <div className='mb-4 bp9:hidden'>
          <div className='mb-1 py-0 flex items-center gap-3'>
            <div className='w-10 h-10 rounded-full bg-layer3 flex items-center justify-center text-lg'>
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-hat-glasses preview-icon"><path d="M14 18a2 2 0 0 0-4 0"/><path d="m19 11-2.11-6.657a2 2 0 0 0-2.752-1.148l-1.276.61A2 2 0 0 1 12 4H8.5a2 2 0 0 0-1.925 1.456L5 11"/><path d="M2 11h20"/><circle cx="17" cy="18" r="3"/><circle cx="7" cy="18" r="3"/></svg>
            </div>
            <h1 className='text-[15px] font-semibold tracking-tight'>Scheduled Tasks</h1>
          </div>
          <div className=' py-0 flex items-center gap-3'>
            <p className='text-sm text-text-secondary opacity-60'>Approve or decline approval to carry out tasks</p>
          </div>

          <div
            onClick={() => {
              setModalType('category');
              setIsModalOpen(true);
            }}
            className={`cursor-pointer flex justify-between items-center gap-3 mt-4 rounded-full bg-layer w-full py-4 px-3`}
          >
            <div className='flex justify-center items-center gap-3'>
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-hat-glasses preview-icon"><path d="M14 18a2 2 0 0 0-4 0"/><path d="m19 11-2.11-6.657a2 2 0 0 0-2.752-1.148l-1.276.61A2 2 0 0 1 12 4H8.5a2 2 0 0 0-1.925 1.456L5 11"/><path d="M2 11h20"/><circle cx="17" cy="18" r="3"/><circle cx="7" cy="18" r="3"/></svg>
              <p>{selectedApproval ? formatAgentName(selectedApproval.agent_id) : "Select Task"}</p>
            </div>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-down preview-icon"><path d="m6 9 6 6 6-6"/></svg>
          </div>
        </div>

            {isLoading && (
              <div className='fixed inset-0 z-[200] flex items-center justify-center bg-black/40 backdrop-blur-sm'>
                <div className='bg-layer2 p-8 rounded-2xl border border-border-subtle flex flex-col items-center gap-4'>
                  <div className='w-12 h-12 border-4 border-layer3 border-t-transparent rounded-full animate-spin'></div>
                  <p className='text-white font-semibold'>Processing Request...</p>
                </div>
              </div>
            )}

            <div className={`w-full flex gap-3 justify-center items-center h-[calc(100%-${navHeight}px)]`}>
          {/* left: Tasks Awaiting Approval */}
          <div style={{ height: h }} className={`bg-layer2 rounded-2xl border py-3 border-border-subtle w-full max-w-[230px] hidden bp9:flex flex-col`}>
            <div className='flex justify-left p-4 items-center w-full gap-3'>
              <div className='w-10 h-10 rounded-full bg-layer3 flex items-center justify-center text-lg'>
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-hat-glasses preview-icon"><path d="M14 18a2 2 0 0 0-4 0"/><path d="m19 11-2.11-6.657a2 2 0 0 0-2.752-1.148l-1.276.61A2 2 0 0 1 12 4H8.5a2 2 0 0 0-1.925 1.456L5 11"/><path d="M2 11h20"/><circle cx="17" cy="18" r="3"/><circle cx="7" cy="18" r="3"/></svg>
              </div>
              <h2 className='text-[13px] font-semibold text-white tracking-tight'>Scheduled Tasks ({approvals.length})</h2>
            </div>

            <div className='px-2 overflow-y-auto flex-1 custom-scrollbar'>
              {approvals.map((task, index) => (
                <div
                  key={index}
                  onClick={() => {
                    setSelectedApproval(task);
                    dispatch(setSelectedIdeaId(task.task_id));
                  }}
                  className={`w-full bp7:max-w-80 cursor-pointer rounded-[10px] p-3 mb-4 h-auto ${selectedApproval?.task_id === task.task_id ? "bg-layer3" : "bg-surface"}`}
                >
                  <div className='flex justify-between items-center font-semibold'>
                    <div className='flex justify-center items-center gap-1.5'>
                      <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-hat-glasses preview-icon"><path d="M14 18a2 2 0 0 0-4 0"/><path d="m19 11-2.11-6.657a2 2 0 0 0-2.752-1.148l-1.276.61A2 2 0 0 1 12 4H8.5a2 2 0 0 0-1.925 1.456L5 11"/><path d="M2 11h20"/><circle cx="17" cy="18" r="3"/><circle cx="7" cy="18" r="3"/></svg>
                      <p>{formatAgentName(task.agent_id)}</p>
                    </div>
                    <p className='text-[10px] opacity-100 font-semibold text-yellow-500'>{formatDateTime(task.created_at)}</p>
                  </div>

                  <div className='mt-3'>
                    <p className='font-semibold mb-1 text-[13px]'>{task.task_id}</p>
                    <p className='opacity-70 text-[12px] line-clamp-2'>
                      {task.search_prompt || "No research prompt provided."}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* middle: Task Detail View */}
          <div style={{ height: h }} className={`bg-layer2 rounded-2xl border border-border-subtle w-full py-4 flex flex-col`}>
            <div className='flex justify-left p-4 items-center w-full gap-3'>
              <div className='w-10 h-10 rounded-full bg-layer3 flex items-center justify-center text-lg'>
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-hat-glasses preview-icon"><path d="M14 18a2 2 0 0 0-4 0"/><path d="m19 11-2.11-6.657a2 2 0 0 0-2.752-1.148l-1.276.61A2 2 0 0 1 12 4H8.5a2 2 0 0 0-1.925 1.456L5 11"/><path d="M2 11h20"/><circle cx="17" cy="18" r="3"/><circle cx="7" cy="18" r="3"/></svg>
              </div>
              <div>
                <h2 className='text-[13px] font-semibold text-white tracking-tight'>{selectedTask ? formatAgentName(selectedTask.agent_id) : 'No Task Selected'}</h2>
                <p className='text-[12px] opacity-70'>Task Configuration Detail</p>
              </div>

              {
                selectedTask&&
              <div className='ml-auto flex justify-center items-center gap-3'>
                <div
                  onClick={handleDelete}
                  className='w-9 h-9 rounded-full cursor-pointer bg-layer3 flex justify-center items-center'
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-trash preview-icon"><path d="M10 11v6"/><path d="M14 11v6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M3 6h18"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                </div>
                {/* <div
                  onClick={handleApprove}
                  className='w-9 h-9 rounded-full cursor-pointer bg-layer3 flex justify-center items-center'
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-check preview-icon"><path d="M20 6 9 17l-5-5"/></svg>
                </div> */}
              </div>
              }
            </div>

            <div className='px-4 overflow-y-auto flex-1 custom-scrollbar'>
              {selectedTask ? (
                <div className="mt-4 overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-border-subtle">
                        <th className="py-2 px-4 text-sm font-semibold text-text-secondary">Key</th>
                        <th className="py-2 px-4 text-sm font-semibold text-text-secondary">Value</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(selectedTask).map(([key, value]) => (
                        <tr key={key} className="border-b border-border-subtle hover:bg-white/5 transition-colors">
                          <td className="py-2 px-4 text-sm font-medium text-white">{key}</td>
                          <td className="py-2 px-4 text-sm text-text-secondary whitespace-pre-wrap">
                            {typeof value === 'object' ? JSON.stringify(value, null, 2) : String(value)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className='text-center opacity-50 mt-10'>Please select a task from the left panel to view details.</div>
              )}
            </div>
          </div>

          {/* Chat Window Integration */}
          <div style={{ height: h }} className={`bg-layer2 rounded-2xl w-full border border-border-subtle hidden bp7:flex flex-col justify-center items-center`}>
            {selectedTask ? (
              <AgentChatWindow
                agentId={selectedTask.agent_id}
                agentName={selectedTask.agent_id}
                initialTaskId={selectedTask.task_id}
                onClose={() => {}}
              />
            ) : (
              <div className="text-center opacity-50">Select a task to chat with the agent</div>
            )}
          </div>
        </div>

        {isModalOpen && (
          <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4'>
            <div className='bg-layer2 border border-border-subtle rounded-2xl w-full max-w-[350px] max-h-[80vh] flex flex-col overflow-hidden'>
              <div className='p-4 border-b border-border-subtle flex justify-between items-center'>
                <h2 className='text-sm font-semibold text-white'>
                  Select From Task
                </h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className='text-text-secondary hover:text-white transition-colors'
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6L6 18"/><path d="m6 6 12 12"/></svg>
                </button>
              </div>
              <div className='p-2 overflow-y-auto flex-1 custom-scrollbar'>
                {approvals.map((task, index) => (
                  <div
                    key={index}
                    onClick={() => {
                      setSelectedApproval(task);
                      dispatch(setSelectedIdeaId(task.task_id));
                      setIsModalOpen(false);
                    }}
                    className={`w-full bp7:max-w-80 cursor-pointer rounded-[10px] p-3 mb-4 h-auto ${selectedApproval?.task_id === task.task_id ? "bg-layer3" : "bg-surface"}`}
                  >
                    <div className='flex justify-between items-center font-semibold'>
                      <div className='flex justify-center items-center gap-1.5'>
                        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-hat-glasses preview-icon"><path d="M14 18a2 2 0 0 0-4 0"/><path d="m19 11-2.11-6.657a2 2 0 0 0-2.752-1.148l-1.276.61A2 2 0 0 1 12 4H8.5a2 2 0 0 0-1.925 1.456L5 11"/><path d="M2 11h20"/><circle cx="17" cy="18" r="3"/><circle cx="7" cy="18" r="3"/></svg>
                        <p>{formatAgentName(task.agent_id)}</p>
                      </div>
                      <p className='text-[10px] opacity-100 font-semibold text-yellow-500'>{formatDateTime(task.created_at)}</p>
                    </div>

                    <div className='mt-3'>
                      <p className='font-semibold mb-1 text-[13px]'>{task.task_id}</p>
                      <p className='opacity-70 text-[12px] line-clamp-2'>
                        {task.search_prompt || "No research prompt provided."}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {isChatModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-end justify-end p-6 pointer-events-none">
            <div className="pointer-events-auto animate-in slide-in-from-bottom-8 fade-in duration-300">
              <div className="w-[380px] h-[580px] max-w-[calc(100vw-48px)] max-h-[calc(100vh-48px)]">
                {/* <AgentChatWindow onClose={() => setIsChatModalOpen(false)} /> */}
                <AgentChatWindow agentId={selectedTask.agent_id} agentName={selectedTask.agent_id} initialTaskId={selectedTask.task_id} onClose={() => {}} />
              </div>
            </div>
          </div>
        )}

        <div onClick={() => setIsChatModalOpen(!isChatModalOpen)} className='flex justify-center items-center bp7:hidden fixed bottom-7 right-7 rounded-full bg-layer h-14 w-14 cursor-pointer'>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-message-circle preview-icon"><path d="M2.992 16.342a2 2 0 0 1 .094 1.167l-1.065 3.29a1 1 0 0 0 1.236 1.168l3.413-.998a2 2 0 0 1 1.099.092 10 10 0 1 0-4.777-4.719"/></svg>
        </div>
      </div>
    </DashboardLayout>
  );
}

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useEffect, useState } from 'react';

function AgentList({env, closeModal}) {
    const [agents, setAgents] = useState([]);
    const [loading, setLoading] = useState(true);
    const path = usePathname()
    // console.log(path)

    useEffect(() => {
        async function fetchAgents() {
            try {
                const response = await fetch('/api/agents/getAgents');
                const data = await response.json();
                if (data.agents) {
                    setAgents(data.agents);
                }
            } catch (error) {
                console.error('Error fetching agents:', error);
            } finally {
                setLoading(false);
            }
        }
        fetchAgents();
    }, []);

    function ifOnModal(){
        if(env=="modal" && closeModal){
            closeModal()
        }
    }

    return (
        <>
            {
                env=="modal"?
                null:
                <div className='flex justify-left p-4 items-center w-full gap-3'>
                <div className='w-10 h-10 rounded-full bg-layer3 flex items-center justify-center text-lg'>
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-hat-glasses preview-icon"><path d="M14 18a2 2 0 0 0-4 0"/><path d="m19 11-2.11-6.657a2 2 0 0 0-2.752-1.148l-1.276.61A2 2 0 0 1 12 4H8.5a2 2 0 0 0-1.925 1.456L5 11"/><path d="M2 11h20"/><circle cx="17" cy="18" r="3"/><circle cx="7" cy="18" r="3"/></svg>
                </div>
                <h2 className='text-[13px] font-semibold text-white tracking-tight'>Agents and Activities</h2>
                </div>
            }

            <div className='px-2 overflow-y-auto flex-1 custom-scrollbar'>
              <div className='mb-2'>
                <Link href={`/agents`} onClick={ifOnModal} className='w-full flex justify-start items-center gap-2'>
                    <div className={`w-full h-auto rounded-[7px] cursor-pointer hover:bg-layer3 ${path=="/agents"?"bg-layer3":""} px-3 py-2 my-1 transition-all duration-200`}>
                        <div className='w-full flex justify-start items-center gap-2'>
                            <div className='w-7 h-7 rounded-full bg-layerd3 flex items-center justify-center text-lg text-white'>
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-square-kanban preview-icon"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M8 7v7"/><path d="M12 7v4"/><path d="M16 7v9"/></svg>
                            </div>
                            <h3 className='text-[13px] font-semibold text-white tracking-tight'>Agents Board</h3>
                        </div>
                        <p className='text-[11px] opacity-70 font-semibold text-text-secondary ml-9'>All agents activities overview</p>
                    </div>
                </Link>
              </div>

                <div className='w-full h-[1px] flex justify-between items-center p-4'>
                    <p className='text-xs opacity-60'>All Agents</p>
                </div>

              {loading ? (
                <div className='flex justify-center items-center p-4'>
                    <p className='text-xs text-text-secondary animate-pulse'>Loading agents...</p>
                </div>
              ) : (
                agents.map((agent, index) => (
                    <Link key={agent.id} onClick={ifOnModal} href={`/agents/${agent.id}`} className='w-full flex justify-start items-center gap-2'>
                        <div
                            className={`w-full h-auto rounded-[7px] cursor-pointer ${path===`/agents/${agent.id}`?"bg-layer3 border border-border-subtle" : "hover:bg-layer3"} px-3 py-2 my-1 transition-all duration-200`}
                        >
                            <div className='w-full flex justify-start items-center gap-2'>
                                <div className='w-7 h-7 rounded-full bg-layerd3 flex items-center justify-center text-lg text-white'>
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-hat-glasses preview-icon"><path d="M14 18a2 2 0 0 0-4 0"/><path d="m19 11-2.11-6.657a2 2 0 0 0-2.752-1.148l-1.276.61A2 2 0 0 1 12 4H8.5a2 2 0 0 0-1.925 1.456L5 11"/><path d="M2 11h20"/><circle cx="17" cy="18" r="3"/><circle cx="7" cy="18" r="3"/></svg>
                                </div>
                                <h3 className='text-[13px] font-semibold text-white tracking-tight'>{agent.name}</h3>
                            </div>
                            <p className='text-[11px] text-text-secondary line-clamp-2 ml-9 opacity-70 font-semibold'>{agent.description}</p>
                        </div>
                    </Link>
                ))
              )}
            </div>
        </>
    );
}

export default AgentList;

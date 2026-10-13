import DashboardLayout from '@/components/DashboardLayout';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

function createAgent(props) {
  const [h, useH] = useState(0);
  const { navHeight } = useSelector((state) => state.general);
  const [agentDescription, setAgentDescription] = useState("")

useEffect(() => {
    const hd = innerHeight - navHeight - 55;
    useH(hd);
}, [navHeight]);

    return (
        <div>
            <DashboardLayout activePill="New Agent" where="Agents">
                <div style={{alignItems: "flex-start"}} className='w-full h-auto center'>

                    <div style={{height:h}} className='bg-surface w-full max-w-120 rounded-[15px] p-4'>
                        <div className='flex justify-left mb-4 items-center w-full gap-3'>
                            <div className='w-11 h-11 rounded-full bg-layer3 flex items-center justify-center text-lg'>
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-hat-glasses preview-icon"><path d="M14 18a2 2 0 0 0-4 0"/><path d="m19 11-2.11-6.657a2 2 0,0 0-2.752-1.148l-1.276.61A2 2 0 0 1 12 4H8.5a2 2 0 0 0-1.925 1.456L5 11"/><path d="M2 11h20"/><circle cx="17" cy="18" r="3"/><circle cx="7" cy="18" r="3"/></svg>
                            </div>
                            <div>
                                <h2 className='text-[15px] font-semibold text-white tracking-tight'>New Agent</h2>
                                <p className='text-[12px] opacity-70 '>Create a new agent for a specific task</p>
                            </div>
                        </div>

                        <div className=' w-full h-auto p-4 rounded-[13px] mb-4 bg-layer'>
                            <p className='px-3s mb-2'> Agent Model</p>
                            <div
                                className='cursor-pointer w-full bg-layer2 rounded-[7px] flex justify-between items-center p-3 py-2 hover:bg-layer3 transition-colors'
                            >
                                <p>{"gemma4:31b-cloud"}</p>
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chevron-down preview-icon"><path d="m6 9 6 6 6-6"/></svg>
                            </div>
                        </div>

                        <div className='w-full'>
                            <p className='px-3s mb-2'>Agent Description</p>
                            <textarea
                                value={agentDescription}
                                onChange={(e) => setAgentDescription(e.target.value)}
                                className='w-full bg-layer3 text-[12px] opacity-70 p-2 rounded-[15px] min-h-[170px] outline-none border border-border-subtle'
                            />
                            <div
                                // onClick={handleSaveSystemFile}
                                className={`w-full py-2 cursor-pointer flex justify-center items-center mt-3 bg-layer rounded-[9px] hover:bg-layer3 transition-colors`}
                            >
                                <p className='text-[13px] opacity-90'>Create</p>
                            </div>
                        </div>
                    </div>
                </div>
            </DashboardLayout>
        </div>
    );
}

export default createAgent;
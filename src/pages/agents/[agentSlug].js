import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useSelector, useDispatch } from 'react-redux';
import DashboardLayout from "../../components/DashboardLayout";
import { setSelectedCategory, setSelectedIdeaId } from '../../store/slices/generalSlice';
import { agent_config } from '../../../agents/config';
import AgentChatWindow from "../../components/AgentChat/AgentChatWindow";
import Link from 'next/link';
import AgentList from '@/components/AgentList';

export default function AgentSlug() {
  const router = useRouter();
  const { agentSlug } = router.query;
  const dispatch = useDispatch();
  const { navHeight, selectedCategory, selectedIdeaId } = useSelector((state) => state.general);
  const [activeAgent, setActiveAgent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);
  const [modalType, setModalType] = useState('category'); // 'category' or 'idea'
  const [categories, setCategories] = useState([]);
  const [ideas, setIdeas] = useState([]);
  const [h, useH] = useState(0);

  useEffect(() => {
    if (agentSlug) {
      const agent = agent_config.agents.find(a => a.id === agentSlug);
      setActiveAgent(agent);
    }
  }, [agentSlug]);

  useEffect(() => {
    const hd = innerHeight - navHeight - 55;
    useH(hd);
  }, [navHeight]);

  // Initial fetch: Get all categories
  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await fetch('/api/getIdeas');
        const data = await response.json();
        setCategories(data.categories || []);

        // Set default category if none selected
        if (data.categories && data.categories.length > 0 && !selectedCategory) {
          dispatch(setSelectedCategory(data.categories[0]));
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    }
    fetchCategories();
  }, [dispatch, selectedCategory]);

  // Secondary fetch: Get ideas for the selected category
  useEffect(() => {
    if (!selectedCategory) return;

    async function fetchIdeas() {
      try {
        const response = await fetch(`/api/getIdeas?category=${selectedCategory}`);
        const data = await response.json();
        setIdeas(data.ideas || []);
      } catch (error) {
        console.error('Error fetching ideas:', error);
      }
    }
    fetchIdeas();
  }, [selectedCategory]);

  // Find the selected idea for the right pane
  const selectedIdea = ideas.find(idea => idea.id === selectedIdeaId);

  if (!activeAgent) {
    return (
        <DashboardLayout activePill="Agents" where="Agents">
            <div className="flex items-center justify-center h-full">
                <p className="text-text-secondary">Loading agent or agent not found...</p>
            </div>
        </DashboardLayout>
    );
  }

  return (
    <DashboardLayout activePill="Agents" where="Agents">
      <div>

        <div className='mb-4 bp9:hidden'>
          <div className='mb-1 py-0 flex items-center gap-3'>
            <div className='w-10 h-10 rounded-full bg-layer3 flex items-center justify-center text-lg'>
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-hat-glasses preview-icon"><path d="M14 18a2 2 0 0 0-4 0"/><path d="m19 11-2.11-6.657a2 2 0 0 0-2.752-1.148l-1.276.61A2 2 0 0 1 12 4H8.5a2 2 0 0 0-1.925 1.456L5 11"/><path d="M2 11h20"/><circle cx="17" cy="18" r="3"/><circle cx="7" cy="18" r="3"/></svg>
            </div>
            <h1 className='text-[15px] font-semibold tracking-tight'>Agents and Activities</h1>
          </div>
          <div className=' py-0 flex items-center gap-3'>
            <p className='text-sm text-text-secondary opacity-60'>Explore agents and their activities</p>
          </div>

          <div
            onClick={() => {
              setModalType('category');
              setIsModalOpen(true);
            }}
            className={`cursor-pointer flex justify-between items-center gap-3 mt-4 rounded-full bg-layer w-full py-4 px-3`}
          >
            <div className='flex justify-center items-center gap-3'>
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-layers preview-icon"><path d="M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83z"/><path d="M2 12a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 12"/><path d="M2 17a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 17"/></svg>
              <p>{selectedCategory || "Select Platform"}</p>
            </div>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chevron-down preview-icon"><path d="m6 9 6 6 6-6"/></svg>
          </div>
        </div>

        <div
          // style={{minHeight: `calc(100% - ${navHeight}px)`}}
          className={`w-full flex gap-3 justify-center items-center h-[calc(100%-${navHeight}px)]`}
        >

          {/* left: Categories */}
          <div style={{height:h}} className={`bg-layer2 rounded-2xl border py-3 border-border-subtle w-full max-w-[230px] hidden bp9:flex flex-col`}>
            <AgentList />
          </div>

          {/* middle: Agent Control Panel */}
          <div style={{height:h}} className={`
                bg-layer2 rounded-2xl border border-border-subtle
                w-full py-4 w-full flex flex-col
            `}
          >
            <div className='flex justify-left p-4 items-center w-full gap-3'>
              <div className='w-10 h-10 rounded-full bg-layer3 flex items-center justify-center text-lg'>
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-hat-glasses preview-icon"><path d="M14 18a2 2 0 0 0-4 0"/><path d="m19 11-2.11-6.657a2 2 0 0 0-2.752-1.148l-1.276.61A2 2 0 0 1 12 4H8.5a2 2 0 0 0-1.925 1.456L5 11"/><path d="M2 11h20"/><circle cx="17" cy="18" r="3"/><circle cx="7" cy="18" r="3"/></svg>
              </div>
              <div>
                  <h2 className='text-[13px] font-semibold text-white tracking-tight'>{activeAgent.name}</h2>
                  <p className='text-[12px] opacity-70'>{activeAgent.description}</p>
              </div>
            </div>

            <div className='px-2 overflow-y-auto flex-1 custom-scrollbar'>
              <div className='bg-surface w-full h-auto p-3 rounded-[13px] mb-4'>
                  <p className='px-3s mb-2'>Model</p>
                  <div className='cursor-pointer w-full bg-layer2 rounded-[7px] flex justify-between items center p-3 py-2'>
                      <p>gemma4:31b-cloud</p>
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chevron-down preview-icon"><path d="m6 9 6 6 6-6"/></svg>
                  </div>
              </div>

              <div className='bg-surface w-full h-auto rounded-[13px] mb-4 cursor-pointer p-3'>
                  <div className='flex justify-between items-center'>
                      <p className='px-3s'>Instruction Documents</p>
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chevron-down preview-icon"><path d="m6 9 6 6 6-6"/></svg>
                  </div>
                  <div className='cursor-pointer w-full bg-layer2 rounded-[7px] flex justify-between items center p-3 py-2 mt-3'>
                      <p>Identity</p>
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-square-pen preview-icon"><path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z"/></svg>
                  </div>
                  <div className='w-full bg-layer2 rounded-[12px] p-3 mt-3'>
                      <div className='mt-3s'>
                          <div className='flex justify-between items-center mb-3'>
                              <h1 className='font-semibold text-[12px]'>Agent Identity</h1>
                              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-square-pen preview-icon"><path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.375 2.625a1 1 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/></svg>
                          </div>
                          <p className='text-[12px] opacity-70'>
                              {activeAgent.role}
                          </p>
                      </div>
                  </div>
              </div>

              <div className='bg-surface w-full h-auto rounded-[13px] mb-4 cursor-pointer p-3'>
                  <div className='flex justify-between items-center'>
                      <p className='px-3s'>Tasks</p>
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chevron-down preview-icon"><path d="m6 9 6 6 6-6"/></svg>
                  </div>
                  <div className='cursor-pointer w-full bg-layer2 rounded-[7px] flex justify-between items center p-3 py-2 mt-3'>
                      <p>Ongoing Tasks</p>
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" backdrop-fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chevron-down preview-icon"><path d="m6 9 6 6 6-6"/></svg>
                  </div>
                  <div className='mt-3'>
                      {
                        Array(12).fill(0).map((item, index)=>{
                          return (
                            <div key={index} className='w-full bg-layer2 rounded-[12px] p-3 mb-3'>
                                <div className='flex justify-between items-center mb-3'>
                                    <h1 className='font-semibold text-[12px]'>Title of this task</h1>
                                    <p className='font-semibold text-[9px] opacity-70'>9:39PM--12/03/2024</p>
                                </div>
                                <p className='text-[12px] opacity-70'>
                                    Human-in-the-Loop (HITL) Intervention: Tracking how often a human had to correct the agent or provide approval.Tracking how often a human had to correct the agent or provide approval.
                                    Human-in-the-Loop (HITL) Intervention: Tracking how often a human had to correct the agent and provide approval.
                                </p>
                            </div>
                          )
                        })
                      }
                  </div>
              </div>
            </div>
          </div>

          {/* right: Chat Window */}
          <div style={{height:h}} className={`bg-layer2 rounded-2xl w-full border border-border-subtle hidden bp7:flex flex-col justify-center items-center`}>
            <AgentChatWindow
                onClose={() => {}}
                agentId={activeAgent.id}
                agentName={activeAgent.name}
            />
          </div>
        </div>
      </div>

      {
        isModalOpen ? (
          <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4'>
            <div className='bg-layer2 border border-border-subtle rounded-2xl w-full max-w-[350px] max-h-[80vh] flex flex-col overflow-hidden'>
              <div className='p-4 border-b border-border-subtle flex justify-between items-center'>
                <h2 className='text-sm font-semibold text-white'>
                  {modalType === 'category' ? 'Select Category' : 'Select Idea'}
                </h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className='text-text-secondary hover:text-white transition-colors'
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 6L6 18" /><path d="m6 6 12 12" />
                  </svg>
                </button>
              </div>
              
              <div className='p-2 overflow-y-auto flex-1 custom-scrollbar'>
                {modalType === 'category' ? (
                  <>
                    {categories.map((cat, index) => (
                      <div
                        key={index}
                        onClick={() => {
                          dispatch(setSelectedCategory(cat));
                          setIsModalOpen(false);
                        }}
                        className={`w-full h-auto rounded-[7px] cursor-pointer ${selectedCategory === cat ? "bg-layer3 border border-border-subtle" : "hover:bg-layer3"} px-3 py-2 my-1 transition-all duration-200`}
                      >
                        <div className='w-full flex justify-start items-center gap-2'>
                          <div className='w-7 h-7 rounded-full bg-layer3 flex items-center justify-center text-lg text-white'>
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" />
                            </svg>
                          </div>
                          <h3 className='text-[13px] font-semibold text-white tracking-tight'>{cat}</h3>
                        </div>
                        <p className='text-[11px] text-text-secondary ml-9'>Explore {cat} concepts</p>
                      </div>
                    ))}
                  </>
                ) : (
                  <>
                    {ideas.length === 0 ? (
                      <div className='flex flex-col items-center justify-center h-full text-text-secondary text-sm p-4'>
                        <p>No ideas found for this category.</p>
                      </div>
                    ) : (
                      <>
                        {ideas.map((idea, index) => (
                          <div
                            key={index}
                            onClick={() => {
                              dispatch(setSelectedIdeaId(idea.id));
                              setIsModalOpen(false);
                            }}
                            // FIXED: Changed 'cat' to 'idea.id' (assuming you have a selectedIdeaId state)
                            className={`w-full h-auto rounded-[7px] cursor-pointer ${selectedIdeaId === idea.id ? "bg-layer3 border border-border-subtle" : "hover:bg-layer3"} px-3 py-2 my-1 transition-all duration-200`}
                          >
                            <div className='w-full flex justify-start items-center gap-2 mb-1'>
                              <div className='text-white text-sm'>
                                {/* FIXED: Changed stroke-width to strokeWidth, stroke-linecap to strokeLinecap, etc. */}
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-lightbulb preview-icon">
                                  <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5" />
                                  <path d="M9 18h6" />
                                  <path d="M10 22h4" />
                                </svg>
                              </div>
                              <h3 className='text-[13px] font-semibold text-white tracking-tight'>{idea.title}</h3>
                            </div>
                            <p className='text-[11px] text-text-secondary leading-relaxed'>{idea.description}</p>
                          </div>
                        ))}
                      </>
                    )}
                  </>
                )}
              </div> {/* FIXED: Added this missing closing div for the body container */}
            </div>
          </div>
        ) : null
      }

    </DashboardLayout>
  );
}

import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import DashboardLayout from "../../components/DashboardLayout";
import { setSelectedCategory, setSelectedIdeaId } from '../../store/slices/generalSlice';
import AgentChatWindow from "../../components/AgentChat/AgentChatWindow";
import Link from 'next/link';


export default function AgentSlug() {
  const dispatch = useDispatch();
  const { navHeight, selectedCategory, selectedIdeaId } = useSelector((state) => state.general);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);
  const [modalType, setModalType] = useState('category'); // 'category' or 'idea'
  const [categories, setCategories] = useState([]);
  const [ideas, setIdeas] = useState([]);
  const [h, useH] = useState(0);

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

  return (
    <DashboardLayout activePill="Approvals" where="Agents">
      <div>

        <div className='mb-4 bp9:hidden'>
          <div className='mb-1 py-0 flex items-center gap-3'>
            <div className='w-10 h-10 rounded-full bg-layer3 flex items-center justify-center text-lg'>
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-hat-glasses preview-icon"><path d="M14 18a2 2 0 0 0-4 0"/><path d="m19 11-2.11-6.657a2 2 0 0 0-2.752-1.148l-1.276.61A2 2 0 0 1 12 4H8.5a2 2 0 0 0-1.925 1.456L5 11"/><path d="M2 11h20"/><circle cx="17" cy="18" r="3"/><circle cx="7" cy="18" r="3"/></svg>
            </div>
            <h1 className='text-[15px] font-semibold tracking-tight'>Agents Awaiting Approvals</h1>
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
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-hat-glasses preview-icon"><path d="M14 18a2 2 0 0 0-4 0"/><path d="m19 11-2.11-6.657a2 2 0 0 0-2.752-1.148l-1.276.61A2 2 0 0 1 12 4H8.5a2 2 0 0 0-1.925 1.456L5 11"/><path d="M2 11h20"/><circle cx="17" cy="18" r="3"/><circle cx="7" cy="18" r="3"/></svg>
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
            <div className='flex justify-left p-4 items-center w-full gap-3'>
              <div className='w-10 h-10 rounded-full bg-layer3 flex items-center justify-center text-lg'>
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-hat-glasses preview-icon"><path d="M14 18a2 2 0 0 0-4 0"/><path d="m19 11-2.11-6.657a2 2 0 0 0-2.752-1.148l-1.276.61A2 2 0 0 1 12 4H8.5a2 2 0 0 0-1.925 1.456L5 11"/><path d="M2 11h20"/><circle cx="17" cy="18" r="3"/><circle cx="7" cy="18" r="3"/></svg>
              </div>
              <h2 className='text-[13px] font-semibold text-white tracking-tight'>Awaiting Approvals</h2>
            </div>

            <div className='px-2 overflow-y-auto flex-1 custom-scrollbar'>

              {categories.map((cat, index) => (
                <div key={index} className={`w-full bp7:max-w-80 cursor-pointer rounded-[10px] p-3 mb-4 h-auto ${index==1?"bg-layer3":"bg-surface"}`}>
                  <div className='flex justify-between items-center font-semibold'>
                    <div className='flex justify-center items-center gap-1.5'>
                      <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-hat-glasses preview-icon"><path d="M14 18a2 2 0 0 0-4 0"/><path d="m19 11-2.11-6.657a2 2 0 0 0-2.752-1.148l-1.276.61A2 2 0 0 1 12 4H8.5a2 2 0 0 0-1.925 1.456L5 11"/><path d="M2 11h20"/><circle cx="17" cy="18" r="3"/><circle cx="7" cy="18" r="3"/></svg>
                      <p>Fushia</p>
                    </div>
                    <p className='text-[10px] opacity-100 font-semibold text-yellow-500'>01:05</p>
                  </div>

                  <div className='mt-3'>
                    <p className='font-semibold mb-1 text-[13px]'>Reason for prompting</p>
                    <p className='opacity-70 text-[12px]'>
                      It's difficult to tell what is being asked here. 
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* middle: Idea List */}
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
                  <h2 className='text-[13px] font-semibold text-white tracking-tight'>Orchestrator</h2>
                  <p className='text-[12px] opacity-70'>Agent Control Panel</p>
              </div>

              <div className='ml-auto flex justify-center items-center gap-3'>
                <div className='w-9 h-9 rounded-full cursor-pointer bg-layer3 flex justify-center items-center'>
                  <svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trash preview-icon"><path d="M10 11v6"/><path d="M14 11v6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M3 6h18"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                </div>
                <div className='w-9 h-9 rounded-full cursor-pointer bg-layer3 flex justify-center items-center'>
                  <svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-check preview-icon"><path d="M20 6 9 17l-5-5"/></svg>
                </div>
              </div>
            </div>

            <div className='px-2 overflow-y-auto flex-1 custom-scrollbar'>
              <p className='text-center'>Text goes here</p>
            </div>
          </div>

          {/* right: Idea Content */}
          <div style={{height:h}} className={`bg-layer2 rounded-2xl w-full border border-border-subtle hidden bp7:flex flex-col justify-center items-center`}>
            <AgentChatWindow onClose={() => {}} />
          </div>
        </div>
      </div>

      {isModalOpen && (
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
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6L6 18"/><path d="m6 6 12 12"/></svg>
              </button>
            </div>
            <div className='p-2 overflow-y-auto flex-1 custom-scrollbar'>
              {modalType === 'category' ? (
                categories.map((cat, index) => (
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
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 18a2 2 0 0 0-4 0"/><path d="m19 11-2.11-6.657a2 2 0 0 0-2.752-1.148l-1.276.61A2 2 0 0 1 12 4H8.5a2 2 0 0 0-1.925 1.456L5 11"/><path d="M2 11h20"/><circle cx="17" cy="18" r="3"/><circle cx="7" cy="18" r="3"/></svg>
                            </div>
                            <h3 className='text-[13px] font-semibold text-white tracking-tight'>{cat}</h3>
                        </div>
                        <p className='text-[11px] text-text-secondary ml-9'>Explore {cat} concepts</p>
                    </div>
                ))
              ) : (
                ideas.length === 0 ? (
                  <div className='flex flex-col items-center justify-center h-full text-text-secondary text-sm p-4'>
                    <p>No ideas found for this category.</p>
                  </div>
                ) : (
                  ideas.map((idea, index) => (
                    <div
                      key={index}
                      onClick={() => {
                        dispatch(setSelectedIdeaId(idea.id));
                        setIsModalOpen(false);
                      }}
                      className={`w-full h-auto rounded-[7px] cursor-pointer ${selectedIdeaId === idea.id ? "bg-layer3 border border-border-subtle" : "hover:bg-layer3"} px-3 py-3 my-1 transition-all duration-200`}
                    >
                      <div className='w-full flex justify-start items-center gap-2 mb-1'>
                        <div className='text-white text-sm'>
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-lightbulb preview-icon"><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/></svg>
                        </div>
                        <h3 className='text-[13px] font-semibold text-white tracking-tight'>{idea.title}</h3>
                      </div>
                      <p className='text-[11px] text-text-secondary leading-relaxed'>{idea.description}</p>
                    </div>
                  ))
                )
              )}
            </div>
          </div>
        </div>
      )}

      {isChatModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-end justify-end p-6 pointer-events-none">
          <div className="pointer-events-auto animate-in slide-in-from-bottom-8 fade-in duration-300">
             <div className="w-[380px] h-[580px] max-w-[calc(100vw-48px)] max-h-[calc(100vh-48px)]">
                <AgentChatWindow onClose={() => setIsChatModalOpen(false)} />
             </div>
          </div>
        </div>
      )}

      <div onClick={() => setIsChatModalOpen(!isChatModalOpen)}  className='flex justify-center items-center bp7:hidden fixed bottom-7 right-7 rounded-full bg-layer h-14 w-14 cursor-pointer'>
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-message-circle preview-icon"><path d="M2.992 16.342a2 2 0 0 1 .094 1.167l-1.065 3.29a1 1 0 0 0 1.236 1.168l3.413-.998a2 2 0 0 1 1.099.092 10 10 0 1 0-4.777-4.719"/></svg>
      </div>
    </DashboardLayout>
  );
}

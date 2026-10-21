import React, { Fragment, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useSelector, useDispatch } from 'react-redux';
import DashboardLayout from "../../components/DashboardLayout";
import { setSelectedCategory, setSelectedIdeaId } from '../../store/slices/generalSlice';
import { agent_config } from '../../../agents/config';
import AgentChatWindow from "../../components/AgentChat/AgentChatWindow";
import Link from 'next/link';
import AgentList from '@/components/AgentList';
import axios from 'axios';
import { usePathname } from 'next/navigation';
import OnboardingModal from "../../components/OnboardingModal";

export default function AgentSlug() {
  const router = useRouter();
  const { agentSlug } = router.query;
  const path = usePathname()
  const dispatch = useDispatch();
  const { navHeight, selectedCategory, selectedIdeaId } = useSelector((state) => state.general);
  const [activeAgent, setActiveAgent] = useState(null);
  const [approveDelete, setApproveDelete] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [showSystemSelector, setShowSystemSelector] = useState(false);
  const [showSystemSelector2, setShowSystemSelector2] = useState(false);
  const [modalType, setModalType] = useState('category'); // 'category' or 'idea'
  const [categories, setCategories] = useState([]);
  const [ideas, setIdeas] = useState([]);
  const [h, useH] = useState(0);
  const [task_categories, set_task_categories] = useState({})

  // Model selection state
  const [isModelModalOpen, setIsModelModalOpen] = useState(false);
  const [availableModels, setAvailableModels] = useState([]);
  const [isLoadingModels, setIsLoadingModels] = useState(false);

  // System File state
  const [isSystemModalOpen, setIsSystemModalOpen] = useState(false);
  const [systemFiles, setSystemFiles] = useState([]);
  const [selectedSystemFile, setSelectedSystemFile] = useState(null);
  const [systemFileContent, setSystemFileContent] = useState('');
  const [isEditingSystem, setIsEditingSystem] = useState(false);
  const [editedContent, setEditedContent] = useState('');
  const [all_agent_tasks, set_all_agent_tasks] = useState([
    {name: "Ongoing Tasks", tasks: [1,2,3]}, 
    {name: "Completed Tasks", tasks: [1,2,3]}, 
    {name: "Awaiting Tasks", tasks: [1,2,3]}
  ])

  useEffect(() => {
    if (agentSlug) {
      const agent = agent_config.agents.find(a => a.id === agentSlug);
      setActiveAgent(agent);

      // if (agent && agent.setup === false) {
      //   setIsOnboardingOpen(true);
      // }
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

  // Fetch models from Ollama via proxy API
  const handleOpenModelSelector = async () => {
    setIsModelModalOpen(true);
    setIsLoadingModels(true);
    try {
      const response = await axios.get('/api/agent/get_models');
      setAvailableModels(response.data.models || []);
    } catch (error) {
      console.error('Error fetching models:', error);
    } finally {
      setIsLoadingModels(false);
    }
  };

  const handleSelectModel = async (modelName) => {
    try {
      const response = await axios.post('/api/agent/update_agent', {
        agentId: activeAgent.id,
        updates: { model: modelName }
      });

      if (response.data.success) {
        // Update local state to reflect the change immediately
        setActiveAgent({
          ...activeAgent,
          model: modelName
        });
      }
    } catch (error) {
      console.error('Error updating agent model:', error);
      alert('Failed to update agent model.');
    } finally {
      setIsModelModalOpen(false);
    }
  };

  // System File handlers
  const handleOpenSystemSelector = async () => {
    setIsSystemModalOpen(true);
    try {
      const response = await axios.get(`/api/agent/get_agent_system?agentId=${activeAgent.id}&action=list`);
      setSystemFiles(response.data.files || []);
    } catch (error) {
      console.error('Error fetching system files:', error);
    }
  };

  const handleSelectSystemFile = async (fileName) => {
    try {
      const response = await axios.get(`/api/agent/get_agent_system?agentId=${activeAgent.id}&file=${fileName}`);
      setSystemFileContent(response.data.content);
      setEditedContent(response.data.content);
      setSelectedSystemFile(fileName);
      setIsSystemModalOpen(false);
    } catch (error) {
      console.error('Error reading system file:', error);
    }
  };

  const handleSaveSystemFile = async () => {
    try {
      const response = await axios.post('/api/agent/edit_agent_system', {
        agentId: activeAgent.id,
        fileName: selectedSystemFile,
        content: editedContent
      });

      if (response.data.success) {
        setSystemFileContent(editedContent);
        setIsEditingSystem(false);
      }
    } catch (error) {
      console.error('Error saving system file:', error);
      alert('Failed to save system file.');
    }
  };
  
  function getRouteName(){
    const pathSplit = path.split("/")
    const currentPath = pathSplit[pathSplit.length - 1]
    if(currentPath !== "agents") return currentPath
    return "Agent Board"
  }


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
      <div className="relative">

        <div className='mb-4 bp9:hidden'>
          <div className='mb-1 py-0 flex items-center gap-3'>
            <div className='w-10 h-10 rounded-full bg-layer3 flex items-center justify-center text-lg'>
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-hat-glasses preview-icon"><path d="M14 18a2 2 0 0 0-4 0"/><path d="m19 11-2.11-6.657a2 2 0,0 0-2.752-1.148l-1.276.61A2 2 0 0 1 12 4H8.5a2 2 0 0 0-1.925 1.456L5 11"/><path d="M2 11h20"/><circle cx="17" cy="18" r="3"/><circle cx="7" cy="18" r="3"/></svg>
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
            className={`cursor-pointer flex justify-between items-center gap-3 mt-4 rounded-full bg-layer w-full py-4 px-6`}
          >
            <div className='flex justify-center items-center gap-3'>
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-hat-glasses preview-icon"><path d="M14 18a2 2 0 0 0-4 0"/><path d="m19 11-2.11-6.657a2 2 0 0 0-2.752-1.148l-1.276.61A2 2 0 0 1 12 4H8.5a2 2 0 0 0-1.925 1.456L5 11"/><path d="M2 11h20"/><circle cx="17" cy="18" r="3"/><circle cx="7" cy="18" r="3"/></svg>
              <p>{getRouteName()}</p>
            </div>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chevron-down preview-icon"><path d="m6 9 6 6 6-6"/></svg>
          </div>
        </div>

        <div
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
              <div className='flex gap-3'>
                <div className='min-w-10 max-w-10 min-h-10 max-h-10 rounded-full bg-layer3 flex items-center justify-center text-lg'>
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-hat-glasses preview-icon"><path d="M14 18a2 2 0 0 0-4 0"/><path d="m19 11-2.11-6.657a2 2 0,0 0-2.752-1.148l-1.276.61A2 2 0 0 1 12 4H8.5a2 2 0 0 0-1.925 1.456L5 11"/><path d="M2 11h20"/><circle cx="17" cy="18" r="3"/><circle cx="7" cy="18" r="3"/></svg>
                </div>
                <div>
                    <h2 className='text-[13px] font-semibold text-white tracking-tight'>{activeAgent.name}</h2>
                    <p className='text-[12px] opacity-70'>{activeAgent.description}</p>
                </div>
              </div>

              {
                activeAgent.name==="orchestrator"?
                null:
                <div onClick={() => setApproveDelete(!approveDelete)} className='min-w-10 min-h-10 ml-auto rounded-full bg-surface cursor-pointer flex items-center justify-center'>
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trash preview-icon"><path d="M10 11v6"/><path d="M14 11v6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M3 6h18"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                </div>
              }
            </div>
            <div className='px-2 overflow-y-auto flex-1 custom-scrollbar'>
                <div className='bg-surface w-full h-auto p-3 rounded-[13px] mb-4'>
                    <p className='px-3s mb-2'>Model</p>
                    <div
                      onClick={handleOpenModelSelector}
                      className='cursor-pointer w-full bg-layer2 rounded-[7px] flex justify-between items-center p-3 py-2 hover:bg-layer3 transition-colors'
                    >
                        <p>{activeAgent.model || "Not set"}</p>
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chevron-down preview-icon"><path d="m6 9 6 6 6-6"/></svg>
                    </div>
                </div>
                
                <div className='bg-surface w-full h-auto rounded-[13px] mb-4 p-3'>
                    <div onClick={() => setShowSystemSelector(!showSystemSelector)} className='cursor-pointer flex justify-between items-center'>
                        <p className='px-3s'>Agent System</p>
                        {
                          !showSystemSelector?
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chevron-down preview-icon"><path d="m6 9 6 6 6-6"/></svg>:
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chevron-up preview-icon"><path d="m18 15-6-6-6 6"/></svg>
                        }
                    </div>
                    {
                      showSystemSelector?
                      <>
                        <div
                          onClick={handleOpenSystemSelector}
                          className='cursor-pointer w-full bg-layer2 rounded-[7px] flex justify-between items-center p-3 py-2 mt-3'
                        >
                            <p>{selectedSystemFile || "Select System File"}</p>
                            <div>
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chevron-down preview-icon"><path d="m6 9 6 6 6-6"/></svg>
                            </div>
                        </div>
                        <div className='w-full bg-layer2 rounded-[12px] p-3 mt-3'>
                            <div className='mt-3s'>
                                <div className='flex justify-between items-center mb-3'>
                                    <h1 className='font-semibold text-[12px]'>{selectedSystemFile || "Agent Identity"}</h1>
                                    <div onClick={() => setIsEditingSystem(!isEditingSystem)} className='cursor-pointer'>
                                      {
                                        !isEditingSystem ?
                                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-square-pen preview-icon"><path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z"/></svg>:
                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-x preview-icon"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                                      }
                                    </div>
                                </div>
                                <div className='w-full'>
                                  {isEditingSystem ? (
                                    <textarea
                                      value={editedContent}
                                      onChange={(e) => setEditedContent(e.target.value)}
                                      className='w-full bg-layer3 text-[12px] opacity-70 p-2 rounded-[7px] min-h-[230px] outline-none border border-border-subtle'
                                    />
                                  ) : (
                                    <p className='text-[12px] opacity-70 whitespace-pre-wrap'>{systemFileContent || activeAgent.role}</p>
                                  )}
                                </div>
                                <div
                                  onClick={handleSaveSystemFile}
                                  className={`w-full py-2 cursor-pointer flex justify-center ${!isEditingSystem ? "hidden" : ""} items-center mt-3 bg-layer rounded-[9px] hover:bg-layer3 transition-colors`}
                                >
                                  <p className='text-[13px] opacity-90'>Update</p>
                                </div>
                            </div>
                        </div>
                      </>:
                      null
                    }
                </div>

                <div className='bg-surface w-full h-auto rounded-[13px] mb-4 cursor-pointer p-3'>
                    <div onClick={()=>{setShowSystemSelector2(!showSystemSelector2)}} className='flex justify-between items-center'>
                        <p className='px-3s'>Tasks</p>
                        {
                          !showSystemSelector2?
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chevron-down preview-icon"><path d="m6 9 6 6 6-6"/></svg>:
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chevron-up preview-icon"><path d="m18 15-6-6-6 6"/></svg>
                        }
                    </div>
                    {
                      showSystemSelector2?
                      <>
                        {
                          all_agent_tasks.map((cat, index)=>{
                            return (
                              <Fragment key={index}>
                                <div 
                                  onClick={()=>{set_task_categories((prev)=>{
                                    return {...prev, [cat.name]: !task_categories[cat.name]}
                                  })}} 
                                  className='cursor-pointer w-full bg-layer2 rounded-[7px] flex justify-between items-center p-3 py-2 mt-3'
                                >
                                    <p>{cat.name}</p> {/* name of category */}
                                    {
                                      !task_categories[cat.name]?
                                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" backdrop-fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chevron-down preview-icon"><path d="m6 9 6 6 6-6"/></svg>:
                                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chevron-up preview-icon"><path d="m18 15-6-6-6 6"/></svg>
                                    }
                                </div>
                                {
                                  !task_categories[cat.name]?
                                  null:
                                  <div className='mt-3'>
                                      {
                                        cat.tasks.map((item, index)=>{
                                          return (
                                            <div key={index} className='w-full bg-layer3 rounded-[12px] p-4 mb-3'>
                                                <div className='flex justify-between items-center mb-3'>
                                                    <h1 className='font-semibold text-[12px]'>Title of this task</h1> 
                                                    <p className='font-semibold text-[9px] opacity-90'>9:39PM--12/03/2024</p> {/* time of creation */}
                                                </div>
                                                <p className='text-[12px] opacity-95'>
                                                    {/* Task Description */}  Human-in-the-Loop (HITL) Intervention: Tracking how often a human had to correct the agent or provide approval.Tracking how often a human had to correct the agent or provide approval.
                                                </p>
                                                <div className='cursor-pointer w-full bg-layer2 rounded-[7px] flex justify-center items-center p-3 py-2 mt-3'>
                                                    <p>Delete</p>
                                                </div>
                                            </div>
                                          )
                                        })
                                      }
                                  </div>
                                }
                              </Fragment>
                            )
                          })
                        }
                      </>:
                      null
                    }
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

      {isModelModalOpen && (
        <div className='fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4'>
          <div className='bg-layer2 border border-border-subtle rounded-2xl w-full max-w-[400px] max-h-[80vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200'>
            <div className='p-4 border-b border-border-subtle flex justify-between items-center'>
              <h2 className='text-sm font-semibold text-white'>Select Agent Model</h2>
              <button
                onClick={() => setIsModelModalOpen(false)}
                className='text-text-secondary hover:text-white transition-colors'
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 6L6 18" /><path d="m6 6 12 12" />
                </svg>
              </button>
            </div>
            <div className='p-2 overflow-y-auto flex-1 custom-scrollbar'>
              {isLoadingModels ? (
                <div className='flex justify-center items-center py-10 text-sm text-text-secondary opacity-50'>
                  Loading models from Ollama...
                </div>
              ) : availableModels.length > 0 ? (
                availableModels.map((model, idx) => (
                  <div
                    key={idx}
                    onClick={() => handleSelectModel(model.name)}
                    className={`w-full h-auto rounded-[7px] cursor-pointer ${activeAgent.model === model.name ? "bg-layer3 border border-border-subtle" : "hover:bg-layer3"} px-3 py-3 my-1 transition-all duration-200 flex justify-between items-center`}
                  >
                    <div className='flex flex-col'>
                      <span className='text-sm text-white font-medium'>{model.name}</span>
                      {model.details && (
                        <span className='text-[10px] text-text-secondary opacity-60'>
                          {model.details.parameter_size} | {model.details.quantization_level}
                        </span>
                      )}
                    </div>
                    {activeAgent.model === model.name && (
                      <div className='w-2 h-2 rounded-full bg-accent' />
                    )}
                  </div>
                ))
              ) : (
                <div className='text-center py-10 text-sm text-text-secondary opacity-50'>
                  No models found on Ollama.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {
        isModalOpen ? (
          <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4'>
            <div className='bg-layer2 border border-border-subtle rounded-2xl w-full max-w-[350px] max-h-[80vh] flex flex-col overflow-hidden'>
              <div className='p-4 border-b border-border-subtle flex justify-between items-center'>
                <h2 className='text-sm font-semibold text-white'>
                  Choose an Agent
                </h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className='text-text-secondary hover:text-white transition-colors cursor-pointer'
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 6L6 18" /><path d="m6 6 12 12" />
                  </svg>
                </button>
              </div>

              <div className='p-2 overflow-y-auto flex-1 custom-scrollbar'>
                <AgentList 
                  env={"modal"}
                  closeModal={() => setIsModalOpen(false)}
                />
              </div>
            </div>
          </div>
        ) : null
      }

      {isSystemModalOpen && (
        <div className='fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4'>
          <div className='bg-layer2 border border-border-subtle rounded-2xl w-full max-w-[400px] max-h-[80vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200'>
            <div className='p-4 border-b border-border-subtle flex justify-between items-center'>
              <h2 className='text-sm font-semibold text-white'>Agent System Files</h2>
              <button
                onClick={() => setIsSystemModalOpen(false)}
                className='text-text-secondary hover:text-white transition-colors'
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 6L6 18" /><path d="m6 6 12 12" />
                </svg>
              </button>
            </div>
            <div className='p-2 overflow-y-auto flex-1 custom-scrollbar'>
              {systemFiles.length > 0 ? (
                systemFiles.map((file, idx) => (
                  <div
                    key={idx}
                    onClick={() => handleSelectSystemFile(file)}
                    className={`w-full h-auto rounded-[7px] cursor-pointer ${selectedSystemFile === file ? "bg-layer3 border border-border-subtle" : "hover:bg-layer3"} px-3 py-3 my-1 transition-all duration-200 flex justify-between items-center`}
                  >
                    <span className='text-sm text-white font-medium'>{file}</span>
                    {selectedSystemFile === file && (
                      <div className='w-2 h-2 rounded-full bg-accent' />
                    )}
                  </div>
                ))
              ) : (
                <div className='text-center py-10 text-sm text-text-secondary opacity-50'>
                  No system files found.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {
        isChatModalOpen ? (
          <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4'>
            <div className='bg-layer2 border border-border-subtle rounded-2xl w-full max-w-[350px] max-h-[80vh] flex flex-col overflow-hidden'>
              <div className='p-4 border-b border-border-subtle flex justify-between items-center'>
                <h2 className='text-sm font-semibold text-white'>
                  Agent Chat
                </h2>
                <button
                  onClick={() => setIsChatModalOpen(!isChatModalOpen)}
                  className='text-text-secondary hover:text-white transition-colors cursor-pointer'
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 6L6 18" /><path d="m6 6 12 12" />
                  </svg>
                </button>
              </div>

              <div className='p-2 overflow-y-auto flex-1 custom-scrollbar'>
                <AgentChatWindow
                    onClose={() => {}}
                    agentId={activeAgent.id}
                    agentName={activeAgent.name}
                />
              </div>
            </div>
          </div>
        ) : null
      }

      {
        approveDelete ? (
          <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4'>
            <div className='bg-layer2 border border-border-subtle rounded-2xl w-full max-w-[350px] max-h-[80vh] flex flex-col overflow-hidden'>
              <div className='p-4 border-b border-border-subtle flex justify-between items-center'>
                <h2 className='text-sm font-semibold text-white'>
                  Confirm Delete
                </h2>
                <button
                  onClick={() => setApproveDelete(!approveDelete)}
                  className='text-text-secondary hover:text-white transition-colors cursor-pointer'
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 6L6 18" /><path d="m6 6 12 12" />
                  </svg>
                </button>
              </div>

              <div className='p-2 flex flex-col'>
                <p className='text-center'>Are you sure you want to delete this agent ({activeAgent.name})?</p>
                <div className='flex justify-evenly items-center mt-5'>
                  <div
                    onClick={async () => {
                      try {
                        const response = await axios.post('/api/agent/delete_agent', {
                          agentId: activeAgent.id
                        });
                        if (response.data.success) {
                          router.push('/agents');
                        }
                      } catch (error) {
                        console.error('Error deleting agent:', error);
                        alert('Failed to delete agent.');
                      }
                    }}
                    className='center py-1.5 cursor-pointer px-7 bg-layer3 rounded-full'
                  >
                    <p>Yes</p>
                  </div>

                  <div onClick={() => setApproveDelete(!approveDelete)} className='center py-1.5 cursor-pointer px-7 bg-layer3 rounded-full'>
                    <p>No</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : null
      }

      {/* <OnboardingModal
        isOpen={isOnboardingOpen}
        onClose={() => setIsOnboardingOpen(false)}
        agentId={activeAgent?.id}
        agentName={activeAgent?.name}
      /> */}

      <div onClick={() => setIsChatModalOpen(!isChatModalOpen)} className='fixed w-14 h-14 bp7:hidden rounded-full bg-layer3 bottom-4 right-4 flex justify-center items-center cursor-pointer hover:bg-layer transition-colors'>
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-message-circle preview-icon opacity-70"><path d="M2.992 16.342a2 2 0 0 1 .094 1.167l-1.065 3.29a1 1 0 0 0 1.236 1.168l3.413-.998a2 2 0 0 1 1.099.092 10 10 0 1 0-4.777-4.719"/></svg>
      </div>

    </DashboardLayout>
  );
}

import DashboardLayout from '@/components/DashboardLayout';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';

function createAgent(props) {
  const [h, useH] = useState(0);
  const { navHeight } = useSelector((state) => state.general);
  const [agentDescription, setAgentDescription] = useState("")
  const [agentName, setAgentName] = useState("")

  // Model selection state
  const [isModelModalOpen, setIsModelModalOpen] = useState(false);
  const [availableModels, setAvailableModels] = useState([]);
  const [isLoadingModels, setIsLoadingModels] = useState(false);
  const [selectedModel, setSelectedModel] = useState("gemma4:31b-cloud");

  const [isCreating, setIsCreating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressStatus, setProgressStatus] = useState("");
  const [progressDetail, setProgressDetail] = useState("");

  useEffect(() => {
    const hd = innerHeight - navHeight - 55;
    useH(hd);
  }, [navHeight]);

  const handleCreateAgent = async () => {
    if (!agentName || !agentDescription || !selectedModel) {
      alert("Please fill in all fields.");
      return;
    }

    setIsCreating(true);
    setProgress(0);
    setProgressStatus("");
    setProgressDetail("");

    try {
      const response = await fetch('/api/agent/create_agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          agentName,
          agentDescription,
          selectedModel
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create agent");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        let buffer = chunk;

        // Split by SSE delimiter and handle fragmented chunks
        const lines = buffer.split('\\n\\n');

        // If the last line is not empty, it might be a fragmented JSON
        // We keep it in a state variable if we were using a class/hook,
        // but here we can just process the complete ones.
        // For a more robust solution, we'd use a buffer outside the loop.

        for (let i = 0; i < lines.length; i++) {
          const line = lines[i];
          if (!line) continue;

          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.replace('data: ', ''));
              if (data.error) throw new Error(data.error);

              setProgress(data.percentage);
              setProgressStatus(data.status);
              setProgressDetail(data.detail);

              if (data.percentage === 100) {
                setTimeout(() => {
                //   window.location.href = `/agents/${agentName.toLowerCase().replace(/\\s+/g, '_').replace(/[^a-z0-9_]/g, '')}`;
                  window.location.href = `/agents/${agentName.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '')}`;
                //   window.location.href = `/agents`;
                }, 1000);
              }
            } catch (e) {
              console.error("Error parsing progress chunk", e);
            }
          }
        }
      }
    } catch (error) {
      alert(error.message);
      setIsCreating(false);
    }
  };

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

  const handleSelectModel = (modelName) => {
    setSelectedModel(modelName);
    setIsModelModalOpen(false);
  };

  return (
    <div className="relative">
        <DashboardLayout activePill="New Agent" where="Agents">
            <div style={{justifyContent: "flex-start"}} className='w-full h-auto center flex-col'>
                {
                    isCreating ? (
                        <div className='w-full max-w-120 flex flex-col items-center justify-center my-4 p-4 bg-layer2 rounded-[13px] border border-border-subtle animate-in fade-in slide-in-from-top-2 duration-300'>
                            <div className='w-full bg-layer3 rounded-full h-2 mb-3 overflow-hidden'>
                                <div
                                    className='bg-accent h-full transition-all duration-300 ease-out'
                                    style={{ width: `${progress}%` }}
                                />
                            </div>
                            <p className='text-[13px] font-semibold text-white'>{progress}% completed</p>
                            <p className='text-[11px] opacity-60 text-center mt-1'>{progressStatus}</p>
                            <p className='text-[11px] opacity-40 text-center'>{progressDetail}</p>
                        </div>
                    ):
                    <div />
                }

                <div style={{height:h}} className='bg-surface w-full max-w-120 rounded-[15px] p-0'>
                    <div className='flex justify-left my-4 items-center w-full gap-3 px-4'>
                        <div className='w-11 h-11 rounded-full bg-layer3 flex items-center justify-center text-lg'>
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-hat-glasses preview-icon"><path d="M14 18a2 2 0 0 0-4 0"/><path d="m19 11-2.11-6.657a2 2 0,0 0-2.752-1.148l-1.276.61A2 2 0 0 1 12 4H8.5a2 2 0 0 0-1.925 1.456L5 11"/><path d="M2 11h20"/><circle cx="17" cy="18" r="3"/><circle cx="7" cy="18" r="3"/></svg>
                        </div>
                        <div>
                            <h2 className='text-[13px] font-semibold text-white tracking-tight'>New Agent</h2>
                            <p className='text-[12px] opacity-70 '>Create a new agent for a specific task</p>
                        </div>
                    </div>

                    <div style={{height: h-140}} className='w-full overflow-y-auto p-4'>

                        <div className=' w-full h-auto p-4 rounded-[13px] mb-4 bg-layer'>
                            <p className='px-3s mb-2'> Agent Model</p>
                            <div
                                onClick={handleOpenModelSelector}
                                className='cursor-pointer w-full bg-layer2 rounded-[7px] flex justify-between items-center p-3 py-2 hover:bg-layer3 transition-colors'
                            >
                                <p>{selectedModel}</p>
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chevron-down preview-icon"><path d="m6 9 6 6 6-6"/></svg>
                            </div>
                        </div>

                        <div className='w-full mb-4'>
                            <p className='px-3s mb-2'>Agent Name</p>
                            <input
                                value={agentName}
                                onChange={(e) => setAgentName(e.target.value)}
                                placeholder='Name of agent'
                                className='w-full bg-layer3 text-[13px]  p-4 rounded-[11px] h-[40px] outline-none border border-border-subtle'
                            />
                        </div>

                        <div className='w-full mb-4'>
                            <p className='px-3s mb-2'>Agent Description</p>
                            <textarea
                                value={agentDescription}
                                onChange={(e) => setAgentDescription(e.target.value)}
                                placeholder='Give a desription of who and what this age is and is to do'
                                className='w-full bg-layer3 text-[13px]  p-4 rounded-[15px] min-h-[200px] outline-none border border-border-subtle'
                            />
                        </div>
                    </div>

                    <div className='px-4 mb-4 w-full'>
                        {isCreating ? (
                            <div
                                className={`w-full py-2 cursor-pointer flex justify-center items-center mt-3 bg-layer rounded-[9px] hover:bg-layer3 transition-colors`}
                            >
                                <p className='text-[13px] opacity-90'>Creating Agent...</p>
                            </div>
                        ) : (
                            <div
                                onClick={handleCreateAgent}
                                className={`w-full py-2 cursor-pointer flex justify-center items-center mt-3 bg-layer rounded-[9px] hover:bg-layer3 transition-colors`}
                            >
                                <p className='text-[13px] opacity-90'>Create</p>
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </DashboardLayout>

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
                      className={`w-full h-auto rounded-[7px] cursor-pointer ${selectedModel === model.name ? "bg-layer3 border border-border-subtle" : "hover:bg-layer3"} px-3 py-3 my-1 transition-all duration-200 flex justify-between items-center`}
                    >
                      <div className='flex flex-col'>
                        <span className='text-sm text-white font-medium'>{model.name}</span>
                        {model.details && (
                          <span className='text-[10px] text-text-secondary opacity-60'>
                            {model.details.parameter_size} | {model.details.quantization_level}
                          </span>
                        )}
                      </div>
                      {selectedModel === model.name && (
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
    </div>
  );
}

export default createAgent;
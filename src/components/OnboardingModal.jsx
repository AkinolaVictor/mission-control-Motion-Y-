import React, { useState } from 'react';
import Modal from './Modal';
import AgentChatWindow from './AgentChat/AgentChatWindow';
import axios from 'axios';

const OnboardingModal = ({ isOpen, onClose, agentId, agentName }) => {
  const [step, setStep] = useState('chat'); // 'chat' | 'summary'
  const [planData, setPlanData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handlePlanReceived = (data) => {
    // This function will be called when the orchestrator provides the final structured plan
    setPlanData(data);
    setStep('summary');
  };

  const handleReplan = () => {
    setStep('chat');
  };

  const handleDone = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post('/api/agent/agent_ability_setup', {
        agentId,
        plan: planData,
      });
      if (response.status === 200) {
        onClose();
      }
    } catch (error) {
      console.error('Setup Error:', error);
      alert('Failed to complete agent setup. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={step === 'chat' ? `${agentName} Setup` : 'Review Implementation Plan'}
    >
      {step === 'chat' ? (
        <div className="h-[60vh] w-full">
          <AgentChatWindow
            agentId={agentId}
            agentName={agentName}
            endpointKey="setup"
            // We'll need a way for AgentChatWindow to notify us when a plan is generated.
            // For now, we can assume the Orchestrator sends a specific trigger or
            // the user can manually transition.
            // In a real scenario, we might add an onPlanGenerated prop to AgentChatWindow.
          />
          <div className="mt-4 flex justify-end">
            <button
              onClick={() => setStep('summary')}
              className="px-4 py-2 bg-zinc-800 text-white rounded-xl hover:bg-zinc-700 transition-colors text-sm"
            >
              Review Plan
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="bg-layer3 p-6 rounded-2xl border border-border-subtle">
            <h3 className="text-lg font-semibold mb-4 text-white">Proposed Capabilities</h3>
            {planData ? (
              <div className="space-y-4">
                <div className="text-text-secondary text-sm">
                  {JSON.stringify(planData, null, 2)}
                </div>
              </div>
            ) : (
              <p className="text-text-secondary text-sm italic">
                No structured plan detected yet. Please continue chatting with the Orchestrator to finalize the requirements.
              </p>
            )}
          </div>

          <div className="flex justify-between items-center">
            <button
              onClick={handleReplan}
              className="px-4 py-2 text-text-secondary hover:text-white transition-colors text-sm"
            >
              Replan
            </button>
            <button
              onClick={handleDone}
              disabled={isLoading}
              className="px-6 py-2 bg-white text-black rounded-xl hover:bg-zinc-200 transition-colors text-sm font-medium disabled:opacity-50 flex items-center gap-2"
            >
              {isLoading && <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />}
              {isLoading ? 'Setting up...' : 'Done'}
            </button>
          </div>
        </div>
      )}
    </Modal>
  );
};

export default OnboardingModal;

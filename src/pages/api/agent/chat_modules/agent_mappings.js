import { chatWithDevto_content_creator } from './../../../../../agents/devto_content_creator/devto_content_creator';
import { chatWithResearcher } from './../../../../../agents/researcher/researcher';
import { chatWithOrchestrator } from './../../../../../agents/orchestrator/orchestrator';

export const agentMappings = {
  devto_content_creator: chatWithDevto_content_creator,
  researcher: chatWithResearcher,
  orchestrator: chatWithOrchestrator,
};
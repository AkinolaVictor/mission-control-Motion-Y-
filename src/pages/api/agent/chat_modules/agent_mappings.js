import { chatWithResearcher } from './../../../../../agents/researcher/researcher';
import { chatWithOrchestrator } from './../../../../../agents/orchestrator/orchestrator';
import { chatWithMotionDev } from './../../../../../agents/motion_dev/motion_dev';

export const agentMappings = {
  researcher: chatWithResearcher,
  orchestrator: chatWithOrchestrator,
  motion_dev: chatWithMotionDev,
};
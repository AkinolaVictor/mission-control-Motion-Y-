import { chatWithOrchestrator } from './../../../../../agents/orchestrator/functions/orchestrator_chat';
import { chatWithMotionDev } from './../../../../../agents/motion_dev/functions/motion_dev_chat';

export const agentMappings = {
  orchestrator: chatWithOrchestrator,
  motion_dev: chatWithMotionDev,
};
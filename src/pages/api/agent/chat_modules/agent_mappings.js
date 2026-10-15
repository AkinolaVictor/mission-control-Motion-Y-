import { chatWithContent_creator } from './../../../../../agents/content_creator/content_creator';
import { chatWithOrchestrator } from './../../../../../agents/orchestrator/orchestrator';
import { chatWithMotionDev } from './../../../../../agents/motion_dev/motion_dev';

export const agentMappings = {
  content_creator: chatWithContent_creator,
  orchestrator: chatWithOrchestrator,
  motion_dev: chatWithMotionDev,
};
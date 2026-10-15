import { chatWithNew_changes } from './../../../../../agents/new_changes/new_changes';
import { chatWithContent_creator } from './../../../../../agents/content_creator/functions/content_creator_chat';
import { chatWithOrchestrator } from './../../../../../agents/orchestrator/functions/orchestrator_chat';
import { chatWithMotionDev } from './../../../../../agents/motion_dev/functions/motion_dev_chat';

export const agentMappings = {
  new_changes: chatWithNew_changes,
  content_creator: chatWithContent_creator,
  orchestrator: chatWithOrchestrator,
  motion_dev: chatWithMotionDev,
};
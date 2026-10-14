import { chatWithTester_rocket } from './../../../../../agents/tester_rocket/functions/tester_rocket_chat';
import { chatWithDeleter } from './../../../../../agents/deleter/functions/deleter_chat';
import { chatWithRead_and_document } from './../../../../../agents/read_and_document/functions/read_and_document_chat';
import { chatWithMore_dev_tests } from './../../../../../agents/more_dev_tests/functions/more_dev_tests_chat';
import { chatWithPhysics_principles } from './../../../../../agents/physics_principles/functions/physics_principles_chat';
import { chatWithRews } from './../../../../../agents/rews/functions/rews_chat';
import { chatWithOrchestrator } from './../../../../../agents/orchestrator/functions/orchestrator_chat';
import { chatWithMotionDev } from './../../../../../agents/motion_dev/functions/motion_dev_chat';

export const agentMappings = {
  tester_rocket: chatWithTester_rocket,
  deleter: chatWithDeleter,
  read_and_document: chatWithRead_and_document,
  more_dev_tests: chatWithMore_dev_tests,
  physics_principles: chatWithPhysics_principles,
  rews: chatWithRews,
  orchestrator: chatWithOrchestrator,
  motion_dev: chatWithMotionDev,
};
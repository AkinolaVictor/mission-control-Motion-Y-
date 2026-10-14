import { chatWithSwqd } from './../../../../../agents/swqd/functions/swqd_chat';
import { chatWithGdrere } from './../../../../../agents/gdrere/functions/gdrere_chat';
// import { chatWithSddq } from './../../../../../agents/sddq/functions/sddq_chat';
// import { chatWithDwas_gr } from './../../../../../agents/dwas_gr/functions/dwas_gr_chat';
// import { chatWithDdr } from './../../../../../agents/ddr/functions/ddr_chat';
// import { chatWithVve } from './../../../../../agents/vve/functions/vve_chat';
// import { chatWithHelloworld } from './../../../../../agents/helloworld/functions/helloworld_chat';
import { chatWithDdse } from './../../../../../agents/ddse/functions/ddse_chat';
import { chatWithOrchestrator } from './../../../../../agents/orchestrator/functions/orchestrator_chat';
import { chatWithMotionDev } from './../../../../../agents/motion_dev/functions/motion_dev_chat';
import { chatWithTest_chat } from './../../../../../agents/test_chat/functions/test_chat_chat';

export const agentMappings = {
  swqd: chatWithSwqd,
  gdrere: chatWithGdrere,
  orchestrator: chatWithOrchestrator,
  motion_dev: chatWithMotionDev,
  test_chat: chatWithTest_chat,
  ddse: chatWithDdse,
  // test3: chatWithTest3,
  // trying_to_know: chatWithTrying_to_know,
};
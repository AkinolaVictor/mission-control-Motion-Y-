import fs from 'fs/promises';
import path from 'path';
import axios from 'axios';

/**
 * Task Assigner for the Orchestrator Agent.
 * Routes user prompts to the most qualified agent and ensures prompt completeness.
 */
export async function task_assigner(assigned_task) {
  const { prompt } = assigned_task;

  if (!prompt) {
    throw new Error('Missing mandatory prop: prompt is required in assigned_task.');
  }

  const agentsBaseDir = path.join(process.cwd(), 'agents');
  const orchestratorMetadataPath = path.join(agentsBaseDir, 'orchestrator', 'metadata.json');

  try {
    // 1. Read Orchestrator Metadata (Fresh)
    const orchMetadataContent = await fs.readFile(orchestratorMetadataPath, 'utf8');
    const orchMetadata = JSON.parse(orchMetadataContent);
    const model = orchMetadata.model;

    // 2. Dynamic Agent Discovery (Fresh Scan)
    const allFolders = await fs.readdir(agentsBaseDir, { withFileTypes: true });
    const agents = [];

    for (const folder of allFolders) {
      if (!folder.isDirectory()) continue;

      const metaPath = path.join(agentsBaseDir, folder.name, 'metadata.json');
      try {
        const metaContent = await fs.readFile(metaPath, 'utf8');
        const meta = JSON.parse(metaContent);
        agents.push({
          id: meta.id,
          role: meta.role,
          description: meta.description,
          prototype: meta.task_state_prototype
        });
      } catch (e) {
        // Skip folders without metadata.json
        continue;
      }
    }

    // 3. Agent Qualification via LLM
    const agentCapabilitiesList = agents.map(a => `- ${a.id}: ${a.role} (${a.description})`).join('\\n');

    const qualificationPrompt = `
You are the System Orchestrator. Your goal is to assign a user request to the most qualified agent.

USER REQUEST:
"${prompt}"

AVAILABLE AGENTS:
${agentCapabilitiesList}

INSTRUCTIONS:
1. Analyze the user request.
2. Identify which agent is most capable of handling this task based on their roles and descriptions.
3. If a suitable agent is found, return ONLY the agent's ID (e.g., "researcher").
4. If no suitable agent is found, return "NONE".
`;

    const qualResponse = await axios.post('http://localhost:11434/api/chat', {
      model: model,
      messages: [
        { role: 'system', content: 'You are a precise routing system. Return only the ID of the qualified agent or "NONE".' },
        { role: 'user', content: qualificationPrompt }
      ],
      stream: false
    });

    const qualifiedAgentId = qualResponse.data.message.content.trim().toLowerCase();

    if (qualifiedAgentId === 'none' || !agents.find(a => a.id === qualifiedAgentId)) {
      const capabilitiesMessage = agents.map(a => `${a.id}: ${a.role}`).join('\\n');
      return `No suitable agent found for this task. Available agents and their capabilities:\\n${capabilitiesMessage}`;
    }

    const qualifiedAgent = agents.find(a => a.id === qualifiedAgentId);
    const prototype = qualifiedAgent.prototype;

    // 4. Context Validation via LLM
    const validationPrompt = `
You are the Task Validator. You must determine if the user's prompt contains all the information required to fill a task state object.

USER REQUEST:
"${prompt}"

REQUIRED TASK STATE PROTOTYPE:
${JSON.stringify(prototype, null, 2)}

INSTRUCTIONS:
1. Compare the user request against the prototype.
2. Check if the prompt provides enough specific context to populate all mandatory fields in the prototype.
3. Return "VALID" if the prompt is sufficient.
4. Return "INVALID" if information is missing.

Return ONLY "VALID" or "INVALID".
`;

    const valResponse = await axios.post('http://localhost:11434/api/chat', {
      model: model,
      messages: [
        { role: 'system', content: 'You are a strict validation system. Return only "VALID" or "INVALID".' },
        { role: 'user', content: validationPrompt }
      ],
      stream: false
    });

    if (valResponse.data.message.content.trim().toUpperCase() !== 'VALID') {
      return "prompt does not contain all the requirement to create this task, please create a prompt that has all i need to create the task";
    }

    // 5. Dynamic Task Delegation
    // Refine the prompt into a detailed research/task assignment string
    const refinementPrompt = `
Refine the following user request into a detailed technical assignment string that provides all necessary context for a task creator.

USER REQUEST:
"${prompt}"

TARGET AGENT: ${qualifiedAgentId}
PROTOTYPE: ${JSON.stringify(prototype)}

The result should be a single, comprehensive string containing all necessary requirements, goals, and constraints.
`;

    const refResponse = await axios.post('http://localhost:11434/api/chat', {
      model: model,
      messages: [
        { role: 'system', content: 'You are a prompt engineer. Refine the request into a detailed assignment string.' },
        { role: 'user', content: refinementPrompt }
      ],
      stream: false
    });

    const refinedPrompt = refResponse.data.message.content.trim();

    // Dynamically import and call the task_creator of the qualified agent
    const taskCreatorModule = await import(`${path.join(process.cwd(), 'agents', qualifiedAgentId, 'functions', 'task_creator.js')}`);
    const task_creator = taskCreatorModule.task_creator;

    const result = await task_creator({ prompt: refinedPrompt });

    return result;

  } catch (error) {
    console.error('Task Assigner Error:', error.message);
    throw error;
  }
}

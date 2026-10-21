
import fs from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import axios from 'axios';

const OLLAMA_URL = 'http://localhost:11434/api/chat';

async function readJSON(filePath) {
  const content = await fs.readFile(filePath, 'utf8');
  return JSON.parse(content);
}

async function chatOllama(model, systemPrompt, userPrompt) {
  const response = await axios.post(
    OLLAMA_URL,
    {
      model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      stream: false
    },
    { timeout: 180000 }
  );

  const content = response.data?.message?.content;

  if (typeof content !== 'string' || !content.trim()) {
    throw new Error('Ollama returned an empty or invalid response.');
  }

  return content.trim();
}

export async function task_assigner({ prompt } = {}) {
  if (typeof prompt !== 'string' || !prompt.trim()) {
    throw new Error('A non-empty prompt string is required.');
  }

  const agentsBaseDir = path.resolve(process.cwd(), 'agents');

  try {
    // 1. Load the orchestrator model.
    const orchestratorMetadata = await readJSON(
      path.join(agentsBaseDir, 'orchestrator', 'metadata.json')
    );

    const model = orchestratorMetadata.model;

    if (!model) {
      throw new Error(
        'The orchestrator metadata.json does not specify a model.'
      );
    }

    // 2. Discover agents and their task-state prototypes.
    const folders = await fs.readdir(agentsBaseDir, {
      withFileTypes: true
    });

    const agents = [];

    for (const folder of folders) {
      if (!folder.isDirectory() || folder.name === 'orchestrator') {
        continue;
      }

      const agentDir = path.join(agentsBaseDir, folder.name);
      const metadataPath = path.join(agentDir, 'metadata.json');

      try {
        const metadata = await readJSON(metadataPath);

        if (!metadata.task_state_prototype) {
          console.warn(
            `Skipping ${folder.name}: missing task_state_prototype.`
          );
          continue;
        }

        agents.push({
          id: folder.name,
          role: metadata.role ?? folder.name,
          description: metadata.description ?? '',
          prototype: metadata.task_state_prototype,
          agentDir
        });
      } catch (error) {
        console.warn(
          `Skipping agent "${folder.name}": ${error.message}`
        );
      }
    }

    if (agents.length === 0) {
      throw new Error('No agents with valid task-state prototypes found.');
    }

    // 3. Find the most suitable agent.
    const capabilities = agents.map(agent => ({
      id: agent.id,
      role: agent.role,
      description: agent.description
    }));

    const routingResponse = await chatOllama(
      model,
      `You are an agent-routing system.
Choose the single best agent for the user's request.
Return ONLY valid JSON in this format:
{"agent_id":"researcher"}
If no agent is suitable, return:
{"agent_id":"NONE"}
Do not invent agent IDs.`,
      JSON.stringify({
        user_request: prompt,
        available_agents: capabilities
      })
    );

    let routing;

    try {
      const cleaned = routingResponse
        .replace(/^```(?:json)?\s*/i, '')
        .replace(/\s*```$/, '');

      routing = JSON.parse(cleaned);
    } catch {
      throw new Error(
        `Could not parse the routing response: ${routingResponse}`
      );
    }

    const qualifiedAgent = agents.find(
      agent => agent.id === routing.agent_id
    );

    if (!qualifiedAgent) {
      const availableAgents = agents
        .map(agent =>
          `${agent.id}: ${agent.role}. ${agent.description}`
        )
        .join('\n');

      return (
        'No suitable agent found for this task.\n\n' +
        'Available agents and their capabilities:\n' +
        availableAgents
      );
    }

    // 4. Validate the request against the selected agent's prototype.
    const validationResponse = await chatOllama(
      model,
      `You validate whether a user request contains enough information
to create a task state for a specific agent.

Treat the prototype as a schema of required task-state fields.
Identify which fields genuinely require information from the user.
A field may be derived from the request only when the derivation is
unambiguous. Do not invent missing values.

Return ONLY valid JSON:
{"valid":true,"missing_fields":[]}
or
{"valid":false,"missing_fields":["field_name"]}

If the prototype's requirements cannot be determined, fail closed
and report the uncertain fields as missing.`,
      JSON.stringify({
        user_request: prompt,
        agent_id: qualifiedAgent.id,
        task_state_prototype: qualifiedAgent.prototype
      })
    );

    let validation;

    try {
      const cleaned = validationResponse
        .replace(/^```(?:json)?\s*/i, '')
        .replace(/\s*```$/, '');

      validation = JSON.parse(cleaned);
    } catch {
      throw new Error(
        `Could not parse validation response: ${validationResponse}`
      );
    }

    if (
      validation.valid !== true ||
      !Array.isArray(validation.missing_fields) ||
      validation.missing_fields.length > 0
    ) {
      const missing = Array.isArray(validation.missing_fields)
        ? validation.missing_fields
        : [];

      return (
        'The prompt does not contain all the information needed ' +
        'to create this task.\n' +
        'Please provide the missing information and try again.' +
        (missing.length
          ? `\nMissing information: ${missing.join(', ')}`
          : '')
      );
    }

    // 5. Refine the prompt without inventing information.
    const refinedPrompt = await chatOllama(
      model,
      `You prepare task-assignment prompts for another agent's
task_creator function.

Convert the user's request into one comprehensive, clear string
that contains the information needed to populate the supplied
task-state prototype.

Preserve all supplied facts, requirements, constraints and values.
Do not invent details, claim actions have been performed, or change
the user's intent. Return only the refined prompt string.`,
      JSON.stringify({
        user_request: prompt,
        target_agent: qualifiedAgent.id,
        task_state_prototype: qualifiedAgent.prototype
      })
    );

    // 6. Import and execute the selected agent's task_creator.
    const creatorPath = path.join(
      qualifiedAgent.agentDir,
      'functions',
      'task_creator.js'
    );

    await fs.access(creatorPath);

    const creatorModule = await import(
      pathToFileURL(creatorPath).href
    );

    const task_creator =
      creatorModule.task_creator ?? creatorModule.default;

    if (typeof task_creator !== 'function') {
      throw new Error(
        `${creatorPath} must export task_creator or a default function.`
      );
    }

    return await task_creator({ prompt: refinedPrompt });

  } catch (error) {
    console.error('[task_assigner] Error:', error);
    throw error;
  }
}

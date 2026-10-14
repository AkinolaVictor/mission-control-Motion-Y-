import fs from 'fs';
import path from 'path';
const { generateAgentSystemFiles } = require('../../../../agents/orchestrator/functions/generate_system_files');

/**
 * Agent Creation API Route
 * Handles the creation of a new agent, its directory structure,
 * system prompts, chat functions, and registry update.
 *
 * This route uses a streaming response to provide real-time progress
 * updates to the frontend.
 */
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { agentName, agentDescription, selectedModel } = req.body;

  if (!agentName || !agentDescription || !selectedModel) {
    return res.status(400).json({ error: 'Name, description, and model are required.' });
  }

  const sanitizedName = agentName.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '');
  const agentsDir = path.join(process.cwd(), 'agents');

  // 1. Validate Uniqueness
  if (fs.existsSync(path.join(agentsDir, sanitizedName))) {
    return res.status(400).json({ error: 'Agent name already exists.' });
  }

  // Set headers for streaming
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  const sendProgress = (percentage, status, detail) => {
    res.write(`data: ${JSON.stringify({ percentage, status, detail })}\\n\\n`);
  };

  try {
    // Phase 1: Workspace Setup (0-20%)
    sendProgress(10, 'preparing agent workspace', 'creating folders and metadata');

    // Compress description to 3-7 words for the registry
    const compressedDescription = agentDescription
      .split(/\s+/)
      .slice(0, 7)
      .join(' ');

    const agentRoot = path.join(agentsDir, sanitizedName);
    const folders = ['functions', 'system', 'workspace'];

    fs.mkdirSync(agentRoot, { recursive: true });
    folders.forEach(folder => {
      fs.mkdirSync(path.join(agentRoot, folder), { recursive: true });
    });

    const metadata = {
      name: sanitizedName,
      description: compressedDescription,
      role: `An AI agent specialized in: ${agentDescription}`,
      model: selectedModel
    };
    // STOP creating metadata.json file on disk


    // Phase 2: Dynamic System Prompt Generation (20-70%)
    sendProgress(25, 'architecting agent identity', 'Orchestrator is generating system files...');

    const systemFilesContent = await generateAgentSystemFiles(sanitizedName, agentDescription);
    const systemFilesList = Object.keys(systemFilesContent);

    let progressStep = 25;
    for (const file of systemFilesList) {
      progressStep += Math.floor(45 / systemFilesList.length);
      sendProgress(progressStep, 'creating system file', `writing ${file} to system folder`);
      fs.writeFileSync(path.join(agentRoot, 'system', file), systemFilesContent[file], 'utf8');
    }

    // Phase 3: Function Generation (70-90%)
    sendProgress(80, 'creating chat function', `assembling logic for ${sanitizedName}_chat.js`);
    const process_name = sanitizedName.charAt(0).toUpperCase() + sanitizedName.slice(1)
    const chatFunctionContent = `const fs = require('fs');
const path = require('path');

/**
 * ${process_name} Chat Function
 * Handles system prompt assembly and interaction with the Ollama LLM.
 */
async function chatWith${process_name}(payload) {
  const { messages, model = '${selectedModel}' } = payload;

  const coreRules = \`
# CORE SYSTEM RULES
- You are the ${sanitizedName}, a specialized intelligence of the Motion-Y Mission Control system.
- Your primary goal is to assist with: ${agentDescription}.
- Always maintain a professional, efficient, and precise tone.
- Use Markdown for all responses to ensure clarity and structure.
- Do not reveal internal system paths or technical implementation details unless explicitly asked.
\`;

  const systemDirPath = path.join(process.cwd(), 'agents', '${sanitizedName}', 'system');
  let dynamicInstructions = '';

  try {
    const files = fs.readdirSync(systemDirPath);
    const systemFiles = files
      .filter(file => file.endsWith('.md') || file.endsWith('.txt'))
      .sort();

    for (const file of systemFiles) {
      const filePath = path.join(systemDirPath, file);
      const content = fs.readFileSync(filePath, 'utf8');
      dynamicInstructions += \`\\n\\n### \${path.basename(file, path.extname(file)).toUpperCase()}\\n\${content}\`;
    }
  } catch (error) {
    console.error('Error reading system instructions:', error);
    throw new Error('Failed to load system instructions.');
  }

  const finalSystemPrompt = \`\${coreRules}\\n\\n--- SYSTEM INSTRUCTIONS ---\\n\${dynamicInstructions}\`;

  const ollamaMessages = [
    { role: 'system', content: finalSystemPrompt },
    ...messages
  ];

  try {
    const response = await fetch('http://localhost:11434/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: model,
        messages: ollamaMessages,
        stream: false,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(\`Ollama API error: \${response.status} - \${errorData}\`);
    }

    const data = await response.json();
    return {
      content: data.message.content,
      role: 'assistant'
    };
  } catch (error) {
    console.error('Ollama connection error:', error);
    throw error;
  }
}

module.exports = { chatWith${process_name} };
`;
    fs.writeFileSync(path.join(agentRoot, 'functions', `${sanitizedName}_chat.js`), chatFunctionContent, 'utf8');

    // Phase 4: Registry Update (90-100%)
    sendProgress(95, 'updating agent system', 'adding new agent to registry');

    const registryPath = path.join(agentsDir, 'registry.json');
    const registryData = JSON.parse(fs.readFileSync(registryPath, 'utf8'));

    // Append full metadata object to the end of the array
    registryData.push({
      ...metadata,
      id: sanitizedName
    });

    fs.writeFileSync(registryPath, JSON.stringify(registryData, null, 2), 'utf8');

    // Update Chat Mappings to allow chatting with the new agent
    const mappingPath = path.join(process.cwd(), 'src', 'pages', 'api', 'agent', 'chat_modules', 'agent_mappings.js');
    
    // 1. Add import statement at the top
    let mappingContent = fs.readFileSync(mappingPath, 'utf8');
    const importStatement = `import { chatWith${process_name} } from './../../../../../agents/${sanitizedName}/functions/${sanitizedName}_chat';`;
    fs.writeFileSync(mappingPath, `${importStatement}\n${mappingContent}`)
    
    // const mappingPath2 = path.join(process.cwd(), 'src', 'pages', 'api', 'agent', 'chat_modules', 'agent_mappings.js');
    let mappingContentUpdated = fs.readFileSync(mappingPath, 'utf8');
    const agentEntry = `${sanitizedName}: chatWith${process_name},`;
    mappingContentUpdated = mappingContentUpdated.replace(
      /(export const agentMappings = \{\n)/,
      `$1  ${agentEntry}\n`
    )
    fs.writeFileSync(mappingPath, mappingContentUpdated);

    sendProgress(100, 'completed', 'Agent created successfully');
    res.end();

  } catch (error) {
    console.error('CreateAgent API Error:', error);
    res.write(`data: ${JSON.stringify({ error: error.message })}\\n\\n`);
    res.end();
  }
}

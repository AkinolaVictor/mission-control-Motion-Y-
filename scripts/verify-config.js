import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function verify() {
  console.log('🚀 Starting Consolidated Agent Registry Verification...');

  try {
    // 1. Syntax Check
    console.log('Checking config.js syntax...');
    // Use dynamic import for ESM files in Node
    const config = await import('../agents/config.js');
    if (!config || !config.agent_config || !Array.isArray(config.agent_config.agents)) {
      throw new Error('Invalid agent_config structure: agents array not found.');
    }
    console.log('✅ config.js syntax is valid.');

    // 2. Orchestrator Order Check
    const firstAgent = config.agent_config.agents[0];
    if (!firstAgent || firstAgent.id !== 'orchestrator') {
      throw new Error(`Orchestrator must be the first agent. Found: ${firstAgent ? firstAgent.id : 'none'}`);
    }
    console.log('✅ Orchestrator is at the top of the list.');

    // 3. Registry Field Integrity Check
    console.log('Checking registry.json content...');
    const registryPath = path.resolve(__dirname, '../agents/registry.json');
    const registry = JSON.parse(fs.readFileSync(registryPath, 'utf8'));

    for (const agent of registry) {
      if (!agent.id || !agent.name || !agent.description || !agent.role || !agent.model) {
        throw new Error(`Agent ${agent.id || 'unknown'} is missing required metadata fields.`);
      }
    }
    console.log('✅ All registry entries have required metadata.');

    console.log('\n✨ Registry verification successful! All checks passed.');
  } catch (error) {
    console.error('\n❌ Verification FAILED:');
    console.error(error.stack || error.message);
    process.exit(1);
  }
}

verify();

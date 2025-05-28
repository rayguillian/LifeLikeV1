import { DeepseekAgent } from './DeepseekAgent.js';

export class WorldGenerator extends DeepseekAgent {
  async loadSchema() {
    const response = await fetch('/src/schemas/worldSchema.json');
    return await response.json();
  }

  async generateWorld() {
    const schema = await this.loadSchema();
    // Use schema here
  }
  constructor() {
    super(
      'WorldGenerator',
      'You are an expert world generation AI. Create rich, detailed worlds with coherent histories, cultures, and ecosystems.'
    );
  }

  async generateWorld(prompt) {
    return this.callAPI(prompt, worldSchema);
  }
}
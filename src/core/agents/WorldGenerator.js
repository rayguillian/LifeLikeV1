import { DeepseekAgent } from './DeepseekAgent';
import worldSchema from '../schemas/worldSchema.json';

export class WorldGenerator extends DeepseekAgent {
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
import { DeepseekAgent } from './DeepseekAgent.js';

export class EventGenerator extends DeepseekAgent {
  async loadSchema() {
    const response = await fetch('/src/schemas/eventSchema.json');
    return await response.json();
  }

  async generateEvent() {
    const schema = await this.loadSchema();
    // Use schema here
  }
  constructor() {
    super(
      'EventGenerator',
      'You are an expert event generation AI. Create impactful, meaningful events that shape worlds and narratives.'
    );
  }

  async generateEvent(prompt) {
    return this.callAPI(prompt, eventSchema);
  }

  async generateEventChain(prompt, count = 3) {
    const chainPrompt = `${prompt}\n\nGenerate ${count} connected events that form a coherent sequence.`;
    return this.callAPI(chainPrompt, {
      type: 'array',
      items: eventSchema
    });
  }
}
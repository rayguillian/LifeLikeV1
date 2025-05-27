import { DeepseekAgent } from './DeepseekAgent';
import eventSchema from '../schemas/eventSchema.json';

export class EventGenerator extends DeepseekAgent {
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
import { DeepseekAgent } from './DeepseekAgent';
import characterSchema from '../schemas/characterSchema.json';

export class CharacterCreator extends DeepseekAgent {
  constructor() {
    super(
      'CharacterCreator',
      'You are an expert character creation AI. Generate detailed, believable characters with rich backstories and personalities.'
    );
  }

  async createCharacter(prompt) {
    return this.callAPI(prompt, characterSchema);
  }

  async createCharacterGroup(prompt, count = 3) {
    const groupPrompt = `${prompt}\n\nGenerate ${count} distinct characters that would exist together in this context.`;
    return this.callAPI(groupPrompt, {
      type: 'array',
      items: characterSchema
    });
  }
}
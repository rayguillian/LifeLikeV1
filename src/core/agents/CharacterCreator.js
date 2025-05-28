import { DeepseekAgent } from './DeepseekAgent.js';

export class CharacterCreator extends DeepseekAgent {
  async loadSchema() {
    const response = await fetch('/src/schemas/characterSchema.json');
    return await response.json();
  }

  async generateCharacter() {
    const schema = await this.loadSchema();
    // Use schema here
  }
  constructor() {
    super(
      'CharacterCreator',
      'You are an expert character creation AI. Generate detailed, believable characters with rich backstories and personalities.'
    );
  }

  async createCharacter(prompt) {
    const character = await this.callAPI(prompt, characterSchema);
    character.dimensional_signature = this.generateDimensionalId();
    character.memories = [];
    character.stats = character.stats || {};
    character.stats.dimensional_stability = 0.9; // Default stability
    return character;
  }

  async createCharacterGroup(prompt, count = 3) {
    const groupPrompt = `${prompt}\n\nGenerate ${count} distinct characters that would exist together in this context.`;
    const characters = await this.callAPI(groupPrompt, {
      type: 'array',
      items: characterSchema
    });
    
    return characters.map(char => {
      char.dimensional_signature = this.generateDimensionalId();
      char.memories = [];
      char.stats = char.stats || {};
      char.stats.dimensional_stability = 0.9;
      return char;
    });
  }
}

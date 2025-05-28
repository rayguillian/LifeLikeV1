import { DeepseekAgent } from './DeepseekAgent.js';

export class DialogueCreator extends DeepseekAgent {
  async loadSchema() {
    const response = await fetch('/src/schemas/dialogueSchema.json');
    return await response.json();
  }

  async generateDialogue() {
    const schema = await this.loadSchema();
    // Use schema here
  }
  constructor() {
    super(
      'DialogueCreator',
      'You are an expert dialogue writer. Create natural, character-appropriate conversations that advance narratives.'
    );
  }

  async createDialogue(prompt) {
    return this.callAPI(prompt, dialogueSchema);
  }

  async createMultiSceneDialogue(prompt, scenes = 2) {
    const scenePrompt = `${prompt}\n\nCreate ${scenes} connected dialogue scenes that form a coherent conversation arc.`;
    return this.callAPI(scenePrompt, {
      type: 'array',
      items: dialogueSchema
    });
  }
}
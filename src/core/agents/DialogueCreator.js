import { DeepseekAgent } from './DeepseekAgent';
import dialogueSchema from '../schemas/dialogueSchema.json';

export class DialogueCreator extends DeepseekAgent {
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
import { WorldGenerator } from './agents/WorldGenerator';
import { CharacterCreator } from './agents/CharacterCreator';
import { EventGenerator } from './agents/EventGenerator';
import { DialogueCreator } from './agents/DialogueCreator';

const worldGenerator = new WorldGenerator();
const characterCreator = new CharacterCreator();
const eventGenerator = new EventGenerator();
const dialogueCreator = new DialogueCreator();

export const LLMService = {
  async generateWorld(prompt) {
    return worldGenerator.generateWorld(prompt);
  },

  async createCharacter(prompt) {
    return characterCreator.createCharacter(prompt);
  },

  async createCharacterGroup(prompt, count = 3) {
    return characterCreator.createCharacterGroup(prompt, count);
  },

  async generateEvent(prompt) {
    return eventGenerator.generateEvent(prompt);
  },

  async generateEventChain(prompt, count = 3) {
    return eventGenerator.generateEventChain(prompt, count);
  },

  async createDialogue(prompt) {
    return dialogueCreator.createDialogue(prompt);
  },

  async createMultiSceneDialogue(prompt, scenes = 2) {
    return dialogueCreator.createMultiSceneDialogue(prompt, scenes);
  }
};
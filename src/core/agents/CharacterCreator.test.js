import { CharacterCreator } from './CharacterCreator.js';

describe('CharacterCreator', () => {
  let creator;

  beforeEach(() => {
    creator = new CharacterCreator();
  });

  test('should generate valid character structure', async () => {
    const character = await creator.generateCharacter();
    expect(character).toHaveProperty('name');
    expect(character).toHaveProperty('traits');
    expect(character).toHaveProperty('background');
  });

  test('should generate unique characters', async () => {
    const char1 = await creator.generateCharacter();
    const char2 = await creator.generateCharacter();
    expect(char1.name).not.toBe(char2.name);
  });

  test('should generate characters with valid traits', async () => {
    const character = await creator.generateCharacter();
    expect(character.traits.length).toBeGreaterThan(0);
    character.traits.forEach(trait => {
      expect(trait).toHaveProperty('name');
      expect(trait).toHaveProperty('value');
    });
  });

  test('should generate characters with coherent background', async () => {
    const character = await creator.generateCharacter();
    expect(character.background.length).toBeGreaterThan(0);
    expect(character.background).toMatch(/[a-zA-Z]/);
  });

  test('should include dimensional signature', async () => {
    const character = await creator.createCharacter('test');
    expect(character.dimensional_signature).toBeDefined();
    expect(typeof character.dimensional_signature).toBe('string');
  });

  test('should initialize empty memories array', async () => {
    const character = await creator.createCharacter('test');
    expect(Array.isArray(character.memories)).toBe(true);
    expect(character.memories.length).toBe(0);
  });

  test('should set default dimensional stability', async () => {
    const character = await creator.createCharacter('test');
    expect(character.stats.dimensional_stability).toBeDefined();
    expect(character.stats.dimensional_stability).toBe(0.9);
  });
});

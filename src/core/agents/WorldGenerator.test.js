import { WorldGenerator } from './WorldGenerator.js';

describe('WorldGenerator', () => {
  let generator;

  beforeEach(() => {
    generator = new WorldGenerator();
  });

  test('should generate valid world structure', async () => {
    const world = await generator.generateWorld();
    expect(world).toHaveProperty('name');
    expect(world).toHaveProperty('description');
    expect(world).toHaveProperty('locations');
    expect(world).toHaveProperty('characters');
    expect(world).toHaveProperty('events');
  });

  test('should generate world with consistent locations', async () => {
    const world = await generator.generateWorld();
    expect(world.locations.length).toBeGreaterThan(0);
    world.locations.forEach(location => {
      expect(location).toHaveProperty('name');
      expect(location).toHaveProperty('description');
    });
  });

  test('should generate world with initial events', async () => {
    const world = await generator.generateWorld();
    expect(world.events.length).toBeGreaterThan(0);
  });

  test('should generate world with starting characters', async () => {
    const world = await generator.generateWorld();
    expect(world.characters.length).toBeGreaterThan(0);
    world.characters.forEach(character => {
      expect(character).toHaveProperty('name');
      expect(character).toHaveProperty('location');
    });
  });
});
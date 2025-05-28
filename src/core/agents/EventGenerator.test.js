import { EventGenerator } from './EventGenerator.js';

describe('EventGenerator', () => {
  let generator;

  beforeEach(() => {
    generator = new EventGenerator();
  });

  test('should generate valid event structure', async () => {
    const event = await generator.generateEvent();
    expect(event).toHaveProperty('id');
    expect(event).toHaveProperty('type');
    expect(event).toHaveProperty('description');
    expect(event).toHaveProperty('timestamp');
  });

  test('should generate events with increasing timestamps', async () => {
    const event1 = await generator.generateEvent();
    const event2 = await generator.generateEvent();
    expect(event2.timestamp).toBeGreaterThan(event1.timestamp);
  });

  test('should generate events of specified types', async () => {
    const event = await generator.generateEvent('combat');
    expect(event.type).toBe('combat');
  });

  test('should generate events with related characters', async () => {
    const characters = [{id: 1, name: 'Test'}, {id: 2, name: 'Test2'}];
    const event = await generator.generateEvent('dialogue', characters);
    expect(event.participants).toContain(characters[0].id);
    expect(event.participants).toContain(characters[1].id);
  });
});
import { NarrativeMemory } from './NarrativeMemory.js';

describe('NarrativeMemory', () => {
  let memory;

  beforeEach(() => {
    memory = new NarrativeMemory();
  });

  test('should initialize with empty structures', () => {
    expect(memory.memory.events).toHaveLength(0);
    expect(Object.keys(memory.memory.relationships)).toHaveLength(0);
    expect(Object.keys(memory.memory.timelines)).toHaveLength(0);
    expect(memory.memory.playerDecisions).toHaveLength(0);
  });

  test('should record and retrieve events', async () => {
    const event = {
      type: 'test',
      description: 'Test event',
      timestamp: Date.now()
    };
    await memory.recordEvent(event);
    const recent = memory.getRecentEvents();
    expect(recent).toContainEqual(event);
  });

  test('should update character relationships', async () => {
    const event = {
      type: 'CHARACTER_INTERACTION',
      characters: [{id: 'char1'}, {id: 'char2'}],
      timestamp: Date.now()
    };
    await memory.recordEvent(event);
    const relationships = memory.getCharacterRelationships('char1');
    expect(relationships).toHaveLength(1);
    expect(relationships[0].strength).toBe(0.1);
  });

  test('should get recent events', async () => {
    for (let i = 0; i < 10; i++) {
      await memory.recordEvent({
        type: 'test',
        description: `Event ${i}`,
        timestamp: Date.now()
      });
    }
    
    const recent = memory.getRecentEvents(5);
    expect(recent).toHaveLength(5);
    expect(recent[0].description).toBe('Event 9');
  });
});
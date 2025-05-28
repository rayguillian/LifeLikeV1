import { AIGameMaster } from './AIGameMaster.js';

describe('AIGameMaster', () => {
  let gameMaster;

  beforeEach(() => {
    gameMaster = new AIGameMaster();
  });

  test('should initialize with empty state', () => {
    expect(gameMaster.worldState).toBeDefined();
    expect(gameMaster.narrativeMemory).toBeDefined();
  });

  test('should generate initial world state', async () => {
    await gameMaster.initializeWorld();
    expect(gameMaster.worldState).not.toBeNull();
  });

  test('should progress narrative', async () => {
    await gameMaster.initializeWorld();
    const initialEvents = gameMaster.worldState.events.length;
    await gameMaster.progressNarrative();
    expect(gameMaster.worldState.events.length).toBeGreaterThan(initialEvents);
  });
});
import { describe, test, expect, beforeEach, jest } from 'vitest';
import WorldState from './worldState';

describe('WorldState System', () => {
  let world;

  beforeEach(() => {
    world = new WorldState();
  });

  test('should initialize with default state', () => {
    expect(world.getProperty('timeline')).toBe('normal');
    expect(world.getProperty('properties.reality_stability')).toBeCloseTo(0.85);
  });

  test('should allow property access via path', () => {
    world.setProperty('properties.magic_level', 0.5);
    expect(world.getProperty('properties.magic_level')).toBe(0.5);
  });

  test('should notify listeners on property change', () => {
    const mockListener = jest.fn();
    const unsubscribe = world.addListener(mockListener);

    world.setProperty('properties.tech_level', 0.8);
    expect(mockListener).toHaveBeenCalledWith({
      path: 'properties.tech_level',
      newValue: 0.8,
      oldValue: 0.7,
      worldId: world.state.id,
      timestamp: expect.any(Number)
    });

    unsubscribe();
  });

  test('should add timeline branches', () => {
    world.addTimelineBranch('ai_singularity', 'technological', 0.1);
    expect(world.state.possible_branches).toContainEqual({
      trigger: 'ai_singularity',
      timeline: 'technological',
      probability: 0.1,
      id: expect.any(String)
    });
  });

  test('should evolve world state', () => {
    const initialStability = world.getProperty('properties.reality_stability');
    world.evolve();
    const newStability = world.getProperty('properties.reality_stability');
    expect(newStability).not.toBe(initialStability);
    expect(newStability).toBeGreaterThanOrEqual(0);
    expect(newStability).toBeLessThanOrEqual(1);
  });

  test('should serialize and deserialize', () => {
    const json = world.toJSON();
    const newWorld = WorldState.fromJSON(json);
    expect(newWorld.state).toEqual(world.state);
  });

  test('should handle timeline branching', () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    world.addTimelineBranch('test_event', 'alternate', 1.0);
    world.evolve();
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('Timeline changed to alternate')
    );
    consoleSpy.mockRestore();
  });
});
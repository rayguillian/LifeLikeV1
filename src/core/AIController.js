import { AIGameMaster } from './agents/AIGameMaster.js';
import { NarrativeMemory } from './agents/NarrativeMemory.js';
import { PerformanceTracker } from './performanceTracker.js';
import WorldState from './worldState.js';

export class AIController {
  constructor() {
    try {
      this.worldState = new WorldState();
      this.gameMaster = new AIGameMaster({ worldState: this.worldState });
      this.memory = new NarrativeMemory();
      this.subscribers = [];
      this.isRunning = false;
      this.performance = new PerformanceTracker();
    } catch (error) {
      console.error('Failed to initialize AIController:', error);
      throw new Error(`AIController initialization failed: ${error.message}`);
    }
  }

  async initialize() {
    const startTime = performance.now();
    this.performance.trackAgentCall('AIGameMaster');
    try {
      await this.gameMaster.initializeWorld();
      this.isRunning = true;
      this.notifySubscribers();
    } catch (error) {
      console.error('Failed to initialize AI controller:', error);
      this.isRunning = false;
      throw new Error(`AI initialization failed: ${error.message}`);
    } finally {
      this.performance.trackResponseTime(startTime);
      this.performance.trackMemoryUsage();
    }
  }

  async progressStory() {
    if (!this.isRunning) return;
    
    const startTime = performance.now();
    this.performance.trackAgentCall('AIGameMaster');
    try {
      await this.gameMaster.progressNarrative();
      const latestEvent = this.gameMaster.worldState.events.slice(-1)[0];
      this.performance.trackAgentCall('NarrativeMemory');
      await this.memory.recordEvent(latestEvent);
      this.notifySubscribers();
    } catch (error) {
      console.error('Story progression failed:', error);
      this.isRunning = false;
      this.notifySubscribers();
      throw new Error(`Story progression failed: ${error.message}`);
    } finally {
      this.performance.trackResponseTime(startTime);
      this.performance.trackMemoryUsage();
    }
  }

  subscribe(callback) {
    this.subscribers.push(callback);
    return () => {
      this.subscribers = this.subscribers.filter(sub => sub !== callback);
    };
  }

  notifySubscribers() {
    const state = this.getCurrentState();
    this.subscribers.forEach(callback => callback(state));
  }

  getCurrentState() {
    try {
      if (!this.gameMaster?.worldState) {
        throw new Error('Invalid world state');
      }
      
      return {
        worldState: this.gameMaster.worldState,
        recentEvents: this.memory?.summarizeRecent?.(5) || [],
        isRunning: this.isRunning,
        performance: this.performance?.getSummary?.() || {}
      };
    } catch (error) {
      console.error('Failed to get current state:', error);
      return {
        worldState: this.createFallbackWorldState(),
        recentEvents: [],
        isRunning: false,
        performance: {}
      };
    }
  }

  pause() {
    this.isRunning = false;
    this.notifySubscribers();
  }

  resume() {
    this.isRunning = true;
    this.notifySubscribers();
  }
  
    createFallbackWorldState() {
      try {
        return new WorldState();
      } catch (error) {
        console.error('Failed to create fallback WorldState:', error);
        return {
          state: {
            id: 'fallback-world',
            timeline: 'normal',
            properties: {
              reality_stability: 0.5,
              magic_level: 0.5,
              tech_level: 0.5,
              population: 0.5
            },
            possible_branches: [],
            characters: [],
            currentEvents: []
          },
          listeners: new Set(),
          gameLoopInterval: null,
          getProperty: () => 0.5,
          setProperty: () => {},
          addListener: () => () => {},
          notifyListeners: () => {}
        };
      }
    }
}
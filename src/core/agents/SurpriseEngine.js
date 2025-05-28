import { DeepseekAgent } from './DeepseekAgent';

export class SurpriseEngine {
  constructor() {
    this.deepseekAgent = new DeepseekAgent(
      'surprise-engine',
      'You create surprising but narratively coherent twists in a dynamic story.'
    );
    this.surpriseFrequency = 0.1; // 10% chance of surprise
    this.lastSurpriseTime = 0;
    this.cooldown = 30000; // 30 seconds minimum between surprises
  }

  async checkForSurprise(worldState, narrativeMemory) {
    // Check cooldown and random chance
    const now = Date.now();
    if (now - this.lastSurpriseTime < this.cooldown || 
        Math.random() > this.surpriseFrequency) {
      return null;
    }

    // Analyze recent events for surprise opportunities
    const recentEvents = narrativeMemory.getRecentEvents(5);
    const prompt = this.buildPrompt(worldState, recentEvents);
    
    const surprise = await this.deepseekAgent.callAPI(
      prompt,
      require('../schemas/surpriseSchema.json')
    );

    if (surprise) {
      this.lastSurpriseTime = now;
      this.adjustFrequency(surprise.intensity);
    }

    return surprise;
  }

  buildPrompt(worldState, recentEvents) {
    return `
      Suggest a surprising narrative twist based on:
      Current World State: ${JSON.stringify(worldState.getProperty('properties'))}
      Recent Events: ${JSON.stringify(recentEvents)}
      
      Requirements:
      - Should be unexpected but logically follow from recent events
      - Should create new narrative opportunities
      - Should not completely invalidate player choices
      - Intensity should match current story pace
      - Include both immediate and long-term effects
    `;
  }

  adjustFrequency(intensity) {
    // Make future surprises more likely after intense events
    this.surpriseFrequency = Math.min(0.3, 
      this.surpriseFrequency + (intensity * 0.05));
  }

  async generateForeshadowing(narrativeMemory) {
    const prompt = `
      Generate subtle foreshadowing hints for upcoming surprises based on:
      Narrative History: ${JSON.stringify(narrativeMemory.getRecentEvents(10))}
      
      Requirements:
      - Should be subtle and only recognizable in hindsight
      - Should appear in dialogue or environmental details
      - Should not reveal the exact nature of future events
    `;

    return this.deepseekAgent.callAPI(
      prompt,
      require('../schemas/foreshadowingSchema.json')
    );
  }

  toJSON() {
    return JSON.stringify({
      frequency: this.surpriseFrequency,
      lastTime: this.lastSurpriseTime
    });
  }

  static fromJSON(json) {
    const engine = new SurpriseEngine();
    const data = JSON.parse(json);
    engine.surpriseFrequency = data.frequency;
    engine.lastSurpriseTime = data.lastTime;
    return engine;
  }
}
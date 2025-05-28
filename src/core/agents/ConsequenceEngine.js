import { DeepseekAgent } from './DeepseekAgent';

export class ConsequenceEngine {
  constructor() {
    this.deepseekAgent = new DeepseekAgent(
      'consequence-engine',
      'You generate realistic consequences for player actions in a dynamic world.'
    );
    this.consequenceCache = new Map();
  }

  async generateConsequences(event, playerImpact) {
    // Check cache first
    const cacheKey = this.getCacheKey(event, playerImpact);
    if (this.consequenceCache.has(cacheKey)) {
      return this.consequenceCache.get(cacheKey);
    }

    // Generate new consequences
    const prompt = this.buildPrompt(event, playerImpact);
    const consequences = await this.deepseekAgent.callAPI(
      prompt,
      require('../schemas/consequenceSchema.json')
    );

    // Cache results
    this.consequenceCache.set(cacheKey, consequences);
    return consequences;
  }

  getCacheKey(event, playerImpact) {
    return `${event.type}-${JSON.stringify(event)}-${playerImpact.playStyle}`;
  }

  buildPrompt(event, playerImpact) {
    return `
      Generate consequences for this event:
      Type: ${event.type}
      Details: ${JSON.stringify(event)}
      
      Player Profile:
      Style: ${playerImpact.playStyle}
      Risk Tolerance: ${playerImpact.riskTolerance}
      Content Preferences: ${JSON.stringify(playerImpact.contentPreferences)}
      
      Consider:
      - Logical cause-and-effect relationships
      - Player's preferred content types
      - Maintaining narrative coherence
      - Gradual world evolution
    `;
  }

  clearCache() {
    this.consequenceCache.clear();
  }

  async generateLongTermConsequences(narrativeMemory) {
    const prompt = `
      Analyze this narrative history and suggest long-term consequences:
      ${JSON.stringify(narrativeMemory.getRecentEvents(10))}
      
      Consider:
      - Character relationship developments
      - World state trends
      - Player behavior patterns
    `;

    return this.deepseekAgent.callAPI(
      prompt,
      require('../schemas/longTermConsequenceSchema.json')
    );
  }

  toJSON() {
    return JSON.stringify({
      cache: Array.from(this.consequenceCache.entries())
    });
  }

  static fromJSON(json) {
    const engine = new ConsequenceEngine();
    const data = JSON.parse(json);
    engine.consequenceCache = new Map(data.cache);
    return engine;
  }
}
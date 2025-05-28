import { DeepseekAgent } from './DeepseekAgent';

export class ChoiceGenerator {
  constructor() {
    this.deepseekAgent = new DeepseekAgent(
      'choice-generator',
      'You generate meaningful, contextual choices for players in a dynamic narrative.'
    );
  }

  async generateChoices(context, narrativeMemory, playerAnalyzer) {
    const playerProfile = await playerAnalyzer.analyzeImpact({ type: 'CHOICE_REQUEST' });
    const recentEvents = narrativeMemory.getRecentEvents(3);
    
    const prompt = this.buildPrompt(context, recentEvents, playerProfile);
    const choices = await this.deepseekAgent.callAPI(
      prompt,
      require('../schemas/choiceSchema.json')
    );

    return this.applyPlayerPreferences(choices, playerProfile);
  }

  buildPrompt(context, recentEvents, playerProfile) {
    return `
      Generate 3-5 choices for this context:
      Current Situation: ${context.description}
      Recent Events: ${JSON.stringify(recentEvents)}
      
      Player Preferences:
      Style: ${playerProfile.playStyle}
      Risk Tolerance: ${playerProfile.riskTolerance}
      Content Types: ${JSON.stringify(playerProfile.contentPreferences)}
      
      Requirements:
      - Each choice should have clear consequences
      - Include at least one high-risk/high-reward option
      - One choice should align with player's preferred style
      - Choices should follow from recent events
      - Vary the apparent difficulty levels
    `;
  }

  applyPlayerPreferences(choices, playerProfile) {
    return choices.map(choice => {
      // Score choice based on player preferences
      let score = 0;
      
      // Reward choices matching play style
      if (choice.style === playerProfile.playStyle) {
        score += 2;
      }
      
      // Reward preferred content types
      if (playerProfile.contentPreferences[choice.contentType]) {
        score += playerProfile.contentPreferences[choice.contentType];
      }
      
      // Adjust for risk tolerance
      if (playerProfile.riskTolerance > 0.7 && choice.riskLevel > 0.7) {
        score += 1;
      } else if (playerProfile.riskTolerance < 0.3 && choice.riskLevel < 0.3) {
        score += 1;
      }
      
      return {
        ...choice,
        preferenceScore: score
      };
    }).sort((a, b) => b.preferenceScore - a.preferenceScore);
  }

  async generateBranchingChoices(worldState, narrativeMemory) {
    const prompt = `
      Generate timeline branching choices based on:
      Current Timeline: ${worldState.getProperty('timeline')}
      World Properties: ${JSON.stringify(worldState.getProperty('properties'))}
      Narrative History: ${JSON.stringify(narrativeMemory.getTimelineHistory())}
      
      Requirements:
      - Each choice should lead to a distinct timeline
      - Include short-term and long-term consequences
      - Make the differences between timelines meaningful
    `;

    return this.deepseekAgent.callAPI(
      prompt,
      require('../schemas/branchingChoiceSchema.json')
    );
  }

  toJSON() {
    return JSON.stringify({});
  }

  static fromJSON() {
    return new ChoiceGenerator();
  }
}
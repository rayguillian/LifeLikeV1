export class PlayerAnalyzer {
  constructor() {
    this.playerProfile = {
      playStyle: 'neutral', // aggressive/passive/neutral
      decisionSpeed: 0, // 0-1 (slow-fast)
      riskTolerance: 0.5, // 0-1 (risk-averse to risk-seeking)
      preferredContent: {} // Map of content types to preference scores
    };
    this.decisionHistory = [];
  }

  async analyzeImpact(event) {
    if (event.type === 'PLAYER_DECISION') {
      this.recordDecision(event);
      await this.updatePlayerProfile();
    }

    return {
      playStyle: this.playerProfile.playStyle,
      riskTolerance: this.playerProfile.riskTolerance,
      contentPreferences: this.playerProfile.preferredContent
    };
  }

  recordDecision(decision) {
    this.decisionHistory.push({
      ...decision,
      timestamp: Date.now(),
      decisionTime: decision.timestamp - decision.presentedAt
    });
  }

  async updatePlayerProfile() {
    // Analyze last 10 decisions
    const recentDecisions = this.decisionHistory.slice(-10);
    
    // Calculate average decision time (normalized 0-1)
    if (recentDecisions.length > 0) {
      const avgTime = recentDecisions.reduce((sum, d) => sum + d.decisionTime, 0) / 
                     recentDecisions.length;
      this.playerProfile.decisionSpeed = Math.min(1, avgTime / 10000); // 10s max
    }

    // Calculate risk tolerance
    const riskyChoices = recentDecisions.filter(d => d.riskLevel > 0.7).length;
    this.playerProfile.riskTolerance = riskyChoices / recentDecisions.length || 0.5;

    // Determine play style
    const aggressiveActions = recentDecisions.filter(d => d.actionType === 'aggressive').length;
    const passiveActions = recentDecisions.filter(d => d.actionType === 'passive').length;
    
    if (aggressiveActions > passiveActions * 2) {
      this.playerProfile.playStyle = 'aggressive';
    } else if (passiveActions > aggressiveActions * 2) {
      this.playerProfile.playStyle = 'passive';
    } else {
      this.playerProfile.playStyle = 'neutral';
    }

    // Update content preferences
    recentDecisions.forEach(decision => {
      if (decision.contentType) {
        if (!this.playerProfile.preferredContent[decision.contentType]) {
          this.playerProfile.preferredContent[decision.contentType] = 0;
        }
        this.playerProfile.preferredContent[decision.contentType] += 
          decision.satisfaction * 0.1; // Weighted by satisfaction
      }
    });
  }

  getRecommendations() {
    return {
      preferredContentTypes: Object.entries(this.playerProfile.preferredContent)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 3)
        .map(([type]) => type),
      difficultyAdjustment: this.calculateDifficulty()
    };
  }

  calculateDifficulty() {
    // Scale difficulty based on player skill and preferences
    const baseDifficulty = 0.5;
    const speedFactor = this.playerProfile.decisionSpeed * 0.2;
    const riskFactor = this.playerProfile.riskTolerance * 0.3;
    return Math.min(1, Math.max(0, baseDifficulty + speedFactor + riskFactor));
  }

  toJSON() {
    return JSON.stringify({
      profile: this.playerProfile,
      history: this.decisionHistory
    });
  }

  static fromJSON(json) {
    const analyzer = new PlayerAnalyzer();
    const data = JSON.parse(json);
    analyzer.playerProfile = data.profile;
    analyzer.decisionHistory = data.history;
    return analyzer;
  }
}
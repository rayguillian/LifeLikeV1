import worldSchema from '../schemas/worldSchema.json';

export class LLMService {
  static async generateWorld(prompt = '') {
    // TODO: Replace with actual LLM API call
    // This is a mock implementation that follows the schema
    return {
      timeline: this.getRandomTimeline(),
      properties: {
        reality_stability: Math.random(),
        magic_level: Math.random(),
        tech_level: Math.random(),
        population: Math.random()
      },
      description: this.generateWorldDescription(),
      events: this.generateRandomEvents(),
      characters: this.generateRandomCharacters()
    };
  }

  static getRandomTimeline() {
    const timelines = worldSchema.properties.timeline.enum;
    return timelines[Math.floor(Math.random() * timelines.length)];
  }

  static generateWorldDescription() {
    const descriptors = [
      "A world where magic and technology coexist uneasily",
      "A dystopian future where reality is fragile",
      "A utopian society with perfect balance",
      "A post-apocalyptic wasteland with pockets of civilization",
      "A high-tech world where magic is forbidden"
    ];
    return descriptors[Math.floor(Math.random() * descriptors.length)];
  }

  static generateRandomEvents() {
    const count = Math.floor(Math.random() * 3) + 1;
    return Array.from({ length: count }, (_, i) => ({
      id: `event-${i}`,
      name: `Major Event ${i + 1}`,
      description: `A significant event that shaped this world`,
      impact: Math.random()
    }));
  }

  static generateRandomCharacters() {
    const count = Math.floor(Math.random() * 3) + 1;
    return Array.from({ length: count }, (_, i) => ({
      id: `char-${i}`,
      name: `Character ${i + 1}`,
      role: ['Hero', 'Villain', 'Neutral'][Math.floor(Math.random() * 3)],
      influence: Math.random()
    }));
  }
}
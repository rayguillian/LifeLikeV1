export default class WorldState {
  constructor() {
    this.state = {
      id: crypto.randomUUID(),
      timeline: 'normal',
      properties: {
        reality_stability: 0.85,
        magic_level: 0.3,
        tech_level: 0.7,
        population: 0.5
      },
      possible_branches: [],
      characters: [],
      currentEvents: []
    };
    this.listeners = new Set();
    this.gameLoopInterval = null;
  }

  startGameLoop(interval = 1000) {
    this.gameLoopInterval = setInterval(() => {
      this.generateEvents();
      this.updateWorld();
      this.notifyListeners({ type: 'GAME_TICK' });
    }, interval);
  }

  stopGameLoop() {
    if (this.gameLoopInterval) {
      clearInterval(this.gameLoopInterval);
      this.gameLoopInterval = null;
    }
  }

  getProperty(path) {
    const parts = path.split('.');
    let value = this.state;
    
    for (const part of parts) {
      value = value[part];
      if (value === undefined) return undefined;
    }
    
    return value;
  }

  setProperty(path, value) {
    const parts = path.split('.');
    let obj = this.state;
    
    for (let i = 0; i < parts.length - 1; i++) {
      const part = parts[i];
      if (!obj[part]) obj[part] = {};
      obj = obj[part];
    }
    
    const lastPart = parts[parts.length - 1];
    const oldValue = obj[lastPart];
    obj[lastPart] = value;
    
    this.notifyListeners({
      path,
      newValue: value,
      oldValue,
      worldId: this.state.id,
      timestamp: Date.now()
    });
  }

  addListener(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  notifyListeners(change) {
    for (const listener of this.listeners) {
      listener(change);
    }
  }

  addTimelineBranch(trigger, timeline, probability) {
    this.state.possible_branches.push({
      trigger,
      timeline,
      probability,
      id: crypto.randomUUID()
    });
  }

  evolve() {
    // Randomly adjust reality stability
    const currentStability = this.getProperty('properties.reality_stability');
    const newStability = Math.max(0, Math.min(1, 
      currentStability + (Math.random() * 0.1 - 0.05)
    ));
    this.setProperty('properties.reality_stability', newStability);

    // Check for timeline branches
    for (const branch of this.state.possible_branches) {
      if (Math.random() < branch.probability) {
        this.setProperty('timeline', branch.timeline);
        console.log(`Timeline changed to ${branch.timeline}`);
        break;
      }
    }
  }

  async generateEvents() {
    try {
      const events = await fetch('/api/generate-events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(this.state)
      }).then(res => res.json());
      
      this.state.currentEvents = events;
      this.notifyListeners({ type: 'NEW_EVENTS', events });
    } catch (error) {
      console.error('Event generation failed:', error);
    }
  }

  updateWorld() {
    // Update character states
    this.state.characters.forEach(character => {
      character.update(this.state);
    });

    // Evolve world properties
    this.evolve();
  }

  toJSON() {
    return JSON.stringify(this.state);
  }

  static fromJSON(json) {
    const world = new WorldState();
    world.state = JSON.parse(json);
    return world;
  }

  addCharacter(character) {
    this.state.characters.push(character);
    this.notifyListeners({ type: 'CHARACTER_ADDED', character });
  }
}
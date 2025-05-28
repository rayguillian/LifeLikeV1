/**
 * @typedef {Object} MemoryEvent
 * @property {string} type - Type of event (e.g. 'CHARACTER_INTERACTION')
 * @property {number} timestamp - When event occurred
 * @property {Object} [characters] - Array of character IDs involved
 * @property {string} [path] - Path being modified (for timeline events)
 * @property {*} [newValue] - New value being set
 */

/**
 * @typedef {Object} CharacterRelationship
 * @property {number} strength - Relationship strength (0-1)
 * @property {string} type - Relationship type (e.g. 'neutral')
 * @property {MemoryEvent[]} history - Interaction history
 */

/**
 * @typedef {Object} NarrativeMemoryData
 * @property {MemoryEvent[]} events - Recorded events
 * @property {Object.<string, CharacterRelationship>} relationships - Character relationships
 * @property {Object.<number, *>} timelines - Timeline snapshots
 * @property {Object[]} playerDecisions - Player decision history
 */

export class NarrativeMemory {
  /** @type {NarrativeMemoryData} */
  memory;

  /** @type {number} */
  maxEvents;

  constructor() {
    this.memory = {
      events: [],
      relationships: {},
      timelines: {},
      playerDecisions: []
    };
    this.maxEvents = 1000; // Prevent memory bloat
  }

  /**
   * Records an event in memory
   * @param {MemoryEvent} event - The event to record
   * @returns {Promise<void>}
   */
  async recordEvent(event) {
    try {
      if (!event || typeof event !== 'object') {
        throw new Error('Invalid event object');
      }

      // Store event with timestamp
      this.memory.events.push({
        ...event,
        timestamp: Date.now()
      });

      // Maintain event limit
      if (this.memory.events.length > this.maxEvents) {
        this.memory.events.shift();
      }

      // Update relationships if event involves characters
      if (event.type === 'CHARACTER_INTERACTION') {
        try {
          this.updateRelationships(event);
        } catch (relError) {
          console.error('Failed to update relationships:', relError);
        }
      }

      // Track timeline changes
      if (event.path === 'timeline') {
        this.memory.timelines[event.timestamp] = event.newValue;
      }
    } catch (error) {
      console.error('Failed to record event:', error);
      throw new Error(`Event recording failed: ${error.message}`);
    }
  }

  /**
   * Updates character relationships based on an interaction event
   * @param {MemoryEvent} event - The interaction event
   * @returns {void}
   */
  updateRelationships(event) {
    const { characters } = event;
    if (!characters || characters.length < 2) return;

    const [char1, char2] = characters;
    const relationshipKey = `${char1.id}-${char2.id}`;
    
    if (!this.memory.relationships[relationshipKey]) {
      this.memory.relationships[relationshipKey] = {
        strength: 0,
        type: 'neutral',
        history: []
      };
    }

    const relationship = this.memory.relationships[relationshipKey];
    relationship.history.push(event);
    relationship.strength = Math.min(1, relationship.strength + 0.1);
  }

  /**
   * Records a player decision
   * @param {Object} decision - The decision data
   * @returns {void}
   */
  recordPlayerDecision(decision) {
    this.memory.playerDecisions.push({
      ...decision,
      timestamp: Date.now()
    });
  }

  /**
   * Gets recent events from memory
   * @param {number} [count=5] - Number of events to retrieve
   * @returns {MemoryEvent[]}
   */
  getRecentEvents(count = 5) {
    return this.memory.events.slice(-count);
  }

  /**
   * Gets relationships for a specific character
   * @param {string} characterId - The character ID
   * @returns {CharacterRelationship[]}
   */
  getCharacterRelationships(characterId) {
    return Object.entries(this.memory.relationships)
      .filter(([key]) => key.includes(characterId))
      .map(([_, rel]) => rel);
  }

  /**
   * Gets timeline history
   * @returns {Array<[number, *]>} - Array of [timestamp, value] pairs
   */
  getTimelineHistory() {
    return Object.entries(this.memory.timelines)
      .sort(([ts1], [ts2]) => ts2 - ts1);
  }

  /**
   * Serializes memory to JSON
   * @returns {string}
   */
  toJSON() {
    return JSON.stringify(this.memory);
  }

  /**
   * Deserializes memory from JSON
   * @param {string} json - JSON string to parse
   * @returns {NarrativeMemory}
   */
  static fromJSON(json) {
    const memory = new NarrativeMemory();
    memory.memory = JSON.parse(json);
    return memory;
  }
}
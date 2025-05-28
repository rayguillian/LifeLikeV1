import { DeepseekAgent } from './DeepseekAgent.js';
import { NarrativeMemory } from './NarrativeMemory';
import { PlayerAnalyzer } from './PlayerAnalyzer';
import { ConsequenceEngine } from './ConsequenceEngine';
import { ChoiceGenerator } from './ChoiceGenerator';
import { SurpriseEngine } from './SurpriseEngine';

/**
 * AI Game Master orchestrating dynamic narrative experiences
 * @typedef {Object} GameMasterOptions
 * @property {DynamicWorldState} worldState - The dynamic world state instance
 * @property {number} [surpriseFrequency=0.1] - Base chance for surprise events
 */

export class AIGameMaster {
  /**
   * @param {GameMasterOptions} options
   */
  constructor({ worldState, surpriseFrequency = 0.1 }) {
    /** @type {DynamicWorldState} */
    if (!worldState || typeof worldState.setProperty !== 'function' || typeof worldState.addListener !== 'function') {
      throw new Error('AIGameMaster requires a valid worldState instance.');
    }
    this.worldState = worldState;
    
    /** @type {NarrativeMemory} */
    this.narrativeMemory = new NarrativeMemory();
    
    /** @type {PlayerAnalyzer} */
    this.playerAnalyzer = new PlayerAnalyzer();
    
    /** @type {ConsequenceEngine} */
    this.consequenceEngine = new ConsequenceEngine();
    
    /** @type {ChoiceGenerator} */
    this.choiceGenerator = new ChoiceGenerator();
    
    /** @type {SurpriseEngine} */
    this.surpriseEngine = new SurpriseEngine();
    this.surpriseEngine.surpriseFrequency = surpriseFrequency;
    
    /** @type {DeepseekAgent} */
    this.deepseekAgent = new DeepseekAgent(
      'game-master',
      'You are an AI Game Master orchestrating a dynamic narrative experience.'
    );

    /** @type {boolean} */
    this._isInitialized = false;

    // Setup event listeners
    try {
      this.worldState.addListener(this.handleWorldChange.bind(this));
    } catch (error) {
      console.error('Failed to setup world state listener:', error);
      throw new Error('Failed to initialize AIGameMaster');
    }
  }

  /**
   * Initializes the game world state
   * @returns {Promise<void>}
   */
  async initializeWorld() {
    if (this._isInitialized) {
      console.warn('World already initialized');
      return;
    }

    try {
      // First try to load from AI
      const defaultWorld = await this.deepseekAgent.callAPI(
        'Initialize a new game world with default settings',
        require('../schemas/worldSchema.json')
      );
      
      if (!this.worldState.validateState(defaultWorld)) {
        throw new Error('Invalid initial world state from AI');
      }
      
      Object.entries(defaultWorld).forEach(([path, value]) => {
        this.worldState.setProperty(path, value);
      });

      this._isInitialized = true;
      return true;
    } catch (error) {
      console.error('Failed to initialize world:', error);
      
      // Fallback to safe default state
      const safeDefaults = {
        'properties.reality_stability': 0.85,
        'properties.magic_level': 0.3,
        'properties.tech_level': 0.7,
        'properties.population': 0.5,
        'timeline': 'normal',
        'characters': [],
        'currentEvents': []
      };
      
      Object.entries(safeDefaults).forEach(([path, value]) => {
        this.worldState.setProperty(path, value);
      });
      
      this._isInitialized = true;
      return true;
    }
  }

  /**
   * Progresses the main narrative
   * @returns {Promise<void>}
   */
  async progressNarrative() {
    try {
      const narrativePrompt = `Progress the main narrative based on current world state: ${this.worldState.toJSON()}`;
      const response = await this.deepseekAgent.callAPI(
        narrativePrompt,
        require('../schemas/eventSchema.json')
      );
      
      if (!this.worldState.validateEvent(response)) {
        throw new Error('Invalid narrative progression from AI');
      }
      
      this.worldState.setProperty(response.path, response.value);
    } catch (error) {
      console.error('Failed to progress narrative:', error);
      throw error;
    }
  }

  /**
   * Handles world state changes and orchestrates narrative responses
   * @param {WorldChangeEvent} change - The world state change event
   * @returns {Promise<void>}
   */
  async handleWorldChange(change) {
    try {
      // Update narrative memory with world changes
      await this.narrativeMemory.recordEvent(change);
      
      // Analyze player impact
      const playerImpact = await this.playerAnalyzer.analyzeImpact(change);
      
      // Generate consequences
      const consequences = await this.consequenceEngine.generateConsequences(
        change,
        playerImpact
      );
      
      // Apply consequences to world state
      for (const consequence of consequences) {
        this.worldState.setProperty(consequence.path, consequence.value);
      }
      
      // Check for surprise events
      const surpriseEvent = await this.surpriseEngine.checkForSurprise(
        this.worldState,
        this.narrativeMemory
      );
      
      if (surpriseEvent) {
        this.worldState.setProperty(surpriseEvent.path, surpriseEvent.value);
      }
    } catch (error) {
      console.error('Error handling world change:', error);
      // Fallback to default state if critical error occurs
      this.worldState.setProperty('system.stability', 0.5);
    }
  }

  /**
   * Generates contextual choices for the player
   * @param {ChoiceContext} context - The current game context
   * @returns {Promise<PlayerChoice[]>}
   */
  async generateChoices(context) {
    try {
      return await this.choiceGenerator.generateChoices(
        context,
        this.narrativeMemory,
        this.playerAnalyzer
      );
    } catch (error) {
      console.error('Error generating choices:', error);
      // Return safe default choices
      return [
        { text: 'Continue forward', action: 'continue', riskLevel: 0.1 },
        { text: 'Wait and observe', action: 'wait', riskLevel: 0.1 }
      ];
    }
  }

  /**
   * Orchestrates a custom game event
   * @param {string} eventType - Type of event to orchestrate
   * @param {EventContext} context - Context for the event
   * @returns {Promise<EventResponse>}
   */
  async orchestrateEvent(eventType, context) {
    try {
      const prompt = `Orchestrate a ${eventType} event with this context: ${JSON.stringify(context)}`;
      const response = await this.deepseekAgent.callAPI(
        prompt,
        require('../schemas/eventSchema.json')
      );
      
      // Validate response against world state
      if (this.worldState.validateEvent(response)) {
        return response;
      }
      throw new Error('Invalid event response from AI');
    } catch (error) {
      console.error('Error orchestrating event:', error);
      return { success: false, message: 'Event failed to execute' };
    }
  }

  /**
   * Serializes game master state for persistence
   * @returns {string}
   */
  toJSON() {
    return JSON.stringify({
      narrativeMemory: this.narrativeMemory.toJSON(),
      playerAnalyzer: this.playerAnalyzer.toJSON(),
      consequenceEngine: this.consequenceEngine.toJSON(),
      surpriseEngine: this.surpriseEngine.toJSON()
    });
  }

  /**
   * Restores game master state from serialized data
   * @param {string} json
   * @param {DynamicWorldState} worldState
   * @returns {AIGameMaster}
   */
  static fromJSON(json, worldState) {
    const data = JSON.parse(json);
    const gameMaster = new AIGameMaster({ worldState });
    
    gameMaster.narrativeMemory = NarrativeMemory.fromJSON(data.narrativeMemory);
    gameMaster.playerAnalyzer = PlayerAnalyzer.fromJSON(data.playerAnalyzer);
    gameMaster.consequenceEngine = ConsequenceEngine.fromJSON(data.consequenceEngine);
    gameMaster.surpriseEngine = SurpriseEngine.fromJSON(data.surpriseEngine);
    
    return gameMaster;
  }
}
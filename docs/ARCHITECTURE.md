# AI-Driven Living World Game Architecture

## Overview
This document outlines the architecture for a React-based game featuring:
- Autonomous AI characters with complete life simulations
- Complex memory and learning systems
- Dynamic world events with butterfly effects
- Pokemon-style creature integration
- Player-driven narrative emergence

## Core Systems

```mermaid
graph TD
    A[Game Architecture] --> B[AI Character System]
    A --> C[World Simulation]
    A --> D[Player Interface]
    
    B --> B1[Memory System]
    B --> B2[Emotional System]
    B --> B3[Decision Engine]
    B --> B4[Relationship Network]
    
    C --> C1[Event Propagation]
    C --> C2[Economic Systems]
    C --> C3[Creature Ecosystem]
    C --> C4[World State Management]
    
    D --> D1[AI Companion]
    D --> D2[Personalized Storytelling]
    D --> D3[Adaptive UI]
```

## Implementation Phases

### Phase 1: Foundation (Week 1-2)
1. **Project Structure Setup**
   - Core AI systems directory
   - Game world simulation services
   - UI components library

2. **Base Character AI**
   - Memory system implementation
   - Emotional response framework
   - Basic decision making

3. **World Systems**
   - Event queue and propagation
   - Simple economic model

### Phase 2: Core Gameplay (Week 3-4)
1. **Advanced Character Systems**
   - Personality generation
   - Life goal hierarchies
   - Relationship networks

2. **World Dynamics**
   - Butterfly effect engine
   - Habitat simulation
   - Creature AI behaviors

3. **Player Integration**
   - Companion AI
   - Story generation
   - Adaptive interfaces

### Phase 3: Optimization (Week 5-6)
1. **Performance**
   - Distributed processing
   - Memory management
   - Load balancing

2. **Scalability**
   - World partitioning
   - LOD systems
   - Background processing

## Technical Specifications

### AI Character System
```javascript
class AICharacter {
  constructor(id, personality) {
    this.id = id;
    this.memories = new MemorySystem();
    this.emotions = new EmotionalSystem();
    this.goals = new GoalHierarchy();
    this.relationships = new RelationshipNetwork();
    this.worldModel = new PersonalWorldModel();
    this.decisionEngine = new AIDecisionEngine();
  }
}
```

### World Simulation
```javascript
class WorldSimulator {
  constructor() {
    this.characters = new Map();
    this.events = new EventQueue();
    this.economy = new EconomicSystem();
    this.ecosystems = new Map();
  }
}
```

### Player Interface
```javascript
class GameInterface {
  constructor(player) {
    this.player = player;
    this.companion = new AICompanion(player);
    this.storyTeller = new StoryGenerator();
    this.uiAdapter = new UIAdapter();
  }
}
```

## Next Steps
1. Implement core character AI systems
2. Build world simulation foundation
3. Develop player interface components
4. Integrate systems and test interactions

## AI System Integration

### AIController
Central coordination point for all AI agents:
```javascript
class AIController {
  constructor() {
    this.gameMaster = new AIGameMaster();
    this.memory = new NarrativeMemory();
    this.performance = new PerformanceTracker();
  }
}
```

### Agent Coordination
- GameMaster orchestrates world state
- NarrativeMemory stores and recalls events
- PerformanceTracker monitors system health
- All agents communicate through AIController

### React Integration
```mermaid
graph LR
    A[App] --> B[AIProvider]
    B --> C[useAIState]
    B --> D[useAIActions]
    C --> E[WorldView]
    D --> F[Controls]
```

### Performance Monitoring
- Tracks agent calls and response times
- Measures memory usage
- Provides real-time metrics to UI
- Helps identify bottlenecks

## Development Environment

### WebSocket Removal and Full Page Reload

**Original Implementation:**
- Used WebSocket-based HMR for fast updates
- Provided near-instant feedback during development
- Complex setup with potential stability issues

**Removal Rationale:**
1. **Stability Issues**: WebSocket connections were unreliable in some network environments
2. **Complexity**: Added unnecessary infrastructure for development
3. **Debugging Challenges**: WebSocket traffic harder to inspect than HTTP

**New Development Workflow:**
- Full page reload on file changes
- Simple and reliable development experience
- No WebSocket connection attempts
- Manual refresh when needed (Ctrl/Cmd + R)

**Configuration:**
```javascript
server: {
  port: 5173,
  host: true,
  watch: {
    usePolling: true,  // Filesystem polling
    interval: 1000     // 1 second poll interval
  }
}
```

**Benefits:**
1. **Simplified Architecture**: No WebSocket dependency
2. **Better Reliability**: Works consistently across all environments
3. **Easier Debugging**: Standard HTTP-only traffic
4. **Reduced Complexity**: Fewer moving parts in dev environment

## Testing Approach

### Unit Tests
- Individual agent functionality
- Controller coordination
- Performance tracking

### Integration Tests
- Agent interactions
- State propagation
- UI updates

### Performance Tests
- Response time benchmarks
- Memory usage limits
- Stress testing
import { useState } from 'react'
import './App.css'
import WorldView from './components/WorldView'
import LifeSimulation from './components/LifeSimulation'
import WorldState from './core/worldState'
import { LLMService } from './core/llmService'

function App() {
  const [world, setWorld] = useState(() => new WorldState())
  const [isGenerating, setIsGenerating] = useState(false)
  const [generationHistory, setGenerationHistory] = useState([])

  const generateNewWorld = async () => {
    setIsGenerating(true)
    try {
      const generatedWorld = await LLMService.generateWorld()
      
      // Update world state
      world.setProperty('timeline', generatedWorld.timeline)
      Object.entries(generatedWorld.properties).forEach(([key, value]) => {
        world.setProperty(`properties.${key}`, value)
      })
      world.setProperty('description', generatedWorld.description)
      world.setProperty('events', generatedWorld.events)
      world.setProperty('characters', generatedWorld.characters)

      // Update history
      setGenerationHistory(prev => [
        {
          id: Date.now(),
          timestamp: new Date().toISOString(),
          world: generatedWorld
        },
        ...prev.slice(0, 4) // Keep last 5 generations
      ])

      setWorld(new WorldState(world)) // Force re-render while maintaining prototype
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="app">
      <div className="header">
        <h1>World Generator</h1>
        <button 
          className="generate-btn"
          onClick={generateNewWorld}
          disabled={isGenerating}
        >
          {isGenerating ? 'Generating...' : 'Generate New World!'}
        </button>
      </div>
      
      <div className="main-content">
        <WorldView world={world} />
        {world && <LifeSimulation world={world} />}
        
        {generationHistory.length > 0 && (
          <div className="history">
            <h2>Recent Worlds</h2>
            <div className="history-items">
              {generationHistory.map((item) => (
                <div key={item.id} className="history-item">
                  <h3>{item.world.description}</h3>
                  <p>Timeline: {item.world.timeline}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default App

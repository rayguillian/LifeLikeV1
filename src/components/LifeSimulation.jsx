import { useState, useEffect, useMemo } from 'react'
import './LifeSimulation.css'

const TAB_OPTIONS = ['Diary', 'Stats', 'Relationships', 'Assets', 'World']

export default function LifeSimulation({ world }) {
  const [currentTime, setCurrentTime] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [events, setEvents] = useState([])
  const [characterStatus, setCharacterStatus] = useState({})
  const [activeTab, setActiveTab] = useState('World')
  const [theme, setTheme] = useState('default')

  // Generate dynamic theme based on world properties
  useEffect(() => {
    if (!world) return
    
    const magicLevel = world.getProperty('properties.magic_level')
    const techLevel = world.getProperty('properties.tech_level')
    
    let newTheme = 'default'
    if (magicLevel > 0.7) newTheme = 'magic'
    else if (techLevel > 0.7) newTheme = 'tech'
    else if (world.getProperty('properties.reality_stability') < 0.3) newTheme = 'unstable'
    
    setTheme(newTheme)
  }, [world])

  // Initialize characters with more detailed life states
  useEffect(() => {
    if (!world) return

    const initialStatus = {}
    world.getProperty('characters').forEach(char => {
      initialStatus[char.id] = {
        ...char,
        health: 100,
        energy: 100,
        mood: 50,
        relationships: {},
        position: { x: Math.random() * 100, y: Math.random() * 100 },
        lifeEvents: [],
        inventory: []
      }
    })
    setCharacterStatus(initialStatus)
  }, [world])

  // Simulation loop
  useEffect(() => {
    if (!isRunning) return

    const interval = setInterval(() => {
      setCurrentTime(prev => {
        const newTime = prev + 1
        simulateWorldTick(newTime)
        return newTime
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [isRunning])

  // Simulate NPC life events and world changes
  const simulateWorldTick = (time) => {
    // Generate world events
    if (Math.random() < 0.2 * world.getProperty('properties.reality_stability')) {
      const newEvent = generateWorldEvent(time)
      setEvents(prev => [newEvent, ...prev.slice(0, 9)])
    }

    // Update character statuses with life events
    setCharacterStatus(prev => {
      const updated = {...prev}
      Object.keys(updated).forEach(charId => {
        const char = updated[charId]
        
        // Random life events
        if (Math.random() < 0.1) {
          const lifeEvent = generateLifeEvent(charId, time)
          char.lifeEvents = [lifeEvent, ...char.lifeEvents.slice(0, 4)]
        }

        // Update character stats
        char.health = Math.min(100, char.health + (Math.random() * 2 - 1))
        char.energy = Math.min(100, char.energy - 0.5 + Math.random())
        char.mood = Math.min(100, Math.max(0, char.mood + (Math.random() * 4 - 2)))
        
        // Update position
        char.position = {
          x: (char.position.x + Math.random() * 4 - 2) % 100,
          y: (char.position.y + Math.random() * 4 - 2) % 100
        }
      })
      return updated
    })
  }

  const generateWorldEvent = (time) => {
    const eventTypes = {
      magic: ['Magical surge', 'Ritual completed', 'Spell misfire'],
      tech: ['Tech breakthrough', 'System failure', 'Invention created'],
      unstable: ['Reality shift', 'Time anomaly', 'Dimensional rift'],
      default: ['Cultural event', 'Population change', 'New discovery']
    }
    
    const descriptors = eventTypes[theme] || eventTypes.default
    return {
      id: `event-${time}`,
      time,
      description: descriptors[Math.floor(Math.random() * descriptors.length)],
      impact: Math.random()
    }
  }

  const generateLifeEvent = (charId, time) => {
    const events = [
      'Made a new friend',
      'Learned a new skill',
      'Found an item',
      'Had an argument',
      'Fell ill',
      'Recovered from illness',
      'Had a dream',
      'Changed appearance'
    ]
    
    return {
      id: `life-${charId}-${time}`,
      time,
      description: events[Math.floor(Math.random() * events.length)],
      characterId: charId
    }
  }

  const toggleSimulation = () => {
    setIsRunning(!isRunning)
  }

  const resetSimulation = () => {
    setCurrentTime(0)
    setEvents([])
    setIsRunning(false)
  }

  if (!world) return <div className="life-simulation">No world loaded</div>

  return (
    <div className={`life-simulation theme-${theme}`}>
      <div className="simulation-controls">
        <button onClick={toggleSimulation}>
          {isRunning ? 'Pause' : 'Start'} Simulation
        </button>
        <button onClick={resetSimulation}>Reset</button>
        <span>Time: {currentTime}</span>
      </div>

      <div className="tab-container">
        {TAB_OPTIONS.map(tab => (
          <button
            key={tab}
            className={`tab-button ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="tab-content">
        {activeTab === 'Diary' && (
          <div className="diary-view">
            <h3>Life Events</h3>
            <ul>
              {Object.values(characterStatus).flatMap(char =>
                char.lifeEvents.map(event => (
                  <li key={event.id}>
                    <span className="event-time">[{event.time}]</span>
                    <span className="event-character">{char.name}:</span>
                    <span className="event-description">{event.description}</span>
                  </li>
                ))
              )}
            </ul>
          </div>
        )}

        {activeTab === 'Stats' && (
          <div className="stats-view">
            <h3>Character Statistics</h3>
            <div className="stats-grid">
              {Object.values(characterStatus).map(char => (
                <div key={char.id} className="character-stats">
                  <h4>{char.name}</h4>
                  <div className="stat-bar health" style={{width: `${char.health}%`}}>
                    Health: {Math.round(char.health)}
                  </div>
                  <div className="stat-bar energy" style={{width: `${char.energy}%`}}>
                    Energy: {Math.round(char.energy)}
                  </div>
                  <div className="stat-bar mood" style={{width: `${char.mood}%`}}>
                    Mood: {Math.round(char.mood)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'World' && (
          <div className="world-view">
            <div className="world-map">
              {Object.values(characterStatus).map(char => (
                <div 
                  key={char.id}
                  className="character"
                  style={{
                    left: `${char.position.x}%`,
                    top: `${char.position.y}%`,
                    backgroundColor: char.role === 'Hero' ? 'blue' : 
                                   char.role === 'Villain' ? 'red' : 'gray'
                  }}
                  title={`${char.name} (${char.role})`}
                />
              ))}
            </div>

            <div className="world-events">
              <h3>World Events</h3>
              <ul>
                {events.map(event => (
                  <li key={event.id}>
                    <span className="event-time">[{event.time}]</span>
                    <span className="event-description">{event.description}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
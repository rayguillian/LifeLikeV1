import './WorldView.css'

const timelineNames = {
  normal: 'Normal World',
  magical: 'Magical World',
  technological: 'Technological World',
  'post-apocalyptic': 'Post-Apocalyptic World',
  utopian: 'Utopian World'
};

export default function WorldView({ world }) {
  if (!world || typeof world.getProperty !== 'function') {
    return <div className="world-view">No valid world data available</div>
  }

  const timeline = world.getProperty?.('timeline') ?? 'normal'
  const description = world.getProperty?.('description') ?? 'No description available'
  const events = world.getProperty?.('events') || []
  const characters = world.getProperty?.('characters') || []

  return (
    <div className="world-view">
      <div className="world-header">
        <h2>{description}</h2>
        <div className="timeline">
          <span>Timeline:</span>
          <span>{timelineNames[timeline] || timeline}</span>
        </div>
      </div>

      <div className="world-details">
        <div className="world-section">
          <h3>Key Events</h3>
          <ul>
            {events.map(event => (
              <li key={event.id}>
                <strong>{event.name}</strong>: {event.description}
              </li>
            ))}
          </ul>
        </div>

        <div className="world-section">
          <h3>Notable Characters</h3>
          <ul>
            {characters.map(char => (
              <li key={char.id}>
                <strong>{char.name}</strong> ({char.role})
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
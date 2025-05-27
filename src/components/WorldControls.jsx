import { useState } from 'react';

export default function WorldControls({ worldState }) {
  const [propertyName, setPropertyName] = useState('reality_stability');
  const [propertyValue, setPropertyValue] = useState(0.85);

  const handlePropertyChange = (e) => {
    e.preventDefault();
    worldState.setProperty(`properties.${propertyName}`, parseFloat(propertyValue));
  };

  return (
    <div className="world-controls">
      <h2>World Controls</h2>
      <form onSubmit={handlePropertyChange}>
        <div>
          <label>Property:</label>
          <select 
            value={propertyName}
            onChange={(e) => setPropertyName(e.target.value)}
          >
            <option value="reality_stability">Reality Stability</option>
            <option value="magic_level">Magic Level</option>
            <option value="tech_level">Tech Level</option>
          </select>
        </div>
        <div>
          <label>Value (0-1):</label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={propertyValue}
            onChange={(e) => setPropertyValue(e.target.value)}
          />
          <span>{propertyValue}</span>
        </div>
        <button type="submit">Update Property</button>
      </form>
    </div>
  );
}
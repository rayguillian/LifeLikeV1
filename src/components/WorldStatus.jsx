import { useState, useEffect } from 'react';

const timelineNames = {
  normal: 'Normal World',
  magical: 'Magical World',
  technological: 'Technological World',
  'post-apocalyptic': 'Post-Apocalyptic World',
  utopian: 'Utopian World'
};

export default function WorldStatus({ worldState }) {
  const [currentTimeline, setCurrentTimeline] = useState(worldState.getProperty('timeline'));
  const [properties, setProperties] = useState(worldState.getProperty('properties'));

  useEffect(() => {
    const unsubscribe = worldState.addListener((change) => {
      if (change.path === 'timeline') {
        setCurrentTimeline(change.newValue);
      }
      if (change.path.startsWith('properties')) {
        setProperties({...worldState.getProperty('properties')});
      }
    });

    return () => unsubscribe();
  }, [worldState]);

  return (
    <div className="world-status">
      <h2>Your Generated World</h2>
      <div className="timeline">
        <span>Timeline:</span>
        <span>{timelineNames[currentTimeline] || currentTimeline}</span>
      </div>
    </div>
  );
}
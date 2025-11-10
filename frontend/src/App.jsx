import React from 'react';
import Player from './components/Player';

// Default device ID for demo purposes
const DEFAULT_DEVICE_ID = 'demo-tv-01';

export default function App() {
  const params = new URLSearchParams(window.location.search);
  const deviceId = params.get('device') || DEFAULT_DEVICE_ID;
  
  return <Player deviceId={deviceId} />;
}

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Player from './components/Player';
import Dashboard from './components/Dashboard';

// Default device ID for demo purposes
const DEFAULT_DEVICE_ID = 'demo-tv-01';

export default function App() {
  const params = new URLSearchParams(window.location.search);
  const deviceId = params.get('device') || DEFAULT_DEVICE_ID;
  
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Player deviceId={deviceId} />} />
        <Route path="/admin" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

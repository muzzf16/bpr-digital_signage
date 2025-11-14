// src/player/PlayerApp.jsx
import React, { useEffect } from 'react';
import '../styles/player.scoped.css';
import Player from '../components/player/Player'; // your existing Player component

export default function PlayerApp(props) {
  useEffect(() => {
    // Ensure body doesn't scroll
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';

    // Set height to 100% to ensure full screen
    document.body.style.height = '100vh';
    document.documentElement.style.height = '100vh';

    // Clean up on unmount
    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
      document.body.style.height = '';
      document.documentElement.style.height = '';
    };
  }, []);

  // Player expects props like deviceId, etc.
  return (
    <div className="player-root" role="application" aria-label="Digital Signage Player">
      <Player {...props} />
    </div>
  );
}
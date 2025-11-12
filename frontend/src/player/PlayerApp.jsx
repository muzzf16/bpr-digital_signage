// src/player/PlayerApp.jsx
import React, { useEffect } from 'react';
import '../styles/player.scoped.css';
import Player from '../components/Player'; // your existing Player component

export default function PlayerApp(props) {
  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden'; // disable body scroll while player active
    return () => { document.body.style.overflow = prevOverflow; };
  }, []);

  // Player expects props like deviceId, etc.
  return (
    <div className="player-root" role="application" aria-label="Digital Signage Player">
      <Player {...props} />
    </div>
  );
}
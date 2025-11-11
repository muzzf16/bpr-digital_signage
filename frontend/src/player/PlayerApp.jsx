// src/player/PlayerApp.jsx
import React from 'react';
import '../styles/player.scoped.css';
import Player from '../components/Player'; // your existing Player component

export default function PlayerApp(props) {
  const now = new Date();

  // formatted time and date using Asia/Jakarta
  const timeStr = new Intl.DateTimeFormat("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
    timeZone: "Asia/Jakarta"
  }).format(now);

  const dateStr = new Intl.DateTimeFormat("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Asia/Jakarta"
  }).format(now);

  // Player expects props like deviceId, etc.
  return (
    <div className="player-root" role="application" aria-label="Digital Signage Player">
      <div className="player">
        <div className="clock-panel">
          <div className="clock-time">{timeStr}</div>
          <div className="clock-date">{dateStr}</div>
        </div>
        <Player {...props} />
      </div>
    </div>
  );
}
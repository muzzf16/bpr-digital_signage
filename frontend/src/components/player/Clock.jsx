import React from 'react';

const Clock = ({ timeStr, dateStr, compact = false }) => {
  if (compact) {
    return (
      <div className={`clock-panel ${compact ? 'clock-compact' : ''}`}>
        <div className="clock-time-compact">{timeStr}</div>
        <div className="clock-date-compact">{dateStr}</div>
      </div>
    );
  }

  return (
    <div className="clock-panel">
      <div className="clock-time">{timeStr}</div>
      <div className="clock-date">{dateStr}</div>
    </div>
  );
};

export default Clock;
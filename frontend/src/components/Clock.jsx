import React from 'react';

const Clock = ({ timeStr, dateStr }) => (
  <div className="clock-panel">
    <div className="clock-time">{timeStr}</div>
    <div className="clock-date">{dateStr}</div>
  </div>
);

export default Clock;
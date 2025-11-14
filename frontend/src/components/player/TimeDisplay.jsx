import React, { useState, useEffect } from 'react';
import { formatTime as utilsFormatTime, formatDate as utilsFormatDate } from "../utils/common";

const TimeDisplay = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timeInterval = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timeInterval);
  }, []);

  return (
    <div className="time-display">
      <div className="time">{utilsFormatTime(time)}</div>
      <div className="date">{utilsFormatDate(time)}</div>
    </div>
  );
};

export default TimeDisplay;
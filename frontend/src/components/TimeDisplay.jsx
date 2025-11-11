import React, { useState, useEffect } from 'react';

const TimeDisplay = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timeInterval = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timeInterval);
  }, []);

  const formatTime = (date) => {
    return date.toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
      timeZone: 'Asia/Jakarta'
    });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('id-ID', {
      weekday: 'long',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      timeZone: 'Asia/Jakarta'
    });
  };

  return (
    <div style={{
      background: 'linear-gradient(180deg, #073b68, #032b4f)',
      color: 'white',
      padding: '16px',
      borderRadius: '8px',
      boxShadow: '0 4px 16px rgba(0,0,0,0.25)',
      textAlign: 'center',
      height: '100%'
    }}>
      <div style={{
        fontSize: 'clamp(2.5rem, 4vw, 3.5rem)',
        fontWeight: 800,
        fontFamily: "'Roboto Mono', 'Courier New', monospace",
        color: '#f1c40f',
        lineHeight: 1,
        marginBottom: '4px'
      }}>
        {formatTime(time)}
      </div>
      <div style={{
        fontSize: 'clamp(0.9rem, 1.5vw, 1.1rem)',
        opacity: 0.9,
        marginTop: '4px'
      }}>
        {formatDate(time).toUpperCase()}
      </div>
    </div>
  );
};

export default TimeDisplay;
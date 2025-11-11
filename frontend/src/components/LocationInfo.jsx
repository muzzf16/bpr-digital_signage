import React, { useState, useEffect } from 'react';

const LocationInfo = ({ location = "Jakarta Pusat", deviceId }) => {
  const [time, setTime] = useState(new Date());
  const [temperature, setTemperature] = useState(null);

  useEffect(() => {
    // Update time every second
    const timeInterval = setInterval(() => {
      setTime(new Date());
    }, 1000);

    // Simulate weather fetching - in a real implementation, this would call an API
    setTemperature(31); // Placeholder value

    return () => clearInterval(timeInterval);
  }, []);

  const formatTime = (date) => {
    return date.toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div style={{
      background: 'linear-gradient(180deg, #073b68, #032b4f)',
      color: 'white',
      padding: '12px 16px',
      borderRadius: '8px',
      boxShadow: '0 4px 16px rgba(0,0,0,0.35)',
      fontSize: '0.9rem'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '4px'
      }}>
        <div>
          <div style={{ fontWeight: 'bold', color: '#f1c40f' }}>{location}</div>
          <div>{formatTime(time)}</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div>{formatDate(time)}</div>
          {temperature && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
              <span>☀️</span>
              <span style={{ marginLeft: '4px' }}>{temperature}°C</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LocationInfo;
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
    <div className="location-info">
      <div className="location-info-header">
        <div>
          <div className="location-info-location">{location}</div>
          <div className="location-info-time">{formatTime(time)}</div>
        </div>
        <div className="location-info-date-weather">
          <div className="location-info-date">{formatDate(time)}</div>
          {temperature && (
            <div className="location-info-weather">
              <span>☀️</span>
              <span>{temperature}°C</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LocationInfo;
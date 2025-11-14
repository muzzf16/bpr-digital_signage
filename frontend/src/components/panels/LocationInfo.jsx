import React, { useState, useEffect } from 'react';
import { formatTime, formatDate } from "../../utils/common";

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

  return (
    <div className="location-info" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'white', marginBottom: '0.5vh' }}>
        {location}
      </div>
      <div style={{ fontSize: '1.2rem', color: 'white', marginBottom: '0.5vh' }}>
        {formatTime(time)}
      </div>
      <div style={{ fontSize: '1rem', color: '#ccc' }}>
        {formatDate(time)}
      </div>
      {temperature !== null && (
        <div style={{ fontSize: '1.5rem', color: 'white', marginTop: '1vh' }}>
          {temperature}°C
        </div>
      )}
    </div>
  );
};

export default LocationInfo;
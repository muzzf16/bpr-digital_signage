import React from 'react';

const WeatherPanel = ({ location = "Depok", temperature = 31, condition = "Cerah Berawan", weatherCode = "sunny" }) => {
  // Weather icon mapping
  const getWeatherIcon = (code) => {
    switch(code) {
      case 'sunny':
      case 'clear':
        return '☀️';
      case 'cloudy':
      case 'partly-cloudy':
        return '🌤️';
      case 'rainy':
        return '🌧️';
      case 'storm':
        return '⛈️';
      default:
        return '🌤️';
    }
  };

  return (
    <div style={{
      background: 'linear-gradient(180deg, #073b68, #032b4f)',
      color: 'white',
      padding: '16px',
      borderRadius: '8px',
      boxShadow: '0 4px 16px rgba(0,0,0,0.25)',
      height: '100%'
    }}>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%'
      }}>
        <div style={{ 
          fontSize: '2.5rem', 
          marginBottom: '8px',
          lineHeight: 1
        }}>
          {getWeatherIcon(weatherCode)}
        </div>
        <div style={{ 
          fontSize: 'clamp(1.5rem, 2.5vw, 2rem)', 
          fontWeight: 'bold', 
          color: '#f1c40f',
          lineHeight: 1,
          marginBottom: '4px'
        }}>
          {temperature}°C
        </div>
        <div style={{ 
          fontSize: 'clamp(0.8rem, 1.2vw, 1rem)',
          textAlign: 'center',
          opacity: 0.9,
          marginBottom: '8px'
        }}>
          {condition}
        </div>
        <div style={{ 
          fontSize: 'clamp(0.7rem, 1vw, 0.9rem)',
          textAlign: 'center',
          opacity: 0.8,
          textTransform: 'uppercase'
        }}>
          Cabang: {location}
        </div>
      </div>
    </div>
  );
};

export default WeatherPanel;
import React from 'react';

// Simple SVG-based mini chart component
// In a real implementation, you might use a charting library like recharts
const MiniChart = ({ type = 'line', data = [], color = '#f1c40f', title = '', currentValue = '', period = '7 hari' }) => {
  if (!data || data.length === 0) {
    return (
      <div className="mini-chart" style={{
        display: 'flex',
        flexDirection: 'column',
        height: 'auto'
      }}>
        <div className="mini-chart-title" style={{
          fontSize: '0.7rem',
          fontWeight: '600',
          opacity: 0.8,
          marginBottom: '0.2vh'
        }}>{title}</div>
        <div className="mini-chart-value" style={{
          fontSize: '0.8rem',
          fontWeight: '700',
          marginBottom: '0.4vh',
          color: '#f5faff'
        }}>N/A</div>
        <div style={{
          height: '50px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '0.7rem',
          opacity: 0.7,
          backgroundColor: 'rgba(255,255,255,0.05)',
          borderRadius: '6px'
        }}>
          No data
        </div>
        <div style={{
          fontSize: '0.6rem',
          opacity: 0.5,
          textAlign: 'right',
          marginTop: '0.2vh'
        }}>
          {period}
        </div>
      </div>
    );
  }

  // Calculate if the trend is up or down
  const firstValue = data[0];
  const lastValue = data[data.length - 1];
  const change = lastValue - firstValue;
  const percentageChange = ((change / firstValue) * 100).toFixed(2);
  const changeIndicator = change > 0 ? '▲' : change < 0 ? '▼' : '';
  const changeColor = change > 0 ? '#4caf50' : change < 0 ? '#e74c3c' : '#ffffff';

  // Normalize data for display
  const maxValue = Math.max(...data);
  const minValue = Math.min(...data);
  const range = maxValue - minValue || 1; // Avoid division by zero

  // Calculate points for the line
  const points = data.map((value, index) => {
    const x = (index / (data.length - 1)) * 100; // Chart width
    const y = 40 - ((value - minValue) / range) * 35; // Chart height
    return `${x},${y}`;
  }).join(' ');

  return (
    <div className="mini-chart" style={{
      display: 'flex',
      flexDirection: 'column',
      height: 'auto',
      color: '#f5faff'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '0.2vh'
      }}>
        <div className="mini-chart-title" style={{
          fontSize: '0.7rem',
          fontWeight: '600',
          opacity: 0.8
        }}>{title}</div>
        <div style={{
          fontSize: '0.6rem',
          opacity: 0.6
        }}>
          {period}
        </div>
      </div>
      <div className="mini-chart-value" style={{
        fontSize: '0.8rem',
        fontWeight: '700',
        marginBottom: '0.3vh',
        display: 'flex',
        alignItems: 'center'
      }}>
        <span>{currentValue}</span>
        {changeIndicator && (
          <span style={{
            marginLeft: '0.3vw',
            color: changeColor,
            fontSize: '0.7rem'
          }}>
            {changeIndicator} {Math.abs(percentageChange)}%
          </span>
        )}
      </div>
      <div style={{ 
        height: '45px', 
        position: 'relative',
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: '6px',
        padding: '4px'
      }}>
        <svg width="100%" height="100%" viewBox="0 0 100 40" preserveAspectRatio="none">
          <defs>
            <linearGradient id={`gradient-${title.replace(/\s+/g, '')}`} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={color} stopOpacity="0.6" />
              <stop offset="100%" stopColor={color} stopOpacity="0.1" />
            </linearGradient>
          </defs>
          <polyline
            fill={`url(#gradient-${title.replace(/\s+/g, '')})`}
            stroke={color}
            strokeWidth="1.5"
            points={`0,40 ${points} 100,40`}
          />
          <polyline
            fill="none"
            stroke={color}
            strokeWidth="1.5"
            points={points}
          />
        </svg>
      </div>
    </div>
  );
};

export default MiniChart;
import React from 'react';

// Simple SVG-based mini chart component 
// In a real implementation, you might use a charting library like recharts
const MiniChart = ({ type = 'line', data = [], color = '#f1c40f', title = '', currentValue = '', period = '7 hari' }) => {
  if (!data || data.length === 0) {
    return (
      <div className="mini-chart">
        <div className="mini-chart-title">{title}</div>
        <div className="mini-chart-value">{currentValue}</div>
        <div style={{ 
          height: '60px', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          fontSize: '0.8rem',
          opacity: 0.7
        }}>
          No data available
        </div>
        <div style={{ 
          fontSize: '0.7rem', 
          opacity: 0.6, 
          textAlign: 'right',
          marginTop: '4px'
        }}>
          {period}
        </div>
      </div>
    );
  }

  // Normalize data for display
  const maxValue = Math.max(...data);
  const minValue = Math.min(...data);
  const range = maxValue - minValue || 1; // Avoid division by zero
  
  // Calculate points for the line
  const points = data.map((value, index) => {
    const x = (index / (data.length - 1)) * 120; // Chart width
    const y = 60 - ((value - minValue) / range) * 50; // Chart height
    return `${x},${y}`;
  }).join(' ');

  return (
    <div className="mini-chart">
      <div className="mini-chart-title">{title}</div>
      <div className="mini-chart-value">{currentValue}</div>
      <div style={{ height: '60px', position: 'relative' }}>
        <svg width="100%" height="100%" viewBox="0 0 120 60" preserveAspectRatio="none">
          <defs>
            <linearGradient id={`gradient-${title}`} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={color} stopOpacity="0.6" />
              <stop offset="100%" stopColor={color} stopOpacity="0.1" />
            </linearGradient>
          </defs>
          <polyline
            fill={`url(#gradient-${title})`}
            stroke={color}
            strokeWidth="2"
            points={`0,60 ${points} 120,60`}
          />
          <polyline
            fill="none"
            stroke={color}
            strokeWidth="2"
            points={points}
          />
        </svg>
      </div>
      <div style={{ 
        fontSize: '0.7rem', 
        opacity: 0.6, 
        textAlign: 'right',
        marginTop: '4px'
      }}>
        {period}
      </div>
    </div>
  );
};

export default MiniChart;
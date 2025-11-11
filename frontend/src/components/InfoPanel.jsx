import React from 'react';

const InfoPanel = ({ title, content, icon = 'ℹ️' }) => {
  return (
    <div style={{
      background: '#062e55',
      borderRadius: 16,
      padding: '1vw',
      color: '#f5faff',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      boxShadow: '0 6px 12px rgba(0,0,0,0.25)',
      height: '100%'
    }}>
      <div style={{
        fontSize: 'clamp(0.9rem, 1.4vw, 1.1rem)',
        fontWeight: '700',
        marginBottom: '0.6vh',
        paddingBottom: '0.4vh',
        borderBottom: '1px solid rgba(255,255,255,0.2)',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5vw'
      }}>
        <span>{icon}</span>
        <span>{title}</span>
      </div>
      <div style={{
        fontSize: 'clamp(0.7rem, 1vw, 0.8rem)',
        lineHeight: '1.4'
      }}>
        {content}
      </div>
    </div>
  );
};

export default InfoPanel;
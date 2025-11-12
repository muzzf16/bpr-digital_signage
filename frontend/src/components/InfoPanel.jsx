import React from 'react';

const InfoPanel = ({ title, content, icon = 'ℹ️' }) => {
  return (
    <div className="info-panel">
      <div className="info-panel-header">
        <span>{icon}</span>
        <span>{title}</span>
      </div>
      <div className="info-panel-content">
        {content}
      </div>
    </div>
  );
};

export default InfoPanel;
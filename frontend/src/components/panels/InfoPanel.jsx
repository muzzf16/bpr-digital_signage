import React from 'react';
import PropTypes from 'prop-types';

const InfoPanel = ({ title, content, icon = 'ℹ️', className = "" }) => {
  return (
    <div className={`info-panel ${className}`} role="region" aria-labelledby="info-panel-title">
      <div className="info-panel-header flex items-center gap-2 mb-2" id="info-panel-title">
        <span className="info-panel-icon text-lg" aria-hidden="true">
          {icon}
        </span>
        <span className="info-panel-title font-semibold text-white">
          {title}
        </span>
      </div>
      <div className="info-panel-content text-gray-200">
        {content}
      </div>
    </div>
  );
};

InfoPanel.propTypes = {
  title: PropTypes.string.isRequired,
  content: PropTypes.node.isRequired,
  icon: PropTypes.string,
  className: PropTypes.string
};

export default InfoPanel;
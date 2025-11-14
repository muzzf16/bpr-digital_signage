import React from 'react';
import PropTypes from 'prop-types';

const GlassCard = ({ title, icon, children, className = "", ...props }) => {
  return (
    <div
      className={`glass-card bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6 shadow-lg ${className}`}
      style={{
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
      }}
      {...props}
    >
      {(title || icon) && (
        <div className="flex items-center space-x-3 mb-4">
          {icon && (
            <div className="glass-card-icon bg-blue-600/30 p-2 rounded-lg">
              {icon}
            </div>
          )}
          {title && (
            <h3 className="glass-card-title text-white text-lg font-semibold">
              {title}
            </h3>
          )}
        </div>
      )}
      <div className="glass-card-content">
        {children}
      </div>
    </div>
  );
};

GlassCard.propTypes = {
  title: PropTypes.string,
  icon: PropTypes.node,
  children: PropTypes.node.isRequired,
  className: PropTypes.string
};

export default GlassCard;

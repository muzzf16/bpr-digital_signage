import React from 'react';

const GlassCard = ({ title, icon, children, className = "" }) => {
  return (
    <div className={`bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6 shadow-lg ${className}`}>
      <div className="flex items-center space-x-3 mb-4">
        <div className="bg-blue-600/30 p-2 rounded-lg">
          {icon}
        </div>
        <h3 className="text-white text-lg font-semibold">{title}</h3>
      </div>
      {children}
    </div>
  );
};

export default GlassCard;

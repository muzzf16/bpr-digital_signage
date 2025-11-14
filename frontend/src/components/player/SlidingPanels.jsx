// src/components/player/SlidingPanels.jsx
import React, { useState, useEffect } from 'react';
import ProductHighlight from '../panels/ProductHighlight';
import { LazyEconPanel, LazyRatePanel } from '../panels';

const SlidingPanels = ({ economicData }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Panels to cycle through
  const panels = [
    { id: 'product', component: <ProductHighlight />, title: 'Produk Unggulan' },
    { id: 'rate', component: <LazyRatePanel />, title: 'Suku Bunga' },
    { id: 'economy', component: <LazyEconPanel />, title: 'Info Ekonomi' }
  ];

  useEffect(() => {
    // Rotate through panels every 8 seconds
    const interval = setInterval(() => {
      setCurrentIndex(prevIndex => (prevIndex + 1) % panels.length);
    }, 48000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="sliding-panels">
      <div className="current-panel">
        <div className="panel-header">{panels[currentIndex].title}</div>
        <div className="panel-content">
          {panels[currentIndex].component}
        </div>
      </div>
      <div className="panel-indicators">
        {panels.map((panel, index) => (
          <div
            key={panel.id}
            className={`indicator ${index === currentIndex ? 'active' : ''}`}
            onClick={() => setCurrentIndex(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default SlidingPanels;
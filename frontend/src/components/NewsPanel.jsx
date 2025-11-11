import React, { useState, useEffect } from 'react';

const NewsPanel = () => {
  const [visibleNewsIndex, setVisibleNewsIndex] = useState(0);
  
  // Sample news data - in a real implementation, this would come from an API
  const newsItems = [
    { id: 1, title: 'IHSG Menguat 0.34% di Penutupan', source: 'Kontan', timestamp: '15.45 WIB', icon: '📈' },
    { id: 2, title: 'BI Pertahankan Suku Bunga Acuan 6.5%', source: 'CNBC Indonesia', timestamp: '09.30 WIB', icon: '🏦' },
    { id: 3, title: 'Inflasi Oktober Terkendali di Level 3.23%', source: 'Antara', timestamp: '08.15 WIB', icon: '📊' },
    { id: 4, title: 'Nilai Tukar Rupiah Menguat ke Level 15.100', source: 'Bloomberg', timestamp: '16.00 WIB', icon: '💱' }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setVisibleNewsIndex(prevIndex => (prevIndex + 1) % newsItems.length);
    }, 5000); // Change every 5 seconds

    return () => clearInterval(interval);
  }, [newsItems.length]);

  const currentNews = newsItems[visibleNewsIndex];

  return (
    <div className="news-panel">
      <div className="news-header">
        Berita Terkini
      </div>
      <div className="news-content">
        <div className="news-item">
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '4px' }}>
            <span style={{ marginRight: '6px', fontSize: '1.2em' }}>{currentNews.icon}</span>
            <strong>{currentNews.title}</strong>
          </div>
          <div style={{ 
            fontSize: '0.8rem',
            opacity: 0.8,
            display: 'flex',
            justifyContent: 'space-between',
            marginTop: '4px'
          }}>
            <span>{currentNews.source}</span>
            <span>{currentNews.timestamp}</span>
          </div>
        </div>
      </div>
      
      {/* News indicators */}
      <div className="news-indicators">
        {newsItems.map((_, idx) => (
          <div
            key={idx}
            style={{
              width: idx === visibleNewsIndex ? '12px' : '8px',
              height: '4px',
              borderRadius: '2px',
              backgroundColor: idx === visibleNewsIndex ? '#f1c40f' : 'rgba(255,255,255,0.3)',
              margin: '0 2px',
              transition: 'width 0.3s ease'
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default NewsPanel;
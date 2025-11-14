import React, { useState, useEffect } from 'react';

const NewsPanel = () => {
  // Sample news data - in a real implementation, this would come from an API
  const newsItems = [
    { id: 1, title: 'IHSG Menguat 0.34%', source: 'Kontan', timestamp: '15.45 WIB', icon: '📈' },
    { id: 2, title: 'BI Pertahankan Suku Bunga 6.5%', source: 'CNBC Indonesia', timestamp: '09.30 WIB', icon: '🏦' },
    { id: 3, title: 'Inflasi Oktober 3.23%', source: 'Antara', timestamp: '08.15 WIB', icon: '📊' },
    { id: 4, title: 'Rupiah Menguat ke 15.100', source: 'Bloomberg', timestamp: '16.00 WIB', icon: '💱' },
    { id: 5, title: 'OJK Evaluasi Kebijakan BPR', source: 'Republika', timestamp: '14.20 WIB', icon: '🏛️' }
  ];

  const [visibleNewsIndex, setVisibleNewsIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisibleNewsIndex(prevIndex => (prevIndex + 1) % (newsItems.length - 1));
    }, 10000); // Change every 10 seconds

    return () => clearInterval(interval);
  }, [newsItems.length]);

  // Show two consecutive news items
  const currentNews1 = newsItems[visibleNewsIndex];
  const currentNews2 = newsItems[(visibleNewsIndex + 1) % newsItems.length];

  return (
    <div className="news-panel">
      <div className="news-header">
        <span>📰</span>
        <span>Berita Terkini</span>
      </div>
      
      <div className="news-content">
        {/* Show first news item */}
        <div key={currentNews1.id} className="news-item">
          <span className="news-item-icon">{currentNews1.icon}</span>
          <div className="news-item-details">
            <div className="news-item-title">{currentNews1.title}</div>
            <div className="news-item-source-time">
              <span>{currentNews1.source}</span>
              <span>{currentNews1.timestamp}</span>
            </div>
          </div>
        </div>
        
        {/* Show second news item */}
        <div key={currentNews2.id} className="news-item">
          <span className="news-item-icon">{currentNews2.icon}</span>
          <div className="news-item-details">
            <div className="news-item-title">{currentNews2.title}</div>
            <div className="news-item-source-time">
              <span>{currentNews2.source}</span>
              <span>{currentNews2.timestamp}</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* News indicators */}
      <div className="news-indicators">
        {Array.from({ length: Math.min(3, newsItems.length) }).map((_, idx) => (
          <div
            key={idx}
            className={`news-indicator ${visibleNewsIndex === idx ? 'news-indicator-active' : ''}`}
          />
        ))}
      </div>
    </div>
  );
};

export default NewsPanel;
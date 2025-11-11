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
    <div className="news-panel" style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      height: '100%',
      color: '#f5faff'
    }}>
      <div className="news-header" style={{
        fontSize: 'clamp(0.9rem, 1.4vw, 1.1rem)',
        fontWeight: '700',
        marginBottom: '0.6vh',
        paddingBottom: '0.4vh',
        borderBottom: '1px solid rgba(255,255,255,0.2)',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5vw'
      }}>
        <span>📰</span>
        <span>Berita Terkini</span>
      </div>
      
      <div className="news-content" style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '0.6vh',
        overflow: 'hidden',
        flex: 1,
        fontSize: 'clamp(0.65rem, 0.9vw, 0.75rem)'
      }}>
        {/* Show first news item */}
        <div key={currentNews1.id} className="news-item" style={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: '0.4vw',
          padding: '0.2vh 0'
        }}>
          <span style={{ fontSize: '0.9em', flexShrink: 0 }}>{currentNews1.icon}</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: '600', marginBottom: '0.1vh', lineHeight: '1.2' }}>{currentNews1.title}</div>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              opacity: 0.8
            }}>
              <span>{currentNews1.source}</span>
              <span>{currentNews1.timestamp}</span>
            </div>
          </div>
        </div>
        
        {/* Show second news item */}
        <div key={currentNews2.id} className="news-item" style={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: '0.4vw',
          padding: '0.2vh 0',
          borderTop: '1px solid rgba(255,255,255,0.1)'
        }}>
          <span style={{ fontSize: '0.9em', flexShrink: 0 }}>{currentNews2.icon}</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: '600', marginBottom: '0.1vh', lineHeight: '1.2' }}>{currentNews2.title}</div>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              opacity: 0.8
            }}>
              <span>{currentNews2.source}</span>
              <span>{currentNews2.timestamp}</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* News indicators */}
      <div className="news-indicators" style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '3px',
        marginTop: '0.4vh',
        padding: '0.3vh 0'
      }}>
        {Array.from({ length: Math.min(3, newsItems.length) }).map((_, idx) => (
          <div
            key={idx}
            style={{
              width: visibleNewsIndex === idx ? '10px' : '5px',
              height: '3px',
              borderRadius: '1.5px',
              backgroundColor: visibleNewsIndex === idx ? '#f1c40f' : 'rgba(255,255,255,0.3)',
              transition: 'width 0.3s ease'
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default NewsPanel;
import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function NewsManager() {
  const [news, setNews] = useState([]);
  const [newNews, setNewNews] = useState({
    title: '',
    source: '',
    link: '',
    category: 'economic',
    isBreaking: false
  });

  useEffect(() => {
    // In a real implementation, this would fetch from the backend API
    // For now, we'll simulate with mock data
    setNews([
      {
        id: 1,
        title: 'BI pertahankan suku bunga acuan 6,5%',
        source: 'CNBC Indonesia',
        link: '#',
        category: 'economic',
        isBreaking: false,
        timestamp: '2025-11-10T09:30:00Z'
      },
      {
        id: 2,
        title: 'IHSG menguat 0.34% di akhir sesi',
        source: 'Kontan',
        link: '#',
        category: 'economic',
        isBreaking: true,
        timestamp: '2025-11-10T15:45:00Z'
      }
    ]);
  }, []);

  const addNews = () => {
    if (!newNews.title || !newNews.source) {
      alert('Please provide at least a title and source for the news');
      return;
    }

    const newsToAdd = {
      id: news.length + 1,
      ...newNews,
      timestamp: new Date().toISOString()
    };

    setNews([newsToAdd, ...news]); // Add to the top
    setNewNews({
      title: '',
      source: '',
      link: '',
      category: 'economic',
      isBreaking: false
    });
  };

  const deleteNews = (id) => {
    if (window.confirm('Are you sure you want to delete this news item?')) {
      setNews(news.filter(item => item.id !== id));
    }
  };

  return (
    <div>
      <h2>News Manager</h2>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '20px', marginTop: '20px' }}>
        {/* Add News Item */}
        <div style={{ border: '1px solid #ddd', padding: '20px', borderRadius: '8px' }}>
          <h3>Add News Item</h3>
          <div className="form-group">
            <label>Title:</label>
            <input
              type="text"
              value={newNews.title}
              onChange={(e) => setNewNews({...newNews, title: e.target.value})}
              placeholder="News title"
            />
          </div>
          <div className="form-group">
            <label>Source:</label>
            <input
              type="text"
              value={newNews.source}
              onChange={(e) => setNewNews({...newNews, source: e.target.value})}
              placeholder="News source"
            />
          </div>
          <div className="form-group">
            <label>Link:</label>
            <input
              type="text"
              value={newNews.link}
              onChange={(e) => setNewNews({...newNews, link: e.target.value})}
              placeholder="Full article link"
            />
          </div>
          <div className="form-group">
            <label>Category:</label>
            <select
              value={newNews.category}
              onChange={(e) => setNewNews({...newNews, category: e.target.value})}
            >
              <option value="economic">Economic</option>
              <option value="banking">Banking</option>
              <option value="general">General News</option>
            </select>
          </div>
          <div className="form-group">
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input
                type="checkbox"
                checked={newNews.isBreaking}
                onChange={(e) => setNewNews({...newNews, isBreaking: e.target.checked})}
              />
              Breaking News
            </label>
          </div>
          <button onClick={addNews}>Add News</button>
        </div>
        
        {/* News List */}
        <div style={{ border: '1px solid #ddd', padding: '20px', borderRadius: '8px' }}>
          <h3>Current News</h3>
          <ul>
            {news.map(item => (
              <li key={item.id} style={{ 
                marginBottom: '15px', 
                borderBottom: '1px solid #eee', 
                paddingBottom: '10px',
                background: item.isBreaking ? '#fff8f0' : 'none',
                borderLeft: item.isBreaking ? '4px solid #ff6b35' : 'none',
                paddingLeft: item.isBreaking ? '10px' : '0'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <strong>{item.title}</strong>
                  {item.isBreaking && <span style={{ color: '#ff6b35', fontWeight: 'bold' }}>BREAKING</span>}
                </div>
                <div style={{ fontSize: '0.9em', color: '#666', marginTop: '5px' }}>
                  {item.source} • {new Date(item.timestamp).toLocaleString()}
                  {item.category && ` • ${item.category}`}
                </div>
                <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                  <a 
                    href={item.link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    style={{ color: '#3498db', fontSize: '0.9em', textDecoration: 'none' }}
                  >
                    View Article
                  </a>
                  <button 
                    onClick={() => deleteNews(item.id)}
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
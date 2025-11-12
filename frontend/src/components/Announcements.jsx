import React, { useState, useEffect } from 'react';

const Announcements = ({ deviceId }) => {
  const [currentAnnouncementIndex, setCurrentAnnouncementIndex] = useState(0);
  
  // Sample announcements data - in a real implementation, this would come from an API
  const announcements = [
    { 
      id: 1, 
      message: 'BPR Sukamakmur akan tutup pada 25 Desember 2025', 
      priority: 'high',
      validFrom: new Date().toISOString(),
      validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // Valid for 7 days
    },
    { 
      id: 2, 
      message: 'Gunakan mobile app kami untuk transaksi lebih cepat', 
      priority: 'medium',
      validFrom: new Date().toISOString(),
      validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // Valid for 7 days
    },
    { 
      id: 3, 
      message: 'Promo spesial akhir tahun - bunga deposito hingga 7.5%', 
      priority: 'low',
      validFrom: new Date().toISOString(),
      validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // Valid for 7 days
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentAnnouncementIndex(prevIndex => (prevIndex + 1) % announcements.length);
    }, 10000); // Change every 10 seconds

    return () => clearInterval(interval);
  }, [announcements.length]);

  const currentAnnouncement = announcements[currentAnnouncementIndex];

  if (!currentAnnouncement) return null;

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'high': return '#e74c3c'; // Red
      case 'medium': return '#f39c12'; // Orange
      case 'low': return '#3498db'; // Blue
      default: return '#95a5a6'; // Gray
    }
  };

  return (
    <div className="announcements-panel" style={{
      borderLeftColor: getPriorityColor(currentAnnouncement.priority),
      animation: 'fadeInOut 10s linear'
    }}>
      <div className="announcements-content">
        <span className="announcements-icon" style={{ color: getPriorityColor(currentAnnouncement.priority) }}>
          {currentAnnouncement.priority === 'high' ? '📢' : 
           currentAnnouncement.priority === 'medium' ? '⚠️' : 'ℹ️'}
        </span>
        <span className="announcements-message">
          {currentAnnouncement.message}
        </span>
      </div>
    </div>
  );
};

export default Announcements;
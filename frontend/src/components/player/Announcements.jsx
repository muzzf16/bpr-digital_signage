import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { PRIORITY_CONFIG, ANIMATION_INTERVAL, VALIDITY_PERIOD } from "../../utils/common";

// Sample announcements data - in a real implementation, this would come from an API
const MOCK_ANNOUNCEMENTS = [
  {
    id: 1,
    message: 'BPR Sukamakmur akan tutup pada 25 Desember 2025',
    priority: 'high',
    validFrom: new Date().toISOString(),
    validUntil: new Date(Date.now() + VALIDITY_PERIOD).toISOString()
  },
  {
    id: 2,
    message: 'Gunakan mobile app kami untuk transaksi lebih cepat',
    priority: 'medium',
    validFrom: new Date().toISOString(),
    validUntil: new Date(Date.now() + VALIDITY_PERIOD).toISOString()
  },
  {
    id: 3,
    message: 'Promo spesial akhir tahun - bunga deposito hingga 7.5%',
    priority: 'low',
    validFrom: new Date().toISOString(),
    validUntil: new Date(Date.now() + VALIDITY_PERIOD).toISOString()
  }
];

const Announcements = ({ deviceId, announcements = MOCK_ANNOUNCEMENTS }) => {
  const [currentAnnouncementIndex, setCurrentAnnouncementIndex] = useState(0);

  // Get active announcements only
  const activeAnnouncements = useCallback(() => {
    const now = new Date();
    return announcements.filter(announcement => {
      const validFrom = new Date(announcement.validFrom);
      const validUntil = new Date(announcement.validUntil);
      return now >= validFrom && now <= validUntil;
    });
  }, [announcements]);

  // Cycle through announcements
  useEffect(() => {
    const interval = setInterval(() => {
      const active = activeAnnouncements();
      if (active.length > 0) {
        setCurrentAnnouncementIndex(prevIndex =>
          (prevIndex + 1) % active.length
        );
      }
    }, ANIMATION_INTERVAL);

    return () => clearInterval(interval);
  }, [activeAnnouncements]);

  const active = activeAnnouncements();
  const currentAnnouncement = active[currentAnnouncementIndex];

  if (!currentAnnouncement) return null;

  const { priority } = currentAnnouncement;
  const priorityConfig = PRIORITY_CONFIG[priority] || PRIORITY_CONFIG.default;

  return (
    <div
      className="announcements-panel"
      style={{
        borderLeft: `4px solid ${priorityConfig.color}`,
        background: 'rgba(0, 0, 0, 0.15)',
        padding: '12px 16px',
        borderRadius: '0 8px 8px 0',
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
      }}
      role="alert"
      aria-live="polite"
    >
      <span
        className="announcements-icon"
        style={{
          fontSize: '1.5rem',
          color: priorityConfig.color
        }}
        aria-hidden="true"
      >
        {priorityConfig.icon}
      </span>
      <span
        className="announcements-message"
        style={{
          fontSize: '1.1rem',
          color: 'white',
          fontWeight: '500',
          flex: 1
        }}
      >
        {currentAnnouncement.message}
      </span>
    </div>
  );
};

Announcements.propTypes = {
  deviceId: PropTypes.string,
  announcements: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      message: PropTypes.string.isRequired,
      priority: PropTypes.oneOf(['high', 'medium', 'low']),
      validFrom: PropTypes.string.isRequired,
      validUntil: PropTypes.string.isRequired
    })
  )
};

export default Announcements;
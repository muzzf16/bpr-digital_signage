/**
 * Common utility functions used across components
 */

// Function to format numbers with Indonesian locale
export const formatNumber = (value) => {
  if (value === null || value === undefined) return 'N/A';
  if (typeof value === 'string' && isNaN(parseFloat(value))) return value;
  return Number(value).toLocaleString('id-ID');
};

// Get trend indicator based on change value
export const getTrendIndicator = (change) => {
  if (!change) return { indicator: '', color: '#ffffff' };

  // Check if change is a percentage string (e.g., "+0.34%")
  if (typeof change === 'string') {
    const numericValue = parseFloat(change.replace(/[^\d.-]/g, ''));
    if (isNaN(numericValue)) return { indicator: '', color: '#ffffff' };

    if (numericValue > 0) {
      return { indicator: '▲', color: '#4caf50' }; // Green for positive
    } else if (numericValue < 0) {
      return { indicator: '▼', color: '#e74c3c' }; // Red for negative
    }
  }

  // For numeric values
  if (change > 0) {
    return { indicator: '▲', color: '#4caf50' }; // Green for positive
  } else if (change < 0) {
    return { indicator: '▼', color: '#e74c3c' }; // Red for negative
  }

  return { indicator: '', color: '#ffffff' }; // No indicator for zero
};

// Function to get news icon based on category
export const getNewsIcon = (title) => {
  if (!title) return '📰';
  
  const lowerTitle = title.toLowerCase();

  if (lowerTitle.includes('ihsg') || lowerTitle.includes('saham') || lowerTitle.includes('stock') || lowerTitle.includes('market')) {
    return '💹';
  } else if (lowerTitle.includes('bank') || lowerTitle.includes('bpr') || lowerTitle.includes('perbankan') || lowerTitle.includes('bi') || lowerTitle.includes('ojk') || lowerTitle.includes('o j k')) {
    return '🏦';
  } else if (lowerTitle.includes('inflasi') || lowerTitle.includes('ekonomi') || lowerTitle.includes('makro') || lowerTitle.includes('gdp')) {
    return '💰';
  } else if (lowerTitle.includes('rupiah') || lowerTitle.includes('kurs') || lowerTitle.includes('dollar') || lowerTitle.includes('valas')) {
    return '💱';
  } else {
    return '📰';
  }
};

// Weather icon mapping
export const getWeatherIcon = (code) => {
  switch(code) {
    case 'sunny':
    case 'clear':
      return '☀️';
    case 'cloudy':
    case 'partly-cloudy':
      return '🌤️';
    case 'rainy':
      return '🌧️';
    case 'storm':
      return '⛈️';
    default:
      return '🌤️';
  }
};

// Function to humanize date (e.g., "Just now", "5m", etc.)
export const humanizeDate = (isoString) => {
  if (!isoString) return '-';
  const date = new Date(isoString);
  const now = new Date();
  const diff = Math.floor((now - date) / 1000);
  
  if (diff < 10) return 'Just now';
  if (diff < 60) return `${diff}s`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
  return date.toLocaleString('id-ID');
};

// Priority configuration for announcements
export const PRIORITY_CONFIG = {
  high: { color: '#e74c3c', icon: '📢' },
  medium: { color: '#f39c12', icon: '⚠️' },
  low: { color: '#3498db', icon: 'ℹ️' },
  default: { color: '#95a5a6', icon: 'ℹ️' }
};

// Priority mappings for announcements
export const priorityMap = {
  low: 1,
  medium: 10,
  high: 20,
};

export const reversePriorityMap = {
  1: 'low',
  10: 'medium',
  20: 'high',
};

// Time formatting for Indonesia timezone
export const formatTime = (date) => {
  return date.toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    timeZone: 'Asia/Jakarta'
  });
};

export const formatDate = (date) => {
  return date.toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'Asia/Jakarta'
  });
};

// Default durations and constants
export const DEFAULT_IMAGE = "/assets/demo.jpg";
export const DEFAULT_VIDEO = "/assets/demo-video.mp4";
export const ANIMATION_INTERVAL = 10000; // 10 seconds
export const VALIDITY_PERIOD = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds
export const FADE_TRANSITION_DURATION = 600; // 0.6 seconds
export const SCALE_TRANSITION_DURATION = 6000; // 6 seconds
export const DEFAULT_MAX_BUFFER_MS = 90000; // 90 seconds
export const DEFAULT_SAFETY_TIMEOUT = 5000; // 5 seconds
export const REFRESH_INTERVAL = 30 * 60 * 1000; // 30 minutes
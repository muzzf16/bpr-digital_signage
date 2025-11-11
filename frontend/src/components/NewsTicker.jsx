import React, { useMemo, useRef, useEffect } from 'react';
import { useEconomicData } from '../context/EconomicContext';

// Constants
const MIN_ANIMATION_DURATION = 30; // Increased minimum duration to 30 seconds as requested
const ANIMATION_SPEED_FACTOR = 20; // Slower speed factor
const ANIMATION_LENGTH_DIVISOR = 100; // Divisor for calculating duration based on text length

// Function to get news icon based on category
const getNewsIcon = (title) => {
  const lowerTitle = title.toLowerCase();
  
  if (lowerTitle.includes('ihsg') || lowerTitle.includes('saham') || lowerTitle.includes('stock') || lowerTitle.includes('market')) {
    return '💹';
  } else if (lowerTitle.includes('bank') || lowerTitle.includes('bpr') || lowerTitle.includes('perbankan') || lowerTitle.includes('bi') || lowerTitle.includes('o j k')) {
    return '🏦';
  } else if (lowerTitle.includes('inflasi') || lowerTitle.includes('ekonomi') || lowerTitle.includes('makro') || lowerTitle.includes('gdp')) {
    return '💰';
  } else if (lowerTitle.includes('rupiah') || lowerTitle.includes('kurs') || lowerTitle.includes('dollar') || lowerTitle.includes('valas')) {
    return '💱';
  } else {
    return '📰';
  }
};

export default function NewsTicker() {
  const { data, loading } = useEconomicData();
  const items = data?.news || [];

  // Hide if loading or no items
  if (loading || !items || items.length === 0) return null;

  // Limit to max 3 headlines as requested
  const limitedItems = items.slice(0, 3);

  // Generate ticker text from news items with icons
  const tickerText = useMemo(() => {
    return limitedItems.map(n => `${getNewsIcon(n.title)} ${n.title} — ${n.source}`).join('   •   ');
  }, [limitedItems]);

  // Calculate animation duration based on text length
  const durationSec = useMemo(() => {
    return Math.max(
      MIN_ANIMATION_DURATION,
      Math.round((tickerText.length / ANIMATION_LENGTH_DIVISOR) * ANIMATION_SPEED_FACTOR)
    );
  }, [tickerText.length]);

  const trackRef = useRef(null);

  // Handle pause/resume on hover
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const handleMouseEnter = () => {
      track.style.animationPlayState = 'paused';
    };

    const handleMouseLeave = () => {
      track.style.animationPlayState = 'running';
    };

    track.addEventListener('mouseenter', handleMouseEnter);
    track.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      track.removeEventListener('mouseenter', handleMouseEnter);
      track.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <div className="ticker" role="marquee" aria-live="polite" style={{
      position: 'absolute',
      bottom: '0.5vh',
      left: 0,
      right: 0,
      height: '4vh',
      background: 'rgba(0, 0, 0, 0.7)',
      display: 'flex',
      alignItems: 'center',
      overflow: 'hidden',
      zIndex: 50
    }}>
      <div
        ref={trackRef}
        style={{
          display: 'inline-block',
          whiteSpace: 'nowrap',
          willChange: 'transform',
          animation: `ticker-scroll ${durationSec}s linear infinite`,
          color: '#f5faff',
          fontSize: 'clamp(0.9rem, 1.3vw, 1.1rem)',
          fontWeight: 400
        }}
        tabIndex={0}
        aria-label={`News ticker: ${tickerText}`}
      >
        <span style={{
          paddingLeft: '2rem',
          paddingRight: '3rem'
        }}>
          {tickerText}
        </span>
        <span style={{
          paddingRight: '3rem'
        }}>
          {tickerText}
        </span>
      </div>

      <style>{`
        @keyframes ticker-scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}
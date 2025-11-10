import React, { useMemo, useRef, useEffect } from 'react';
import { useEconomicData } from '../context/EconomicContext';

// Constants
const MIN_ANIMATION_DURATION = 18; // Minimum duration in seconds
const ANIMATION_SPEED_FACTOR = 20; // Speed factor for calculating duration
const ANIMATION_LENGTH_DIVISOR = 100; // Divisor for calculating duration based on text length

export default function NewsTicker() {
  const { data, loading } = useEconomicData();
  const items = data?.news || [];

  // Hide if loading or no items
  if (loading || !items || items.length === 0) return null;

  // Generate ticker text from news items
  const tickerText = useMemo(() => {
    return items.map(n => `${n.title} — ${n.source}`).join('   •   ');
  }, [items]);

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
    <div className="ticker" role="marquee" aria-live="polite">
      <div
        ref={trackRef}
        style={{
          display: 'inline-block',
          whiteSpace: 'nowrap',
          willChange: 'transform',
          animation: `ticker-scroll ${durationSec}s linear infinite`
        }}
        tabIndex={0}
        aria-label={`News ticker: ${tickerText}`}
      >
        <span style={{ 
          paddingRight: '3rem', 
          fontSize: 'clamp(1rem,1.4vw,1.6rem)', 
          color: 'var(--muted)' 
        }}>
          {tickerText}
        </span>
        <span style={{ 
          paddingRight: '3rem', 
          fontSize: 'clamp(1rem,1.4vw,1.6rem)', 
          color: 'var(--muted)' 
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

import React, { useMemo, useRef, useEffect } from 'react';
import { useEconomicData } from '../../context/EconomicContext';
import { getNewsIcon } from "../../utils/common";

// Constants
const MIN_ANIMATION_DURATION = 30; // Increased minimum duration to 30 seconds as requested
const ANIMATION_SPEED_FACTOR = 20; // Slower speed factor
const ANIMATION_LENGTH_DIVISOR = 100; // Divisor for calculating duration based on text length

export default function NewsTicker() {
  const { data, loading } = useEconomicData();
  const items = data?.news || [];

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

  // Hide if loading or no items
  if (loading || !items || items.length === 0) return null;

  return (
    <div className="ticker-container" role="marquee" aria-live="polite">
      <div
        ref={trackRef}
        className="ticker-track"
        style={{
          animation: `ticker-scroll ${durationSec}s linear infinite`,
        }}
        tabIndex={0}
        aria-label={`News ticker: ${tickerText}`}
      >
        <span className="ticker-item">
          {tickerText}
        </span>
        <span className="ticker-item">
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
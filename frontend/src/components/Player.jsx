import React, { useRef, useEffect } from "react";
import { usePlayer } from "../hooks/usePlayer";
import { useTime } from "../hooks/useTime";
import { useEconomicData } from "../context/EconomicContext";

import Branding from "./Branding";
import Clock from "./Clock";
import PromoCard from "./PromoCard";
import RightColumn from "./RightColumn";
import SlideOverlay from "./SlideOverlay";
import NewsTicker from "./NewsTicker";
import Announcements from "./Announcements";

const Player = ({ deviceId }) => {
  const containerRef = useRef(null);
  const {
    playlist,
    index,
    loading,
    allowSound,
    handleKeyDown,
    currentItem,
    promoItem,
  } = usePlayer(deviceId);
  
  const { timeStr, dateStr } = useTime("Asia/Jakarta");
  const { data: economicData } = useEconomicData();

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    el.addEventListener("keydown", handleKeyDown);
    return () => el.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  if (loading || !playlist || playlist.length === 0) {
    return (
      <div className="loading-screen">
        Loading...
      </div>
    );
  }

  return (
    <div className="player" role="main" aria-live="polite" ref={containerRef} tabIndex={0}>
      <Branding />
      <Clock timeStr={timeStr} dateStr={dateStr} />
      
      <PromoCard item={currentItem.type === 'promo' ? currentItem : promoItem} />
      
      <div className="announcements-container">
        <Announcements deviceId={deviceId} />
      </div>

      <RightColumn economicData={economicData} />

      <SlideOverlay 
        currentItem={currentItem} 
        allowSound={allowSound} 
      />
      
      <NewsTicker />
    </div>
  );
};

export default Player;
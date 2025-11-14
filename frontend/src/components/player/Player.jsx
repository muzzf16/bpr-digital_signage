// src/components/player/Player.jsx
import React, { useRef, useEffect, memo } from "react";
import PropTypes from "prop-types";
import Branding from "./Branding";
import Clock from "./Clock";
import PromoCard from "./PromoCard";
import RightColumn from "./RightColumn";
import SlideOverlay from "./SlideOverlay";
import NewsTicker from "./NewsTicker";
import Announcements from "./Announcements";
import SlidingPanels from "./SlidingPanels";

// assume usePlayer hook encapsulates playlist, index, handlers
import { usePlayer } from "../../hooks/usePlayer";
import { useTime } from "../../hooks/useTime";
import { useEconomicData } from "../../context/EconomicContext";

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
    scheduleNextTick
  } = usePlayer(deviceId);

  const { timeStr, dateStr } = useTime("Asia/Jakarta");
  const { data: economicData, loading: econLoading } = useEconomicData();

  // Focus and keyboard handling
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    // focus once so keyboard works without click
    try { el.setAttribute("tabindex", "0"); el.focus(); } catch {}

    const onKey = (e) => handleKeyDown?.(e);
    el.addEventListener("keydown", onKey);
    return () => el.removeEventListener("keydown", onKey);
  }, [handleKeyDown]);

  if (loading) {
    return (
      <div className="player-root" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div className="loading-screen">Memuat konten...</div>
      </div>
    );
  }

  const effectivePromo = (currentItem?.type === "promo") ? currentItem : promoItem;

  return (
    <div className="player-root" ref={containerRef} role="main" aria-live="polite">
      {/* header containing branding + clock */}
      <div className="player-header" aria-hidden={false}>
        <div className="branding-container">
          <Branding />
        </div>
        <Clock timeStr={timeStr} dateStr={dateStr} />
      </div>

      {/* main grid */}
      <div className="player-grid" role="region" aria-label="Digital Signage layout">
        {/* LEFT: big promo / hero */}
        <section className="player-left" aria-label="Promo area">
          <div className="promo-large-wrapper">
            <div className="promo-branding" aria-hidden>
              {/* Branding pill, optional */}
              <Branding compact />
            </div>

            <div className="promo-large">
              {/* PromoCard is responsible for rendering title/sub + optional image */}
              <PromoCard item={effectivePromo} />
            </div>

            {/* announcements inside hero (bottom-left) */}
            <div className="promo-announcements" aria-hidden={false}>
              <Announcements deviceId={deviceId} />
            </div>
          </div>
        </section>

        {/* RIGHT: stacked modules */}
        <aside className="player-right" aria-label="Information column">
          <div className="right-top">
            <div className="right-news module-small">
              {/* news / headlines */}
              <RightColumn.NewsPanel />
            </div>
          </div>

          <div className="right-middle">
            {/* Sliding panels: ProductHighlight, RatePanel, EconPanel */}
            <div className="sliding-panels-container module-small">
              <SlidingPanels economicData={economicData} />
            </div>
          </div>

          <div className="right-bottom">
            <div className="mini-panels">
              <div className="mini-panel">
                <RightColumn.MiniChart id="suku-bunga" />
              </div>
              <div className="mini-panel">
                <RightColumn.MiniChart id="ihsg" />
              </div>
            </div>
          </div>
        </aside>

        {/* overlays: slide image / video / rate (SlideOverlay handles non-duplicate rendering) */}
        <div className="player-overlays" aria-hidden>
          <SlideOverlay
            currentItem={currentItem}
            allowSound={allowSound}
            scheduleNextTick={scheduleNextTick}
          />
        </div>
      </div>

      {/* ticker across bottom */}
      <div className="ticker-container" aria-hidden>
        <NewsTicker />
      </div>
    </div>
  );
};

Player.propTypes = {
  deviceId: PropTypes.string.isRequired
};

export default memo(Player);

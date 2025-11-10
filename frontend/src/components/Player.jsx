import React, { useEffect, useRef, useState, useCallback } from "react";
import ImageSlide from "./ImageSlide";
import PromoCard from "./PromoCard";
import RatePanel from "./RatePanel";
import EconPanel from "./EconPanel";
import NewsTicker from "./NewsTicker";
import VideoSlide from "./VideoSlide";

// Constants
const PLAYLIST_REFRESH_INTERVAL = 5 * 60 * 1000; // 5 minutes
const DEFAULT_IMAGE_DURATION = 12000; // 12 seconds
const DEFAULT_VIDEO_DURATION = 60000; // 60 seconds
const SAFETY_BUFFER = 2000; // 2 seconds buffer for videos

export default function Player({ deviceId }) {
  const [playlist, setPlaylist] = useState([]);
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const timerRef = useRef(null);
  const isVisibleRef = useRef(true);
  const mountedRef = useRef(true);
  const [allowSound, setAllowSound] = useState(false);
  const containerRef = useRef(null);

  // clock state (Asia/Jakarta)
  const [now, setNow] = useState(() => new Date());

  // update clock every second
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  // formatted time and date using Asia/Jakarta
  const timeStr = new Intl.DateTimeFormat("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
    timeZone: "Asia/Jakarta"
  }).format(now);

  const dateStr = new Intl.DateTimeFormat("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Asia/Jakarta"
  }).format(now);

  // Fetch playlist
  const fetchPlaylist = useCallback(async () => {
    try {
      const res = await fetch(`/api/devices/${encodeURIComponent(deviceId)}/playlist?api_key=secret_dev_key`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const j = await res.json();
      if (j.playlist && Array.isArray(j.playlist.items)) {
        setPlaylist(j.playlist.items.map(it => ({ duration: 12, ...it })));
        setLoading(false);
      } else {
        setLoading(false);
      }
    } catch (e) {
      console.warn("Fetch playlist failed", e);
      setLoading(false);
    }
  }, [deviceId]);

  // visibility handler
  useEffect(() => {
    const handleVisibility = () => {
      isVisibleRef.current = !document.hidden;
      if (!isVisibleRef.current && timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      } else if (isVisibleRef.current) {
        scheduleNextTick(0);
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, []);

  // schedule next tick
  const scheduleNextTick = useCallback((ms) => {
    if (!mountedRef.current) return;
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    if (!isVisibleRef.current) return;
    timerRef.current = setTimeout(() => {
      setIndex(prevIndex => {
        const nextIndex = playlist && playlist.length ? (prevIndex + 1) % playlist.length : 0;
        return nextIndex;
      });
    }, ms);
  }, [playlist]);

  // rotation logic per item
  useEffect(() => {
    if (!playlist || playlist.length === 0) return;
    const cur = playlist[index];
    if (!cur) return;

    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    let duration = DEFAULT_IMAGE_DURATION;
    if (cur.type === "video") {
      duration = (cur.duration && Number(cur.duration) > 0 ? Number(cur.duration) * 1000 : DEFAULT_VIDEO_DURATION) + SAFETY_BUFFER;
    } else if (cur.duration && Number(cur.duration) > 0) {
      duration = Number(cur.duration) * 1000;
    }

    scheduleNextTick(duration);

    // preload next image
    const next = playlist[(index + 1) % playlist.length];
    if (next && next.type === "image" && next.url) {
      const img = new Image();
      img.src = next.url;
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [index, playlist, scheduleNextTick]);

  // keep index valid
  useEffect(() => {
    if (!Array.isArray(playlist) || playlist.length === 0) {
      setIndex(0);
      if (timerRef.current) { clearTimeout(timerRef.current); timerRef.current = null; }
      return;
    }
    if (index >= playlist.length) setIndex(0);
  }, [playlist, index]);

  // init playlist and refresh
  useEffect(() => {
    mountedRef.current = true;
    fetchPlaylist();
    const id = setInterval(fetchPlaylist, PLAYLIST_REFRESH_INTERVAL);
    return () => {
      mountedRef.current = false;
      clearInterval(id);
    };
  }, [fetchPlaylist]);

  // keyboard shortcuts for operator (container must be focused)
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const handleKeyDown = (e) => {
      if (e.code === "Space" || e.code === "ArrowRight") {
        e.preventDefault();
        scheduleNextTick(0);
      }
      if (e.code === "ArrowLeft") {
        e.preventDefault();
        setIndex(prevIndex => {
          const nextIndex = playlist && playlist.length ? (prevIndex - 1 + playlist.length) % playlist.length : 0;
          return nextIndex;
        });
      }
      if (e.key === "s" || e.key === "S") {
        setAllowSound(prev => !prev);
      }
    };
    el.addEventListener("keydown", handleKeyDown);
    return () => el.removeEventListener("keydown", handleKeyDown);
  }, [playlist, scheduleNextTick]);

  if (loading || !playlist || playlist.length === 0) {
    return (
      <div className="bg-black text-white h-screen w-screen flex items-center justify-center text-4xl">
        Loading...
      </div>
    );
  }

  const currentItem = playlist[index];
  const promoItem = playlist.find(p => p.type === "promo") || {
    title: "Promo Unggulan",
    subtitle: "Layanan BPR terbaik untuk Anda",
    image: "/assets/demo.jpg"
  };

  return (
    <div className="player relative" role="main" aria-live="polite" ref={containerRef} tabIndex={0}>

      {/* -------------------------
          TOP BAR: Branding (left) + Clock (right)
         ------------------------- */}
      <div style={{ position: "absolute", top: "2vh", left: "2vw", zIndex: 60 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "1vw",
            background: "rgba(0,0,0,0.28)",
            padding: "0.6vw 1vw",
            borderRadius: 10,
            backdropFilter: "blur(6px)"
          }}
        >
          <img
            src="/assets/logo-bpr.png"
            alt="Logo Bank Perekonomian Rakyat"
            onError={(e) => (e.currentTarget.style.display = "none")}
            style={{ width: "clamp(48px, 6vw, 96px)", height: "auto", objectFit: "contain" }}
          />
          <div style={{ color: "#fff", fontWeight: 800, lineHeight: 1 }}>
            <div style={{ fontSize: "clamp(0.9rem, 1.8vw, 1.6rem)" }}>Bank</div>
            <div style={{ fontSize: "clamp(1.2rem, 2.4vw, 2.8rem)", color: "#ffd166" }}>Perekonomian Rakyat</div>
          </div>
        </div>
      </div>

      <div style={{ position: "absolute", top: "2vh", right: "2vw", zIndex: 60 }}>
        <div
          style={{
            textAlign: "right",
            background: "rgba(0,0,0,0.28)",
            padding: "0.5vw 0.9vw",
            borderRadius: 10,
            backdropFilter: "blur(6px)",
            color: "#fff",
            minWidth: "10ch"
          }}
        >
          <div style={{ fontSize: "clamp(1rem, 2.2vw, 2.2rem)", fontWeight: 700 }}>{timeStr}</div>
          <div style={{ fontSize: "clamp(0.8rem, 1.4vw, 1rem)", opacity: 0.85 }}>{dateStr}</div>
        </div>
      </div>

      {/* -------------------------
          MAIN LAYOUT (promo left, panels right)
         ------------------------- */}
      <div className="promo-card" aria-hidden={false}>
        <PromoCard item={currentItem.type === "promo" ? currentItem : promoItem} />
      </div>

      <div className="right-col" role="complementary">
        <div style={{ width: "100%", height: "100%" }}>
          <RatePanel productId={playlist.find(i => i.type === "rate")?.productId} fallback={playlist.find(i => i.type === "rate")} />
        </div>
        <div style={{ width: "100%", height: "100%" }}>
          <EconPanel />
        </div>
      </div>

      {/* Slide overlay */}
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
        {currentItem.type === "image" && <ImageSlide url={currentItem.url} title={currentItem.title} />}
        {currentItem.type === "economic" && <EconPanel />}
        {currentItem.type === "rate" && <RatePanel productId={currentItem.productId} />}
        {currentItem.type === "video" && (
          <div style={{ width: "100%", height: "100%", pointerEvents: "auto" }}>
            <VideoSlide
              url={currentItem.url}
              poster={currentItem.poster}
              mute={!allowSound}
              onEnded={() => scheduleNextTick(0)}
              onError={() => scheduleNextTick(1000)}
            />
          </div>
        )}
      </div>

      {/* Footer Branding (center above ticker) - kept minimal since top branding exists */}
      {/* (optional: you can remove this block if you don't want duplicate branding at bottom) */}
      {/* <div style={{ position: 'absolute', left:0, right:0, bottom:'9vh', display:'flex', justifyContent:'center', zIndex:50 }}>
        ... */}
      {/* </div> */}

      {/* News ticker (very bottom) */}
      <NewsTicker />
    </div>
  );
}

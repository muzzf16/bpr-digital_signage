import React, { useEffect, useRef, useState, useCallback } from "react";
import { useEconomicData } from "../context/EconomicContext";
import ImageSlide from "./ImageSlide";
import PromoCard from "./PromoCard";
import RatePanel from "./RatePanel";
import EconPanel from "./EconPanel";
import NewsTicker from "./NewsTicker";
import VideoSlide from "./VideoSlide";
import ProductHighlight from "./ProductHighlight";
import MiniChart from "./MiniChart";
import NewsPanel from "./NewsPanel";
import Announcements from "./Announcements";

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



  // Get economic data for weather and other info
  const { data: economicData, loading: economicLoading } = useEconomicData();
  
  // formatted time and date using Asia/Jakarta
  const now = new Date();
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
  
  // Extract weather data from economic data
  const temperature = economicData?.weather?.temperature || 31;
  const condition = economicData?.weather?.condition || "Cerah Berawan";

  // Fetch playlist
  const fetchPlaylist = useCallback(async () => {
    try {
      const res = await fetch(`/api/devices/${encodeURIComponent(deviceId)}/playlist`, {
        headers: {
          'x-api-key': 'secret_dev_key'
        }
      });
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

  const SkeletonBar = () => (
    <div style={{ height: 8, width: '60%', background: 'linear-gradient(90deg, #083b59, #0b5b7a)', borderRadius: 6, marginBottom: 4 }} />
  );

  return (
    <div className="player relative" role="main" aria-live="polite" ref={containerRef} tabIndex={0}>

      {/* -------------------------
          TOP BAR: Branding (left) + Clock (right)
         ------------------------- */}
      <div className="branding">
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "1vw"
          }}
        >
          <img
            src="/assets/logo-bpr.png"
            alt="Logo Bank Perekonomian Rakyat"
            onError={(e) => (e.currentTarget.style.display = "none")}
          />
          <div>
            <div>Bank</div>
            <div>Perekonomian Rakyat</div>
            <div>
              Solusi Keuangan Masyarakat — Aman & Terpercaya
            </div>
          </div>
        </div>
      </div>

      <div className="clock-panel">
        <div className="clock-time">{timeStr}</div>
        <div className="clock-date">{dateStr}</div>
      </div>



      {/* -------------------------
          MAIN LAYOUT (promo left, panels right)
         ------------------------- */}
      <PromoCard item={currentItem.type === 'promo' ? currentItem : promoItem} />

      {/* Announcements panel below the promo card */}
      <div style={{
        position: "absolute",
        top: "calc(10vh + 50%)",
        left: "2vw",
        width: "30%",
        zIndex: 31
      }}>
        <Announcements deviceId={deviceId} />
      </div>

      <div className="right-col" role="complementary">
        {/* Top Module: Weather Info */}
        <div style={{
          background: "linear-gradient(135deg, #013a63, #083b6d)",
          borderRadius: 16,
          padding: "1.2vw",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          color: "#f5faff",
          boxShadow: "0 6px 12px rgba(0,0,0,0.25)"
        }}>
          <div style={{ 
            fontSize: "clamp(1.2rem, 2.5vw, 2.2rem)", 
            fontWeight: 700, 
            marginBottom: "0.3vh"
          }}>
            {temperature}°C
          </div>
          <div style={{ 
            display: "flex", 
            alignItems: "center", 
            gap: "0.4vw", 
            fontSize: "clamp(0.8rem, 1.3vw, 1rem)",
            textAlign: "center"
          }}>
            <span>🌤️</span>
            <span>{condition} — Depok</span>
          </div>
        </div>

        {/* Middle Module: Product & News */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "2fr 1fr",
          gap: "1vw",
          height: "100%"
        }}>
          <div style={{ 
            background: "#062e55",
            borderRadius: 16,
            padding: "1vw",
            color: "#f5faff",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            boxShadow: "0 6px 12px rgba(0,0,0,0.25)"
          }}>
            <ProductHighlight />
          </div>
          <div style={{ 
            background: "#062e55", 
            borderRadius: 16, 
            padding: "1vw",
            color: "#f5faff",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            boxShadow: "0 6px 12px rgba(0,0,0,0.25)"
          }}>
            <NewsPanel />
          </div>
        </div>

        {/* Bottom Module: Economic Data with Mini Charts */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "1vw",
          height: "100%"
        }}>
          <div style={{
            background: "#062e55",
            borderRadius: 16,
            padding: "1vw",
            color: "#f5faff",
            boxShadow: "0 6px 12px rgba(0,0,0,0.25)"
          }}>
            <div style={{ height: '60%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <RatePanel productId={playlist.find(i => i.type === "rate")?.productId} fallback={playlist.find(i => i.type === "rate")} />
            </div>
            <div style={{ height: '40%', marginTop: "0.5vh" }}>
              <MiniChart
                type="line"
                data={[6.7, 6.8, 6.9, 7.0, 6.9, 6.8, 6.85]}
                title="Suku Bunga"
                currentValue="6.85%"
                color="#50c878"
                period="7 hari"
              />
            </div>
          </div>
          <div style={{
            background: "#062e55",
            borderRadius: 16,
            padding: "1vw",
            color: "#f5faff",
            boxShadow: "0 6px 12px rgba(0,0,0,0.25)"
          }}>
            <div style={{ height: '60%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <EconPanel />
            </div>
            <div style={{ height: '40%', marginTop: "0.5vh" }}>
              <MiniChart
                type="line"
                data={[7120, 7135, 7150, 7145, 7160, 7155, 7165]}
                title="IHSG"
                currentValue="7,165.00 ▲ +0.12%"
                color="#00bcd4"
                period="7 hari"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Slide overlay */}
     <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
  {currentItem.type === "image" && (
    <div style={{ width: "100%", height: "100%" }}>
      <ImageSlide url={currentItem.url} title={currentItem.title} />
    </div>
  )}

  {currentItem.type === "economic" && (
    <div style={{ width: "100%", height: "100%" }}>
      <EconPanel />
    </div>
  )}

  {/* NOTE: rate is intentionally NOT rendered here to avoid duplicate.
      RatePanel is already visible inside the right column. */}

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
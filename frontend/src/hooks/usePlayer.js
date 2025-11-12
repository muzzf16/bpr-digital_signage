import { useState, useEffect, useRef, useCallback } from 'react';

const PLAYLIST_REFRESH_INTERVAL = 5 * 60 * 1000; // 5 minutes
const DEFAULT_IMAGE_DURATION = 12000; // 12 seconds
const DEFAULT_VIDEO_DURATION = 60000; // 60 seconds
const SAFETY_BUFFER = 2000; // 2 seconds buffer for videos

export const usePlayer = (deviceId) => {
  const [playlist, setPlaylist] = useState([]);
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [allowSound, setAllowSound] = useState(false);
  const timerRef = useRef(null);
  const isVisibleRef = useRef(true);
  const mountedRef = useRef(true);

  const scheduleNextTick = useCallback((ms) => {
    if (!mountedRef.current) return;
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    if (!isVisibleRef.current) return;
    timerRef.current = setTimeout(() => {
      setIndex(prevIndex => (playlist && playlist.length ? (prevIndex + 1) % playlist.length : 0));
    }, ms);
  }, [playlist]);

  const fetchPlaylist = useCallback(async () => {
    try {
      const res = await fetch(`/api/devices/${encodeURIComponent(deviceId)}/playlist`, {
        headers: { 'x-api-key': 'secret_dev_key' }
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const j = await res.json();
      if (j.playlist && Array.isArray(j.playlist.items)) {
        setPlaylist(j.playlist.items.map(it => ({ duration: 12, ...it })));
      }
    } catch (e) {
      console.warn("Fetch playlist failed", e);
    } finally {
      setLoading(false);
    }
  }, [deviceId]);

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
  }, [scheduleNextTick]);

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

  useEffect(() => {
    if (!Array.isArray(playlist) || playlist.length === 0) {
      setIndex(0);
      if (timerRef.current) { clearTimeout(timerRef.current); timerRef.current = null; }
      return;
    }
    if (index >= playlist.length) setIndex(0);
  }, [playlist, index]);

  useEffect(() => {
    mountedRef.current = true;
    fetchPlaylist();
    const id = setInterval(fetchPlaylist, PLAYLIST_REFRESH_INTERVAL);
    return () => {
      mountedRef.current = false;
      clearInterval(id);
    };
  }, [fetchPlaylist]);

  const handleKeyDown = useCallback((e) => {
    if (e.code === "Space" || e.code === "ArrowRight") {
      e.preventDefault();
      scheduleNextTick(0);
    }
    if (e.code === "ArrowLeft") {
      e.preventDefault();
      setIndex(prevIndex => (playlist && playlist.length ? (prevIndex - 1 + playlist.length) % playlist.length : 0));
    }
    if (e.key === "s" || e.key === "S") {
      setAllowSound(prev => !prev);
    }
  }, [playlist, scheduleNextTick]);

  return {
    playlist,
    index,
    loading,
    allowSound,
    handleKeyDown,
    currentItem: playlist[index],
    promoItem: playlist.find(p => p.type === "promo") || {
      title: "Promo Unggulan",
      subtitle: "Layanan BPR terbaik untuk Anda",
      image: "/assets/demo.jpg"
    },
  };
};
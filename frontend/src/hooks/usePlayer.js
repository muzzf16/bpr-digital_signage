// src/hooks/usePlayer.js
// Optimized player hook with performance improvements
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
  const fetchAbortControllerRef = useRef(null);

  // Memoized callback to schedule next item
  const scheduleNextTick = useCallback((ms) => {
    if (!mountedRef.current) return;
    
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    
    if (!isVisibleRef.current) return;
    
    timerRef.current = setTimeout(() => {
      setIndex(prevIndex => {
        if (!playlist || !Array.isArray(playlist) || playlist.length === 0) {
          return 0;
        }
        return (prevIndex + 1) % playlist.length;
      });
    }, ms);
  }, [playlist]);

  // Memoized callback to fetch playlist with abort controller
  const fetchPlaylist = useCallback(async () => {
    try {
      // Cancel any previous fetch requests
      if (fetchAbortControllerRef.current) {
        fetchAbortControllerRef.current.abort();
      }
      
      // Create a new abort controller for this request
      fetchAbortControllerRef.current = new AbortController();
      
      const res = await fetch(`/api/devices/${encodeURIComponent(deviceId)}/playlist`, {
        headers: { 
          'x-api-key': 'secret_dev_key',
          'Content-Type': 'application/json'
        },
        signal: fetchAbortControllerRef.current.signal
      });
      
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      
      const j = await res.json();
      
      if (j.playlist && Array.isArray(j.playlist.items)) {
        // Only update state if component is still mounted
        if (mountedRef.current) {
          setPlaylist(prevPlaylist => {
            // Prevent unnecessary re-renders if playlist hasn't changed
            const newPlaylist = j.playlist.items.map(it => ({ duration: 12, ...it }));
            if (JSON.stringify(prevPlaylist) === JSON.stringify(newPlaylist)) {
              return prevPlaylist;
            }
            return newPlaylist;
          });
        }
      }
    } catch (e) {
      if (e.name !== 'AbortError' && mountedRef.current) {
        console.warn("Fetch playlist failed", e);
      }
    } finally {
      if (mountedRef.current) {
        setLoading(false);
      }
    }
  }, [deviceId]);

  // Handle document visibility changes
  useEffect(() => {
    const handleVisibility = () => {
      isVisibleRef.current = !document.hidden;
      if (!isVisibleRef.current && timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      } else if (isVisibleRef.current && playlist && playlist.length > 0) {
        scheduleNextTick(0);
      }
    };
    
    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, [scheduleNextTick, playlist]);

  // Handle item transitions with optimized timing
  useEffect(() => {
    if (!playlist || playlist.length === 0) return;
    
    const current = playlist[index];
    if (!current) return;

    // Clear existing timer
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    // Calculate duration based on content type
    let duration = DEFAULT_IMAGE_DURATION;
    if (current.type === "video") {
      duration = (current.duration && Number(current.duration) > 0 
        ? Number(current.duration) * 1000 
        : DEFAULT_VIDEO_DURATION) + SAFETY_BUFFER;
    } else if (current.duration && Number(current.duration) > 0) {
      duration = Number(current.duration) * 1000;
    }

    // Schedule next item
    scheduleNextTick(duration);

    // Preload next item if it's an image
    const nextIndex = (index + 1) % playlist.length;
    const next = playlist[nextIndex];
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

  // Reset index if playlist length changes
  useEffect(() => {
    if (!Array.isArray(playlist) || playlist.length === 0) {
      setIndex(0);
      if (timerRef.current) { 
        clearTimeout(timerRef.current); 
        timerRef.current = null; 
      }
      return;
    }
    if (index >= playlist.length) {
      setIndex(0);
    }
  }, [playlist, index]);

  // Initial setup and periodic refresh
  useEffect(() => {
    mountedRef.current = true;
    fetchPlaylist();
    
    const refreshInterval = setInterval(fetchPlaylist, PLAYLIST_REFRESH_INTERVAL);
    
    return () => {
      mountedRef.current = false;
      
      // Clear timeouts and intervals
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      
      if (fetchAbortControllerRef.current) {
        fetchAbortControllerRef.current.abort();
      }
      
      clearInterval(refreshInterval);
    };
  }, [fetchPlaylist]);

  // Keyboard event handler
  const handleKeyDown = useCallback((e) => {
    if (e.code === "Space" || e.code === "ArrowRight") {
      e.preventDefault();
      scheduleNextTick(0);
    }
    if (e.code === "ArrowLeft") {
      e.preventDefault();
      setIndex(prevIndex => {
        if (!playlist || !Array.isArray(playlist) || playlist.length === 0) {
          return 0;
        }
        return (prevIndex - 1 + playlist.length) % playlist.length;
      });
    }
    if (e.key === "s" || e.key === "S") {
      setAllowSound(prev => !prev);
    }
  }, [playlist, scheduleNextTick]);

  // Memoize the current item and promo item to prevent unnecessary re-renders
  const currentItem = playlist[index] || null;
  const promoItem = playlist.find(p => p.type === "promo") || {
    title: "Promo Unggulan",
    subtitle: "Layanan BPR terbaik untuk Anda",
    image: "/assets/demo.jpg"
  };

  return {
    playlist,
    index,
    loading,
    allowSound,
    handleKeyDown,
    currentItem,
    promoItem,
  };
};
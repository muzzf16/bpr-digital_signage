import React, { useEffect, useRef, useState, useCallback } from "react";

// Constants
const DEFAULT_MAX_BUFFER_MS = 90000; // 90 seconds
const DEFAULT_SAFETY_TIMEOUT = 5000; // 5 seconds for error handling

/**
 * VideoSlide
 *
 * Props:
 *  - url (string)           : video URL (required)
 *  - poster (string)        : poster image shown while loading (optional)
 *  - autoAdvance (bool)     : true => call onEnded when playback ends (default true)
 *  - mute (bool)            : start muted (default true)
 *  - loop (bool)            : loop video instead of ending (default false)
 *  - maxBufferMs (number)   : safety timeout in ms to advance if video stalls (default 90000)
 *  - onReady ()             : callback when video can play
 *  - onEnded ()             : callback when video ended (or safety timeout)
 *  - onError (err)          : callback on error
 */
export default function VideoSlide({
  url,
  poster = null,
  autoAdvance = true,
  mute = true,
  loop = false,
  maxBufferMs = DEFAULT_MAX_BUFFER_MS,
  onReady = () => {},
  onEnded = () => {},
  onError = () => {}
}) {
  const videoRef = useRef(null);
  const timeoutRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const [paused, setPaused] = useState(false);
  const [muted, setMuted] = useState(Boolean(mute));

  // Clean up timeout
  const clearSafetyTimeout = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  // Set up safety timeout
  const setupSafetyTimeout = useCallback(() => {
    clearSafetyTimeout();
    timeoutRef.current = setTimeout(() => {
      console.warn("VideoSlide: safety timeout reached");
      if (autoAdvance) {
        onEnded();
      }
      setLoading(false);
    }, maxBufferMs);
  }, [autoAdvance, maxBufferMs, onEnded, clearSafetyTimeout]);

  // Handle URL change
  useEffect(() => {
    setLoading(true);
    setFailed(false);
    setPaused(false);
    setMuted(Boolean(mute));

    setupSafetyTimeout();

    return () => {
      clearSafetyTimeout();
    };
  }, [url, mute, autoAdvance, setupSafetyTimeout, clearSafetyTimeout]);

  // Set up video event listeners
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleCanPlay = () => {
      clearSafetyTimeout();
      setLoading(false);
      onReady();
      // autoplay: try play() — must be muted in modern browsers or user gesture required
      video.muted = muted;
      video.play().catch(err => {
        // play may fail if autoplay policy; still treat as ready
        console.warn("Video play() failed:", err);
      });
    };

    const handleEnded = () => {
      if (loop) {
        // if looping, ensure we keep playing
        try { 
          video.currentTime = 0; 
          video.play().catch(() => {}); 
        } catch {}
        return;
      }
      onEnded();
    };

    const handleError = (e) => {
      console.error("VideoSlide error", e);
      clearSafetyTimeout();
      setFailed(true);
      setLoading(false);
      onError(e);
    };

    // Add event listeners
    video.addEventListener("canplay", handleCanPlay);
    video.addEventListener("canplaythrough", handleCanPlay);
    video.addEventListener("loadeddata", handleCanPlay);
    video.addEventListener("ended", handleEnded);
    video.addEventListener("error", handleError);

    // Cleanup event listeners
    return () => {
      try {
        video.removeEventListener("canplay", handleCanPlay);
        video.removeEventListener("canplaythrough", handleCanPlay);
        video.removeEventListener("loadeddata", handleCanPlay);
        video.removeEventListener("ended", handleEnded);
        video.removeEventListener("error", handleError);
      } catch {}
    };
  }, [muted, loop, autoAdvance, onReady, onEnded, onError, clearSafetyTimeout]);

  const handleRetry = () => {
    setFailed(false);
    setLoading(true);
    try {
      const video = videoRef.current;
      if (video) {
        video.load();
        video.play().catch(() => {});
      }
    } catch (e) {
      console.warn("retry failed", e);
    }
    setupSafetyTimeout();
  };

  const togglePause = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play().catch(() => {});
      setPaused(false);
    } else {
      video.pause();
      setPaused(true);
    }
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setMuted(video.muted);
  };

  // Inline styles for fullscreen cover
  const containerStyle = {
    width: "100%",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#000"
  };

  const videoStyle = {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    display: loading ? "none" : "block"
  };

  const posterStyle = {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    display: loading && poster ? "block" : "none"
  };

  return (
    <div
      role="region"
      aria-label="Video promo"
      aria-live="polite"
      tabIndex={0}
      style={containerStyle}
      onKeyDown={(e) => {
        // maintenance keyboard shortcuts
        if (e.key === " " || e.key === "k") { e.preventDefault(); togglePause(); }
        if (e.key === "m") { e.preventDefault(); toggleMute(); }
      }}
    >
      {/* poster while loading or when provided */}
      {poster && <img src={poster} alt="poster" style={posterStyle} />}

      {/* video element */}
      <video
        ref={videoRef}
        src={url}
        poster={poster || undefined}
        style={videoStyle}
        playsInline
        muted={muted}
        loop={loop}
        preload="auto"
      />

      {/* overlay controls & status (hidden for normal signage but available on focus) */}
      <div style={{ position: "absolute", left: 16, top: 12, color: "#fff", fontSize: 13, opacity: 0.95 }}>
        {loading ? "Memuat video..." : failed ? "Gagal memuat video" : paused ? "Paused" : "Memutar"}
      </div>

      {/* action buttons for maintenance/testing (visually subtle) */}
      <div style={{ position: "absolute", right: 12, bottom: 12, display: "flex", gap: 8 }}>
        {/* show only when focused to avoid clutter on TV */}
        <button
          onClick={togglePause}
          title="Play/Pause (space)"
          style={{
            display: "inline-block",
            background: "rgba(0,0,0,0.45)",
            color: "#fff",
            border: "1px solid rgba(255,255,255,0.08)",
            padding: "8px 10px",
            borderRadius: 8,
            fontSize: 14,
            cursor: "pointer",
            backdropFilter: "blur(4px)"
          }}
          aria-label={paused ? "Play video" : "Pause video"}
        >
          {paused ? "Play" : "Pause"}
        </button>

        <button
          onClick={toggleMute}
          title="Mute/Unmute (m)"
          style={{
            display: "inline-block",
            background: "rgba(0,0,0,0.45)",
            color: "#fff",
            border: "1px solid rgba(255,255,255,0.08)",
            padding: "8px 10px",
            borderRadius: 8,
            fontSize: 14,
            cursor: "pointer",
            backdropFilter: "blur(4px)"
          }}
          aria-label={muted ? "Unmute video" : "Mute video"}
        >
          {muted ? "Muted" : "Sound"}
        </button>

        {failed && (
          <button
            onClick={handleRetry}
            title="Retry loading"
            style={{
              display: "inline-block",
              background: "#ffd166",
              color: "#042a57",
              border: "none",
              padding: "8px 12px",
              borderRadius: 8,
              fontWeight: 700,
              cursor: "pointer"
            }}
            aria-label="Retry loading video"
          >
            Retry
          </button>
        )}
      </div>
    </div>
  );
}

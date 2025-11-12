import React, { useEffect, useState, useCallback } from "react";

// Constants
const DEFAULT_IMAGE = "/assets/demo.jpg";
const FADE_TRANSITION_DURATION = 600; // 0.6 seconds
const SCALE_TRANSITION_DURATION = 6000; // 6 seconds

export default function ImageSlide({ url, title }) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const [opacity, setOpacity] = useState(0);
  
  // Determine the image source
  const src = url?.startsWith("/") ? url : url || DEFAULT_IMAGE;

  // Handle image loading
  const loadNewImage = useCallback(() => {
    setLoaded(false);
    setError(false);
    setOpacity(0); // Start with opacity 0
    
    const img = new Image();
    img.src = src;
    img.onload = () => {
      setLoaded(true);
      setOpacity(1); // Fade in after loading
    };
    img.onerror = () => setError(true);
  }, [src]);

  useEffect(() => {
    loadNewImage();
  }, [loadNewImage]);

  if (error) {
    return (
      <div className="image-slide-error">
        Gagal memuat gambar
      </div>
    );
  }

  return (
    <div 
      className="image-slide-container"
      style={{ 
        opacity: opacity, 
        transition: `opacity ${FADE_TRANSITION_DURATION}ms ease-in-out` 
      }}
    >
      <img 
        src={src} 
        alt={title || "promo"} 
        className="image-slide-img"
        style={{ 
          transition: `transform ${SCALE_TRANSITION_DURATION}ms ease-out` 
        }} 
      />
      <div className="image-slide-overlay" />
      {title && (
        <div className="image-slide-title">
          {title}
        </div>
      )}
    </div>
  );
}

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
      <div className="w-full h-full flex items-center justify-center bg-gray-900 text-white text-3xl">
        Gagal memuat gambar
      </div>
    );
  }

  return (
    <div 
      className="w-full h-full flex items-center justify-center relative overflow-hidden bg-black" 
      style={{ 
        opacity: opacity, 
        transition: `opacity ${FADE_TRANSITION_DURATION}ms ease-in-out` 
      }}
    >
      <img 
        src={src} 
        alt={title || "promo"} 
        className="w-full h-full object-cover" 
        style={{ 
          filter: "brightness(0.96)", 
          transform: "scale(1.02)", 
          transition: `transform ${SCALE_TRANSITION_DURATION}ms ease-out` 
        }} 
      />
      <div 
        className="absolute bottom-0 left-0 w-full h-1/3" 
        style={{ 
          background: "linear-gradient(180deg, rgba(0,0,0,0.75), transparent)" 
        }} 
      />
      {title && (
        <div 
          className="absolute left-[3vw] bottom-[6vh] text-white font-bold" 
          style={{ 
            fontSize: "clamp(1.8rem, 4vw, 5rem)", 
            lineHeight: 1.05, 
            textShadow: "0 2px 12px rgba(0,0,0,.8)", 
            maxWidth: "85%" 
          }}
        >
          {title}
        </div>
      )}
    </div>
  );
}

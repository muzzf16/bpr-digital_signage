import React, { useEffect, useState, useCallback, memo } from "react";
import PropTypes from 'prop-types';
import { DEFAULT_IMAGE, FADE_TRANSITION_DURATION, SCALE_TRANSITION_DURATION } from "../../utils/common";

const ImageSlide = ({ url, title, className = "", alt = "Slide" }) => {
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
      <div
        className={`image-slide-error ${className}`}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          backgroundColor: '#333',
          color: 'white',
          fontSize: '1.2rem'
        }}
      >
        Gagal memuat gambar
      </div>
    );
  }

  return (
    <div
      className={`image-slide-container ${className}`}
      style={{
        opacity: opacity,
        transition: `opacity ${FADE_TRANSITION_DURATION}ms ease-in-out`,
        position: 'relative',
        height: '100%',
        overflow: 'hidden'
      }}
    >
      <img
        src={src}
        alt={alt || title || "promo"}
        className="image-slide-img"
        loading="eager"  // Since these are slides, eager loading is appropriate
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          transition: `transform ${SCALE_TRANSITION_DURATION}ms ease-out`
        }}
      />
      <div
        className="image-slide-overlay"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(0deg, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.1) 100%)',
          pointerEvents: 'none'
        }}
      />
      {title && (
        <div
          className="image-slide-title"
          style={{
            position: 'absolute',
            bottom: '20px',
            left: '20px',
            color: 'white',
            fontSize: '1.5rem',
            fontWeight: 'bold',
            textShadow: '1px 1px 3px rgba(0,0,0,0.8)',
            zIndex: 2
          }}
        >
          {title}
        </div>
      )}
    </div>
  );
};

ImageSlide.propTypes = {
  url: PropTypes.string,
  title: PropTypes.string,
  className: PropTypes.string,
  alt: PropTypes.string
};

export default memo(ImageSlide);

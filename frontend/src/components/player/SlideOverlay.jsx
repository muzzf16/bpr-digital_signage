import React, { memo } from 'react';
import ImageSlide from './ImageSlide';
import VideoSlide from './VideoSlide';
import { LazyEconPanel } from '../panels';

const SlideOverlay = ({ currentItem, allowSound, scheduleNextTick }) => {
  if (!currentItem) return null;

  return (
    <div className="slide-overlay">
      {currentItem.type === "image" && (
        <div className="slide-overlay-item">
          <ImageSlide url={currentItem.url} title={currentItem.title} />
        </div>
      )}

      {/* {currentItem.type === "economic" && (
        <div className="slide-overlay-item">
          <LazyEconPanel />
        </div>
      )} */}

      {currentItem.type === "video" && (
        <div className="slide-overlay-item" style={{ pointerEvents: "auto" }}>
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
  );
};

export default memo(SlideOverlay);
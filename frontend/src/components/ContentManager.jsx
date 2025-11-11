import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function ContentManager() {
  const [slides, setSlides] = useState([]);
  const [promos, setPromos] = useState([]);
  const [videos, setVideos] = useState([]);
  const [currentSlide, setCurrentSlide] = useState({
    type: 'image',
    url: '',
    title: '',
    duration: 10
  });
  const [currentPromo, setCurrentPromo] = useState({
    title: '',
    subtitle: '',
    rate: '',
    image: ''
  });
  const [currentVideo, setCurrentVideo] = useState({
    url: '',
    title: '',
    duration: 30
  });

  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = () => {
    // In a real implementation, these would fetch from the backend API
    // For now, we'll use static examples
    setSlides([
      { id: 1, type: 'image', url: '/assets/demo.jpg', title: 'Promo Tabungan', duration: 10 },
      { id: 2, type: 'image', url: '/assets/demo2.jpg', title: 'KPR Spesial', duration: 10 }
    ]);
    
    setPromos([
      { id: 1, title: 'Tabungan Simpanas', subtitle: 'Nikmati bunga menarik', rate: '4.25%', image: '/assets/demo.jpg' }
    ]);
    
    setVideos([
      { id: 1, url: '/assets/demo-video.mp4', title: 'Promo Spesial', duration: 30 }
    ]);
  };

  const addSlide = () => {
    if (!currentSlide.url) {
      alert('Please provide a URL for the slide');
      return;
    }
    
    const newSlide = {
      id: slides.length + 1,
      ...currentSlide
    };
    
    setSlides([...slides, newSlide]);
    setCurrentSlide({ type: 'image', url: '', title: '', duration: 10 });
  };

  const addPromo = () => {
    if (!currentPromo.title || !currentPromo.image) {
      alert('Please provide a title and image for the promo');
      return;
    }
    
    const newPromo = {
      id: promos.length + 1,
      ...currentPromo
    };
    
    setPromos([...promos, newPromo]);
    setCurrentPromo({ title: '', subtitle: '', rate: '', image: '' });
  };

  const addVideo = () => {
    if (!currentVideo.url) {
      alert('Please provide a URL for the video');
      return;
    }
    
    const newVideo = {
      id: videos.length + 1,
      ...currentVideo
    };
    
    setVideos([...videos, newVideo]);
    setCurrentVideo({ url: '', title: '', duration: 30 });
  };

  const removeSlide = (id) => {
    setSlides(slides.filter(slide => slide.id !== id));
  };

  const removePromo = (id) => {
    setPromos(promos.filter(promo => promo.id !== id));
  };

  const removeVideo = (id) => {
    setVideos(videos.filter(video => video.id !== id));
  };

  return (
    <div>
      <h2>Content Manager</h2>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '20px', marginTop: '20px' }}>
        {/* Image/Video Slides Management */}
        <div style={{ border: '1px solid #ddd', padding: '20px', borderRadius: '8px' }}>
          <h3>Image/Video Slides</h3>
          
          <div className="form-group">
            <label>Content Type:</label>
            <select
              value={currentSlide.type}
              onChange={(e) => setCurrentSlide({...currentSlide, type: e.target.value})}
            >
              <option value="image">Image</option>
              <option value="video">Video</option>
            </select>
          </div>
          
          <div className="form-group">
            <label>URL:</label>
            <input
              type="text"
              value={currentSlide.url}
              onChange={(e) => setCurrentSlide({...currentSlide, url: e.target.value})}
              placeholder="Enter image/video URL"
            />
          </div>
          
          <div className="form-group">
            <label>Title:</label>
            <input
              type="text"
              value={currentSlide.title}
              onChange={(e) => setCurrentSlide({...currentSlide, title: e.target.value})}
              placeholder="Slide title"
            />
          </div>
          
          <div className="form-group">
            <label>Duration (seconds):</label>
            <input
              type="number"
              min="1"
              value={currentSlide.duration}
              onChange={(e) => setCurrentSlide({...currentSlide, duration: parseInt(e.target.value)})}
            />
          </div>
          
          <button onClick={addSlide}>Add Slide</button>
          
          <div style={{ marginTop: '20px' }}>
            <h4>Current Slides:</h4>
            <ul>
              {slides.map(slide => (
                <li key={slide.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <span>{slide.title || slide.url}</span>
                  <button onClick={() => removeSlide(slide.id)}>Remove</button>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        {/* Promotional Content Management */}
        <div style={{ border: '1px solid #ddd', padding: '20px', borderRadius: '8px' }}>
          <h3>Promotional Cards</h3>
          
          <div className="form-group">
            <label>Title:</label>
            <input
              type="text"
              value={currentPromo.title}
              onChange={(e) => setCurrentPromo({...currentPromo, title: e.target.value})}
              placeholder="Promo title"
            />
          </div>
          
          <div className="form-group">
            <label>Subtitle:</label>
            <input
              type="text"
              value={currentPromo.subtitle}
              onChange={(e) => setCurrentPromo({...currentPromo, subtitle: e.target.value})}
              placeholder="Promo subtitle"
            />
          </div>
          
          <div className="form-group">
            <label>Rate/CTA:</label>
            <input
              type="text"
              value={currentPromo.rate}
              onChange={(e) => setCurrentPromo({...currentPromo, rate: e.target.value})}
              placeholder="Interest rate or call to action"
            />
          </div>
          
          <div className="form-group">
            <label>Image URL:</label>
            <input
              type="text"
              value={currentPromo.image}
              onChange={(e) => setCurrentPromo({...currentPromo, image: e.target.value})}
              placeholder="Image URL"
            />
          </div>
          
          <button onClick={addPromo}>Add Promo</button>
          
          <div style={{ marginTop: '20px' }}>
            <h4>Current Promos:</h4>
            <ul>
              {promos.map(promo => (
                <li key={promo.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <span>{promo.title}</span>
                  <button onClick={() => removePromo(promo.id)}>Remove</button>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        {/* Video Content Management */}
        <div style={{ border: '1px solid #ddd', padding: '20px', borderRadius: '8px', gridColumn: '1 / -1' }}>
          <h3>Video Content</h3>
          
          <div className="form-group">
            <label>Video URL:</label>
            <input
              type="text"
              value={currentVideo.url}
              onChange={(e) => setCurrentVideo({...currentVideo, url: e.target.value})}
              placeholder="Enter video URL"
            />
          </div>
          
          <div className="form-group">
            <label>Title:</label>
            <input
              type="text"
              value={currentVideo.title}
              onChange={(e) => setCurrentVideo({...currentVideo, title: e.target.value})}
              placeholder="Video title"
            />
          </div>
          
          <div className="form-group">
            <label>Duration (seconds):</label>
            <input
              type="number"
              min="1"
              value={currentVideo.duration}
              onChange={(e) => setCurrentVideo({...currentVideo, duration: parseInt(e.target.value)})}
            />
          </div>
          
          <button onClick={addVideo}>Add Video</button>
          
          <div style={{ marginTop: '20px' }}>
            <h4>Current Videos:</h4>
            <ul>
              {videos.map(video => (
                <li key={video.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <span>{video.title || video.url}</span>
                  <button onClick={() => removeVideo(video.id)}>Remove</button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
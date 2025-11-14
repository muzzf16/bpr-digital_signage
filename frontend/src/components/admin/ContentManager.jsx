import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';

// Component for managing content items (slides, promos, videos)
const ContentItemManager = ({
  title,
  items,
  currentItem,
  setCurrentItem,
  onAdd,
  onRemove,
  fields
}) => {
  return (
    <div className="content-manager-card bg-gray-800 rounded-xl p-6 shadow-lg">
      <h3 className="text-xl font-bold text-white mb-4">{title}</h3>

      <div className="space-y-4 mb-6">
        {fields.map((field) => (
          <div key={field.name} className="form-group">
            <label className="block text-gray-300 font-medium mb-1">
              {field.label}:
            </label>
            {field.type === 'select' ? (
              <select
                value={currentItem[field.name]}
                onChange={(e) => setCurrentItem({
                  ...currentItem,
                  [field.name]: e.target.value
                })}
                className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:border-blue-500 focus:outline-none"
              >
                {field.options.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            ) : field.type === 'number' ? (
              <input
                type="number"
                min={field.min || 1}
                value={currentItem[field.name]}
                onChange={(e) => setCurrentItem({
                  ...currentItem,
                  [field.name]: parseInt(e.target.value) || field.defaultValue || 1
                })}
                className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:border-blue-500 focus:outline-none"
              />
            ) : (
              <input
                type={field.type || 'text'}
                value={currentItem[field.name]}
                onChange={(e) => setCurrentItem({
                  ...currentItem,
                  [field.name]: e.target.value
                })}
                placeholder={field.placeholder}
                className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:border-blue-500 focus:outline-none"
              />
            )}
          </div>
        ))}
      </div>

      <button
        onClick={onAdd}
        className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors mb-6"
      >
        Add {title.replace(' Management', '')}
      </button>

      <div className="mt-4">
        <h4 className="text-lg font-semibold text-white mb-2">Current {title}:</h4>
        {items.length === 0 ? (
          <p className="text-gray-400 italic">No items added yet</p>
        ) : (
          <ul className="space-y-2">
            {items.map((item) => (
              <li
                key={item.id}
                className="flex justify-between items-center bg-gray-700 p-3 rounded-lg"
              >
                <span className="text-gray-200">
                  {item.title || item.url || `Item ${item.id}`}
                </span>
                <button
                  onClick={() => onRemove(item.id)}
                  className="text-red-500 hover:text-red-400 font-medium"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

ContentItemManager.propTypes = {
  title: PropTypes.string.isRequired,
  items: PropTypes.array.isRequired,
  currentItem: PropTypes.object.isRequired,
  setCurrentItem: PropTypes.func.isRequired,
  onAdd: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
  fields: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      type: PropTypes.string,
      placeholder: PropTypes.string,
      min: PropTypes.number,
      defaultValue: PropTypes.any,
      options: PropTypes.arrayOf(
        PropTypes.shape({
          value: PropTypes.string.isRequired,
          label: PropTypes.string.isRequired
        })
      )
    })
  ).isRequired
};

const ContentManager = () => {
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
      toast.error('Please provide a URL for the slide');
      return;
    }

    const newSlide = {
      id: slides.length + 1,
      ...currentSlide
    };

    setSlides([...slides, newSlide]);
    setCurrentSlide({ type: 'image', url: '', title: '', duration: 10 });
    toast.success('Slide added successfully');
  };

  const addPromo = () => {
    if (!currentPromo.title || !currentPromo.image) {
      toast.error('Please provide a title and image for the promo');
      return;
    }

    const newPromo = {
      id: promos.length + 1,
      ...currentPromo
    };

    setPromos([...promos, newPromo]);
    setCurrentPromo({ title: '', subtitle: '', rate: '', image: '' });
    toast.success('Promo added successfully');
  };

  const addVideo = () => {
    if (!currentVideo.url) {
      toast.error('Please provide a URL for the video');
      return;
    }

    const newVideo = {
      id: videos.length + 1,
      ...currentVideo
    };

    setVideos([...videos, newVideo]);
    setCurrentVideo({ url: '', title: '', duration: 30 });
    toast.success('Video added successfully');
  };

  const removeSlide = (id) => {
    setSlides(slides.filter(slide => slide.id !== id));
    toast.info('Slide removed');
  };

  const removePromo = (id) => {
    setPromos(promos.filter(promo => promo.id !== id));
    toast.info('Promo removed');
  };

  const removeVideo = (id) => {
    setVideos(videos.filter(video => video.id !== id));
    toast.info('Video removed');
  };

  // Define field configurations for each content type
  const slideFields = [
    {
      name: 'type',
      label: 'Content Type',
      type: 'select',
      options: [
        { value: 'image', label: 'Image' },
        { value: 'video', label: 'Video' }
      ]
    },
    {
      name: 'url',
      label: 'URL',
      placeholder: 'Enter image/video URL'
    },
    {
      name: 'title',
      label: 'Title',
      placeholder: 'Slide title'
    },
    {
      name: 'duration',
      label: 'Duration (seconds)',
      type: 'number',
      min: 1
    }
  ];

  const promoFields = [
    {
      name: 'title',
      label: 'Title',
      placeholder: 'Promo title'
    },
    {
      name: 'subtitle',
      label: 'Subtitle',
      placeholder: 'Promo subtitle'
    },
    {
      name: 'rate',
      label: 'Rate/CTA',
      placeholder: 'Interest rate or call to action'
    },
    {
      name: 'image',
      label: 'Image URL',
      placeholder: 'Image URL'
    }
  ];

  const videoFields = [
    {
      name: 'url',
      label: 'Video URL',
      placeholder: 'Enter video URL'
    },
    {
      name: 'title',
      label: 'Title',
      placeholder: 'Video title'
    },
    {
      name: 'duration',
      label: 'Duration (seconds)',
      type: 'number',
      min: 1
    }
  ];

  return (
    <div className="content-manager p-6 bg-gray-900 min-h-screen">
      <h2 className="text-2xl font-bold text-white mb-6">Content Manager</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Image/Video Slides Management */}
        <ContentItemManager
          title="Image/Video Slides"
          items={slides}
          currentItem={currentSlide}
          setCurrentItem={setCurrentSlide}
          onAdd={addSlide}
          onRemove={removeSlide}
          fields={slideFields}
        />

        {/* Promotional Content Management */}
        <ContentItemManager
          title="Promotional Cards"
          items={promos}
          currentItem={currentPromo}
          setCurrentItem={setCurrentPromo}
          onAdd={addPromo}
          onRemove={removePromo}
          fields={promoFields}
        />

        {/* Video Content Management */}
        <div className="lg:col-span-3">
          <ContentItemManager
            title="Video Content"
            items={videos}
            currentItem={currentVideo}
            setCurrentItem={setCurrentVideo}
            onAdd={addVideo}
            onRemove={removeVideo}
            fields={videoFields}
          />
        </div>
      </div>
    </div>
  );
};

export default ContentManager;
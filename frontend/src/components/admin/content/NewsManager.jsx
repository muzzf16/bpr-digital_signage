import React, { useState, useEffect } from 'react';
import { FaNewspaper, FaPlus, FaEdit, FaTrash, FaSearch, FaGlobe, FaBullhorn } from 'react-icons/fa';
import { toast } from 'react-toastify';

const NewsManager = () => {
  const [newsItems, setNewsItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedNews, setSelectedNews] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newNews, setNewNews] = useState({
    title: '',
    source: '',
    link: '',
    category: 'economic',
    isBreaking: false,
    publishDate: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    // In a real implementation, this would fetch from the backend API
    // For now, we'll simulate with mock data
    setNewsItems([
      {
        id: 1,
        title: 'BI pertahankan suku bunga acuan 6,5%',
        source: 'CNBC Indonesia',
        link: '#',
        category: 'economic',
        isBreaking: false,
        timestamp: '2025-11-10T09:30:00Z',
        publishDate: '2025-11-10'
      },
      {
        id: 2,
        title: 'IHSG menguat 0.34% di akhir sesi',
        source: 'Kontan',
        link: '#',
        category: 'economic',
        isBreaking: true,
        timestamp: '2025-11-10T15:45:00Z',
        publishDate: '2025-11-10'
      },
      {
        id: 3,
        title: 'Harga Emas Antam Turun Rp3.000 per Gram',
        source: 'Antara News',
        link: '#',
        category: 'economic',
        isBreaking: false,
        timestamp: '2025-11-09T11:20:00Z',
        publishDate: '2025-11-09'
      }
    ]);
  }, []);

  const handleAddNews = () => {
    if (!newNews.title || !newNews.source) {
      toast.error('Please provide at least a title and source for the news');
      return;
    }

    const newsToAdd = {
      id: newsItems.length + 1,
      ...newNews,
      timestamp: new Date().toISOString()
    };

    setNewsItems([newsToAdd, ...newsItems]); // Add to the top
    setNewNews({
      title: '',
      source: '',
      link: '',
      category: 'economic',
      isBreaking: false,
      publishDate: new Date().toISOString().split('T')[0]
    });
    setIsModalOpen(false);
    toast.success('News item added successfully!');
  };

  const handleEdit = (item) => {
    setSelectedNews(item);
    setNewNews({
      title: item.title,
      source: item.source,
      link: item.link,
      category: item.category,
      isBreaking: item.isBreaking,
      publishDate: item.publishDate
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this news item?')) {
      setNewsItems(newsItems.filter(item => item.id !== id));
      toast.success('News item deleted successfully!');
    }
  };

  const handleUpdateNews = () => {
    if (!newNews.title || !newNews.source) {
      toast.error('Please provide at least a title and source for the news');
      return;
    }

    setNewsItems(newsItems.map(item =>
      item.id === selectedNews.id ? { ...item, ...newNews } : item
    ));

    setSelectedNews(null);
    setIsModalOpen(false);
    setNewNews({
      title: '',
      source: '',
      link: '',
      category: 'economic',
      isBreaking: false,
      publishDate: new Date().toISOString().split('T')[0]
    });
    toast.success('News item updated successfully!');
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewNews(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedNews) {
      handleUpdateNews();
    } else {
      handleAddNews();
    }
  };

  // Filter news based on search term
  const filteredNews = newsItems.filter(item =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.source.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="glass-card">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <div>
          <h3 className="card-title flex items-center gap-2">
            <FaNewspaper className="text-yellow-400" /> News Management
          </h3>
          <p className="card-sub">Manage news content for digital displays</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Search news..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input w-full sm:w-48"
            />
            <FaSearch className="absolute left-3 top-3 text-blue-300" />
          </div>

          <button
            onClick={() => {
              setSelectedNews(null);
              setNewNews({
                title: '',
                source: '',
                link: '',
                category: 'economic',
                isBreaking: false,
                publishDate: new Date().toISOString().split('T')[0]
              });
              setIsModalOpen(true);
            }}
            className="btn btn-primary flex items-center space-x-2"
          >
            <FaPlus /> <span>Add News</span>
          </button>
        </div>
      </div>

      <div className="mb-6">
        <div className="admin-grid">
          <div className="col-4">
            <div className="devices-stat-card">
              <div className="stat-label">Total News</div>
              <div className="stat-value">{newsItems.length}</div>
            </div>
          </div>
          <div className="col-4">
            <div className="devices-stat-card">
              <div className="stat-label">Breaking News</div>
              <div className="stat-value">{newsItems.filter(n => n.isBreaking).length}</div>
            </div>
          </div>
          <div className="col-4">
            <div className="devices-stat-card">
              <div className="stat-label">Economic News</div>
              <div className="stat-value">{newsItems.filter(n => n.category === 'economic').length}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Source</th>
              <th>Category</th>
              <th>Date</th>
              <th>Status</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredNews.length > 0 ? (
              filteredNews.map((item, index) => (
                <tr key={index} className="hover:bg-white/5 transition-colors">
                  <td className="align-top">
                    <div className="flex items-center">
                      {item.isBreaking && (
                        <span className="bg-red-500 text-white text-xs px-2 py-1 rounded mr-2">BREAKING</span>
                      )}
                      <span className="font-medium">{item.title}</span>
                    </div>
                  </td>
                  <td className="align-top">
                    <div className="flex items-center">
                      <FaGlobe className="text-blue-300 mr-2" />
                      {item.source}
                    </div>
                  </td>
                  <td className="align-top">
                    <span className={`status-badge ${item.category}`}>
                      {item.category}
                    </span>
                  </td>
                  <td className="align-top">
                    {new Date(item.publishDate).toLocaleDateString()}
                  </td>
                  <td className="align-top">
                    <span className={`status-badge ${item.isBreaking ? 'breaking' : 'normal'}`}>
                      {item.isBreaking ? 'Breaking' : 'Normal'}
                    </span>
                  </td>
                  <td className="align-top text-right">
                    <button
                      onClick={() => handleEdit(item)}
                      className="action-button"
                      title="Edit"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="action-button"
                      title="Delete"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center text-sm text-blue-200 py-4">
                  No news items found. Add a new item to get started.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal for creating/editing news */}
      {isModalOpen && (
        <div className="admin-modal">
          <div className="admin-modal-content">
            <div className="modal-header">
              <h3 className="modal-title">
                {selectedNews ? `Edit News: ${selectedNews.title}` : 'Add New News'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="modal-close"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="modal-body">
              <div className="space-y-4">
                <div>
                  <label className="label">Title *</label>
                  <input
                    type="text"
                    name="title"
                    value={newNews.title}
                    onChange={handleInputChange}
                    className="input"
                    placeholder="Enter news title"
                    required
                  />
                </div>

                <div>
                  <label className="label">Source *</label>
                  <input
                    type="text"
                    name="source"
                    value={newNews.source}
                    onChange={handleInputChange}
                    className="input"
                    placeholder="Enter news source"
                    required
                  />
                </div>

                <div>
                  <label className="label">Link</label>
                  <input
                    type="text"
                    name="link"
                    value={newNews.link}
                    onChange={handleInputChange}
                    className="input"
                    placeholder="Enter article URL"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="label">Category</label>
                    <select
                      name="category"
                      value={newNews.category}
                      onChange={handleInputChange}
                      className="input"
                    >
                      <option value="economic">Economic</option>
                      <option value="news">General News</option>
                      <option value="breaking">Breaking News</option>
                    </select>
                  </div>

                  <div>
                    <label className="label">Publish Date</label>
                    <input
                      type="date"
                      name="publishDate"
                      value={newNews.publishDate}
                      onChange={handleInputChange}
                      className="input"
                    />
                  </div>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="isBreaking"
                    checked={newNews.isBreaking}
                    onChange={handleInputChange}
                    className="mr-2 w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                  />
                  <label className="label">Is Breaking News?</label>
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                >
                  {selectedNews ? 'Update News' : 'Add News'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewsManager;
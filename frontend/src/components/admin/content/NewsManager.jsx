import React, { useState, useEffect } from 'react';
import { FaNewspaper, FaPlus, FaEdit, FaTrash, FaSearch, FaGlobe, FaBullhorn } from 'react-icons/fa';
import { toast } from 'react-toastify';
import GlassCard from '../../GlassCard';

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

  // Filter news based on search term
  const filteredNews = newsItems.filter(item => 
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.source.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <GlassCard className="bg-gradient-to-br from-blue-900/30 to-blue-800/20 backdrop-blur-sm border border-blue-700/30">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <div>
          <h3 className="text-xl font-bold flex items-center gap-2">
            <FaNewspaper className="text-yellow-400" /> News Management
          </h3>
          <p className="text-blue-200 text-sm mt-1">Manage news content for digital displays</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Search news..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-blue-800/30 text-white placeholder-blue-300 border border-blue-700/50 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-48"
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
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-all duration-300 shadow-lg shadow-blue-900/30"
          >
            <FaPlus /> <span>Add News</span>
          </button>
        </div>
      </div>

      <div className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-900/40 p-4 rounded-lg">
            <p className="text-blue-200 text-sm">Total News</p>
            <p className="text-2xl font-bold text-white">{newsItems.length}</p>
          </div>
          <div className="bg-red-900/40 p-4 rounded-lg">
            <p className="text-red-200 text-sm">Breaking News</p>
            <p className="text-2xl font-bold text-white">{newsItems.filter(n => n.isBreaking).length}</p>
          </div>
          <div className="bg-green-900/40 p-4 rounded-lg">
            <p className="text-green-200 text-sm">Economic News</p>
            <p className="text-2xl font-bold text-white">{newsItems.filter(n => n.category === 'economic').length}</p>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-blue-700/50">
          <thead>
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-blue-200 uppercase tracking-wider">Title</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-blue-200 uppercase tracking-wider">Source</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-blue-200 uppercase tracking-wider">Category</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-blue-200 uppercase tracking-wider">Date</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-blue-200 uppercase tracking-wider">Status</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-blue-200 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-blue-700/30">
            {filteredNews.length > 0 ? (
              filteredNews.map((item, index) => (
                <tr key={index} className="hover:bg-white/5 transition-colors">
                  <td className="px-4 py-3 text-sm text-white">
                    <div className="flex items-center">
                      {item.isBreaking && (
                        <span className="bg-red-500 text-white text-xs px-2 py-1 rounded mr-2">BREAKING</span>
                      )}
                      <span className="font-medium">{item.title}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-white">
                    <div className="flex items-center">
                      <FaGlobe className="text-blue-300 mr-2" />
                      {item.source}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-white">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      item.category === 'economic' ? 'bg-blue-600/30 text-blue-200' :
                      item.category === 'news' ? 'bg-green-600/30 text-green-200' :
                      'bg-purple-600/30 text-purple-200'
                    }`}>
                      {item.category}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-white">
                    {new Date(item.publishDate).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-sm text-white">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      item.isBreaking ? 'bg-red-600/30 text-red-200' : 'bg-gray-600/30 text-gray-200'
                    }`}>
                      {item.isBreaking ? 'Breaking' : 'Normal'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right text-sm">
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => handleEdit(item)}
                        className="p-2 text-blue-300 hover:text-blue-100 hover:bg-blue-700/50 rounded-lg transition-colors"
                        aria-label="Edit"
                        title="Edit"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="p-2 text-red-300 hover:text-red-100 hover:bg-red-700/50 rounded-lg transition-colors"
                        aria-label="Delete"
                        title="Delete"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td 
                  colSpan="6" 
                  className="px-4 py-6 text-center text-sm text-blue-200"
                >
                  No news items found. Add a new news item to get started.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal for creating/editing news */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-xl border border-blue-700/50 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-white">
                  {selectedNews ? `Edit News: ${selectedNews.title}` : 'Add New News'}
                </h3>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-400 hover:text-white"
                >
                  ✕
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-blue-200 mb-1">Title</label>
                  <input
                    type="text"
                    name="title"
                    value={newNews.title}
                    onChange={handleInputChange}
                    className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter news title"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-blue-200 mb-1">Source</label>
                    <input
                      type="text"
                      name="source"
                      value={newNews.source}
                      onChange={handleInputChange}
                      className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter news source"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-blue-200 mb-1">Link</label>
                    <input
                      type="text"
                      name="link"
                      value={newNews.link}
                      onChange={handleInputChange}
                      className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter news link"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-blue-200 mb-1">Category</label>
                    <select
                      name="category"
                      value={newNews.category}
                      onChange={handleInputChange}
                      className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="economic">Economic</option>
                      <option value="news">General News</option>
                      <option value="announcements">Announcements</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-blue-200 mb-1">Publish Date</label>
                    <input
                      type="date"
                      name="publishDate"
                      value={newNews.publishDate}
                      onChange={handleInputChange}
                      className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="isBreaking"
                    checked={newNews.isBreaking}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500 bg-gray-700 border-gray-600"
                  />
                  <label className="ml-2 block text-sm text-blue-200">
                    Mark as Breaking News
                  </label>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 mt-6">
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-gray-600 rounded-lg text-white hover:bg-gray-700/50 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={selectedNews ? handleUpdateNews : handleAddNews}
                  className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg text-white hover:from-blue-700 hover:to-blue-800 transition-all"
                >
                  {selectedNews ? 'Update News' : 'Add News'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </GlassCard>
  );
};

export default NewsManager;
import React, { useState, useEffect } from 'react';
import { FaFilm, FaPlus, FaEdit, FaTrash, FaPlay, FaPause, FaClone, FaSearch } from 'react-icons/fa';
import { toast } from 'react-toastify';
import GlassCard from '../../GlassCard';
import DataTable from '../ui/DataTable';

const PlaylistManager = () => {
  const [playlists, setPlaylists] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetch('/api/admin/playlists')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setPlaylists(data.playlists);
        }
      })
      .catch(err => {
        console.error("Error fetching playlists:", err);
        toast.error("Failed to fetch playlists.");
      });
  }, []);

  const handleEdit = (item) => {
    setSelectedPlaylist(item);
    setIsModalOpen(true);
    toast.info(`Editing playlist: ${item.name}`);
  };

  const handleDelete = (item) => {
    if (window.confirm(`Are you sure you want to delete the playlist "${item.name}"?`)) {
      fetch(`/api/admin/playlists/${item.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': 'secret_dev_key'
        }
      })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setPlaylists(playlists.filter(p => p.id !== item.id));
          toast.success(`Playlist "${item.name}" deleted successfully!`);
        } else {
          toast.error("Failed to delete playlist.");
        }
      })
      .catch(err => {
        console.error("Error deleting playlist:", err);
        toast.error("Failed to delete playlist.");
      });
    }
  };

  const handleCreate = () => {
    setSelectedPlaylist(null);
    setIsModalOpen(true);
    toast.success(`Create new playlist clicked!`);
  };

  const handlePlayPause = (item) => {
    toast.info(`${item.status === 'Active' ? 'Pausing' : 'Playing'} playlist: ${item.name}`);
  };

  // Filter playlists based on search term
  const filteredPlaylists = playlists.filter(playlist => 
    playlist.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    playlist.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <GlassCard className="bg-gradient-to-br from-blue-900/30 to-blue-800/20 backdrop-blur-sm border border-blue-700/30">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <div>
          <h3 className="text-xl font-bold flex items-center gap-2">
            <FaFilm className="text-yellow-400" /> Display Playlists
          </h3>
          <p className="text-blue-200 text-sm mt-1">Manage your digital signage playlists</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Search playlists..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-blue-800/30 text-white placeholder-blue-300 border border-blue-700/50 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-48"
            />
            <FaSearch className="absolute left-3 top-3 text-blue-300" />
          </div>
          
          <button
            onClick={handleCreate}
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-all duration-300 shadow-lg shadow-blue-900/30"
          >
            <FaPlus /> <span>New Playlist</span>
          </button>
        </div>
      </div>

      <div className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-blue-900/40 p-4 rounded-lg">
            <p className="text-blue-200 text-sm">Total Playlists</p>
            <p className="text-2xl font-bold text-white">{playlists.length}</p>
          </div>
          <div className="bg-green-900/40 p-4 rounded-lg">
            <p className="text-green-200 text-sm">Active</p>
            <p className="text-2xl font-bold text-white">{playlists.filter(p => p.status === 'Active').length}</p>
          </div>
          <div className="bg-yellow-900/40 p-4 rounded-lg">
            <p className="text-yellow-200 text-sm">Scheduled</p>
            <p className="text-2xl font-bold text-white">{playlists.filter(p => p.status === 'Scheduled').length}</p>
          </div>
          <div className="bg-red-900/40 p-4 rounded-lg">
            <p className="text-red-200 text-sm">Inactive</p>
            <p className="text-2xl font-bold text-white">{playlists.filter(p => p.status === 'Inactive').length}</p>
          </div>
        </div>
      </div>

      <DataTable
        columns={[
          { key: 'name', header: 'Name', render: (value, row) => (
            <div className="flex items-center">
              <div className="bg-blue-700/30 p-2 rounded-lg mr-3">
                <FaFilm className="text-yellow-400" />
              </div>
              <div>
                <div className="font-medium">{value}</div>
                <div className="text-xs text-blue-200 truncate max-w-xs">{row.description || 'No description'}</div>
              </div>
            </div>
          )},
          { key: 'items', header: 'Items', render: (value) => (
            <span className="px-2 py-1 bg-blue-800/40 text-blue-200 rounded text-sm">{value} items</span>
          )},
          { key: 'status', header: 'Status', render: (value) => (
            <span className={`px-3 py-1 rounded-full text-xs flex items-center justify-center ${
              value === 'Active' ? 'bg-green-600/30 text-green-200' : 
              value === 'Scheduled' ? 'bg-yellow-600/30 text-yellow-200' : 
              'bg-red-600/30 text-red-200'
            }`}>
              <span className={`w-2 h-2 rounded-full mr-2 ${
                value === 'Active' ? 'bg-green-400' : 
                value === 'Scheduled' ? 'bg-yellow-400' : 
                'bg-red-400'
              }`}></span>
              {value}
            </span>
          )},
          { key: 'lastUpdated', header: 'Last Updated', render: (value) => (
            new Date(value).toLocaleDateString()
          )},
          { 
            key: 'actions', 
            header: 'Actions', 
            render: (_, row) => (
              <div className="flex space-x-2 justify-end">
                <button
                  onClick={() => handlePlayPause(row)}
                  className="p-2 text-blue-300 hover:text-blue-100 hover:bg-blue-700/50 rounded-lg transition-colors"
                  title={row.status === 'Active' ? 'Pause' : 'Play'}
                >
                  {row.status === 'Active' ? <FaPause /> : <FaPlay />}
                </button>
                <button
                  onClick={() => handleEdit(row)}
                  className="p-2 text-blue-300 hover:text-blue-100 hover:bg-blue-700/50 rounded-lg transition-colors"
                  title="Edit"
                >
                  <FaEdit />
                </button>
                <button
                  onClick={() => handleDelete(row)}
                  className="p-2 text-red-300 hover:text-red-100 hover:bg-red-700/50 rounded-lg transition-colors"
                  title="Delete"
                >
                  <FaTrash />
                </button>
              </div>
            )
          }
        ]}
        data={filteredPlaylists}
        emptyMessage="No playlists found. Create a new playlist to get started."
      />

      {/* Modal for creating/editing playlists */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-xl border border-blue-700/50 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-white">
                  {selectedPlaylist ? `Edit: ${selectedPlaylist.name}` : 'Create New Playlist'}
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
                  <label className="block text-sm font-medium text-blue-200 mb-1">Playlist Name</label>
                  <input
                    type="text"
                    className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter playlist name"
                    defaultValue={selectedPlaylist?.name || ''}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-blue-200 mb-1">Description</label>
                  <textarea
                    className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter playlist description"
                    rows="3"
                    defaultValue={selectedPlaylist?.description || ''}
                  ></textarea>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-blue-200 mb-1">Start Date</label>
                    <input
                      type="date"
                      className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      defaultValue={selectedPlaylist?.startDate || ''}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-blue-200 mb-1">End Date</label>
                    <input
                      type="date"
                      className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      defaultValue={selectedPlaylist?.endDate || ''}
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-blue-200 mb-1">Status</label>
                  <select className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="Active">Active</option>
                    <option value="Scheduled">Scheduled</option>
                    <option value="Inactive">Inactive</option>
                  </select>
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
                  onClick={() => {
                    setIsModalOpen(false);
                    toast.success(selectedPlaylist ? 'Playlist updated successfully!' : 'Playlist created successfully!');
                  }}
                  className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg text-white hover:from-blue-700 hover:to-blue-800 transition-all"
                >
                  {selectedPlaylist ? 'Update Playlist' : 'Create Playlist'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </GlassCard>
  );
};

export default PlaylistManager;
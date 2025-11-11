import React, { useState, useEffect } from 'react';
import { FaFilm, FaPlus } from 'react-icons/fa';
import { toast } from 'react-toastify';
import GlassCard from './GlassCard';
import DataTable from './DataTable';

const PlaylistManager = () => {
  const [playlists, setPlaylists] = useState([]);

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
    toast.info(`Edit clicked for: ${item.name}`);
  };

  const handleDelete = (item) => {
    if (window.confirm(`Are you sure you want to delete this playlist?`)) {
      // Here you would call the API to delete the item
      toast.success(`Playlist deleted successfully!`);
    }
  };

  const handleCreate = () => {
    // Here you would open a modal or navigate to a new page to create a playlist
    toast.success(`Create new playlist clicked!`);
  };

  return (
    <GlassCard 
      title="🎞️ Display Playlist" 
      icon={<FaFilm />}
    >
      <div className="flex justify-between items-center mb-4">
        <h4 className="text-white font-medium">Active Playlists</h4>
        <button 
          onClick={handleCreate}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
        >
          <FaPlus /> <span>Add New</span>
        </button>
      </div>
      
      <DataTable 
        columns={[
          { key: 'name', header: 'Name' },
          { key: 'items', header: 'Items' },
          { key: 'status', header: 'Status', render: (value) => (
            <span className={`px-2 py-1 rounded-full text-xs ${
              value === 'Active' ? 'bg-green-600/30 text-green-200' : 'bg-red-600/30 text-red-200'
            }`}>
              {value}
            </span>
          )},
          { key: 'lastUpdated', header: 'Last Updated' },
        ]}
        data={playlists}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </GlassCard>
  );
};

export default PlaylistManager;
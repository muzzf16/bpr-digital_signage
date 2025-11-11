import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function PlaylistManager() {
  const [playlists, setPlaylists] = useState([]);
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [newPlaylist, setNewPlaylist] = useState({ name: '', deviceId: '' });
  const [newItem, setNewItem] = useState({ type: 'image', url: '', duration: 10, title: '' });

  useEffect(() => {
    loadPlaylists();
  }, []);

  const loadPlaylists = () => {
    // In a real implementation, this would fetch from the backend API
    // For now, we'll simulate with mock data
    setPlaylists([
      { 
        id: 'default-playlist', 
        name: 'Default Playlist', 
        deviceId: 'demo-tv-01',
        items: [
          { type: 'image', url: '/assets/demo.jpg', title: 'Promo Tabungan', duration: 12 },
          { type: 'rate', productId: 'tabungan-simapanas', duration: 10 },
          { type: 'economic', duration: 15 },
          { type: 'news', duration: 12 }
        ]
      }
    ]);
  };

  const createPlaylist = () => {
    if (!newPlaylist.name || !newPlaylist.deviceId) {
      alert('Please provide playlist name and device ID');
      return;
    }
    
    const playlistToAdd = {
      id: `playlist-${playlists.length + 1}`,
      ...newPlaylist,
      items: []
    };
    
    setPlaylists([...playlists, playlistToAdd]);
    setNewPlaylist({ name: '', deviceId: '' });
  };

  const deletePlaylist = (id) => {
    if (window.confirm('Are you sure you want to delete this playlist?')) {
      setPlaylists(playlists.filter(playlist => playlist.id !== id));
    }
  };

  const selectPlaylist = (playlist) => {
    setSelectedPlaylist(playlist);
  };

  const addItemToPlaylist = () => {
    if (!selectedPlaylist) {
      alert('Please select a playlist first');
      return;
    }
    
    if (!newItem.url && (newItem.type === 'image' || newItem.type === 'video')) {
      alert('Please provide a URL for the media item');
      return;
    }
    
    const itemToAdd = {
      type: newItem.type,
      ...(newItem.type === 'image' || newItem.type === 'video') ? { url: newItem.url } : {},
      ...(newItem.type === 'image') ? { title: newItem.title } : {},
      duration: parseInt(newItem.duration) || 10
    };
    
    const updatedPlaylists = playlists.map(playlist => {
      if (playlist.id === selectedPlaylist.id) {
        return {
          ...playlist,
          items: [...playlist.items, itemToAdd]
        };
      }
      return playlist;
    });
    
    setPlaylists(updatedPlaylists);
    setSelectedPlaylist({
      ...selectedPlaylist,
      items: [...selectedPlaylist.items, itemToAdd]
    });
    
    setNewItem({ type: 'image', url: '', duration: 10, title: '' });
  };

  const removeItemFromPlaylist = (playlistId, itemIndex) => {
    const updatedPlaylists = playlists.map(playlist => {
      if (playlist.id === playlistId) {
        const updatedItems = [...playlist.items];
        updatedItems.splice(itemIndex, 1);
        return {
          ...playlist,
          items: updatedItems
        };
      }
      return playlist;
    });
    
    setPlaylists(updatedPlaylists);
    
    // Update the selected playlist view if it's the one being modified
    if (selectedPlaylist && selectedPlaylist.id === playlistId) {
      setSelectedPlaylist({
        ...selectedPlaylist,
        items: selectedPlaylist.items.filter((_, index) => index !== itemIndex)
      });
    }
  };

  return (
    <div>
      <h2>Playlist Manager</h2>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginTop: '20px' }}>
        {/* Create New Playlist */}
        <div style={{ border: '1px solid #ddd', padding: '20px', borderRadius: '8px' }}>
          <h3>Create New Playlist</h3>
          <div className="form-group">
            <label>Playlist Name:</label>
            <input
              type="text"
              value={newPlaylist.name}
              onChange={(e) => setNewPlaylist({...newPlaylist, name: e.target.value})}
              placeholder="e.g., Lobby Display Playlist"
            />
          </div>
          <div className="form-group">
            <label>Device ID:</label>
            <input
              type="text"
              value={newPlaylist.deviceId}
              onChange={(e) => setNewPlaylist({...newPlaylist, deviceId: e.target.value})}
              placeholder="e.g., demo-tv-01"
            />
          </div>
          <button onClick={createPlaylist}>Create Playlist</button>
        </div>
        
        {/* Playlist List */}
        <div style={{ border: '1px solid #ddd', padding: '20px', borderRadius: '8px' }}>
          <h3>Existing Playlists</h3>
          <ul>
            {playlists.map(playlist => (
              <li key={playlist.id} style={{ marginBottom: '10px', display: 'flex', justifyContent: 'space-between' }}>
                <button 
                  onClick={() => selectPlaylist(playlist)}
                  style={{ 
                    textAlign: 'left', 
                    flex: 1, 
                    background: 'none', 
                    border: 'none', 
                    padding: '5px', 
                    cursor: 'pointer',
                    textDecoration: selectedPlaylist?.id === playlist.id ? 'underline' : 'none',
                    color: '#2c3e50'
                  }}
                >
                  {playlist.name} ({playlist.items.length} items)
                </button>
                <button 
                  onClick={() => deletePlaylist(playlist.id)}
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
      
      {/* Selected Playlist Details */}
      {selectedPlaylist && (
        <div style={{ border: '1px solid #ddd', padding: '20px', borderRadius: '8px', marginTop: '20px' }}>
          <h3>Editing: {selectedPlaylist.name}</h3>
          
          <div className="form-group">
            <label>Add Item to Playlist:</label>
            <select
              value={newItem.type}
              onChange={(e) => setNewItem({...newItem, type: e.target.value})}
            >
              <option value="image">Image Slide</option>
              <option value="video">Video Slide</option>
              <option value="rate">Interest Rate Panel</option>
              <option value="economic">Economic Data Panel</option>
              <option value="news">News Ticker</option>
            </select>
          </div>
          
          {(newItem.type === 'image' || newItem.type === 'video') && (
            <>
              <div className="form-group">
                <label>URL:</label>
                <input
                  type="text"
                  value={newItem.url}
                  onChange={(e) => setNewItem({...newItem, url: e.target.value})}
                  placeholder={`Enter ${newItem.type} URL`}
                />
              </div>
              {newItem.type === 'image' && (
                <div className="form-group">
                  <label>Title:</label>
                  <input
                    type="text"
                    value={newItem.title}
                    onChange={(e) => setNewItem({...newItem, title: e.target.value})}
                    placeholder="Slide title"
                  />
                </div>
              )}
            </>
          )}
          
          <div className="form-group">
            <label>Duration (seconds):</label>
            <input
              type="number"
              min="1"
              value={newItem.duration}
              onChange={(e) => setNewItem({...newItem, duration: parseInt(e.target.value)})}
            />
          </div>
          
          <button onClick={addItemToPlaylist}>Add to Playlist</button>
          
          <div style={{ marginTop: '20px' }}>
            <h4>Playlist Items:</h4>
            <ul>
              {selectedPlaylist.items.map((item, index) => (
                <li key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <div>
                    <strong>{item.type}:</strong> 
                    {item.title ? item.title : item.url || item.productId || 'Item'}
                    {item.duration && ` (${item.duration}s)`}
                  </div>
                  <button 
                    onClick={() => removeItemFromPlaylist(selectedPlaylist.id, index)}
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

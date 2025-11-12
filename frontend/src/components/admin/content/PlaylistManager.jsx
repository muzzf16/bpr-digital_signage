import React, { useState, useEffect } from 'react';
import { FaFilm, FaPlus, FaEdit, FaTrash, FaPlay, FaPause, FaSearch } from 'react-icons/fa';
import { toast } from 'react-toastify';

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
    <div className="glass-card">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <div>
          <h3 className="card-title flex items-center gap-2">
            <FaFilm className="text-blue-400" /> Display Playlists
          </h3>
          <p className="card-sub">Manage your digital signage playlists</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Search playlists..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input w-full sm:w-48"
            />
            <FaSearch className="absolute left-3 top-3 text-blue-300" />
          </div>

          <button
            onClick={handleCreate}
            className="btn btn-primary flex items-center space-x-2"
          >
            <FaPlus /> <span>New Playlist</span>
          </button>
        </div>
      </div>

      <div className="mb-6">
        <div className="admin-grid">
          <div className="col-3">
            <div className="devices-stat-card">
              <div className="stat-label">Total Playlists</div>
              <div className="stat-value">{playlists.length}</div>
            </div>
          </div>
          <div className="col-3">
            <div className="devices-stat-card">
              <div className="stat-label">Active</div>
              <div className="stat-value">{playlists.filter(p => p.status === 'Active').length}</div>
            </div>
          </div>
          <div className="col-3">
            <div className="devices-stat-card">
              <div className="stat-label">Scheduled</div>
              <div className="stat-value">{playlists.filter(p => p.status === 'Scheduled').length}</div>
            </div>
          </div>
          <div className="col-3">
            <div className="devices-stat-card">
              <div className="stat-label">Inactive</div>
              <div className="stat-value">{playlists.filter(p => p.status === 'Inactive').length}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Items</th>
              <th>Status</th>
              <th>Last Updated</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredPlaylists.length > 0 ? (
              filteredPlaylists.map((row) => (
                <tr key={row.id} className="hover:bg-white/5 transition-colors">
                  <td className="align-top">
                    <div className="flex items-center">
                      <div className="bg-blue-700/30 p-2 rounded-lg mr-3">
                        <FaFilm className="text-yellow-400" />
                      </div>
                      <div>
                        <div className="font-medium">{row.name}</div>
                        <div className="text-xs text-blue-200 truncate max-w-xs">{row.description || 'No description'}</div>
                      </div>
                    </div>
                  </td>
                  <td className="align-top">
                    <span className="px-2 py-1 bg-blue-800/40 text-blue-200 rounded text-sm">{row.items} items</span>
                  </td>
                  <td className="align-top">
                    <span className={`status-badge ${row.status.toLowerCase()}`}>
                      <span className={`w-2 h-2 rounded-full mr-2 ${
                        row.status === 'Active' ? 'bg-green-400' :
                        row.status === 'Scheduled' ? 'bg-yellow-400' :
                        'bg-red-400'
                      }`}></span>
                      {row.status}
                    </span>
                  </td>
                  <td className="align-top">
                    {new Date(row.lastUpdated).toLocaleDateString()}
                  </td>
                  <td className="align-top text-right">
                    <button
                      onClick={() => handlePlayPause(row)}
                      className="action-button"
                      title={row.status === 'Active' ? 'Pause' : 'Play'}
                    >
                      {row.status === 'Active' ? <FaPause /> : <FaPlay />}
                    </button>
                    <button
                      onClick={() => handleEdit(row)}
                      className="action-button"
                      title="Edit"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(row)}
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
                <td colSpan="5" className="text-center text-sm text-blue-200 py-4">
                  No playlists found. Create a new playlist to get started.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal for creating/editing playlists */}
      {isModalOpen && (
        <div className="admin-modal">
          <div className="admin-modal-content">
            <div className="modal-header">
              <h3 className="modal-title">
                {selectedPlaylist ? `Edit: ${selectedPlaylist.name}` : 'Create New Playlist'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="modal-close"
              >
                ✕
              </button>
            </div>

            <div className="modal-body">
              <div className="space-y-4">
                <div>
                  <label className="label">Playlist Name</label>
                  <input
                    type="text"
                    className="input"
                    placeholder="Enter playlist name"
                    defaultValue={selectedPlaylist?.name || ''}
                  />
                </div>

                <div>
                  <label className="label">Description</label>
                  <textarea
                    className="input"
                    placeholder="Enter playlist description"
                    rows="3"
                    defaultValue={selectedPlaylist?.description || ''}
                  ></textarea>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="label">Start Date</label>
                    <input
                      type="date"
                      className="input"
                      defaultValue={selectedPlaylist?.startDate || ''}
                    />
                  </div>

                  <div>
                    <label className="label">End Date</label>
                    <input
                      type="date"
                      className="input"
                      defaultValue={selectedPlaylist?.endDate || ''}
                    />
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="btn btn-primary"
                >
                  {selectedPlaylist ? 'Update Playlist' : 'Create Playlist'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlaylistManager;
import React, { useState, useEffect } from 'react';
import { FaBullhorn, FaPlus, FaEdit, FaTrash, FaSearch } from 'react-icons/fa';
import { toast } from 'react-toastify';

const AnnouncementsManager = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newAnnouncement, setNewAnnouncement] = useState({
    message: '',
    priority: 'medium',
    validFrom: new Date().toISOString().split('T')[0],
    validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // 7 days from now
  });

  useEffect(() => {
    // Sample data - in a real implementation, this would come from an API
    setAnnouncements([
      {
        id: 1,
        message: 'BPR Sukamakmur akan tutup pada 25 Desember 2025',
        priority: 'high',
        validFrom: new Date().toISOString(),
        validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        createdOn: new Date().toISOString()
      },
      {
        id: 2,
        message: 'Gunakan mobile app kami untuk transaksi lebih cepat',
        priority: 'medium',
        validFrom: new Date().toISOString(),
        validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        createdOn: new Date().toISOString()
      },
      {
        id: 3,
        message: 'Promo spesial akhir tahun - bunga deposito hingga 7.5%',
        priority: 'low',
        validFrom: new Date().toISOString(),
        validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        createdOn: new Date().toISOString()
      }
    ]);
  }, []);

  const handleAddAnnouncement = () => {
    if (!newAnnouncement.message) {
      toast.error('Please provide an announcement message');
      return;
    }

    const announcementToAdd = {
      id: announcements.length + 1,
      ...newAnnouncement,
      createdOn: new Date().toISOString()
    };

    setAnnouncements([announcementToAdd, ...announcements]); // Add to the top
    setNewAnnouncement({
      message: '',
      priority: 'medium',
      validFrom: new Date().toISOString().split('T')[0],
      validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    });
    setIsModalOpen(false);
    toast.success('Announcement added successfully!');
  };

  const handleEdit = (item) => {
    setSelectedAnnouncement(item);
    setNewAnnouncement({
      message: item.message,
      priority: item.priority,
      validFrom: item.validFrom.split('T')[0],
      validUntil: item.validUntil.split('T')[0]
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this announcement?')) {
      setAnnouncements(announcements.filter(item => item.id !== id));
      toast.success('Announcement deleted successfully!');
    }
  };

  const handleUpdateAnnouncement = () => {
    if (!newAnnouncement.message) {
      toast.error('Please provide an announcement message');
      return;
    }

    setAnnouncements(announcements.map(item =>
      item.id === selectedAnnouncement.id ? 
      { ...item, ...newAnnouncement, createdOn: selectedAnnouncement.createdOn } : 
      item
    ));

    setSelectedAnnouncement(null);
    setIsModalOpen(false);
    setNewAnnouncement({
      message: '',
      priority: 'medium',
      validFrom: new Date().toISOString().split('T')[0],
      validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    });
    toast.success('Announcement updated successfully!');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewAnnouncement(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedAnnouncement) {
      handleUpdateAnnouncement();
    } else {
      handleAddAnnouncement();
    }
  };

  // Filter announcements based on search term
  const filteredAnnouncements = announcements.filter(item =>
    item.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.priority.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'high': return 'bg-red-600/30 text-red-200';
      case 'medium': return 'bg-yellow-600/30 text-yellow-200';
      case 'low': return 'bg-green-600/30 text-green-200';
      default: return 'bg-gray-600/30 text-gray-200';
    }
  };

  const getPriorityIcon = (priority) => {
    switch(priority) {
      case 'high': return '📢'; // Loudspeaker
      case 'medium': return '⚠️'; // Warning
      case 'low': return 'ℹ️'; // Info
      default: return '💬'; // Default
    }
  };

  return (
    <div className="glass-card">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <div>
          <h3 className="card-title flex items-center gap-2">
            <FaBullhorn className="text-blue-400" /> Announcements Management
          </h3>
          <p className="card-sub">Manage system-wide announcements</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Search announcements..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input w-full sm:w-48"
            />
            <FaSearch className="absolute left-3 top-3 text-blue-300" />
          </div>

          <button
            onClick={() => {
              setSelectedAnnouncement(null);
              setNewAnnouncement({
                message: '',
                priority: 'medium',
                validFrom: new Date().toISOString().split('T')[0],
                validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
              });
              setIsModalOpen(true);
            }}
            className="btn btn-primary flex items-center space-x-2"
          >
            <FaPlus /> <span>Add Announcement</span>
          </button>
        </div>
      </div>

      <div className="mb-6">
        <div className="admin-grid">
          <div className="col-3">
            <div className="devices-stat-card">
              <div className="stat-label">Total</div>
              <div className="stat-value">{announcements.length}</div>
            </div>
          </div>
          <div className="col-3">
            <div className="devices-stat-card">
              <div className="stat-label">High Priority</div>
              <div className="stat-value">{announcements.filter(a => a.priority === 'high').length}</div>
            </div>
          </div>
          <div className="col-3">
            <div className="devices-stat-card">
              <div className="stat-label">Medium Priority</div>
              <div className="stat-value">{announcements.filter(a => a.priority === 'medium').length}</div>
            </div>
          </div>
          <div className="col-3">
            <div className="devices-stat-card">
              <div className="stat-label">Low Priority</div>
              <div className="stat-value">{announcements.filter(a => a.priority === 'low').length}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="table">
          <thead>
            <tr>
              <th>Message</th>
              <th>Priority</th>
              <th>Valid From</th>
              <th>Valid Until</th>
              <th>Created</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredAnnouncements.length > 0 ? (
              filteredAnnouncements.map((item) => (
                <tr key={item.id} className="hover:bg-white/5 transition-colors">
                  <td className="align-top">
                    <div className="flex items-center">
                      <span className="mr-2">{getPriorityIcon(item.priority)}</span>
                      <span className="font-medium">{item.message}</span>
                    </div>
                  </td>
                  <td className="align-top">
                    <span className={`status-badge ${item.priority} ${getPriorityColor(item.priority)}`}>
                      {item.priority}
                    </span>
                  </td>
                  <td className="align-top">
                    {new Date(item.validFrom).toLocaleDateString()}
                  </td>
                  <td className="align-top">
                    {new Date(item.validUntil).toLocaleDateString()}
                  </td>
                  <td className="align-top">
                    {new Date(item.createdOn).toLocaleDateString()}
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
                  No announcements found. Add a new announcement to get started.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal for creating/editing announcements */}
      {isModalOpen && (
        <div className="admin-modal">
          <div className="admin-modal-content">
            <div className="modal-header">
              <h3 className="modal-title">
                {selectedAnnouncement ? `Edit Announcement` : 'Add New Announcement'}
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
                  <label className="label">Message *</label>
                  <textarea
                    name="message"
                    value={newAnnouncement.message}
                    onChange={handleInputChange}
                    className="input"
                    placeholder="Enter announcement message"
                    rows="3"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="label">Priority</label>
                    <select
                      name="priority"
                      value={newAnnouncement.priority}
                      onChange={handleInputChange}
                      className="input"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>

                  <div>
                    <label className="label">Valid Until</label>
                    <input
                      type="date"
                      name="validUntil"
                      value={newAnnouncement.validUntil}
                      onChange={handleInputChange}
                      className="input"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="label">Valid From</label>
                    <input
                      type="date"
                      name="validFrom"
                      value={newAnnouncement.validFrom}
                      onChange={handleInputChange}
                      className="input"
                    />
                  </div>
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
                  {selectedAnnouncement ? 'Update Announcement' : 'Add Announcement'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnnouncementsManager;
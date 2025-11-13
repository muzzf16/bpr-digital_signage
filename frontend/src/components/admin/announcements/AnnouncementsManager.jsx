import React, { useState, useEffect } from 'react';
import { FaBullhorn, FaPlus, FaEdit, FaTrash, FaSearch } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { fetchWithAuth } from '../../../utils/api';

const priorityMap = {
  low: 1,
  medium: 10,
  high: 20,
};

const reversePriorityMap = {
  1: 'low',
  10: 'medium',
  20: 'high',
};

const AnnouncementsManager = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newAnnouncement, setNewAnnouncement] = useState({
    message: '',
    priority: 'medium',
    start_at: new Date().toISOString().split('T')[0],
    end_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // 7 days from now
  });

  const fetchAnnouncements = () => {
    fetchWithAuth('/api/admin/announcements')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          const formattedAnnouncements = data.announcements.map(ann => ({
            ...ann,
            priority: reversePriorityMap[ann.priority] || 'medium',
            validFrom: ann.start_at,
            validUntil: ann.end_at,
            createdOn: ann.created_at,
          }));
          setAnnouncements(formattedAnnouncements);
        } else {
          toast.error('Failed to fetch announcements.');
        }
      })
      .catch(err => {
        console.error("Error fetching announcements:", err);
        toast.error("Failed to fetch announcements.");
      });
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const handleAddAnnouncement = () => {
    if (!newAnnouncement.message) {
      toast.error('Please provide an announcement message');
      return;
    }

    const payload = {
      ...newAnnouncement,
      priority: priorityMap[newAnnouncement.priority],
    };

    fetchWithAuth('/api/admin/announcements', {
      method: 'POST',
      body: JSON.stringify(payload),
    })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        fetchAnnouncements();
        setIsModalOpen(false);
        toast.success('Announcement added successfully!');
      } else {
        toast.error('Failed to add announcement.');
      }
    })
    .catch(err => {
      console.error("Error adding announcement:", err);
      toast.error('Failed to add announcement.');
    });
  };

  const handleEdit = (item) => {
    setSelectedAnnouncement(item);
    setNewAnnouncement({
      message: item.message,
      priority: item.priority,
      start_at: item.validFrom.split('T')[0],
      end_at: item.validUntil.split('T')[0]
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this announcement?')) {
      fetchWithAuth(`/api/admin/announcements/${id}`, {
        method: 'DELETE',
      })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          fetchAnnouncements();
          toast.success('Announcement deleted successfully!');
        } else {
          toast.error('Failed to delete announcement.');
        }
      })
      .catch(err => {
        console.error("Error deleting announcement:", err);
        toast.error('Failed to delete announcement.');
      });
    }
  };

  const handleUpdateAnnouncement = () => {
    if (!newAnnouncement.message) {
      toast.error('Please provide an announcement message');
      return;
    }

    const payload = {
      ...newAnnouncement,
      priority: priorityMap[newAnnouncement.priority],
    };

    fetchWithAuth(`/api/admin/announcements/${selectedAnnouncement.id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        fetchAnnouncements();
        setIsModalOpen(false);
        toast.success('Announcement updated successfully!');
      } else {
        toast.error('Failed to update announcement.');
      }
    })
    .catch(err => {
      console.error("Error updating announcement:", err);
      toast.error('Failed to update announcement.');
    });
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
                      name="end_at"
                      value={newAnnouncement.end_at}
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
                      name="start_at"
                      value={newAnnouncement.start_at}
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
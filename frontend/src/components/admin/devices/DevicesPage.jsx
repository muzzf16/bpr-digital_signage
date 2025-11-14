import React, { useEffect, useState, useRef } from 'react';
import { FaDesktop, FaSync, FaPlus, FaDownload, FaSearch, FaEdit, FaTrash, FaEye, FaLink } from 'react-icons/fa';
import { toast } from 'react-toastify';
import GlassCard from '../../shared/GlassCard';
import DataTable from '../ui/DataTable';
import { fetchWithAuth } from '../../../utils/api';
import { humanizeDate } from "../../../utils/common";

export default function DevicesPage() {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const [page, setPage] = useState(1);
  const perPage = 10;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [newDevice, setNewDevice] = useState({
    id: '',
    name: '',
    location: '',
    playlist_id: ''
  });
  const [stats, setStats] = useState({ total: 0, online: 0, offline: 0 });

  const fetchDevices = () => {
    setLoading(true);
    fetchWithAuth('/api/admin/devices')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setDevices(data.devices);
          const now = Date.now();
          let online = 0;
          data.devices.forEach(d => {
            if (d.last_seen && ((now - new Date(d.last_seen).getTime()) < 90 * 1000)) online++;
          });
          setStats({ total: data.devices.length, online, offline: data.devices.length - online });
        } else {
          toast.error("Failed to fetch devices.");
        }
      })
      .catch(err => {
        console.error("Error fetching devices:", err);
        toast.error("Failed to fetch devices.");
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchDevices();
    const id = setInterval(fetchDevices, 60 * 1000); // refresh every minute
    return () => clearInterval(id);
  }, []);

  const handleSaveDevice = () => {
    const isUpdating = !!selectedDevice;
    const url = isUpdating ? `/api/admin/devices/${selectedDevice.id}` : '/api/admin/devices';
    const method = isUpdating ? 'PUT' : 'POST';

    fetchWithAuth(url, {
      method,
      body: JSON.stringify(newDevice),
    })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        toast.success(`Device ${isUpdating ? 'updated' : 'added'} successfully!`);
        fetchDevices();
        setIsModalOpen(false);
      } else {
        toast.error(`Failed to ${isUpdating ? 'update' : 'add'} device.`);
      }
    })
    .catch(err => {
      console.error(`Error ${isUpdating ? 'updating' : 'adding'} device:`, err);
      toast.error(`Failed to ${isUpdating ? 'update' : 'add'} device.`);
    });
  };

  const handleDelete = (item) => {
    if (window.confirm(`Are you sure you want to remove the device "${item.name}"?`)) {
      fetchWithAuth(`/api/admin/devices/${item.id}`, {
        method: 'DELETE',
      })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          toast.success(`Device "${item.name}" removed successfully!`);
          fetchDevices();
        } else {
          toast.error("Failed to remove device.");
        }
      })
      .catch(err => {
        console.error("Error removing device:", err);
        toast.error("Failed to remove device.");
      });
    }
  };

  const handleEdit = (item) => {
    setSelectedDevice(item);
    setNewDevice({
      id: item.id,
      name: item.name,
      location: item.location,
      playlist_id: item.playlist_id
    });
    setIsModalOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewDevice(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const filteredDevices = devices.filter(d => {
    if (filter === 'online') {
      const diff = (Date.now() - new Date(d.last_seen).getTime()) / 1000;
      if (diff >= 90) return false;
    } else if (filter === 'offline') {
      const diff = (Date.now() - new Date(d.last_seen).getTime()) / 1000;
      if (diff < 90) return false;
    }
    return (!query) || (d.name || '').toLowerCase().includes(query.toLowerCase()) || (d.id || '').toLowerCase().includes(query.toLowerCase()) || (d.location || '').toLowerCase().includes(query.toLowerCase());
  });

  const columns = [
    { 
      key: 'name', 
      header: 'Device Name', 
      render: (value, row) => (
        <div className="flex items-center">
          <div className={`w-3 h-3 rounded-full mr-3 ${
            ((Date.now() - new Date(row.last_seen).getTime()) / 1000) < 90 ? 'bg-green-500 animate-pulse' : 'bg-red-500'
          }`}></div>
          <div>
            <div className="font-medium">{value}</div>
            <div className="text-xs text-indigo-200">{row.id}</div>
          </div>
        </div>
      )
    },
    { 
      key: 'location', 
      header: 'Location',
    },
    { 
      key: 'last_seen', 
      header: 'Last Seen',
      render: (value) => humanizeDate(value)
    },
    { 
      key: 'playlist_id', 
      header: 'Playlist',
    },
  ];

  return (
    <GlassCard className="bg-gradient-to-br from-indigo-900/30 to-indigo-800/20 backdrop-blur-sm border border-indigo-700/30">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <div>
          <h3 className="text-xl font-bold flex items-center gap-2">
            <FaDesktop className="text-blue-400" /> Device Management
          </h3>
          <p className="text-indigo-200 text-sm mt-1">Monitor and manage digital signage devices</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Search devices..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="bg-indigo-800/30 text-white placeholder-indigo-300 border border-indigo-700/50 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full sm:w-48"
            />
            <FaSearch className="absolute left-3 top-3 text-indigo-300" />
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={fetchDevices}
              className="bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white px-3 py-2 rounded-lg flex items-center space-x-1 transition-all duration-300 shadow-lg shadow-indigo-900/30"
            >
              <FaSync /> <span>Refresh</span>
            </button>
            <button
              onClick={() => {
                setSelectedDevice(null);
                setNewDevice({ id: '', name: '', location: '', playlist_id: '' });
                setIsModalOpen(true);
              }}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-all duration-300 shadow-lg shadow-blue-900/30"
            >
              <FaDesktop /> <span>Add Device</span>
            </button>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-indigo-900/40 p-4 rounded-lg">
            <p className="text-indigo-200 text-sm">Total Devices</p>
            <p className="text-2xl font-bold text-white">{stats.total}</p>
          </div>
          <div className="bg-green-900/40 p-4 rounded-lg">
            <p className="text-green-200 text-sm">Online</p>
            <p className="text-2xl font-bold text-white">{stats.online}</p>
          </div>
          <div className="bg-red-900/40 p-4 rounded-lg">
            <p className="text-red-200 text-sm">Offline</p>
            <p className="text-2xl font-bold text-white">{stats.offline}</p>
          </div>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={filteredDevices}
        onEdit={handleEdit}
        onDelete={handleDelete}
        emptyMessage="No devices found. Add a new device to get started."
      />

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-xl border border-indigo-700/50 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-white">
                  {selectedDevice ? `Edit Device: ${selectedDevice.name}` : 'Add New Device'}
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
                  <label className="block text-sm font-medium text-indigo-200 mb-1">Device ID</label>
                  <input
                    type="text"
                    name="id"
                    value={newDevice.id}
                    onChange={handleInputChange}
                    className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Enter device ID"
                    disabled={!!selectedDevice}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-indigo-200 mb-1">Device Name</label>
                    <input
                      type="text"
                      name="name"
                      value={newDevice.name}
                      onChange={handleInputChange}
                      className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="Enter device name"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-indigo-200 mb-1">Playlist ID</label>
                    <input
                      type="text"
                      name="playlist_id"
                      value={newDevice.playlist_id}
                      onChange={handleInputChange}
                      className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="Enter playlist ID"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-indigo-200 mb-1">Location</label>
                  <input
                    type="text"
                    name="location"
                    value={newDevice.location}
                    onChange={handleInputChange}
                    className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Enter full location (e.g., Branch - Area)"
                  />
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
                  onClick={handleSaveDevice}
                  className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-indigo-700 rounded-lg text-white hover:from-indigo-700 hover:to-indigo-800 transition-all"
                >
                  {selectedDevice ? 'Update Device' : 'Add Device'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </GlassCard>
  );
}
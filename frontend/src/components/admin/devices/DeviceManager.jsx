import React, { useState, useEffect } from 'react';
import { FaDesktop, FaEdit, FaTrash, FaSearch, FaSync, FaMapMarkerAlt, FaSignal, FaClock, FaPowerOff, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';
import { toast } from 'react-toastify';
import GlassCard from '../../GlassCard';
import DataTable from '../ui/DataTable';

const DeviceManager = () => {
  const [devices, setDevices] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newDevice, setNewDevice] = useState({
    name: '',
    location: '',
    ip: '',
    status: 'Offline',
    lastSeen: new Date().toISOString()
  });

  useEffect(() => {
    fetch('/api/admin/devices')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          // Transform the data to match our expected structure
          const formattedDevices = data.devices.map((device, idx) => ({
            id: device.id || idx + 1,
            name: device.name || `Device ${idx + 1}`,
            location: device.location || 'Unknown Location',
            ip: device.ip || '192.168.1.1',
            status: device.status || 'Offline',
            lastSeen: device.lastSeen || new Date().toISOString()
          }));
          setDevices(formattedDevices);
        }
      })
      .catch(err => {
        console.error("Error fetching devices:", err);
        toast.error("Failed to fetch devices.");
        // Fallback to mock data
        setDevices([
          {
            id: 1,
            name: 'Lobby Display',
            location: 'Main Branch - Lobby',
            ip: '192.168.1.10',
            status: 'Online',
            lastSeen: '2025-11-11T10:30:00Z'
          },
          {
            id: 2,
            name: 'Teller Area Screen',
            location: 'Main Branch - Teller Area',
            ip: '192.168.1.11',
            status: 'Online',
            lastSeen: '2025-11-11T10:28:00Z'
          },
          {
            id: 3,
            name: 'Meeting Room TV',
            location: 'Main Branch - Meeting Room',
            ip: '192.168.1.12',
            status: 'Offline',
            lastSeen: '2025-11-10T15:45:00Z'
          },
          {
            id: 4,
            name: 'VIP Lounge Display',
            location: 'VIP Lounge',
            ip: '192.168.1.13',
            status: 'Online',
            lastSeen: '2025-11-11T10:25:00Z'
          }
        ]);
      });
  }, []);

  const handleEdit = (item) => {
    setSelectedDevice(item);
    setNewDevice({
      name: item.name,
      location: item.location,
      ip: item.ip,
      status: item.status,
      lastSeen: item.lastSeen
    });
    setIsModalOpen(true);
    toast.info(`Editing device: ${item.name}`);
  };

  const handleDelete = (item) => {
    if (window.confirm(`Are you sure you want to remove the device "${item.name}"?`)) {
      fetch(`/api/admin/devices/${item.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': 'secret_dev_key'
        }
      })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setDevices(devices.filter(d => d.id !== item.id));
          toast.success(`Device "${item.name}" removed successfully!`);
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

  const handleRefresh = () => {
    toast.info('Refreshing device list...');
    // In a real implementation, this would fetch the latest data
  };

  const handleSaveDevice = () => {
    if (!newDevice.name || !newDevice.location) {
      toast.error('Please provide both name and location for the device');
      return;
    }

    if (selectedDevice) {
      // Update existing device
      setDevices(devices.map(device => 
        device.id === selectedDevice.id ? { ...device, ...newDevice } : device
      ));
      toast.success(`Device "${newDevice.name}" updated successfully!`);
    } else {
      // Create new device
      const newDeviceObj = {
        id: devices.length + 1,
        ...newDevice,
        lastSeen: new Date().toISOString()
      };
      setDevices([newDeviceObj, ...devices]);
      toast.success(`Device "${newDevice.name}" added successfully!`);
    }
    
    setIsModalOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewDevice(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const updateDeviceStatus = (deviceId, newStatus) => {
    setDevices(devices.map(device => 
      device.id === deviceId ? { ...device, status: newStatus } : device
    ));
    toast.success(`Device status updated to ${newStatus}`);
  };

  // Filter devices based on search term
  const filteredDevices = devices.filter(device => 
    device.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    device.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    device.ip.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-indigo-800/30 text-white placeholder-indigo-300 border border-indigo-700/50 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full sm:w-48"
            />
            <FaSearch className="absolute left-3 top-3 text-indigo-300" />
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={handleRefresh}
              className="bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white px-3 py-2 rounded-lg flex items-center space-x-1 transition-all duration-300 shadow-lg shadow-indigo-900/30"
            >
              <FaSync /> <span>Refresh</span>
            </button>
            <button
              onClick={() => {
                setSelectedDevice(null);
                setNewDevice({
                  name: '',
                  location: '',
                  ip: '',
                  status: 'Offline',
                  lastSeen: new Date().toISOString()
                });
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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-indigo-900/40 p-4 rounded-lg">
            <p className="text-indigo-200 text-sm">Total Devices</p>
            <p className="text-2xl font-bold text-white">{devices.length}</p>
          </div>
          <div className="bg-green-900/40 p-4 rounded-lg">
            <p className="text-green-200 text-sm">Online</p>
            <p className="text-2xl font-bold text-white">{devices.filter(d => d.status === 'Online').length}</p>
          </div>
          <div className="bg-red-900/40 p-4 rounded-lg">
            <p className="text-red-200 text-sm">Offline</p>
            <p className="text-2xl font-bold text-white">{devices.filter(d => d.status === 'Offline').length}</p>
          </div>
          <div className="bg-yellow-900/40 p-4 rounded-lg">
            <p className="text-yellow-200 text-sm">Last Updated</p>
            <p className="text-xl font-bold text-white">Just now</p>
          </div>
        </div>
      </div>

      <DataTable
        columns={[
          { 
            key: 'name', 
            header: 'Device Name', 
            render: (value, row) => (
              <div className="flex items-center">
                <div className={`w-3 h-3 rounded-full mr-3 ${
                  row.status === 'Online' ? 'bg-green-500 animate-pulse' : 
                  row.status === 'Offline' ? 'bg-red-500' : 'bg-yellow-500'
                }`}></div>
                <div>
                  <div className="font-medium">{value}</div>
                  <div className="text-xs text-indigo-200">{row.ip}</div>
                </div>
              </div>
            )
          },
          { 
            key: 'location', 
            header: 'Location',
            render: (value) => (
              <div className="flex items-center">
                <FaMapMarkerAlt className="text-indigo-300 mr-2" />
                <span>{value}</span>
              </div>
            )
          },
          { 
            key: 'status', 
            header: 'Status', 
            render: (value) => (
              <span className={`px-3 py-1 rounded-full text-xs flex items-center justify-center ${
                value === 'Online' ? 'bg-green-600/30 text-green-200' : 
                value === 'Offline' ? 'bg-red-600/30 text-red-200' : 
                'bg-yellow-600/30 text-yellow-200'
              }`}>
                <span className={`w-2 h-2 rounded-full mr-2 ${
                  value === 'Online' ? 'bg-green-400' : 
                  value === 'Offline' ? 'bg-red-400' : 
                  'bg-yellow-400'
                }`}></span>
                {value}
              </span>
            )
          },
          { 
            key: 'lastSeen', 
            header: 'Last Seen',
            render: (value) => (
              <div className="flex items-center">
                <FaClock className="text-indigo-300 mr-2" />
                <span>{new Date(value).toLocaleString()}</span>
              </div>
            )
          },
          { 
            key: 'actions', 
            header: 'Actions', 
            render: (_, row) => (
              <div className="flex space-x-2 justify-end">
                <select
                  value={row.status}
                  onChange={(e) => updateDeviceStatus(row.id, e.target.value)}
                  className="bg-gray-700 text-white text-xs rounded px-2 py-1 mr-2 focus:outline-none"
                >
                  <option value="Online">Online</option>
                  <option value="Offline">Offline</option>
                  <option value="Maintenance">Maintenance</option>
                </select>
                <button
                  onClick={() => handleEdit(row)}
                  className="p-2 text-indigo-300 hover:text-indigo-100 hover:bg-indigo-700/50 rounded-lg transition-colors"
                  title="Edit"
                >
                  <FaEdit />
                </button>
                <button
                  onClick={() => handleDelete(row)}
                  className="p-2 text-red-300 hover:text-red-100 hover:bg-red-700/50 rounded-lg transition-colors"
                  title="Remove"
                >
                  <FaTrash />
                </button>
              </div>
            )
          }
        ]}
        data={filteredDevices}
        emptyMessage="No devices found. Add a new device to get started."
      />

      {/* Modal for creating/editing devices */}
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
                    <label className="block text-sm font-medium text-indigo-200 mb-1">IP Address</label>
                    <input
                      type="text"
                      name="ip"
                      value={newDevice.ip}
                      onChange={handleInputChange}
                      className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="Enter IP address"
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
                
                <div>
                  <label className="block text-sm font-medium text-indigo-200 mb-1">Status</label>
                  <select
                    name="status"
                    value={newDevice.status}
                    onChange={handleInputChange}
                    className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="Online">Online</option>
                    <option value="Offline">Offline</option>
                    <option value="Maintenance">Maintenance</option>
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
};

export default DeviceManager;
import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function DeviceManager() {
  const [devices, setDevices] = useState([]);
  const [newDevice, setNewDevice] = useState({
    name: '',
    location: '',
    status: 'active'
  });

  useEffect(() => {
    // For now, we'll use mock data since there's no dedicated device API
    // In a real implementation, fetch from backend API
    setDevices([
      { id: 'demo-tv-01', name: 'Main Lobby Display', location: 'Main Lobby', status: 'active', lastActive: '2025-11-11T08:30:00Z' },
      { id: 'demo-tv-02', name: 'Branch Office Display', location: 'Branch Office', status: 'active', lastActive: '2025-11-11T08:25:00Z' },
      { id: 'demo-tv-03', name: 'Conference Room Display', location: 'Conference Room', status: 'inactive', lastActive: '2025-11-10T17:45:00Z' }
    ]);
  }, []);

  const addDevice = () => {
    if (!newDevice.name || !newDevice.location) {
      alert('Please fill in all required fields');
      return;
    }

    const deviceToAdd = {
      id: `demo-tv-${devices.length + 1}`,
      ...newDevice,
      lastActive: new Date().toISOString()
    };

    setDevices([...devices, deviceToAdd]);
    setNewDevice({ name: '', location: '', status: 'active' });
  };

  const removeDevice = (id) => {
    if (window.confirm('Are you sure you want to remove this device?')) {
      setDevices(devices.filter(device => device.id !== id));
    }
  };

  const updateDeviceStatus = (id, newStatus) => {
    setDevices(devices.map(device => 
      device.id === id ? { ...device, status: newStatus } : device
    ));
  };

  return (
    <div>
      <h2>Device Manager</h2>
      
      <div className="add-device-form" style={{ marginBottom: '30px' }}>
        <h3>Add New Device</h3>
        <div className="form-group">
          <label>Device Name:</label>
          <input
            type="text"
            value={newDevice.name}
            onChange={(e) => setNewDevice({...newDevice, name: e.target.value})}
            placeholder="e.g., Lobby Display"
          />
        </div>
        <div className="form-group">
          <label>Location:</label>
          <input
            type="text"
            value={newDevice.location}
            onChange={(e) => setNewDevice({...newDevice, location: e.target.value})}
            placeholder="e.g., Main Lobby"
          />
        </div>
        <div className="form-group">
          <label>Status:</label>
          <select
            value={newDevice.status}
            onChange={(e) => setNewDevice({...newDevice, status: e.target.value})}
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="maintenance">Maintenance</option>
          </select>
        </div>
        <button onClick={addDevice}>Add Device</button>
      </div>

      <div className="device-list">
        <h3>Registered Devices</h3>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Location</th>
              <th>Status</th>
              <th>Last Active</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {devices.map(device => (
              <tr key={device.id}>
                <td>{device.id}</td>
                <td>{device.name}</td>
                <td>{device.location}</td>
                <td>
                  <select
                    value={device.status}
                    onChange={(e) => updateDeviceStatus(device.id, e.target.value)}
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="maintenance">Maintenance</option>
                  </select>
                </td>
                <td>{new Date(device.lastActive).toLocaleString()}</td>
                <td>
                  <button onClick={() => removeDevice(device.id)}>Remove</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
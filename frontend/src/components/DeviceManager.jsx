import React, { useState, useEffect } from 'react';
import { FaDesktop } from 'react-icons/fa';
import { toast } from 'react-toastify';
import GlassCard from './GlassCard';
import DataTable from './DataTable';

const DeviceManager = () => {
  const [devices, setDevices] = useState([]);

  useEffect(() => {
    fetch('/api/admin/devices')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setDevices(data.devices);
        }
      })
      .catch(err => {
        console.error("Error fetching devices:", err);
        toast.error("Failed to fetch devices.");
      });
  }, []);

  const handleEdit = (item) => {
    toast.info(`Edit clicked for: ${item.name}`);
  };

  const handleDelete = (item) => {
    if (window.confirm(`Are you sure you want to delete this device?`)) {
      // Here you would call the API to delete the item
      toast.success(`Device deleted successfully!`);
    }
  };

  return (
    <GlassCard 
      title="🖥️ Device Management" 
      icon={<FaDesktop />}
      className="lg:col-span-2"
    >
      <div className="flex justify-between items-center mb-4">
        <h4 className="text-white font-medium">Connected Devices</h4>
        <div className="flex space-x-2">
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">
            Refresh
          </button>
        </div>
      </div>
      
      <DataTable 
        columns={[
          { key: 'name', header: 'Device Name' },
          { key: 'location', header: 'Location' },
          { key: 'status', header: 'Status', render: (value) => (
            <span className={`px-2 py-1 rounded-full text-xs ${
              value === 'Online' ? 'bg-green-600/30 text-green-200' : 'bg-red-600/30 text-red-200'
            }`}>
              {value}
            </span>
          )},
          { key: 'lastSeen', header: 'Last Seen' },
        ]}
        data={devices}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </GlassCard>
  );
};

export default DeviceManager;

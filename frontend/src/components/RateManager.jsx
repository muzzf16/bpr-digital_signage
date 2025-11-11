import React, { useState, useEffect } from 'react';
import { FaMoneyBillAlt, FaPlus, FaDownload } from 'react-icons/fa';
import { toast } from 'react-toastify';
import GlassCard from './GlassCard';
import DataTable from './DataTable';

const RateManager = () => {
  const [rates, setRates] = useState([]);

  useEffect(() => {
    fetch('/api/admin/rates')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setRates(data.products); // Assuming backend returns 'products' for rates
        }
      })
      .catch(err => {
        console.error("Error fetching rates:", err);
        toast.error("Failed to fetch rates.");
      });
  }, []);

  const handleEdit = (item) => {
    toast.info(`Edit clicked for: ${item.name}`);
  };

  const handleDelete = (item) => {
    if (window.confirm(`Are you sure you want to delete this rate?`)) {
      // Here you would call the API to delete the item
      toast.success(`Rate deleted successfully!`);
    }
  };

  const handleCreate = () => {
    // Here you would open a modal or navigate to a new page to create a rate
    toast.success(`Create new rate clicked!`);
  };

  return (
    <GlassCard 
      title="💰 Produk & Suku Bunga" 
      icon={<FaMoneyBillAlt />}
    >
      <div className="flex justify-between items-center mb-4">
        <h4 className="text-white font-medium">Interest Rates</h4>
        <div className="flex space-x-2">
          <button className="bg-green-600/30 hover:bg-green-600/40 text-green-300 px-3 py-2 rounded-lg flex items-center space-x-1 border border-green-600/30">
            <FaDownload /> <span>Export</span>
          </button>
          <button 
            onClick={handleCreate}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
          >
            <FaPlus /> <span>Add New</span>
          </button>
        </div>
      </div>
      
      <DataTable 
        columns={[
          { key: 'name', header: 'Product' },
          { key: 'rate', header: 'Rate (%)', render: (value) => `${value}%` },
          { key: 'currency', header: 'Currency' },
          { key: 'status', header: 'Status', render: (value) => (
            <span className={`px-2 py-1 rounded-full text-xs ${
              value === 'Published' ? 'bg-green-600/30 text-green-200' : 'bg-yellow-600/30 text-yellow-200'
            }`}>
              {value}
            </span>
          )},
        ]}
        data={rates}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </GlassCard>
  );
};

export default RateManager;
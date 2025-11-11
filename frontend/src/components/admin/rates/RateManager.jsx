import React, { useState, useEffect } from 'react';
import { FaMoneyBillAlt, FaPlus, FaEdit, FaTrash, FaDownload, FaSearch, FaChartLine, FaPercent } from 'react-icons/fa';
import { toast } from 'react-toastify';
import GlassCard from '../../GlassCard';
import DataTable from '../ui/DataTable';

const RateManager = () => {
  const [rates, setRates] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRate, setSelectedRate] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newRate, setNewRate] = useState({
    name: '',
    rate: '',
    currency: 'IDR',
    description: '',
    status: 'Published'
  });

  useEffect(() => {
    fetch('/api/admin/rates')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          // Transform the data to match our expected structure
          const formattedRates = data.products.map((product, idx) => ({
            id: idx + 1,
            name: product.name || `Product ${idx + 1}`,
            rate: product.rate || 0,
            currency: product.currency || 'IDR',
            description: product.description || 'No description',
            status: product.status || 'Draft',
            lastUpdated: product.lastUpdated || new Date().toISOString()
          }));
          setRates(formattedRates);
        }
      })
      .catch(err => {
        console.error("Error fetching rates:", err);
        toast.error("Failed to fetch rates.");
        // Fallback to mock data
        setRates([
          {
            id: 1,
            name: 'Tabungan Berjangka',
            rate: 7.5,
            currency: 'IDR',
            description: 'Tabungan dengan jangka waktu tertentu',
            status: 'Published',
            lastUpdated: '2025-10-15'
          },
          {
            id: 2,
            name: 'Deposito Rupiah',
            rate: 6.8,
            currency: 'IDR',
            description: 'Deposito dalam mata uang Rupiah',
            status: 'Published',
            lastUpdated: '2025-10-20'
          },
          {
            id: 3,
            name: 'Kredit Multiguna',
            rate: 12.5,
            currency: 'IDR',
            description: 'Kredit untuk berbagai keperluan',
            status: 'Draft',
            lastUpdated: '2025-11-01'
          }
        ]);
      });
  }, []);

  const handleEdit = (item) => {
    setSelectedRate(item);
    setNewRate({
      name: item.name,
      rate: item.rate,
      currency: item.currency,
      description: item.description,
      status: item.status
    });
    setIsModalOpen(true);
    toast.info(`Editing rate: ${item.name}`);
  };

  const handleDelete = (item) => {
    if (window.confirm(`Are you sure you want to delete the rate "${item.name}"?`)) {
      fetch(`/api/admin/rates/${item.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': 'secret_dev_key'
        }
      })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setRates(rates.filter(r => r.id !== item.id));
          toast.success(`Rate "${item.name}" deleted successfully!`);
        } else {
          toast.error("Failed to delete rate.");
        }
      })
      .catch(err => {
        console.error("Error deleting rate:", err);
        toast.error("Failed to delete rate.");
      });
    }
  };

  const handleCreate = () => {
    setSelectedRate(null);
    setNewRate({
      name: '',
      rate: '',
      currency: 'IDR',
      description: '',
      status: 'Draft'
    });
    setIsModalOpen(true);
    toast.success(`Create new rate clicked!`);
  };

  const handleSaveRate = () => {
    if (!newRate.name || !newRate.rate) {
      toast.error('Please provide both name and rate');
      return;
    }

    if (selectedRate) {
      // Update existing rate
      setRates(rates.map(rate => 
        rate.id === selectedRate.id 
          ? { ...rate, ...newRate, lastUpdated: new Date().toISOString() } 
          : rate
      ));
      toast.success(`Rate "${newRate.name}" updated successfully!`);
    } else {
      // Create new rate
      const newRateObj = {
        id: rates.length + 1,
        ...newRate,
        lastUpdated: new Date().toISOString()
      };
      setRates([newRateObj, ...rates]);
      toast.success(`Rate "${newRate.name}" created successfully!`);
    }
    
    setIsModalOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewRate(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Filter rates based on search term
  const filteredRates = rates.filter(rate => 
    rate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    rate.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    rate.currency.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const exportToCSV = () => {
    // In a real implementation, this would generate and download a CSV file
    toast.info('Exporting to CSV...');
  };

  return (
    <GlassCard className="bg-gradient-to-br from-purple-900/30 to-purple-800/20 backdrop-blur-sm border border-purple-700/30">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <div>
          <h3 className="text-xl font-bold flex items-center gap-2">
            <FaMoneyBillAlt className="text-green-400" /> Interest Rates Management
          </h3>
          <p className="text-purple-200 text-sm mt-1">Manage interest rates for financial products</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Search rates..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-purple-800/30 text-white placeholder-purple-300 border border-purple-700/50 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 w-full sm:w-48"
            />
            <FaSearch className="absolute left-3 top-3 text-purple-300" />
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={exportToCSV}
              className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-3 py-2 rounded-lg flex items-center space-x-1 transition-all duration-300 shadow-lg shadow-green-900/30"
            >
              <FaDownload /> <span>Export</span>
            </button>
            <button
              onClick={handleCreate}
              className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-all duration-300 shadow-lg shadow-purple-900/30"
            >
              <FaPlus /> <span>Add Rate</span>
            </button>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-purple-900/40 p-4 rounded-lg">
            <p className="text-purple-200 text-sm">Total Products</p>
            <p className="text-2xl font-bold text-white">{rates.length}</p>
          </div>
          <div className="bg-green-900/40 p-4 rounded-lg">
            <p className="text-green-200 text-sm">Published</p>
            <p className="text-2xl font-bold text-white">{rates.filter(r => r.status === 'Published').length}</p>
          </div>
          <div className="bg-yellow-900/40 p-4 rounded-lg">
            <p className="text-yellow-200 text-sm">Avg. Rate</p>
            <p className="text-2xl font-bold text-white">
              {rates.length > 0 
                ? (rates.reduce((sum, r) => sum + parseFloat(r.rate), 0) / rates.length).toFixed(2) + '%' 
                : '0%'}
            </p>
          </div>
          <div className="bg-blue-900/40 p-4 rounded-lg">
            <p className="text-blue-200 text-sm">Currency</p>
            <p className="text-2xl font-bold text-white">IDR</p>
          </div>
        </div>
      </div>

      <DataTable
        columns={[
          { 
            key: 'name', 
            header: 'Product Name',
            render: (value, row) => (
              <div>
                <div className="font-medium">{value}</div>
                <div className="text-xs text-purple-200 truncate max-w-xs">{row.description}</div>
              </div>
            )
          },
          { 
            key: 'rate', 
            header: 'Rate (%)', 
            render: (value) => (
              <div className="flex items-center">
                <FaPercent className="text-green-400 mr-1" />
                <span className="font-bold">{value}%</span>
              </div>
            ) 
          },
          { 
            key: 'currency', 
            header: 'Currency',
            render: (value) => (
              <span className="px-2 py-1 bg-purple-800/40 text-purple-200 rounded text-sm">{value}</span>
            )
          },
          { 
            key: 'status', 
            header: 'Status', 
            render: (value) => (
              <span className={`px-3 py-1 rounded-full text-xs flex items-center justify-center ${
                value === 'Published' ? 'bg-green-600/30 text-green-200' : 
                value === 'Scheduled' ? 'bg-yellow-600/30 text-yellow-200' : 
                'bg-red-600/30 text-red-200'
              }`}>
                <span className={`w-2 h-2 rounded-full mr-2 ${
                  value === 'Published' ? 'bg-green-400' : 
                  value === 'Scheduled' ? 'bg-yellow-400' : 
                  'bg-red-400'
                }`}></span>
                {value}
              </span>
            )
          },
          { 
            key: 'lastUpdated', 
            header: 'Last Updated',
            render: (value) => new Date(value).toLocaleDateString()
          },
          { 
            key: 'actions', 
            header: 'Actions', 
            render: (_, row) => (
              <div className="flex space-x-2 justify-end">
                <button
                  onClick={() => handleEdit(row)}
                  className="p-2 text-purple-300 hover:text-purple-100 hover:bg-purple-700/50 rounded-lg transition-colors"
                  title="Edit"
                >
                  <FaEdit />
                </button>
                <button
                  onClick={() => handleDelete(row)}
                  className="p-2 text-red-300 hover:text-red-100 hover:bg-red-700/50 rounded-lg transition-colors"
                  title="Delete"
                >
                  <FaTrash />
                </button>
              </div>
            )
          }
        ]}
        data={filteredRates}
        emptyMessage="No interest rates found. Create a new rate to get started."
      />

      {/* Modal for creating/editing rates */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-xl border border-purple-700/50 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-white">
                  {selectedRate ? `Edit Rate: ${selectedRate.name}` : 'Add New Interest Rate'}
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
                  <label className="block text-sm font-medium text-purple-200 mb-1">Product Name</label>
                  <input
                    type="text"
                    name="name"
                    value={newRate.name}
                    onChange={handleInputChange}
                    className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Enter product name"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-purple-200 mb-1">Interest Rate (%)</label>
                    <input
                      type="number"
                      name="rate"
                      value={newRate.rate}
                      onChange={handleInputChange}
                      className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="Enter interest rate"
                      step="0.01"
                      min="0"
                      max="100"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-purple-200 mb-1">Currency</label>
                    <select
                      name="currency"
                      value={newRate.currency}
                      onChange={handleInputChange}
                      className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="IDR">IDR (Indonesian Rupiah)</option>
                      <option value="USD">USD (US Dollar)</option>
                      <option value="EUR">EUR (Euro)</option>
                      <option value="GBP">GBP (British Pound)</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-purple-200 mb-1">Description</label>
                  <textarea
                    name="description"
                    value={newRate.description}
                    onChange={handleInputChange}
                    className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Enter product description"
                    rows="3"
                  ></textarea>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-purple-200 mb-1">Status</label>
                  <select
                    name="status"
                    value={newRate.status}
                    onChange={handleInputChange}
                    className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="Draft">Draft</option>
                    <option value="Published">Published</option>
                    <option value="Scheduled">Scheduled</option>
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
                  onClick={handleSaveRate}
                  className="px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-700 rounded-lg text-white hover:from-purple-700 hover:to-purple-800 transition-all"
                >
                  {selectedRate ? 'Update Rate' : 'Add Rate'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </GlassCard>
  );
};

export default RateManager;
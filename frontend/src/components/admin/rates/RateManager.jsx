import React, { useState, useEffect } from 'react';
import { FaMoneyBillAlt, FaPlus, FaEdit, FaTrash, FaDownload, FaSearch, FaPercent } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { fetchWithAuth } from '../../../utils/api';

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
    fetchWithAuth('/api/admin/rates')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          // Transform the data to match our expected structure
          const formattedRates = data.products.map((product, idx) => ({
            id: product.id || idx + 1,
            name: product.name || `Product ${idx + 1}`,
            rate: product.interest_rate || 0,
            currency: product.currency || 'IDR',
            description: product.terms || 'No description',
            status: product.published ? 'Published' : 'Draft',
            lastUpdated: product.updated_at || new Date().toISOString()
          }));
          setRates(formattedRates);
        }
      })
      .catch(err => {
        console.error("Error fetching rates:", err);
        toast.error("Failed to fetch rates.");
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
      fetchWithAuth(`/api/admin/rates/${item.id}`, {
        method: 'DELETE',
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
    rate.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    rate.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    rate.currency?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const exportToCSV = () => {
    // In a real implementation, this would generate and download a CSV file
    toast.info('Exporting to CSV...');
  };

  return (
    <div className="glass-card">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <div>
          <h3 className="card-title flex items-center gap-2">
            <FaMoneyBillAlt className="text-purple-400" /> Interest Rates Management
          </h3>
          <p className="card-sub">Manage interest rates for financial products</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Search rates..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input w-full sm:w-48"
            />
            <FaSearch className="absolute left-3 top-3 text-purple-300" />
          </div>

          <div className="flex gap-2">
            <button
              onClick={exportToCSV}
              className="btn btn-success flex items-center space-x-1"
            >
              <FaDownload /> <span>Export</span>
            </button>
            <button
              onClick={handleCreate}
              className="btn btn-primary flex items-center space-x-2"
            >
              <FaPlus /> <span>Add Rate</span>
            </button>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <div className="admin-grid">
          <div className="col-3">
            <div className="devices-stat-card">
              <div className="stat-label">Total Products</div>
              <div className="stat-value">{rates.length}</div>
            </div>
          </div>
          <div className="col-3">
            <div className="devices-stat-card">
              <div className="stat-label">Published</div>
              <div className="stat-value">{rates.filter(r => r.status === 'Published').length}</div>
            </div>
          </div>
          <div className="col-3">
            <div className="devices-stat-card">
              <div className="stat-label">Avg. Rate</div>
              <div className="stat-value">
                {rates.length > 0
                  ? (rates.reduce((sum, r) => sum + parseFloat(r.rate), 0) / rates.length).toFixed(2) + '%'
                  : '0%'}
              </div>
            </div>
          </div>
          <div className="col-3">
            <div className="devices-stat-card">
              <div className="stat-label">Currency</div>
              <div className="stat-value">IDR</div>
            </div>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="table">
          <thead>
            <tr>
              <th>Product Name</th>
              <th>Rate (%)</th>
              <th>Currency</th>
              <th>Status</th>
              <th>Last Updated</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredRates.length > 0 ? (
              filteredRates.map((row) => (
                <tr key={row.id} className="hover:bg-white/5 transition-colors">
                  <td className="align-top">
                    <div>
                      <div className="font-medium">{row.name}</div>
                      <div className="text-xs text-purple-200 truncate max-w-xs">{row.description}</div>
                    </div>
                  </td>
                  <td className="align-top">
                    <div className="flex items-center">
                      <FaPercent className="text-green-400 mr-1" />
                      <span className="font-bold">{row.rate}%</span>
                    </div>
                  </td>
                  <td className="align-top">
                    <span className="px-2 py-1 bg-purple-800/40 text-purple-200 rounded text-sm">{row.currency}</span>
                  </td>
                  <td className="align-top">
                    <span className={`status-badge ${row.status?.toLowerCase()}`}>
                      <span className={`w-2 h-2 rounded-full mr-2 ${
                        row.status === 'Published' ? 'bg-green-400' :
                        row.status === 'Scheduled' ? 'bg-yellow-400' :
                        'bg-red-400'
                      }`}></span>
                      {row.status}
                    </span>
                  </td>
                  <td className="align-top">{new Date(row.lastUpdated).toLocaleDateString()}</td>
                  <td className="align-top text-right">
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
                <td colSpan="6" className="text-center text-sm text-purple-200 py-4">
                  No interest rates found. Create a new rate to get started.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal for creating/editing rates */}
      {isModalOpen && (
        <div className="admin-modal">
          <div className="admin-modal-content">
            <div className="modal-header">
              <h3 className="modal-title">
                {selectedRate ? `Edit Rate: ${selectedRate.name}` : 'Add New Interest Rate'}
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
                  <label className="label">Product Name</label>
                  <input
                    type="text"
                    name="name"
                    value={newRate.name}
                    onChange={handleInputChange}
                    className="input"
                    placeholder="Enter product name"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="label">Interest Rate (%)</label>
                    <input
                      type="number"
                      name="rate"
                      value={newRate.rate}
                      onChange={handleInputChange}
                      className="input"
                      placeholder="Enter interest rate"
                      step="0.01"
                      min="0"
                      max="100"
                    />
                  </div>

                  <div>
                    <label className="label">Currency</label>
                    <select
                      name="currency"
                      value={newRate.currency}
                      onChange={handleInputChange}
                      className="input"
                    >
                      <option value="IDR">IDR (Indonesian Rupiah)</option>
                      <option value="USD">USD (US Dollar)</option>
                      <option value="EUR">EUR (Euro)</option>
                      <option value="GBP">GBP (British Pound)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="label">Description</label>
                  <textarea
                    name="description"
                    value={newRate.description}
                    onChange={handleInputChange}
                    className="input"
                    placeholder="Enter product description"
                    rows="3"
                  ></textarea>
                </div>

                <div>
                  <label className="label">Status</label>
                  <select
                    name="status"
                    value={newRate.status}
                    onChange={handleInputChange}
                    className="input"
                  >
                    <option value="Draft">Draft</option>
                    <option value="Published">Published</option>
                    <option value="Scheduled">Scheduled</option>
                  </select>
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
                  onClick={handleSaveRate}
                  className="btn btn-primary"
                >
                  {selectedRate ? 'Update Rate' : 'Add Rate'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RateManager;
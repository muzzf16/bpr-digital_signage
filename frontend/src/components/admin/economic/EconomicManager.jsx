import React, { useState, useEffect } from 'react';
import { FaChartLine, FaDollarSign, FaCoins, FaSync, FaSearch, FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { fetchWithAuth } from '../../../utils/api';

const EconomicManager = () => {
  const [economicData, setEconomicData] = useState({
    currencyRates: {},
    goldPrice: {},
    stockIndex: {},
    updateHistory: []
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newData, setNewData] = useState({
    type: 'currency',
    key: '',
    value: '',
    date: new Date().toISOString().split('T')[0],
    notes: ''
  });

  const processEconomicData = (data) => {
    const currencyRates = {};
    const goldPrice = {};
    const stockIndex = {};
    data.forEach(item => {
      if (item.type === 'currency') {
        currencyRates[item.key] = item.value;
      } else if (item.type === 'gold') {
        goldPrice[item.key] = item.value;
      } else if (item.type === 'stockIndex') {
        stockIndex[item.key] = item.value;
      }
    });
    return { currencyRates, goldPrice, stockIndex, updateHistory: data };
  };

  const fetchEconomicData = () => {
    fetchWithAuth('/api/admin/economic')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          const processedData = processEconomicData(data.economicData);
          setEconomicData(processedData);
        } else {
          toast.error('Failed to fetch economic data.');
        }
      })
      .catch(err => {
        console.error("Error fetching economic data:", err);
        toast.error("Failed to fetch economic data.");
      });
  };

  useEffect(() => {
    fetchEconomicData();
  }, []);

  const handleAddData = () => {
    if (!newData.type || !newData.key || !newData.value) {
      toast.error('Please fill in all required fields');
      return;
    }

    fetchWithAuth('/api/admin/economic', {
      method: 'POST',
      body: JSON.stringify(newData),
    })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        fetchEconomicData();
        setIsModalOpen(false);
        toast.success('Economic data added successfully!');
      } else {
        toast.error('Failed to add economic data.');
      }
    })
    .catch(err => {
      console.error("Error adding economic data:", err);
      toast.error('Failed to add economic data.');
    });
  };

  const handleUpdateData = () => {
    if (!newData.type || !newData.key || !newData.value) {
      toast.error('Please fill in all required fields');
      return;
    }

    fetchWithAuth(`/api/admin/economic/${selectedItem.id}`, {
      method: 'PUT',
      body: JSON.stringify(newData),
    })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        fetchEconomicData();
        setIsModalOpen(false);
        toast.success('Economic data updated successfully!');
      } else {
        toast.error('Failed to update economic data.');
      }
    })
    .catch(err => {
      console.error("Error updating economic data:", err);
      toast.error('Failed to update economic data.');
    });
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this economic data item?')) {
      fetchWithAuth(`/api/admin/economic/${id}`, {
        method: 'DELETE',
      })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          fetchEconomicData();
          toast.success('Economic data item deleted successfully!');
        } else {
          toast.error('Failed to delete economic data item.');
        }
      })
      .catch(err => {
        console.error("Error deleting economic data:", err);
        toast.error('Failed to delete economic data item.');
      });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedItem) {
      handleUpdateData();
    } else {
      handleAddData();
    }
  };

  const filteredHistory = economicData.updateHistory.filter(item =>
    item.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.key.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.notes.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.date.includes(searchTerm)
  );

  return (
    <div className="glass-card">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <div>
          <h3 className="card-title flex items-center gap-2">
            <FaChartLine className="text-amber-400" /> Economic Data Management
          </h3>
          <p className="card-sub">Manage currency rates, gold prices, and stock indices</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Search updates..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input w-full sm:w-48"
            />
            <FaSearch className="absolute left-3 top-3 text-amber-300" />
          </div>

          <div className="flex gap-2">
            <button
              onClick={fetchEconomicData}
              className="btn btn-secondary flex items-center space-x-1"
            >
              <FaSync /> <span>Refresh</span>
            </button>
            <button
              onClick={() => {
                setSelectedItem(null);
                setNewData({
                  type: 'currency',
                  key: '',
                  value: '',
                  date: new Date().toISOString().split('T')[0],
                  notes: ''
                });
                setIsModalOpen(true);
              }}
              className="btn btn-primary flex items-center space-x-2"
            >
              <FaPlus /> <span>Add Data</span>
            </button>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <div className="admin-grid">
          <div className="col-4">
            <div className="bg-amber-900/40 p-4 rounded-lg">
              <h4 className="text-amber-200 text-sm mb-2">Currency Rates (IDR)</h4>
              <div className="space-y-2">
                {Object.entries(economicData.currencyRates).map(([key, value]) => (
                  <div key={key} className="flex justify-between text-white">
                    <span>{key}</span>
                    <span className="font-medium">{value?.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="col-4">
            <div className="bg-amber-900/40 p-4 rounded-lg">
              <h4 className="text-amber-200 text-sm mb-2">Gold Price</h4>
              <div className="flex justify-between text-white">
                <span>Per Gram</span>
                <span className="font-medium">Rp {economicData.goldPrice?.gram?.toLocaleString() || 0}</span>
              </div>
              <div className="mt-3 pt-3 border-t border-amber-700/50">
                <h4 className="text-amber-200 text-sm mb-2">Stock Index</h4>
                <div className="flex justify-between text-white">
                  <span>IHSG</span>
                  <span className="font-medium">{economicData.stockIndex?.IHSG?.toFixed(2) || 0}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="col-4">
            <div className="bg-amber-900/40 p-4 rounded-lg">
              <h4 className="text-amber-200 text-sm mb-2">Recent Updates</h4>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {economicData.updateHistory.slice(0, 4).map(item => (
                  <div key={item.id} className="text-xs text-amber-100 flex justify-between">
                    <div>
                      <span className="font-medium">{item.type}({item.key}):</span>
                    </div>
                    <div>
                      <span>{item.value}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="card-title flex items-center gap-2">
          <FaChartLine className="text-amber-400" /> Update History
        </h3>

        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>Type</th>
                <th>Key</th>
                <th>Value</th>
                <th>Date</th>
                <th>Notes</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredHistory.length > 0 ? (
                filteredHistory.map((item, index) => (
                  <tr key={index} className="hover:bg-white/5 transition-colors">
                    <td className="align-top">
                      <div className="flex items-center">
                        {item.type === 'currency' && <FaDollarSign className="text-amber-300 mr-2" />}
                        {item.type === 'gold' && <FaCoins className="text-amber-300 mr-2" />}
                        {item.type === 'stockIndex' && <FaChartLine className="text-amber-300 mr-2" />}
                        <span className="capitalize">{item.type}</span>
                      </div>
                    </td>
                    <td className="align-top">{item.key}</td>
                    <td className="align-top">
                      {item.type === 'currency' || item.type === 'gold'
                        ? new Intl.NumberFormat().format(parseFloat(item.value))
                        : parseFloat(item.value).toFixed(2)}
                    </td>
                    <td className="align-top text-amber-200">{item.date}</td>
                    <td className="align-top text-amber-200">{item.notes}</td>
                    <td className="align-top text-right">
                      <button
                        onClick={() => {
                          setSelectedItem(item);
                          setNewData({
                            type: item.type,
                            key: item.key,
                            value: item.value,
                            date: item.date,
                            notes: item.notes
                          });
                          setIsModalOpen(true);
                        }}
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
                  <td
                    colSpan="6"
                    className="text-center text-sm text-amber-200"
                  >
                    No economic data updates found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal for adding/updating data */}
      {isModalOpen && (
        <div className="admin-modal">
          <div className="admin-modal-content">
            <div className="modal-header">
              <h3 className="modal-title">
                {selectedItem ? 'Edit Economic Data' : 'Add New Economic Data'}
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="label">Type</label>
                    <select
                      name="type"
                      value={newData.type}
                      onChange={handleInputChange}
                      className="input"
                    >
                      <option value="currency">Currency Rate</option>
                      <option value="gold">Gold Price</option>
                      <option value="stockIndex">Stock Index</option>
                    </select>
                  </div>

                  <div>
                    <label className="label">Key</label>
                    <input
                      type="text"
                      name="key"
                      value={newData.key}
                      onChange={handleInputChange}
                      className="input"
                      placeholder="e.g. USD, EUR, IHSG, gram"
                    />
                  </div>
                </div>

                <div>
                  <label className="label">Value</label>
                  <input
                    type="number"
                    name="value"
                    value={newData.value}
                    onChange={handleInputChange}
                    className="input"
                    placeholder="Enter value"
                    step="any"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="label">Date</label>
                    <input
                      type="date"
                      name="date"
                      value={newData.date}
                      onChange={handleInputChange}
                      className="input"
                    />
                  </div>

                  <div>
                    <label className="label">Notes</label>
                    <input
                      type="text"
                      name="notes"
                      value={newData.notes}
                      onChange={handleInputChange}
                      className="input"
                      placeholder="Add optional notes"
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
                  {selectedItem ? 'Update Data' : 'Add Data'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EconomicManager;
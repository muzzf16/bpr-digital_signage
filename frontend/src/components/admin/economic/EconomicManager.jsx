import React, { useState, useEffect } from 'react';
import { FaChartLine, FaDollarSign, FaCoins, FaSync, FaSearch, FaPlus, FaEdit } from 'react-icons/fa';
import { toast } from 'react-toastify';
import GlassCard from '../../GlassCard';

const EconomicManager = () => {
  const [economicData, setEconomicData] = useState({
    currencyRates: { USD: 0, SGD: 0, JPY: 0, EUR: 0 },
    goldPrice: { gram: 0 },
    stockIndex: { IHSG: 0 },
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

  useEffect(() => {
    // In a real implementation, this would fetch from the backend API
    // For now, we'll simulate with mock data
    setEconomicData({
      currencyRates: { 
        USD: 15950, 
        SGD: 11800, 
        JPY: 105.5, 
        EUR: 17200 
      },
      goldPrice: { gram: 1250000 },
      stockIndex: { IHSG: 7150.25 },
      updateHistory: [
        { id: 1, type: 'currency', key: 'USD', value: 15950, date: '2025-11-10', notes: 'Daily update' },
        { id: 2, type: 'stockIndex', key: 'IHSG', value: 7150.25, date: '2025-11-10', notes: 'Market close' },
        { id: 3, type: 'gold', key: 'gram', value: 1250000, date: '2025-11-10', notes: 'Daily update' }
      ]
    });
  }, []);

  const fetchEconomicData = () => {
    toast.info('Refreshing economic data...');
    // In a real implementation, fetch data from backend API
  };

  const updateEconomicData = (type, key, value) => {
    const updatedData = { ...economicData };
    
    if (type === 'currency') {
      updatedData.currencyRates = { ...updatedData.currencyRates, [key]: parseFloat(value) };
    } else if (type === 'gold') {
      updatedData.goldPrice = { ...updatedData.goldPrice, [key]: parseFloat(value) };
    } else if (type === 'stockIndex') {
      updatedData.stockIndex = { ...updatedData.stockIndex, [key]: parseFloat(value) };
    }

    // Add to history
    const historyItem = {
      id: economicData.updateHistory.length + 1,
      type,
      key,
      value: parseFloat(value),
      date: new Date().toISOString().split('T')[0],
      notes: 'Manual update'
    };
    
    updatedData.updateHistory = [historyItem, ...updatedData.updateHistory];
    
    setEconomicData(updatedData);
    toast.success(`${type} (${key}) updated to ${value}`);
  };

  const handleAddData = () => {
    if (!newData.type || !newData.key || !newData.value) {
      toast.error('Please fill in all required fields');
      return;
    }

    updateEconomicData(newData.type, newData.key, newData.value);
    setIsModalOpen(false);
    setNewData({
      type: 'currency',
      key: '',
      value: '',
      date: new Date().toISOString().split('T')[0],
      notes: ''
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const filteredHistory = economicData.updateHistory.filter(item => 
    item.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.key.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.notes.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.date.includes(searchTerm)
  );

  return (
    <GlassCard className="bg-gradient-to-br from-amber-900/30 to-amber-800/20 backdrop-blur-sm border border-amber-700/30">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <div>
          <h3 className="text-xl font-bold flex items-center gap-2">
            <FaChartLine className="text-yellow-400" /> Economic Data Management
          </h3>
          <p className="text-amber-200 text-sm mt-1">Manage currency rates, gold prices, and stock indices</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Search updates..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-amber-800/30 text-white placeholder-amber-300 border border-amber-700/50 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500 w-full sm:w-48"
            />
            <FaSearch className="absolute left-3 top-3 text-amber-300" />
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={fetchEconomicData}
              className="bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white px-3 py-2 rounded-lg flex items-center space-x-1 transition-all duration-300 shadow-lg shadow-amber-900/30"
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
              className="bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-all duration-300 shadow-lg shadow-amber-900/30"
            >
              <FaPlus /> <span>Add Data</span>
            </button>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-amber-900/40 p-4 rounded-lg">
            <h4 className="text-amber-200 text-sm mb-2">Currency Rates (IDR)</h4>
            <div className="space-y-2">
              {Object.entries(economicData.currencyRates).map(([key, value]) => (
                <div key={key} className="flex justify-between text-white">
                  <span>{key}</span>
                  <span className="font-medium">{value.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-amber-900/40 p-4 rounded-lg">
            <h4 className="text-amber-200 text-sm mb-2">Gold Price</h4>
            <div className="flex justify-between text-white">
              <span>Per Gram</span>
              <span className="font-medium">Rp {economicData.goldPrice.gram.toLocaleString()}</span>
            </div>
            <div className="mt-3 pt-3 border-t border-amber-700/50">
              <h4 className="text-amber-200 text-sm mb-2">Stock Index</h4>
              <div className="flex justify-between text-white">
                <span>IHSG</span>
                <span className="font-medium">{economicData.stockIndex.IHSG.toFixed(2)}</span>
              </div>
            </div>
          </div>
          
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

      <div className="mb-6">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <FaChartLine className="text-amber-400" /> Update History
        </h3>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-amber-700/50">
            <thead>
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-amber-200 uppercase tracking-wider">Type</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-amber-200 uppercase tracking-wider">Key</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-amber-200 uppercase tracking-wider">Value</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-amber-200 uppercase tracking-wider">Date</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-amber-200 uppercase tracking-wider">Notes</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-amber-200 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-amber-700/30">
              {filteredHistory.length > 0 ? (
                filteredHistory.map((item, index) => (
                  <tr key={index} className="hover:bg-white/5 transition-colors">
                    <td className="px-4 py-3 text-sm text-white">
                      <div className="flex items-center">
                        {item.type === 'currency' && <FaDollarSign className="text-amber-300 mr-2" />}
                        {item.type === 'gold' && <FaCoins className="text-amber-300 mr-2" />}
                        {item.type === 'stockIndex' && <FaChartLine className="text-amber-300 mr-2" />}
                        <span className="capitalize">{item.type}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-white">{item.key}</td>
                    <td className="px-4 py-3 text-sm text-white">
                      {item.type === 'currency' || item.type === 'gold' 
                        ? new Intl.NumberFormat().toLocaleString() 
                        : parseFloat(item.value).toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-sm text-amber-200">{item.date}</td>
                    <td className="px-4 py-3 text-sm text-amber-200">{item.notes}</td>
                    <td className="px-4 py-3 text-right text-sm">
                      <div className="flex justify-end space-x-2">
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
                          className="p-2 text-amber-300 hover:text-amber-100 hover:bg-amber-700/50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <FaEdit />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td 
                    colSpan="6" 
                    className="px-4 py-6 text-center text-sm text-amber-200"
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
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-xl border border-amber-700/50 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-white">
                  {selectedItem ? 'Edit Economic Data' : 'Add New Economic Data'}
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
                    <label className="block text-sm font-medium text-amber-200 mb-1">Type</label>
                    <select
                      name="type"
                      value={newData.type}
                      onChange={handleInputChange}
                      className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                    >
                      <option value="currency">Currency Rate</option>
                      <option value="gold">Gold Price</option>
                      <option value="stockIndex">Stock Index</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-amber-200 mb-1">Key</label>
                    <input
                      type="text"
                      name="key"
                      value={newData.key}
                      onChange={handleInputChange}
                      className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                      placeholder="e.g. USD, EUR, IHSG, gram"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-amber-200 mb-1">Value</label>
                  <input
                    type="number"
                    name="value"
                    value={newData.value}
                    onChange={handleInputChange}
                    className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                    placeholder="Enter value"
                    step="any"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-amber-200 mb-1">Date</label>
                    <input
                      type="date"
                      name="date"
                      value={newData.date}
                      onChange={handleInputChange}
                      className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-amber-200 mb-1">Notes</label>
                    <input
                      type="text"
                      name="notes"
                      value={newData.notes}
                      onChange={handleInputChange}
                      className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                      placeholder="Add optional notes"
                    />
                  </div>
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
                  onClick={handleAddData}
                  className="px-4 py-2 bg-gradient-to-r from-amber-600 to-amber-700 rounded-lg text-white hover:from-amber-700 hover:to-amber-800 transition-all"
                >
                  {selectedItem ? 'Update Data' : 'Add Data'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </GlassCard>
  );
};

export default EconomicManager;
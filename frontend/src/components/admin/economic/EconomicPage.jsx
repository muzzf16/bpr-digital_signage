import React, { useState, useEffect, useRef } from 'react';
import { FaChartLine, FaDollarSign, FaCoins, FaSync, FaSearch, FaPlus, FaEdit, FaTrash, FaDownload } from 'react-icons/fa';

/**
 * EconomicPage
 * - list economic data (currency rates, gold prices, stock indices)
 * - search / filter
 * - add/edit economic data modal
 * - export CSV
 * - pagination
 *
 * Adjust endpoints / headers to match your backend.
 */

export default function EconomicPage() {
  const [economicData, setEconomicData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const [page, setPage] = useState(1);
  const perPage = 10;
  const [showAdd, setShowAdd] = useState(false);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({
    type: 'currency',
    key: '',
    value: '',
    date: new Date().toISOString().split('T')[0],
    notes: ''
  });
  const [stats, setStats] = useState({ total: 0, currency: 0, gold: 0, stockIndex: 0 });
  const mounted = useRef(true);

  // adjust base url and headers for your backend
  const apiBase = '/api/admin/economic';
  const headers = { 'Content-Type': 'application/json', 'x-api-key': 'secret_dev_key' };

  async function fetchEconomicData() {
    setLoading(true);
    try {
      const res = await fetch(apiBase, { headers });
      if (!res.ok) throw new Error('Fetch failed');
      const j = await res.json();
      // expect j.economicData = [...]
      const list = Array.isArray(j.economicData) ? j.economicData : (j.data ? j.data.items : []);
      if (!mounted.current) return;
      
      setEconomicData(list);
      
      // compute stats
      const currencyCount = list.filter(item => item.type === 'currency').length;
      const goldCount = list.filter(item => item.type === 'gold').length;
      const stockCount = list.filter(item => item.type === 'stockIndex').length;
      
      setStats({
        total: list.length,
        currency: currencyCount,
        gold: goldCount,
        stockIndex: stockCount
      });
    } catch (e) {
      console.error(e);
      // Fallback to mock data
      const mockData = [
        { id: 1, type: 'currency', key: 'USD', value: 15950, date: '2025-11-10', notes: 'Daily update' },
        { id: 2, type: 'currency', key: 'SGD', value: 11800, date: '2025-11-10', notes: 'Daily update' },
        { id: 3, type: 'currency', key: 'EUR', value: 17200, date: '2025-11-10', notes: 'Daily update' },
        { id: 4, type: 'gold', key: 'gram', value: 1250000, date: '2025-11-10', notes: 'Gold price update' },
        { id: 5, type: 'stockIndex', key: 'IHSG', value: 7150.25, date: '2025-11-10', notes: 'Market close' },
        { id: 6, type: 'stockIndex', key: 'JKSE', value: 7150.25, date: '2025-11-10', notes: 'Market close' }
      ];
      
      setEconomicData(mockData);
      
      setStats({
        total: mockData.length,
        currency: mockData.filter(item => item.type === 'currency').length,
        gold: mockData.filter(item => item.type === 'gold').length,
        stockIndex: mockData.filter(item => item.type === 'stockIndex').length
      });
    } finally {
      if (mounted.current) setLoading(false);
    }
  }

  useEffect(() => {
    mounted.current = true;
    fetchEconomicData();
    const id = setInterval(fetchEconomicData, 5 * 60 * 1000); // refresh every 5 minutes
    return () => { mounted.current = false; clearInterval(id); };
  }, []);

  // filtered & paginated
  const filtered = economicData.filter(d => {
    if (filter !== 'all' && d.type !== filter) return false;
    return (!query) || 
           d.type.toLowerCase().includes(query.toLowerCase()) || 
           d.key.toLowerCase().includes(query.toLowerCase()) || 
           d.notes.toLowerCase().includes(query.toLowerCase()) ||
           d.date.includes(query);
  });
  
  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const pageItems = filtered.slice((page - 1) * perPage, page * perPage);

  // CSV export
  function exportCsv() {
    const rows = [
      ['id','type','key','value','date','notes']
    ];
    economicData.forEach(d => {
      rows.push([d.id, d.type, d.key, d.value, d.date, d.notes]);
    });
    const csv = rows.map(r => r.map(c => `"${String(c).replace(/"/g,'""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = `economic_data_${Date.now()}.csv`; a.click();
    URL.revokeObjectURL(url);
  }

  // create economic data
  async function handleCreate(e) {
    e.preventDefault();
    if (!form.type || !form.key || !form.value) return alert('All required fields must be filled');
    
    setCreating(true);
    try {
      // In a real implementation, this would call the API
      const newEconomicData = {
        id: economicData.length + 1,
        ...form,
        value: parseFloat(form.value)
      };

      setEconomicData(prev => [newEconomicData, ...prev]);
      
      // Update stats
      setStats(prev => ({
        ...prev,
        total: prev.total + 1,
        [form.type]: prev[form.type] + 1
      }));

      setShowAdd(false);
      setForm({
        type: 'currency',
        key: '',
        value: '',
        date: new Date().toISOString().split('T')[0],
        notes: ''
      });
    } catch (err) {
      console.error(err);
      alert('Failed to add economic data');
    } finally {
      setCreating(false);
    }
  }

  // update economic data
  function handleUpdate(id, updates) {
    setEconomicData(prev => prev.map(item => 
      item.id === id ? { ...item, ...updates } : item
    ));
  }

  // delete economic data
  function handleDelete(id) {
    if (!confirm('Delete this economic data entry?')) return;
    try {
      setEconomicData(prev => {
        const deletedItem = prev.find(item => item.id === id);
        const updated = prev.filter(item => item.id !== id);
        
        // Update stats
        setStats(prevStats => ({
          ...prevStats,
          total: prevStats.total - 1,
          [deletedItem.type]: prevStats[deletedItem.type] - 1
        }));
        
        return updated;
      });
    } catch (err) {
      alert('Delete failed');
    }
  }

  // Format value based on type
  const formatValue = (type, value) => {
    if (type === 'currency' || type === 'gold') {
      if (typeof value === 'number') {
        return 'Rp ' + value.toLocaleString();
      }
      return 'Rp ' + parseFloat(value).toLocaleString();
    } else if (type === 'stockIndex') {
      return parseFloat(value).toFixed(2);
    }
    return value;
  };

  return (
    <div className="admin-content">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <div>
          <h2 className="card-title flex items-center gap-2">
            <FaChartLine className="text-amber-400" /> Economic Data Management
          </h2>
          <p className="card-sub">Monitor and manage economic data (currency rates, gold prices, stock indices)</p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <button
            onClick={fetchEconomicData}
            className="btn btn-secondary flex items-center"
          >
            <FaSync className="mr-2" /> Refresh
          </button>
          <button
            onClick={() => setShowAdd(true)}
            className="btn btn-primary flex items-center"
          >
            <FaPlus className="mr-2" /> Add Data
          </button>
          <button
            onClick={exportCsv}
            className="btn btn-success flex items-center"
          >
            <FaDownload className="mr-2" /> Export CSV
          </button>
        </div>
      </div>

      <div className="admin-grid mb-6">
        <div className="col-3">
          <div className="devices-stat-card">
            <div className="stat-label">Total Entries</div>
            <div className="stat-value">{stats.total}</div>
          </div>
        </div>
        <div className="col-3">
          <div className="devices-stat-card">
            <div className="stat-label">Currency Rates</div>
            <div className="stat-value">{stats.currency}</div>
          </div>
        </div>
        <div className="col-3">
          <div className="devices-stat-card">
            <div className="stat-label">Gold Prices</div>
            <div className="stat-value">{stats.gold}</div>
          </div>
        </div>
        <div className="col-3">
          <div className="devices-stat-card">
            <div className="stat-label">Stock Indices</div>
            <div className="stat-value">{stats.stockIndex}</div>
          </div>
        </div>
      </div>

      <div className="devices-search-filter mb-6">
        <div className="devices-search-box">
          <FaSearch className="search-icon" />
          <input
            value={query}
            onChange={(e) => { setQuery(e.target.value); setPage(1); }}
            placeholder="Search economic data by type/key/notes..."
            className="devices-search-input"
          />
        </div>
        <select
          value={filter}
          onChange={(e) => { setFilter(e.target.value); setPage(1); }}
          className="devices-filter-select"
        >
          <option value="all">All Types</option>
          <option value="currency">Currency Rates</option>
          <option value="gold">Gold Prices</option>
          <option value="stockIndex">Stock Indices</option>
        </select>
      </div>

      <div className="devices-table-container mb-6">
        <table className="devices-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Type</th>
              <th>Key</th>
              <th>Value</th>
              <th>Date</th>
              <th>Notes</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td className="text-center" colSpan="7">Loading...</td></tr>
            ) : pageItems.length === 0 ? (
              <tr><td className="text-center" colSpan="7">No economic data found. Add a new entry to get started.</td></tr>
            ) : pageItems.map(d => {
              return (
                <tr key={d.id} className="hover:bg-white/5 transition-colors">
                  <td className="align-top text-white">{d.id}</td>
                  <td className="align-top">
                    <span className={`status-badge ${d.type}`}>
                      <span className="w-2 h-2 rounded-full bg-white/60" />
                      <span className="capitalize">{d.type}</span>
                    </span>
                  </td>
                  <td className="align-top text-indigo-200">{d.key}</td>
                  <td className="align-top text-white">{formatValue(d.type, d.value)}</td>
                  <td className="align-top text-indigo-200">{d.date}</td>
                  <td className="align-top text-indigo-200">{d.notes}</td>
                  <td className="align-top text-right">
                    <div className="devices-actions">
                      <button
                        onClick={() => {
                          setForm({
                            type: d.type,
                            key: d.key,
                            value: d.value,
                            date: d.date,
                            notes: d.notes
                          });
                          setShowAdd(true);
                        }}
                        className="action-button"
                        title="Edit"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(d.id)}
                        className="action-button"
                        title="Delete"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="pagination-container">
        <div className="pagination-info">Showing {filtered.length === 0 ? 0 : ( (page-1)*perPage + 1 ) } - {Math.min(page*perPage, filtered.length)} of {filtered.length}</div>
        <div className="pagination-controls">
          <button
            onClick={() => setPage(p => Math.max(1, p-1))}
            disabled={page === 1}
            className="pagination-button"
          >
            Prev
          </button>
          <div className="pagination-button">Page {page} / {totalPages}</div>
          <button
            onClick={() => setPage(p => Math.min(totalPages, p+1))}
            disabled={page === totalPages}
            className="pagination-button"
          >
            Next
          </button>
        </div>
      </div>

      {/* Add/Edit Economic Data Modal */}
      {showAdd && (
        <div className="admin-modal">
          <div className="admin-modal-content">
            <div className="modal-header">
              <h3 className="modal-title">
                <FaPlus /> {form.id ? 'Edit' : 'Add'} Economic Data
              </h3>
              <button
                onClick={() => setShowAdd(false)}
                className="modal-close"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreate} className="modal-body">
              <div className="space-y-4">
                <div className="form-group">
                  <label className="label">Type *</label>
                  <select
                    value={form.type}
                    onChange={e => setForm({...form, type: e.target.value})}
                    className="input"
                    required
                  >
                    <option value="currency">Currency Rate</option>
                    <option value="gold">Gold Price</option>
                    <option value="stockIndex">Stock Index</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="label">Key *</label>
                  <input
                    value={form.key}
                    onChange={e => setForm({...form, key: e.target.value})}
                    className="input"
                    placeholder="e.g., USD, EUR, gram, IHSG"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="label">Value *</label>
                  <input
                    type="number"
                    value={form.value}
                    onChange={e => setForm({...form, value: e.target.value})}
                    className="input"
                    placeholder="Enter value"
                    step="any"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="label">Date *</label>
                  <input
                    type="date"
                    value={form.date}
                    onChange={e => setForm({...form, date: e.target.value})}
                    className="input"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="label">Notes</label>
                  <input
                    value={form.notes}
                    onChange={e => setForm({...form, notes: e.target.value})}
                    className="input"
                    placeholder="Optional notes"
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  onClick={() => setShowAdd(false)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="btn btn-primary"
                >
                  {creating ? 'Saving...' : form.id ? 'Update' : 'Add'} Data
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
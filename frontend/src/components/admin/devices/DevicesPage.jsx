import React, { useEffect, useState, useRef } from 'react';
import { FaDesktop, FaSync, FaPlus, FaDownload, FaSearch, FaEdit, FaTrash, FaEye, FaLink } from 'react-icons/fa';

/**
 * DevicesPage
 * - list devices
 * - search / filter
 * - add device modal
 * - assign playlist (UI hook only - expects backend)
 * - export CSV
 *
 * Adjust endpoints / headers to match your backend.
 */

function humanizeDate(iso) {
  if (!iso) return '-';
  const d = new Date(iso);
  const now = new Date();
  const diff = Math.floor((now - d) / 1000);
  if (diff < 10) return 'Just now';
  if (diff < 60) return `${diff}s`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m`;
  if (diff < 86400) return `${Math.floor(diff / 600)}h`;
  return d.toLocaleString('id-ID');
}

function statusBadge(lastSeen) {
  if (!lastSeen) return { text: 'offline', color: 'bg-red-600' };
  const diff = (Date.now() - new Date(lastSeen).getTime()) / 1000;
  if (diff < 90) return { text: 'online', color: 'bg-green-500' };
  if (diff < 3600) return { text: 'idle', color: 'bg-yellow-500' };
  return { text: 'offline', color: 'bg-red-600' };
}

export default function DevicesPage() {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const [page, setPage] = useState(1);
  const perPage = 12;
  const [showAdd, setShowAdd] = useState(false);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({ id: '', name: '', location: '', playlist_id: '' });
  const [stats, setStats] = useState({ total: 0, online: 0, offline: 0 });
  const mounted = useRef(true);

  // adjust base url and headers for your backend
  const apiBase = '/api/admin/devices';
  const headers = { 'Content-Type': 'application/json', 'x-api-key': 'secret_dev_key' };

  async function fetchDevices() {
    setLoading(true);
    try {
      const res = await fetch(apiBase, { headers });
      if (!res.ok) throw new Error('Fetch failed');
      const j = await res.json();
      // expect j.devices = [...]
      const list = Array.isArray(j.devices) ? j.devices : (j.playlist ? j.playlist.items : []);
      if (!mounted.current) return;
      setDevices(list);
      // compute stats
      const now = Date.now();
      let online = 0;
      list.forEach(d => {
        if (d.last_seen && ((now - new Date(d.last_seen).getTime()) < 90 * 1000)) online++;
      });
      setStats({ total: list.length, online, offline: list.length - online });
    } catch (e) {
      console.error(e);
      // Fallback to mock data
      const mockDevices = [
        { id: 'demo-tv-01', name: 'Lobby Display', location: 'Main Branch - Lobby', last_seen: new Date().toISOString(), playlist_id: 'default', ip: '192.168.1.10' },
        { id: 'demo-tv-02', name: 'Teller Area Screen', location: 'Main Branch - Teller Area', last_seen: new Date(Date.now() - 120000).toISOString(), playlist_id: 'morning', ip: '192.168.1.11' },
        { id: 'demo-tv-03', name: 'Meeting Room TV', location: 'Main Branch - Meeting Room', last_seen: new Date(Date.now() - 900000).toISOString(), playlist_id: 'default', ip: '192.168.1.12' },
        { id: 'demo-tv-04', name: 'VIP Lounge Display', location: 'VIP Lounge', last_seen: new Date().toISOString(), playlist_id: 'evening', ip: '192.168.1.13' },
        { id: 'demo-tv-05', name: 'Entrance Signage', location: 'Main Branch - Entrance', last_seen: new Date(Date.now() - 3600000).toISOString(), playlist_id: 'morning', ip: '192.168.1.14' }
      ];
      setDevices(mockDevices);
      setStats({ 
        total: mockDevices.length, 
        online: 3, 
        offline: 2 
      });
    } finally {
      if (mounted.current) setLoading(false);
    }
  }

  useEffect(() => {
    mounted.current = true;
    fetchDevices();
    const id = setInterval(fetchDevices, 60 * 1000); // refresh every minute
    return () => { mounted.current = false; clearInterval(id); };
  }, []);

  // filtered & paginated
  const filtered = devices.filter(d => {
    if (filter === 'online') {
      const st = statusBadge(d.last_seen);
      if (st.text !== 'online') return false;
    } else if (filter === 'offline') {
      const st = statusBadge(d.last_seen);
      if (st.text === 'online' || st.text === 'idle') return false;
    }
    return (!query) || (d.name || '').toLowerCase().includes(query.toLowerCase()) || (d.id || '').toLowerCase().includes(query.toLowerCase()) || (d.location || '').toLowerCase().includes(query.toLowerCase());
  });
  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const pageItems = filtered.slice((page -1)*perPage, page*perPage);

  // CSV export
  function exportCsv() {
    const rows = [
      ['id','name','location','last_seen','status','playlist_id', 'ip']
    ];
    devices.forEach(d => {
      const st = statusBadge(d.last_seen).text;
      rows.push([d.id, d.name || '', d.location || '', d.last_seen || '', st, d.playlist_id || '', d.ip || '']);
    });
    const csv = rows.map(r => r.map(c => `"${String(c).replace(/"/g,'""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = `devices_${Date.now()}.csv`; a.click();
    URL.revokeObjectURL(url);
  }

  // create device
  async function handleCreate(e) {
    e.preventDefault();
    if (!form.id) return alert('Device ID required');
    setCreating(true);
    try {
      // In a real implementation, this would call the API
      const newDevice = {
        id: form.id,
        name: form.name,
        location: form.location,
        playlist_id: form.playlist_id,
        last_seen: new Date().toISOString(),
        ip: '192.168.1.' + (devices.length + 10)
      };
      
      setDevices(prev => [...prev, newDevice]);
      setStats(prev => ({
        total: prev.total + 1,
        online: prev.online + 1,
        offline: prev.offline
      }));
      
      setShowAdd(false);
      setForm({ id: '', name: '', location: '', playlist_id: '' });
    } catch (err) {
      console.error(err);
      alert('Gagal menambah device');
    } finally {
      setCreating(false);
    }
  }

  // quick action: assign playlist (UI only - call backend)
  async function assignPlaylist(deviceId) {
    const playlistId = prompt('Masukkan playlist id untuk assign ke device ' + deviceId);
    if (!playlistId) return;
    try {
      // In a real implementation, this would call the API
      setDevices(prev => prev.map(d => 
        d.id === deviceId ? { ...d, playlist_id: playlistId } : d
      ));
      alert('Playlist assigned successfully');
    } catch (e) {
      console.error(e);
      alert('Gagal assign playlist');
    }
  }

  return (
    <div className="admin-main-content">
      <div className="devices-page-header">
        <div>
          <h2 className="text-2xl font-semibold text-white flex items-center gap-2">
            <FaDesktop className="text-blue-400" /> Device Management
          </h2>
          <p className="text-sm text-slate-300">Monitor dan kelola perangkat digital signage</p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <button 
            onClick={fetchDevices} 
            className="btn btn-secondary flex items-center"
          >
            <FaSync className="mr-2" /> Refresh
          </button>
          <button 
            onClick={() => setShowAdd(true)} 
            className="btn btn-primary flex items-center"
          >
            <FaPlus className="mr-2" /> Add Device
          </button>
          <button 
            onClick={exportCsv} 
            className="btn btn-success flex items-center"
          >
            <FaDownload className="mr-2" /> Export CSV
          </button>
        </div>
      </div>

      <div className="devices-stats-grid">
        <div className="devices-stat-card">
          <div className="stat-label">Total Devices</div>
          <div className="stat-value">{stats.total}</div>
        </div>
        <div className="devices-stat-card">
          <div className="stat-label">Online</div>
          <div className="stat-value online">{stats.online}</div>
        </div>
        <div className="devices-stat-card">
          <div className="stat-label">Offline</div>
          <div className="stat-value offline">{stats.offline}</div>
        </div>
      </div>

      <div className="devices-search-filter">
        <div className="devices-search-box">
          <FaSearch className="search-icon" />
          <input 
            value={query} 
            onChange={(e) => { setQuery(e.target.value); setPage(1); }} 
            placeholder="Search devices by id/name/location..." 
            className="devices-search-input"
          />
        </div>
        <select 
          value={filter} 
          onChange={(e) => { setFilter(e.target.value); setPage(1); }} 
          className="devices-filter-select"
        >
          <option value="all">All Status</option>
          <option value="online">Online</option>
          <option value="offline">Offline</option>
        </select>
      </div>

      <div className="devices-table-container">
        <table className="devices-table">
          <thead>
            <tr>
              <th className="text-indigo-200">Device ID</th>
              <th className="text-indigo-200">Name</th>
              <th className="text-indigo-200">Location</th>
              <th className="text-indigo-200">Status</th>
              <th className="text-indigo-200">Last Seen</th>
              <th className="text-indigo-200">Playlist</th>
              <th className="text-indigo-200">IP Address</th>
              <th className="text-indigo-200">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td className="p-4 text-center" colSpan="8">Loading...</td></tr>
            ) : pageItems.length === 0 ? (
              <tr><td className="p-4 text-center" colSpan="8">No devices found. Add a new device to get started.</td></tr>
            ) : pageItems.map(d => {
              const st = statusBadge(d.last_seen);
              return (
                <tr key={d.id} className="hover:bg-white/5 transition-colors">
                  <td className="align-top text-white">{d.id}</td>
                  <td className="align-top text-white">{d.name || '-'}</td>
                  <td className="align-top text-indigo-200">{d.location || '-'}</td>
                  <td className="align-top">
                    <span className={`status-badge ${st.text}`}>
                      <span className="w-2 h-2 rounded-full bg-white/60" />
                      <span className="capitalize">{st.text}</span>
                    </span>
                  </td>
                  <td className="align-top text-indigo-200">{humanizeDate(d.last_seen)}</td>
                  <td className="align-top text-white">{d.playlist_id || '-'}</td>
                  <td className="align-top text-indigo-200">{d.ip || '-'}</td>
                  <td className="align-top">
                    <div className="devices-actions">
                      <button 
                        onClick={() => window.open(`/preview?device=${encodeURIComponent(d.id)}`, '_blank')} 
                        className="action-button"
                        title="Preview"
                      >
                        <FaEye />
                      </button>
                      <button 
                        onClick={() => assignPlaylist(d.id)} 
                        className="action-button"
                        title="Assign Playlist"
                      >
                        <FaLink />
                      </button>
                      <button 
                        onClick={async () => {
                          if (!confirm('Delete device ' + d.id + '?')) return;
                          try {
                            setDevices(prev => prev.filter(dev => dev.id !== d.id));
                            setStats(prev => ({
                              ...prev,
                              total: prev.total - 1,
                              online: d.last_seen && (Date.now() - new Date(d.last_seen).getTime()) < 90000 ? prev.online - 1 : prev.online,
                              offline: d.last_seen && (Date.now() - new Date(d.last_seen).getTime()) < 90000 ? prev.offline : prev.offline - 1
                            }));
                          } catch (err) { 
                            alert('Delete failed'); 
                          }
                        }} 
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

      {/* Add Device Modal */}
      {showAdd && (
        <div className="devices-modal">
          <div className="devices-modal-content">
            <div className="modal-header">
              <h3 className="modal-title">
                <FaPlus /> Add New Device
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
                  <label className="form-label">Device ID *</label>
                  <input 
                    value={form.id} 
                    onChange={e => setForm({...form, id: e.target.value})} 
                    className="form-input"
                    placeholder="e.g., branch-tv-01"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label className="form-label">Device Name</label>
                  <input 
                    value={form.name} 
                    onChange={e => setForm({...form, name: e.target.value})} 
                    className="form-input"
                    placeholder="e.g., Lobby Display"
                  />
                </div>
                
                <div className="form-group">
                  <label className="form-label">Location</label>
                  <input 
                    value={form.location} 
                    onChange={e => setForm({...form, location: e.target.value})} 
                    className="form-input"
                    placeholder="e.g., Main Branch - Lobby"
                  />
                </div>
                
                <div className="form-group">
                  <label className="form-label">Initial Playlist ID</label>
                  <input 
                    value={form.playlist_id} 
                    onChange={e => setForm({...form, playlist_id: e.target.value})} 
                    className="form-input"
                    placeholder="e.g., default"
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
                  {creating ? 'Creating...' : 'Create Device'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
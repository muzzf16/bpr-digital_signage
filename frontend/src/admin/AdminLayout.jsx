// src/admin/AdminLayout.jsx
import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import '../styles/admin.scoped.css';

export default function AdminLayout({ children }) {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  // Define menu items with their paths
  const menuItems = [
    { path: '/admin', label: '🏠 Dashboard', key: 'dashboard' },
    { path: '/admin/playlists', label: '🎞️ Playlists', key: 'playlists' },
    { path: '/admin/rates', label: '💰 Rates', key: 'rates' },
    { path: '/admin/economic', label: '📊 Economic', key: 'economic' },
    { path: '/admin/devices', label: '🖥️ Devices', key: 'devices' },
    { path: '/admin/settings', label: '🖼️ Display Settings', key: 'display-settings' },
    { path: '/admin/announcements', label: '🔔 Announcements', key: 'announcements' },
  ];

  return (
    <div className="admin-root">
      <div className="admin-wrapper">
        <aside className={`admin-sidebar ${sidebarOpen ? "open" : "collapsed"}`}>
          <div className="brand">
            <img src="/assets/logo-bpr.png" alt="BPR Logo" />
            <div>
              <div style={{fontSize: '0.95rem', color: 'var(--a-accent-2)', fontWeight:700}}>Bank</div>
              <div style={{fontSize: '1rem', fontWeight:800}}>Perekonomian Rakyat</div>
            </div>
          </div>

          <nav className="admin-nav" aria-label="Admin Navigation">
            {menuItems.map((item) => (
              <NavLink 
                key={item.key} 
                to={item.path}
                className={({ isActive }) => isActive ? 'active' : ''}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div style={{marginTop:'auto'}}>
            <button className="btn btn-ghost" onClick={() => { /* handle logout */ }}>Logout</button>
          </div>
        </aside>

        <div className="admin-main">
          <header className="admin-header">
            <div>
              <div className="admin-title">Admin Dashboard</div>
              <div className="muted">Kelola konten & perangkat digital signage</div>
            </div>

            <div style={{display:'flex', gap:12, alignItems:'center'}}>
              <button className="btn btn-ghost" onClick={() => setSidebarOpen(!sidebarOpen)}>☰</button>
              <input className="input" style={{width:240}} placeholder="Search..." />
              <div className="muted">User: Super Admin</div>
            </div>
          </header>

          <div className="admin-content">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
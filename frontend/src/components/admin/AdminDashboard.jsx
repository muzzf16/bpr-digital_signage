// Combined Admin Dashboard Component with Layout and Styles
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Outlet } from 'react-router-dom';
import useAuth from '../../hooks/useAuth'; // Import the useAuth hook
import { FaHome, FaFilm, FaMoneyBillAlt, FaChartLine, FaDesktop, FaCog, FaNewspaper, FaBullhorn, FaBell, FaPlus, FaDownload, FaArrowUp, FaArrowDown } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { fetchWithAuth } from '../../utils/api';

// Inline styles using CSS custom properties for consistent theming
const adminStyles = `
/* Unified Admin Styles */
/* CSS custom properties for consistent theming */
.admin-root {
  --admin-bg-1: #071228;
  --admin-bg-2: #0f172a;
  --admin-bg-3: #1e293b;
  --admin-glass: rgba(255, 255, 255, 0.04);
  --admin-glass-medium: rgba(255, 255, 255, 0.05);
  --admin-glass-strong: rgba(255, 255, 255, 0.07);
  --admin-muted: #cbd5e1;
  --admin-text: #e6eef8;
  --admin-text-light: #f8fafc;
  --admin-text-secondary: #e2e8f0;
  --admin-accent: #3b82f6;
  --admin-accent-dark: #2563eb;
  --admin-accent-darker: #1d4ed8;
  --admin-accent-2: #ffd166;
  --admin-success: #4ade80;
  --admin-success-bg: rgba(34, 197, 94, 0.2);
  --admin-warning: #facc15;
  --admin-warning-bg: rgba(234, 179, 8, 0.2);
  --admin-error: #f87171;
  --admin-error-bg: rgba(239, 68, 68, 0.2);
  --admin-border: rgba(255, 255, 255, 0.1);
  --admin-card-radius: 12px;
  --admin-card-radius-lg: 16px;
  --admin-transition: all 0.2s ease;
  --admin-transition-long: all 0.3s ease;
  --admin-shadow-sm: 0 6px 18px rgba(0,0,0,0.45);
  --admin-shadow-md: 0 8px 32px rgba(2, 8, 20, 0.4);
  --admin-shadow-lg: 0 10px 28px rgba(0,0,0,0.6);
  --admin-shadow-xl: 0 20px 50px rgba(0, 0, 0, 0.5);
  font-family: Inter, "Segoe UI", Roboto, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  min-height: 100vh;
  color: var(--admin-text);
  background: linear-gradient(180deg, var(--admin-bg-1) 0%, var(--admin-bg-2) 100%);
}

/* Common layout */
.admin-root {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  overflow: hidden;
  background: linear-gradient(180deg, var(--admin-bg-1) 0%, var(--admin-bg-2) 100%);
  color: var(--admin-text);
}

.admin-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  overflow: hidden;
  background: linear-gradient(180deg, var(--admin-bg-1) 0%, var(--admin-bg-2) 100%);
  color: var(--admin-text);
}

.admin-wrapper {
  display: flex;
  min-height: 0;
  flex: 1;
  overflow: hidden;
}

.admin-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0; /* Allow flex child to shrink */
}

.admin-content {
  padding: 1.25rem;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  min-height: 0; /* Allow flex child to shrink correctly */
  flex: 1;
  display: flex;
  flex-direction: column;
}

/* Sidebar */
.admin-sidebar {
  width: 260px;
  flex: 0 0 260px;
  min-width: 260px;
  padding: 1.2rem;
  background: linear-gradient(180deg, rgba(3, 17, 38, 0.6), rgba(2, 10, 26, 0.6));
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-right: 1px solid var(--admin-border);
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.45);
  display: flex;
  flex-direction: column;
  gap: 1rem;
  transition: transform var(--admin-transition-long), width 0.28s ease;
  z-index: 40;
  position: relative;
}

.admin-sidebar.collapsed {
  transform: translateX(-100%);
  width: 0;
  min-width: 0;
}

.admin-sidebar[aria-hidden="true"] {
  transform: translateX(-100%);
  width: 0;
  min-width: 0;
}

/* Main content adjustments when sidebar is collapsed */
.admin-main.sidebar-collapsed .admin-content {
  padding-left: 1.25rem;
}

/* Ensure header is sticky */
.admin-header {
  position: sticky;
  top: 0;
  z-index: 30;
}

/* Header content */
.header-content {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
}

.header-actions {
  display: flex;
  gap: 12px;
  align-items: center;
}

.search-input {
  width: 240px;
}

/* Navigation footer */
.nav-footer {
  margin-top: auto;
}

/* Brand styling */
.brand {
  display: flex;
  gap: 0.75rem;
  align-items: center;
}

.brand img {
  width: 40px;
  height: auto;
  border-radius: 8px;
}

.brand-text {
  display: flex;
  flex-direction: column;
}

.brand-bank {
  color: var(--admin-accent-2);
  font-size: 0.95rem;
  font-weight: 700;
}

.brand-name {
  color: var(--admin-accent-2);
  font-size: 1rem;
  font-weight: 800;
}

/* Navigation */
.admin-nav {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-top: 0.8rem;
}

.admin-nav a {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.55rem 0.6rem;
  color: #cfe8ff;
  border-radius: 8px;
  text-decoration: none;
  transition: var(--admin-transition);
}

.admin-nav a:hover,
.admin-nav a.active {
  background: rgba(59, 130, 246, 0.15);
  color: #fff;
  border-left: 3px solid var(--admin-accent);
  padding-left: 0.8rem;
}

/* Grid layout */
.admin-grid {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 1rem;
}

.col-4 { grid-column: span 4; }
.col-6 { grid-column: span 6; }
.col-8 { grid-column: span 8; }
.col-12 { grid-column: span 12; }

/* Card styles */
.glass-card, .admin-card {
  background:
    linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0.02)),
    rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid var(--admin-border);
  border-radius: var(--admin-card-radius-lg);
  box-shadow: var(--admin-shadow-md);
  padding: 1.5rem;
  transition: var(--admin-transition-long);
}

.glass-card:hover,
.admin-card:hover {
  background:
    linear-gradient(180deg, rgba(255,255,255,0.05), rgba(255,255,255,0.03)),
    rgba(255, 255, 255, 0.08);
  box-shadow: var(--admin-shadow-lg);
  transform: translateY(-4px);
}

/* Titles */
.card-title, .admin-title {
  font-weight: 700;
  color: var(--admin-text-light);
  margin-bottom: 0.5rem;
  font-size: 1rem;
}

.card-sub {
  color: var(--admin-muted);
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
}

/* Forms */
.form-row, .admin-form-group {
  margin-bottom: 0.75rem;
}

.label, .admin-form-label {
  display: block;
  margin-bottom: 0.3rem;
  font-weight: 500;
  color: var(--admin-muted);
  font-size: 0.88rem;
}

.input, .admin-form-input, .form-input {
  width: 100%;
  padding: 0.6rem 0.75rem;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid var(--admin-border);
  color: var(--admin-text-light);
  transition: var(--admin-transition);
}

.input:focus, .admin-form-input:focus, .form-input:focus {
  outline: none;
  border-color: rgba(59, 130, 246, 0.9);
  box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.12);
}

.input::placeholder, .admin-form-input::placeholder, .form-input::placeholder {
  color: #94a3b8;
}

/* Buttons */
.btn, .admin-button {
  padding: 0.5rem 0.8rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: var(--admin-transition);
  border: none;
}

.btn-primary, .admin-button-primary {
  background: linear-gradient(90deg, var(--admin-accent), var(--admin-accent-darker));
  color: white;
}

.btn-primary:hover, .admin-button-primary:hover {
  background: linear-gradient(90deg, var(--admin-accent-darker), #1a3d9e);
}

.btn-secondary, .admin-button-secondary {
  background: var(--admin-glass-medium);
  color: var(--admin-text-secondary);
}

/* Dashboard specific styles */
.dashboard-stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1.25rem;
  margin-bottom: 1.5rem;
}

.dashboard-stat-card {
  background: 
    linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0.02)),
    rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid var(--admin-border);
  border-radius: var(--admin-card-radius-lg);
  padding: 1.25rem;
  box-shadow: var(--admin-shadow-md);
}

.dashboard-stat-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.5rem;
}

.dashboard-stat-label {
  color: var(--admin-muted);
  font-size: 0.875rem;
  margin-bottom: 0.25rem;
}

.dashboard-stat-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--admin-text-light);
}

.dashboard-stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
}

.dashboard-stat-icon.blue { background: rgba(59, 130, 246, 0.15); color: #93c5fd; }
.dashboard-stat-icon.green { background: rgba(34, 197, 94, 0.15); color: #86efac; }
.dashboard-stat-icon.purple { background: rgba(168, 85, 247, 0.15); color: #d8b4fe; }
.dashboard-stat-icon.yellow { background: rgba(234, 179, 8, 0.15); color: #fde047; }

.dashboard-stat-trend {
  font-size: 0.875rem;
}

.dashboard-stat-trend .positive {
  color: var(--admin-success);
}

.dashboard-stat-trend .negative {
  color: var(--admin-error);
}

.dashboard-content-section {
  background: 
    linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0.02)),
    rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid var(--admin-border);
  border-radius: var(--admin-card-radius-lg);
  padding: 1.5rem;
  box-shadow: var(--admin-shadow-md);
}

.sidebar-toggle-btn {
  background: var(--admin-glass-medium);
  border: none;
  color: var(--admin-text-secondary);
  width: 36px;
  height: 36px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: var(--admin-transition);
}

.sidebar-toggle-btn:hover {
  background: var(--admin-glass-strong);
  color: var(--admin-text-light);
}
`;

// Sidebar component
const Sidebar = ({ 
  isOpen, 
  toggleSidebar, 
  menuItems, 
  user, 
  onLogout, 
  onMenuItemClick 
}) => {
  return (
    <aside 
      className={`admin-sidebar ${isOpen ? 'open' : 'collapsed'}`} 
      aria-hidden={!isOpen}
    >
      <div className="brand">
        <div className="brand-text">
          <span className="brand-bank">Bank</span>
          <span className="brand-name">Perekonomian Rakyat</span>
        </div>
      </div>

      <nav className="admin-nav">
        {menuItems.map((item) => (
          <a
            key={item.key}
            href="#"
            className={item.active ? 'active' : ''}
            onClick={(e) => {
              e.preventDefault();
              onMenuItemClick(item.path);
            }}
          >
            {item.icon}
            <span>{item.label}</span>
          </a>
        ))}
      </nav>

      <div className="nav-footer">
        <a href="#" className="admin-nav-item" onClick={(e) => {
          e.preventDefault();
          onLogout();
        }}>
          <FaCog />
          <span>Logout</span>
        </a>
      </div>
    </aside>
  );
};

// Header component
const Header = ({ 
  title, 
  showSearch = false, 
  showNotifications = false, 
  notificationCount = 0, 
  onSearch = () => {}, 
  onNotificationClick = () => {} 
}) => {
  return (
    <header className="admin-header">
      <div className="header-content">
        <h1 className="card-title">{title}</h1>
      </div>
      <div className="header-actions">
        {showSearch && (
          <div className="search-input">
            <input
              type="text"
              placeholder="Search..."
              className="input"
              onChange={(e) => onSearch(e.target.value)}
            />
          </div>
        )}
        {showNotifications && (
          <button 
            className="btn-secondary"
            onClick={onNotificationClick}
          >
            <FaBell />
            {notificationCount > 0 && (
              <span className="notification-badge">{notificationCount}</span>
            )}
          </button>
        )}
      </div>
    </header>
  );
};

// Main Admin Dashboard Component
const AdminDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth(); // Use the useAuth hook
  const [stats, setStats] = useState({
    totalPlaylists: 0,
    activeDevices: 0,
    pendingUpdates: 0,
    totalRates: 0,
    playlistChange: 0,
    deviceChange: 0,
    rateChange: 0
  });

  // Define menu items with their paths and active state
  const menuItems = [
    { icon: <FaHome />, label: 'Dashboard', path: '/admin/dashboard', key: 'dashboard' },
    { icon: <FaFilm />, label: 'Playlist', path: '/admin/playlists', key: 'playlists' },
    { icon: <FaMoneyBillAlt />, label: 'Rates', path: '/admin/rates', key: 'rates' },
    { icon: <FaNewspaper />, label: 'News', path: '/admin/news', key: 'news' },
    { icon: <FaChartLine />, label: 'Economic Data', path: '/admin/economic', key: 'economic' },
    { icon: <FaDesktop />, label: 'Devices', path: '/admin/devices', key: 'devices' },
    { icon: <FaCog />, label: 'Display Settings', path: '/admin/settings', key: 'settings' },
    { icon: <FaBullhorn />, label: 'Announcements', path: '/admin/announcements', key: 'announcements' },
  ];

  const activeMenuItem = location.pathname.split('/')[2] || 'dashboard';

  useEffect(() => {
    // Fetch dashboard statistics
    fetchWithAuth('/api/admin/dashboard-stats')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setStats({
            totalPlaylists: data.stats.totalPlaylists || 24,
            activeDevices: data.stats.activeDevices || 18,
            pendingUpdates: data.stats.pendingUpdates || 5,
            totalRates: data.stats.totalRates || 12,
            playlistChange: data.stats.playlistChange || 3,
            deviceChange: data.stats.deviceChange || -2,
            rateChange: data.stats.rateChange || 1
          });
        } else {
          // Fallback to default values if API fails
          setStats({
            totalPlaylists: 24,
            activeDevices: 18,
            pendingUpdates: 5,
            totalRates: 12,
            playlistChange: 3,
            deviceChange: -2,
            rateChange: 1
          });
        }
      })
      .catch(err => {
        console.error("Error fetching dashboard stats:", err);
        // Use default values if API fails
        setStats({
          totalPlaylists: 24,
          activeDevices: 18,
          pendingUpdates: 5,
          totalRates: 12,
          playlistChange: 3,
          deviceChange: -2,
          rateChange: 1
        });
      });
  }, []);

  const handleMenuItemClick = (path) => {
    navigate(path);
  };

  return (
    <div className="admin-root">
      <style>{adminStyles}</style>
      <div className="admin-wrapper">
        <Sidebar
          isOpen={sidebarOpen}
          toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          menuItems={menuItems.map(item => ({
            ...item,
            active: activeMenuItem === item.key
          }))}
          user={{ name: 'Admin BPR', role: 'Super Admin' }}
          onLogout={logout}
          onMenuItemClick={handleMenuItemClick}
        />

        <div className={`admin-main ${sidebarOpen ? 'sidebar-open' : 'sidebar-collapsed'}`}>
          <Header
            title="Bank Perekonomian Rakyat - Admin Dashboard"
            showSearch={true}
            showNotifications={true}
            notificationCount={3}
            onSearch={(value) => console.log("Searching for:", value)}
            onNotificationClick={() => { /* handle notifications */ }}
          />

          <div className="admin-content">
            {/* Stats Overview */}
            <div className="dashboard-stats-grid">
              <div className="dashboard-stat-card">
                <div className="dashboard-stat-header">
                  <div>
                    <p className="dashboard-stat-label">Total Playlists</p>
                    <h3 className="dashboard-stat-value">{stats.totalPlaylists}</h3>
                  </div>
                  <div className="dashboard-stat-icon blue">
                    <FaFilm />
                  </div>
                </div>
                <div className="dashboard-stat-trend">
                  <span className={`flex items-center ${stats.playlistChange >= 0 ? 'positive' : 'negative'}`}>
                    {stats.playlistChange >= 0 ? <FaArrowUp /> : <FaArrowDown />}
                    {Math.abs(stats.playlistChange)} from last week
                  </span>
                </div>
              </div>

              <div className="dashboard-stat-card">
                <div className="dashboard-stat-header">
                  <div>
                    <p className="dashboard-stat-label">Active Devices</p>
                    <h3 className="dashboard-stat-value">{stats.activeDevices}</h3>
                  </div>
                  <div className="dashboard-stat-icon green">
                    <FaDesktop />
                  </div>
                </div>
                <div className="dashboard-stat-trend">
                  <span className={`flex items-center ${stats.deviceChange >= 0 ? 'positive' : 'negative'}`}>
                    {stats.deviceChange >= 0 ? <FaArrowUp /> : <FaArrowDown />}
                    {Math.abs(stats.deviceChange)} from last week
                  </span>
                </div>
              </div>

              <div className="dashboard-stat-card">
                <div className="dashboard-stat-header">
                  <div>
                    <p className="dashboard-stat-label">Interest Rates</p>
                    <h3 className="dashboard-stat-value">{stats.totalRates}</h3>
                  </div>
                  <div className="dashboard-stat-icon purple">
                    <FaMoneyBillAlt />
                  </div>
                </div>
                <div className="dashboard-stat-trend">
                  <span className={`flex items-center ${stats.rateChange >= 0 ? 'positive' : 'negative'}`}>
                    {stats.rateChange >= 0 ? <FaArrowUp /> : <FaArrowDown />}
                    {Math.abs(stats.rateChange)} from last week
                  </span>
                </div>
              </div>

              <div className="dashboard-stat-card">
                <div className="dashboard-stat-header">
                  <div>
                    <p className="dashboard-stat-label">Pending Updates</p>
                    <h3 className="dashboard-stat-value">{stats.pendingUpdates}</h3>
                  </div>
                  <div className="dashboard-stat-icon yellow">
                    <FaCog />
                  </div>
                </div>
                <div className="dashboard-stat-trend">
                  <span className="text-yellow-400">
                    Requires attention
                  </span>
                </div>
              </div>
            </div>

            {/* Content area for child routes */}
            <div className="admin-grid mb-8 gap-6">
              <div className="col-12">
                <div className="dashboard-content-section">
                  <Outlet />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </div>
  );
};

export default AdminDashboard;
// src/admin/AdminLayout.jsx
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaHome, FaFilm, FaMoneyBillAlt, FaChartLine, FaDesktop, FaCog, FaNewspaper, FaBullhorn } from 'react-icons/fa';
import Sidebar from '../components/admin/ui/Sidebar';
import Header from '../components/admin/ui/Header';
import '../styles/admin.css';

export default function AdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = React.useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  
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

  const handleMenuItemClick = (path) => {
    navigate(path);
  };

  return (
    <div className="admin-root">
      <div className="admin-wrapper">
        <Sidebar
          isOpen={sidebarOpen}
          toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          menuItems={menuItems.map(item => ({
            ...item,
            active: activeMenuItem === item.key
          }))}
          user={{ name: 'Admin BPR', role: 'Super Admin' }}
          onLogout={() => { /* handle logout */ }}
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
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
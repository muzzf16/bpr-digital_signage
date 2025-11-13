// src/admin/AdminLayout.jsx
import React from 'react';
import { useLocation } from 'react-router-dom';
import Sidebar from '../components/admin/ui/Sidebar';
import Header from '../components/admin/ui/Header';
import '../styles/admin.css';

export default function AdminLayout({ children, sidebarOpen, setSidebarOpen, menuItems, activeMenuItem, handleMenuItemClick }) {
  const location = useLocation();

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
import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import Sidebar from './ui/Sidebar';
import Header from './ui/Header';
import GlassCard from '../GlassCard';
import DataTable from './ui/DataTable';
import PlaylistManager from './content/PlaylistManager';
import RateManager from './rates/RateManager';
import DeviceManager from './devices/DeviceManager';
import NewsManager from './content/NewsManager';
import EconomicManager from './economic/EconomicManager';
import DisplaySettingsManager from './system/DisplaySettingsManager';
import DevicesPage from './devices/DevicesPage';
import {
  FaCog, FaFilm, FaDesktop, FaChartLine, FaMoneyBillAlt, FaChartBar,
  FaBell, FaPlus, FaDownload, FaArrowUp, FaArrowDown, FaHome, FaNewspaper
} from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Dashboard component with routing
const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalPlaylists: 0,
    activeDevices: 0,
    pendingUpdates: 0,
    totalRates: 0,
    playlistChange: 0,
    deviceChange: 0,
    rateChange: 0
  });

  useEffect(() => {
    // Fetch dashboard statistics
    fetch('/api/admin/dashboard-stats')
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
    
    // Set active menu item based on current path
    const path = location.pathname;
    if (path === '/admin/devices') {
      setActiveMenuItem('devices');
    } else if (path === '/admin/playlists') {
      setActiveMenuItem('playlists');
    } else if (path === '/admin/rates') {
      setActiveMenuItem('rates');
    } else if (path === '/admin/news') {
      setActiveMenuItem('news');
    } else if (path === '/admin/economic') {
      setActiveMenuItem('economic');
    } else if (path === '/admin/settings') {
      setActiveMenuItem('settings');
    } else {
      setActiveMenuItem('dashboard');
    }
  }, [location.pathname]);

  const [activeMenuItem, setActiveMenuItem] = useState('dashboard');

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleMenuItemClick = (path) => {
    navigate(path);
    setActiveMenuItem(path.split('/')[2] || 'dashboard');
  };

  // Define menu items with their paths and active state
  const menuItems = [
    { icon: <FaHome />, label: 'Dashboard', path: '/admin/dashboard', key: 'dashboard' },
    { icon: <FaFilm />, label: 'Playlist', path: '/admin/playlists', key: 'playlists' },
    { icon: <FaMoneyBillAlt />, label: 'Rates', path: '/admin/rates', key: 'rates' },
    { icon: <FaNewspaper />, label: 'News', path: '/admin/news', key: 'news' },
    { icon: <FaChartLine />, label: 'Economic Data', path: '/admin/economic', key: 'economic' },
    { icon: <FaDesktop />, label: 'Devices', path: '/admin/devices', key: 'devices' },
    { icon: <FaCog />, label: 'Display Settings', path: '/admin/settings', key: 'settings' },
  ];

  const renderContent = () => {
    if (location.pathname === '/admin/devices') {
      return <DevicesPage />;
    } else if (location.pathname === '/admin/playlists') {
      return <PlaylistManager />;
    } else if (location.pathname === '/admin/rates') {
      return <RateManager />;
    } else if (location.pathname === '/admin/news') {
      return <NewsManager />;
    } else if (location.pathname === '/admin/economic') {
      return <EconomicManager />;
    } else if (location.pathname === '/admin/settings') {
      return <DisplaySettingsManager />;
    } else {
      // Dashboard content
      return (
        <>
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <GlassCard className="bg-gradient-to-br from-blue-600/20 to-blue-800/30 backdrop-blur-sm border border-blue-700/30">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-200 text-sm">Total Playlists</p>
                  <h3 className="text-2xl font-bold text-white mt-1">{stats.totalPlaylists}</h3>
                </div>
                <div className="bg-blue-500/20 p-3 rounded-full">
                  <FaFilm className="text-blue-300 text-xl" />
                </div>
              </div>
              <div className="flex items-center mt-3">
                <span className={`text-xs flex items-center ${stats.playlistChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {stats.playlistChange >= 0 ? <FaArrowUp className="mr-1" /> : <FaArrowDown className="mr-1" />}
                  {Math.abs(stats.playlistChange)} from last week
                </span>
              </div>
            </GlassCard>

            <GlassCard className="bg-gradient-to-br from-green-600/20 to-green-800/30 backdrop-blur-sm border border-green-700/30">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-200 text-sm">Active Devices</p>
                  <h3 className="text-2xl font-bold text-white mt-1">{stats.activeDevices}</h3>
                </div>
                <div className="bg-green-500/20 p-3 rounded-full">
                  <FaDesktop className="text-green-300 text-xl" />
                </div>
              </div>
              <div className="flex items-center mt-3">
                <span className={`text-xs flex items-center ${stats.deviceChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {stats.deviceChange >= 0 ? <FaArrowUp className="mr-1" /> : <FaArrowDown className="mr-1" />}
                  {Math.abs(stats.deviceChange)} from last week
                </span>
              </div>
            </GlassCard>

            <GlassCard className="bg-gradient-to-br from-purple-600/20 to-purple-800/30 backdrop-blur-sm border border-purple-700/30">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-200 text-sm">Interest Rates</p>
                  <h3 className="text-2xl font-bold text-white mt-1">{stats.totalRates}</h3>
                </div>
                <div className="bg-purple-500/20 p-3 rounded-full">
                  <FaMoneyBillAlt className="text-purple-300 text-xl" />
                </div>
              </div>
              <div className="flex items-center mt-3">
                <span className={`text-xs flex items-center ${stats.rateChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {stats.rateChange >= 0 ? <FaArrowUp className="mr-1" /> : <FaArrowDown className="mr-1" />}
                  {Math.abs(stats.rateChange)} from last week
                </span>
              </div>
            </GlassCard>

            <GlassCard className="bg-gradient-to-br from-yellow-600/20 to-yellow-800/30 backdrop-blur-sm border border-yellow-700/30">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-yellow-200 text-sm">Pending Updates</p>
                  <h3 className="text-2xl font-bold text-white mt-1">{stats.pendingUpdates}</h3>
                </div>
                <div className="bg-yellow-500/20 p-3 rounded-full">
                  <FaCog className="text-yellow-300 text-xl" />
                </div>
              </div>
              <div className="mt-3">
                <span className="text-xs text-yellow-400">Requires attention</span>
              </div>
            </GlassCard>
          </div>

          {/* Management Sections */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <PlaylistManager />
            <RateManager />
          </div>

          <div className="grid grid-cols-1 gap-6">
            <DeviceManager />
          </div>
        </>
      );
    }
  };

  return (
    <div className="admin-container">
      <div className="admin-layout">
        <Sidebar 
          isOpen={sidebarOpen} 
          toggleSidebar={toggleSidebar} 
          menuItems={menuItems.map(item => ({
            ...item,
            active: activeMenuItem === item.key
          }))}
          user={{ name: 'Admin BPR', role: 'Super Admin' }}
          onLogout={() => toast.info("Logout functionality would go here")}
        />

        <div className="flex-1 flex flex-col overflow-hidden">
          <Header 
            title="Bank Perekonomian Rakyat - Admin Dashboard" 
            showSearch={true}
            showNotifications={true}
            notificationCount={3}
            onSearch={(value) => console.log("Searching for:", value)}
            onNotificationClick={() => toast.info("Notifications clicked")}
          />

          <main className="admin-main-content">
            {renderContent()}
          </main>
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
    </div>
  );
};

export default Dashboard;
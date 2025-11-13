import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import AdminLayout from '../../admin/AdminLayout'; // Import the updated AdminLayout
import PlaylistManager from './content/PlaylistManager';
import RateManager from './rates/RateManager';
import NewsManager from './content/NewsManager';
import EconomicManager from './economic/EconomicManager';
import DisplaySettingsManager from './system/DisplaySettingsManager';
import AnnouncementsManager from './announcements/AnnouncementsManager';
import DevicesPage from './devices/DevicesPage';
import {
  FaCog, FaFilm, FaDesktop, FaChartLine, FaMoneyBillAlt, FaChartBar,
  FaBell, FaPlus, FaDownload, FaArrowUp, FaArrowDown, FaHome, FaNewspaper,
  FaBullhorn
} from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { fetchWithAuth } from '../../utils/api';

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true); // Set to true by default for desktop view
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

  const [activeMenuItem, setActiveMenuItem] = useState('dashboard');

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

    // Set active menu item based on current path
    const path = location.pathname;
    const currentKey = path.split('/')[2] || 'dashboard';
    setActiveMenuItem(currentKey);
  }, [location.pathname]);

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
    { icon: <FaBullhorn />, label: 'Announcements', path: '/admin/announcements', key: 'announcements' },
  ];

  return (
    <AdminLayout>
      <>
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

        {/* Management Sections */}
        <div className="admin-grid mb-8 gap-6">
          <div className="col-6">
            <div className="dashboard-content-section">
              <h3>Playlist Overview</h3>
              <PlaylistManager />
            </div>
          </div>
          <div className="col-6">
            <div className="dashboard-content-section">
              <h3>Rate Overview</h3>
              <RateManager />
            </div>
          </div>
        </div>

        <div className="admin-grid gap-6">
          <div className="col-12">
            <div className="dashboard-content-section">
              <h3>Device Status</h3>
              <DevicesPage />
            </div>
          </div>
        </div>
      </>
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
    </AdminLayout>
  );
};

export default Dashboard;
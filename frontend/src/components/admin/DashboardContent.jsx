// src/components/admin/DashboardContent.jsx
import React, { useState, useEffect } from 'react';
import { fetchWithAuth } from '../../utils/api';
import { FaFilm, FaDesktop, FaMoneyBillAlt, FaChartLine, FaNewspaper, FaCog, FaBullhorn, FaPlus } from 'react-icons/fa';

const DashboardContent = () => {
  const [dashboardData, setDashboardData] = useState({
    playlists: [],
    devices: [],
    rates: [],
    news: [],
    announcements: []
  });
  
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch dashboard data
    const fetchDashboardData = async () => {
      try {
        const [playlistsRes, devicesRes, ratesRes, newsRes, announcementsRes] = 
          await Promise.allSettled([
            fetchWithAuth('/api/playlists'),
            fetchWithAuth('/api/devices'),
            fetchWithAuth('/api/rates'),
            fetchWithAuth('/api/news'),
            fetchWithAuth('/api/announcements')
          ]);

        const data = {
          playlists: playlistsRes.status === 'fulfilled' ? await playlistsRes.value.json() : [],
          devices: devicesRes.status === 'fulfilled' ? await devicesRes.value.json() : [],
          rates: ratesRes.status === 'fulfilled' ? await ratesRes.value.json() : [],
          news: newsRes.status === 'fulfilled' ? await newsRes.value.json() : [],
          announcements: announcementsRes.status === 'fulfilled' ? await announcementsRes.value.json() : []
        };

        setDashboardData(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Placeholder components for each section
  const PlaylistOverview = () => (
    <div className="dashboard-content-section">
      <div className="flex justify-between items-center mb-4">
        <h3 className="card-title">Playlists</h3>
        <button className="btn-primary flex items-center gap-2">
          <FaPlus /> Add New
        </button>
      </div>
      {loading ? (
        <p>Loading playlists...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {dashboardData.playlists.slice(0, 4).map((playlist, index) => (
            <div key={index} className="glass-card p-4">
              <h4 className="font-semibold">{playlist.name || `Playlist ${index + 1}`}</h4>
              <p className="text-sm text-gray-400">{playlist.items?.length || 0} items</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const DeviceOverview = () => (
    <div className="dashboard-content-section">
      <div className="flex justify-between items-center mb-4">
        <h3 className="card-title">Active Devices</h3>
        <button className="btn-primary flex items-center gap-2">
          <FaPlus /> Add Device
        </button>
      </div>
      {loading ? (
        <p>Loading devices...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {dashboardData.devices.slice(0, 3).map((device, index) => (
            <div key={index} className="glass-card p-4">
              <h4 className="font-semibold">{device.name || `Device ${index + 1}`}</h4>
              <p className="text-sm text-gray-400">Location: {device.location || 'Unknown'}</p>
              <p className={`text-sm mt-2 ${device.status === 'online' ? 'text-green-400' : 'text-red-400'}`}>
                Status: {device.status || 'offline'}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const RateOverview = () => (
    <div className="dashboard-content-section">
      <div className="flex justify-between items-center mb-4">
        <h3 className="card-title">Interest Rates</h3>
        <button className="btn-primary flex items-center gap-2">
          <FaPlus /> Add Rate
        </button>
      </div>
      {loading ? (
        <p>Loading rates...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {dashboardData.rates.slice(0, 4).map((rate, index) => (
            <div key={index} className="glass-card p-4">
              <h4 className="font-semibold">{rate.name || `Rate ${index + 1}`}</h4>
              <p className="text-lg font-bold">{rate.interest_rate || 0}%</p>
              <p className="text-sm text-gray-400">Updated: {rate.updated_at || 'N/A'}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="admin-grid gap-6">
      <div className="col-6">
        <PlaylistOverview />
      </div>
      <div className="col-6">
        <RateOverview />
      </div>
      <div className="col-12">
        <DeviceOverview />
      </div>
    </div>
  );
};

export default DashboardContent;
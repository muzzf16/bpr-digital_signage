import React from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import PlayerApp from './player/PlayerApp'; // Player app with scoped CSS
import AdminDashboard from './components/admin/AdminDashboard'; // Combined admin layout and dashboard
import DashboardContent from './components/admin/DashboardContent';
import PlaylistManager from './components/admin/content/PlaylistManager';
import RateManager from './components/admin/rates/RateManager';
import NewsManager from './components/admin/content/NewsManager';
import EconomicManager from './components/admin/economic/EconomicManager';
import DisplaySettingsManager from './components/admin/system/DisplaySettingsManager';
import AnnouncementsManager from './components/admin/announcements/AnnouncementsManager';
import DevicesPage from './components/admin/devices/DevicesPage';

import LoginPage from './admin/LoginPage';
import ProtectedRoute from './admin/ProtectedRoute';

// Default device ID for demo purposes
const DEFAULT_DEVICE_ID = 'demo-tv-01';

export default function App() {
  const params = new URLSearchParams(window.location.search);
  const deviceId = params.get('device') || DEFAULT_DEVICE_ID;

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<PlayerApp deviceId={deviceId} />} />

        {/* Admin routes with proper nested routing */}
        <Route path="/admin" element={
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        }>
          <Route index element={<DashboardContent />} />
          <Route path="dashboard" element={<DashboardContent />} />
          <Route path="playlists" element={<PlaylistManager />} />
          <Route path="rates" element={<RateManager />} />
          <Route path="news" element={<NewsManager />} />
          <Route path="economic" element={<EconomicManager />} />
          <Route path="settings" element={<DisplaySettingsManager />} />
          <Route path="announcements" element={<AnnouncementsManager />} />
          <Route path="devices" element={<DevicesPage />} />
        </Route>
      </Routes>
    </Router>
  );
}
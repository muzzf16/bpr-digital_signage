import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PlayerApp from './player/PlayerApp'; // Player app with scoped CSS
import AdminLayout from './admin/AdminLayout'; // Admin layout with scoped CSS
import Dashboard from './components/admin/Dashboard';
import DeviceManager from './components/admin/devices/DeviceManager';
import PlaylistManager from './components/admin/content/PlaylistManager';
import RateManager from './components/admin/rates/RateManager';
import NewsManager from './components/admin/content/NewsManager';
import EconomicManager from './components/admin/economic/EconomicManager';
import DisplaySettingsManager from './components/admin/system/DisplaySettingsManager';
import DevicesPage from './components/admin/devices/DevicesPage';

// Default device ID for demo purposes
const DEFAULT_DEVICE_ID = 'demo-tv-01';

export default function App() {
  const params = new URLSearchParams(window.location.search);
  const deviceId = params.get('device') || DEFAULT_DEVICE_ID;

  return (
    <Router>
      <Routes>
        <Route path="/" element={<PlayerApp deviceId={deviceId} />} />
        <Route path="/admin" element={
          <AdminLayout>
            <Dashboard />
          </AdminLayout>
        } />
        <Route path="/admin/*" element={
          <AdminLayout>
            <Dashboard />
          </AdminLayout>
        } />
        <Route path="/admin/devices" element={
          <AdminLayout>
            <DevicesPage />
          </AdminLayout>
        } />
        <Route path="/admin/playlists" element={
          <AdminLayout>
            <PlaylistManager />
          </AdminLayout>
        } />
        <Route path="/admin/rates" element={
          <AdminLayout>
            <RateManager />
          </AdminLayout>
        } />
        <Route path="/admin/news" element={
          <AdminLayout>
            <NewsManager />
          </AdminLayout>
        } />
        <Route path="/admin/economic" element={
          <AdminLayout>
            <EconomicManager />
          </AdminLayout>
        } />
        <Route path="/admin/settings" element={
          <AdminLayout>
            <DisplaySettingsManager />
          </AdminLayout>
        } />
      </Routes>
    </Router>
  );
}
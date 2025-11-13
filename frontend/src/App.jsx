import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PlayerApp from './player/PlayerApp'; // Player app with scoped CSS
import AdminLayout from './admin/AdminLayout'; // Admin layout with scoped CSS
import Dashboard from './components/admin/Dashboard';
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
        <Route path="/admin" element={<ProtectedRoute />}>
          <Route
            path="*" // Catch all admin routes
            element={
              <AdminLayout>
                <Dashboard />
              </AdminLayout>
            }
          />
        </Route>
      </Routes>
    </Router>
  );
}
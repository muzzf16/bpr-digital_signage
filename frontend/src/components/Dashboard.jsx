import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import GlassCard from './GlassCard';
import DataTable from './DataTable';
import PlaylistManager from './PlaylistManager';
import RateManager from './RateManager';
import DeviceManager from './DeviceManager';
import { 
  FaCog, FaFilm, FaDesktop,
  FaBell,
  FaPlus, FaDownload
} from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Dashboard component
const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-blue-900 to-blue-800 text-white overflow-hidden">
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        
        <main className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <GlassCard 
              title="Total Playlists" 
              icon={<FaFilm className="text-yellow-400" />}
              className="md:col-span-2"
            >
              <div className="text-3xl font-bold text-yellow-400">24</div>
              <div className="text-sm text-blue-200 mt-1">+3 from last week</div>
            </GlassCard>
            
            <GlassCard 
              title="Active Devices" 
              icon={<FaDesktop className="text-green-400" />}
            >
              <div className="text-3xl font-bold text-green-400">18</div>
              <div className="text-sm text-blue-200 mt-1">4 offline</div>
            </GlassCard>
            
            <GlassCard 
              title="Pending Updates" 
              icon={<FaCog className="text-purple-400" />}
            >
              <div className="text-3xl font-bold text-purple-400">5</div>
              <div className="text-sm text-blue-200 mt-1">Requires attention</div>
            </GlassCard>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <PlaylistManager />

            <RateManager />

            <DeviceManager />
          </div>
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
  );
};

export default Dashboard;
import React, { useState } from 'react';
import { 
  FaHome, FaFilm, FaMoneyBillAlt, FaChartLine, FaDesktop, FaCog, 
  FaListAlt, FaBell, FaSignOutAlt, FaBars, FaTimes, FaTrash, FaEdit,
  FaPlus, FaSearch, FaDownload, FaUser
} from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Mock data for tables
const mockPlaylists = [
  { id: 1, name: 'Promo Produk', items: 12, status: 'Active', lastUpdated: '2025-11-11' },
  { id: 2, name: 'Berita Ekonomi', items: 8, status: 'Active', lastUpdated: '2025-11-10' },
  { id: 3, name: 'Rate Highlights', items: 6, status: 'Inactive', lastUpdated: '2025-11-09' },
];

const mockRates = [
  { id: 1, name: 'Tabungan Simpanan', rate: 6.85, currency: 'IDR', effectiveDate: '2025-01-01', status: 'Published' },
  { id: 2, name: 'Kredit Mikro', rate: 8.5, currency: 'IDR', effectiveDate: '2025-01-01', status: 'Published' },
  { id: 3, name: 'Deposito', rate: 7.2, currency: 'IDR', effectiveDate: '2025-01-01', status: 'Draft' },
];

const mockDevices = [
  { id: 1, name: 'TV Utama', location: 'Lobby', status: 'Online', lastSeen: '2025-11-11 16:30:00' },
  { id: 2, name: 'TV CS', location: 'Customer Service', status: 'Online', lastSeen: '2025-11-11 16:28:00' },
  { id: 3, name: 'TV Lobi 2', location: 'Second Floor', status: 'Offline', lastSeen: '2025-11-10 08:15:00' },
];

// Sidebar component
const Sidebar = ({ isOpen, toggleSidebar }) => {
  return (
    <>
      {/* Mobile sidebar toggle button */}
      <button 
        className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-blue-600 text-white"
        onClick={toggleSidebar}
      >
        {isOpen ? <FaTimes /> : <FaBars />}
      </button>

      {/* Sidebar */}
      <div 
        className={`fixed md:relative z-40 h-full w-64 bg-gradient-to-b from-blue-900/80 to-blue-800/80 backdrop-blur-lg border-r border-blue-700/50 transition-transform duration-300 ease-in-out transform ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0`}
      >
        <div className="p-6 border-b border-blue-700/50">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-600 p-2 rounded-lg">
              <FaUser className="text-white" />
            </div>
            <div>
              <h2 className="text-white font-semibold">Admin BPR</h2>
              <p className="text-blue-200 text-sm">User Role: Super Admin</p>
            </div>
          </div>
        </div>

        <nav className="p-4">
          <ul className="space-y-2">
            {[
              { icon: <FaHome />, label: 'Dashboard', active: true },
              { icon: <FaFilm />, label: 'Playlist', active: false },
              { icon: <FaMoneyBillAlt />, label: 'Rates', active: false },
              { icon: <FaChartLine />, label: 'Economic Data', active: false },
              { icon: <FaDesktop />, label: 'Display Settings', active: false },
              { icon: <FaListAlt />, label: 'Devices', active: false },
              { icon: <FaCog />, label: 'System Logs', active: false },
            ].map((item, index) => (
              <li key={index}>
                <a 
                  href="#" 
                  className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                    item.active 
                      ? 'bg-blue-700/50 text-white' 
                      : 'text-blue-200 hover:bg-blue-700/30 hover:text-white'
                  }`}
                >
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="absolute bottom-4 left-4 right-4">
          <button className="flex items-center justify-center space-x-2 w-full p-3 bg-red-600/20 hover:bg-red-600/30 text-red-200 rounded-lg border border-red-600/30 transition-colors">
            <FaSignOutAlt />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </>
  );
};

// Header component
const Header = () => {
  return (
    <header className="bg-gradient-to-r from-blue-900/80 to-blue-800/80 backdrop-blur-lg border-b border-blue-700/50 p-4 flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 p-2 rounded-lg">
          <FaHome className="text-blue-900" />
        </div>
        <h1 className="text-white text-xl font-bold">Bank Perekonomian Rakyat</h1>
      </div>
      <div className="flex items-center space-x-4">
        <div className="relative">
          <input 
            type="text" 
            placeholder="Search..." 
            className="bg-blue-800/30 text-white placeholder-blue-300 border border-blue-700/50 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <FaSearch className="absolute right-3 top-3 text-blue-300" />
        </div>
        <button className="relative p-2 bg-blue-700/50 rounded-lg hover:bg-blue-600/50 transition-colors">
          <FaBell className="text-white" />
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">3</span>
        </button>
      </div>
    </header>
  );
};

// Card component with glassmorphism effect
const GlassCard = ({ title, icon, children, className = "" }) => {
  return (
    <div className={`bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6 shadow-lg ${className}`}>
      <div className="flex items-center space-x-3 mb-4">
        <div className="bg-blue-600/30 p-2 rounded-lg">
          {icon}
        </div>
        <h3 className="text-white text-lg font-semibold">{title}</h3>
      </div>
      {children}
    </div>
  );
};

// Table component
const DataTable = ({ columns, data, onEdit, onDelete }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-blue-700/50">
        <thead>
          <tr>
            {columns.map((col, idx) => (
              <th key={idx} className="px-4 py-3 text-left text-xs font-medium text-blue-200 uppercase tracking-wider">
                {col.header}
              </th>
            ))}
            <th className="px-4 py-3 text-right text-xs font-medium text-blue-200 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-blue-700/30">
          {data.map((row, idx) => (
            <tr key={idx} className="hover:bg-white/5 transition-colors">
              {columns.map((col, colIdx) => (
                <td key={colIdx} className="px-4 py-3 text-sm text-white">
                  {col.render ? col.render(row[col.key], row) : row[col.key]}
                </td>
              ))}
              <td className="px-4 py-3 text-right text-sm">
                <div className="flex justify-end space-x-2">
                  <button 
                    onClick={() => onEdit && onEdit(row)}
                    className="p-1 text-blue-300 hover:text-blue-100 transition-colors"
                  >
                    <FaEdit />
                  </button>
                  <button 
                    onClick={() => onDelete && onDelete(row)}
                    className="p-1 text-red-300 hover:text-red-100 transition-colors"
                  >
                    <FaTrash />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// Dashboard component
const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleEdit = (item, type) => {
    toast.info(`${type} edit clicked for: ${item.name || item.title}`);
  };

  const handleDelete = (item, type) => {
    if (window.confirm(`Are you sure you want to delete this ${type.toLowerCase()}?`)) {
      toast.success(`${type} deleted successfully!`);
    }
  };

  const handleCreate = (type) => {
    toast.success(`${type} created successfully!`);
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
            {/* Playlist Manager */}
            <GlassCard 
              title="🎞️ Display Playlist" 
              icon={<FaFilm />}
            >
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-white font-medium">Active Playlists</h4>
                <button 
                  onClick={() => handleCreate('Playlist')}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
                >
                  <FaPlus /> <span>Add New</span>
                </button>
              </div>
              
              <DataTable 
                columns={[
                  { key: 'name', header: 'Name' },
                  { key: 'items', header: 'Items' },
                  { key: 'status', header: 'Status', render: (value) => (
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      value === 'Active' ? 'bg-green-600/30 text-green-200' : 'bg-red-600/30 text-red-200'
                    }`}>
                      {value}
                    </span>
                  )},
                  { key: 'lastUpdated', header: 'Last Updated' },
                ]}
                data={mockPlaylists}
                onEdit={(item) => handleEdit(item, 'Playlist')}
                onDelete={(item) => handleDelete(item, 'Playlist')}
              />
            </GlassCard>

            {/* Rates Manager */}
            <GlassCard 
              title="💰 Produk & Suku Bunga" 
              icon={<FaMoneyBillAlt />}
            >
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-white font-medium">Interest Rates</h4>
                <div className="flex space-x-2">
                  <button className="bg-green-600/30 hover:bg-green-600/40 text-green-300 px-3 py-2 rounded-lg flex items-center space-x-1 border border-green-600/30">
                    <FaDownload /> <span>Export</span>
                  </button>
                  <button 
                    onClick={() => handleCreate('Rate')}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
                  >
                    <FaPlus /> <span>Add New</span>
                  </button>
                </div>
              </div>
              
              <DataTable 
                columns={[
                  { key: 'name', header: 'Product' },
                  { key: 'rate', header: 'Rate (%)', render: (value) => `${value}%` },
                  { key: 'currency', header: 'Currency' },
                  { key: 'status', header: 'Status', render: (value) => (
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      value === 'Published' ? 'bg-green-600/30 text-green-200' : 'bg-yellow-600/30 text-yellow-200'
                    }`}>
                      {value}
                    </span>
                  )},
                ]}
                data={mockRates}
                onEdit={(item) => handleEdit(item, 'Rate')}
                onDelete={(item) => handleDelete(item, 'Rate')}
              />
            </GlassCard>

            {/* Devices Manager */}
            <GlassCard 
              title="🖥️ Device Management" 
              icon={<FaDesktop />}
              className="lg:col-span-2"
            >
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-white font-medium">Connected Devices</h4>
                <div className="flex space-x-2">
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">
                    Refresh
                  </button>
                </div>
              </div>
              
              <DataTable 
                columns={[
                  { key: 'name', header: 'Device Name' },
                  { key: 'location', header: 'Location' },
                  { key: 'status', header: 'Status', render: (value) => (
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      value === 'Online' ? 'bg-green-600/30 text-green-200' : 'bg-red-600/30 text-red-200'
                    }`}>
                      {value}
                    </span>
                  )},
                  { key: 'lastSeen', header: 'Last Seen' },
                ]}
                data={mockDevices}
                onEdit={(item) => handleEdit(item, 'Device')}
                onDelete={(item) => handleDelete(item, 'Device')}
              />
            </GlassCard>
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
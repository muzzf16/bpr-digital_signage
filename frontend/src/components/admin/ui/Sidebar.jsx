import React from 'react';
import { Link } from 'react-router-dom';
import {
  FaHome, FaFilm, FaMoneyBillAlt, FaChartLine, FaDesktop, FaCog,
  FaListAlt, FaSignOutAlt, FaBars, FaTimes, FaUser
} from 'react-icons/fa';

const Sidebar = ({
  isOpen = false,
  toggleSidebar,
  menuItems = [],
  user = { name: 'Admin BPR', role: 'Super Admin' },
  onLogout = null,
  onMenuItemClick = null, // Add onMenuItemClick prop
  className = ""
}) => {
  return (
    <>
      {/* Mobile sidebar toggle button */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-blue-600 text-white"
        onClick={toggleSidebar}
        aria-label={isOpen ? "Close menu" : "Open menu"}
      >
        {isOpen ? <FaTimes /> : <FaBars />}
      </button>

      {/* Sidebar */}
      <div
        className={`fixed md:relative z-40 h-full w-64 bg-gradient-to-b from-blue-900/80 to-blue-800/80 backdrop-blur-lg border-r border-blue-700/50 transition-transform duration-300 ease-in-out transform ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 ${className}`}
      >
        <div className="p-6 border-b border-blue-700/50">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-600 p-2 rounded-lg">
              <FaUser className="text-white" />
            </div>
            <div>
              <h2 className="text-white font-semibold">{user.name}</h2>
              <p className="text-blue-200 text-sm">User Role: {user.role}</p>
            </div>
          </div>
        </div>

        <nav className="p-4">
          <ul className="space-y-2">
            {menuItems.map((item, index) => (
              <li key={index}>
                <Link
                  to={item.path}
                  onClick={() => {
                    if (onMenuItemClick) onMenuItemClick(item.path);
                    if (toggleSidebar && isOpen) toggleSidebar(); // Close sidebar on mobile after click
                  }}
                  className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                    item.active
                      ? 'bg-blue-700/50 text-white'
                      : 'text-blue-200 hover:bg-blue-700/30 hover:text-white'
                  }`}
                >
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="absolute bottom-4 left-4 right-4">
          <button
            onClick={onLogout}
            className="flex items-center justify-center space-x-2 w-full p-3 bg-red-600/20 hover:bg-red-600/30 text-red-200 rounded-lg border border-red-600/30 transition-colors"
          >
            <FaSignOutAlt />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
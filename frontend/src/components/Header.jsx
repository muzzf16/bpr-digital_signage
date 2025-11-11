import React from 'react';
import { FaHome, FaBell, FaSearch } from 'react-icons/fa';

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

export default Header;

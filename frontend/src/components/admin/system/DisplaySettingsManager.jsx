import React, { useState, useEffect } from 'react';
import { FaCog, FaPalette, FaVolumeUp, FaClock, FaSun, FaSave, FaUndo } from 'react-icons/fa';
import { toast } from 'react-toastify';

const DisplaySettingsManager = () => {
  const [settings, setSettings] = useState({
    brightness: 100,
    contrast: 50,
    volume: 50,
    autoPlay: true,
    showClock: true,
    showWeather: false,
    slideDuration: 10,
    dateFormat: 'DD/MM/YYYY',
    timeFormat: '24h',
    theme: 'default',
    playlist: 'default',
    refreshInterval: 300
  });

  useEffect(() => {
    // Load existing settings (currently using defaults)
    // In a real implementation, you would fetch this from the API
    loadSettings();
  }, []);

  const loadSettings = () => {
    // For now, we're using default settings
    // In a real implementation, fetch settings from backend API
    toast.info('Loading display settings...');
  };

  const saveSettings = () => {
    // In a real implementation, send settings to the backend API
    console.log('Saving display settings:', settings);
    toast.success('Display settings saved successfully!');
  };

  const resetSettings = () => {
    setSettings({
      brightness: 100,
      contrast: 50,
      volume: 50,
      autoPlay: true,
      showClock: true,
      showWeather: false,
      slideDuration: 10,
      dateFormat: 'DD/MM/YYYY',
      timeFormat: '24h',
      theme: 'default',
      playlist: 'default',
      refreshInterval: 300
    });
    toast.info('Settings reset to default values');
  };

  const updateSetting = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const parsedValue = type === 'checkbox' ? checked : type === 'number' ? parseFloat(value) : value;
    updateSetting(name, parsedValue);
  };

  return (
    <div className="glass-card">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <div>
          <h3 className="card-title flex items-center gap-2">
            <FaCog className="text-cyan-400" /> Display Settings Management
          </h3>
          <p className="card-sub">Configure display settings for digital signage</p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={resetSettings}
            className="btn btn-secondary flex items-center space-x-2"
          >
            <FaUndo /> <span>Reset</span>
          </button>
          <button
            onClick={saveSettings}
            className="btn btn-primary flex items-center space-x-2"
          >
            <FaSave /> <span>Save Settings</span>
          </button>
        </div>
      </div>

      <div className="admin-grid gap-6 mb-8">
        {/* Visual Settings - 6 columns */}
        <div className="col-6">
          <div className="bg-gradient-to-br from-cyan-900/40 to-cyan-800/30 p-6 rounded-xl border border-cyan-700/30">
            <h4 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <FaPalette className="text-cyan-400" /> Visual Settings
            </h4>

            <div className="space-y-5">
              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-cyan-200">Brightness: {settings.brightness}%</label>
                </div>
                <div className="flex items-center gap-3">
                  <FaSun className="text-yellow-400" />
                  <input
                    type="range"
                    name="brightness"
                    min="0"
                    max="100"
                    value={settings.brightness}
                    onChange={handleInputChange}
                    className="w-full h-2 bg-cyan-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                  />
                  <FaSun className="text-yellow-600" />
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-cyan-200">Contrast: {settings.contrast}%</label>
                </div>
                <input
                  type="range"
                  name="contrast"
                  min="0"
                  max="100"
                  value={settings.contrast}
                  onChange={handleInputChange}
                  className="w-full h-2 bg-cyan-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                />
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-cyan-200">Volume: {settings.volume}%</label>
                </div>
                <div className="flex items-center gap-3">
                  <FaVolumeUp className="text-cyan-400" />
                  <input
                    type="range"
                    name="volume"
                    min="0"
                    max="100"
                    value={settings.volume}
                    onChange={handleInputChange}
                    className="w-full h-2 bg-cyan-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                  />
                </div>
              </div>

              <div>
                <label className="label mb-2 block">Slide Duration (seconds)</label>
                <input
                  type="number"
                  name="slideDuration"
                  min="5"
                  max="60"
                  value={settings.slideDuration}
                  onChange={handleInputChange}
                  className="input"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Content Settings - 6 columns */}
        <div className="col-6">
          <div className="bg-gradient-to-br from-cyan-900/40 to-cyan-800/30 p-6 rounded-xl border border-cyan-700/30">
            <h4 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <FaClock className="text-cyan-400" /> Content & Display Settings
            </h4>

            <div className="space-y-5">
              <div>
                <label className="label mb-2 block">Theme</label>
                <select
                  name="theme"
                  value={settings.theme}
                  onChange={handleInputChange}
                  className="input"
                >
                  <option value="default">Default Theme</option>
                  <option value="modern">Modern Theme</option>
                  <option value="minimal">Minimal Theme</option>
                  <option value="business">Business Theme</option>
                </select>
              </div>

              <div>
                <label className="label mb-2 block">Playlist</label>
                <select
                  name="playlist"
                  value={settings.playlist}
                  onChange={handleInputChange}
                  className="input"
                >
                  <option value="default">Default Playlist</option>
                  <option value="morning">Morning Playlist</option>
                  <option value="afternoon">Afternoon Playlist</option>
                  <option value="evening">Evening Playlist</option>
                </select>
              </div>

              <div>
                <label className="label mb-2 block">Date Format</label>
                <select
                  name="dateFormat"
                  value={settings.dateFormat}
                  onChange={handleInputChange}
                  className="input"
                >
                  <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                  <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                  <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                  <option value="DD MMM YYYY">DD MMM YYYY</option>
                </select>
              </div>

              <div>
                <label className="label mb-2 block">Time Format</label>
                <select
                  name="timeFormat"
                  value={settings.timeFormat}
                  onChange={handleInputChange}
                  className="input"
                >
                  <option value="24h">24 Hour</option>
                  <option value="12h">12 Hour</option>
                </select>
              </div>

              <div className="flex items-center justify-between py-2">
                <label className="text-cyan-200">Auto Play Content</label>
                <div className="relative inline-block w-12 h-6">
                  <input
                    type="checkbox"
                    name="autoPlay"
                    checked={settings.autoPlay}
                    onChange={handleInputChange}
                    className="opacity-0 w-0 h-0 peer"
                  />
                  <span className={`absolute top-0 left-0 right-0 bottom-0 rounded-full transition-colors duration-300 ${
                    settings.autoPlay ? 'bg-cyan-600' : 'bg-gray-600'
                  }`}></span>
                  <span className={`absolute top-1 w-4 h-4 rounded-full transition-transform duration-300 ${
                    settings.autoPlay ? 'left-7 bg-white' : 'left-1 bg-gray-300'
                  }`}></span>
                </div>
              </div>

              <div className="flex items-center justify-between py-2">
                <label className="text-cyan-200">Show Clock</label>
                <div className="relative inline-block w-12 h-6">
                  <input
                    type="checkbox"
                    name="showClock"
                    checked={settings.showClock}
                    onChange={handleInputChange}
                    className="opacity-0 w-0 h-0 peer"
                  />
                  <span className={`absolute top-0 left-0 right-0 bottom-0 rounded-full transition-colors duration-300 ${
                    settings.showClock ? 'bg-cyan-600' : 'bg-gray-600'
                  }`}></span>
                  <span className={`absolute top-1 w-4 h-4 rounded-full transition-transform duration-300 ${
                    settings.showClock ? 'left-7 bg-white' : 'left-1 bg-gray-300'
                  }`}></span>
                </div>
              </div>

              <div className="flex items-center justify-between py-2">
                <label className="text-cyan-200">Show Weather</label>
                <div className="relative inline-block w-12 h-6">
                  <input
                    type="checkbox"
                    name="showWeather"
                    checked={settings.showWeather}
                    onChange={handleInputChange}
                    className="opacity-0 w-0 h-0 peer"
                  />
                  <span className={`absolute top-0 left-0 right-0 bottom-0 rounded-full transition-colors duration-300 ${
                    settings.showWeather ? 'bg-cyan-600' : 'bg-gray-600'
                  }`}></span>
                  <span className={`absolute top-1 w-4 h-4 rounded-full transition-transform duration-300 ${
                    settings.showWeather ? 'left-7 bg-white' : 'left-1 bg-gray-300'
                  }`}></span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DisplaySettingsManager;
import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function DisplaySettingsManager() {
  const [settings, setSettings] = useState({
    brightness: 100,
    contrast: 50,
    volume: 50,
    autoPlay: true,
    showClock: true,
    showWeather: false,
    slideDuration: 10,
    dateFormat: 'DD/MM/YYYY',
    timeFormat: '24h'
  });

  useEffect(() => {
    // Load existing settings (currently using defaults)
    // In a real implementation, you would fetch this from the API
    loadSettings();
  }, []);

  const loadSettings = () => {
    // For now, we're using default settings
    // In a real implementation, fetch settings from backend API
    console.log('Loading display settings');
  };

  const saveSettings = () => {
    // In a real implementation, send settings to the backend API
    console.log('Saving display settings:', settings);
    alert('Settings saved successfully!');
  };

  const updateSetting = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  return (
    <div>
      <h2>Display Settings Manager</h2>
      <div className="display-settings-form">
        <div className="form-group">
          <label>Brightness:</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <input
              type="range"
              min="0"
              max="100"
              value={settings.brightness}
              onChange={(e) => updateSetting('brightness', parseInt(e.target.value))}
            />
            <span style={{ minWidth: '40px' }}>{settings.brightness}%</span>
          </div>
        </div>
        
        <div className="form-group">
          <label>Contrast:</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <input
              type="range"
              min="0"
              max="100"
              value={settings.contrast}
              onChange={(e) => updateSetting('contrast', parseInt(e.target.value))}
            />
            <span style={{ minWidth: '40px' }}>{settings.contrast}%</span>
          </div>
        </div>
        
        <div className="form-group">
          <label>Volume:</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <input
              type="range"
              min="0"
              max="100"
              value={settings.volume}
              onChange={(e) => updateSetting('volume', parseInt(e.target.value))}
            />
            <span style={{ minWidth: '40px' }}>{settings.volume}%</span>
          </div>
        </div>
        
        <div className="form-group">
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <input
              type="checkbox"
              checked={settings.autoPlay}
              onChange={(e) => updateSetting('autoPlay', e.target.checked)}
            />
            Auto Play Content
          </label>
        </div>
        
        <div className="form-group">
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <input
              type="checkbox"
              checked={settings.showClock}
              onChange={(e) => updateSetting('showClock', e.target.checked)}
            />
            Show Clock
          </label>
        </div>
        
        <div className="form-group">
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <input
              type="checkbox"
              checked={settings.showWeather}
              onChange={(e) => updateSetting('showWeather', e.target.checked)}
            />
            Show Weather
          </label>
        </div>
        
        <div className="form-group">
          <label>Slide Duration (seconds):</label>
          <input
            type="number"
            min="1"
            max="60"
            value={settings.slideDuration}
            onChange={(e) => updateSetting('slideDuration', parseInt(e.target.value))}
          />
        </div>
        
        <div className="form-group">
          <label>Date Format:</label>
          <select
            value={settings.dateFormat}
            onChange={(e) => updateSetting('dateFormat', e.target.value)}
          >
            <option value="DD/MM/YYYY">DD/MM/YYYY</option>
            <option value="MM/DD/YYYY">MM/DD/YYYY</option>
            <option value="YYYY-MM-DD">YYYY-MM-DD</option>
          </select>
        </div>
        
        <div className="form-group">
          <label>Time Format:</label>
          <select
            value={settings.timeFormat}
            onChange={(e) => updateSetting('timeFormat', e.target.value)}
          >
            <option value="12h">12-hour</option>
            <option value="24h">24-hour</option>
          </select>
        </div>
        
        <button onClick={saveSettings} style={{ marginTop: '20px', padding: '12px 24px', fontSize: '1rem' }}>Save Settings</button>
      </div>
    </div>
  );
}
import React from 'react';
import PlaylistManager from './PlaylistManager';
import RateManager from './RateManager';
import EconomicManager from './EconomicManager';
import DisplaySettingsManager from './DisplaySettingsManager';
import DeviceManager from './DeviceManager';
import ContentManager from './ContentManager';
import NewsManager from './NewsManager';
import './dashboard-styles.css';

export default function Dashboard() {
  return (
    <div style={{ padding: '20px', fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif' }}>
      <h1>Admin Dashboard</h1>
      <p style={{ color: '#34495e', fontSize: '1.1rem', marginBottom: '25px' }}>
        Welcome to the admin dashboard. Here you can manage all aspects of your digital signage system.
      </p>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '20px', marginTop: '20px' }}>
        <div style={{ border: '1px solid #ddd', padding: '20px', borderRadius: '8px' }}>
          <PlaylistManager />
        </div>
        
        <div style={{ border: '1px solid #ddd', padding: '20px', borderRadius: '8px' }}>
          <RateManager />
        </div>
        
        <div style={{ border: '1px solid #ddd', padding: '20px', borderRadius: '8px' }}>
          <EconomicManager />
        </div>
        
        <div style={{ border: '1px solid #ddd', padding: '20px', borderRadius: '8px' }}>
          <DisplaySettingsManager />
        </div>
        
        <div style={{ border: '1px solid #ddd', padding: '20px', borderRadius: '8px', gridColumn: '1 / -1' }}>
          <DeviceManager />
        </div>
        
        <div style={{ border: '1px solid #ddd', padding: '20px', borderRadius: '8px', gridColumn: '1 / -1' }}>
          <ContentManager />
        </div>
        
        <div style={{ border: '1px solid #ddd', padding: '20px', borderRadius: '8px', gridColumn: '1 / -1' }}>
          <NewsManager />
        </div>
      </div>
    </div>
  );
}

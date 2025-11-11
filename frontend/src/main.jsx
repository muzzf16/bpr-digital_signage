import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { EconomicProvider } from './context/EconomicContext';

createRoot(document.getElementById('root')).render(
  <EconomicProvider apiKey="secret_dev_key" refreshIntervalMs={60 * 60 * 1000}>
    <App />
  </EconomicProvider>
);

import React from 'react';
import useSWR from 'swr';
import axios from 'axios';

// Constants
const REFRESH_INTERVAL = 30 * 60 * 1000; // 30 minutes
const API_KEY = import.meta.env.VITE_API_KEY || 'secret_dev_key';

const fetcher = async (url) => {
  try {
    const res = await axios.get(url);
    return res.data;
  } catch (error) {
    const newError = new Error('An error occurred while fetching the data.');
    newError.info = error.response?.data;
    newError.status = error.response?.status;
    throw newError;
  }
};

export default function RatePanel({ productId, fallback }) {
  const { data, error } = useSWR(
    productId ? `/api/rates/${encodeURIComponent(productId)}?api_key=${API_KEY}` : null,
    fetcher,
    {
      refreshInterval: REFRESH_INTERVAL,
      fallbackData: fallback ? { rate: fallback } : undefined,
    }
  );

  const rate = data?.rate;
  const loading = !data && !error;

  // Sample interest rate summary - in a real implementation this would come from an API
  // This is for demonstration purposes when we don't have specific product data
  const rateSummary = {
    tabungan: '0.00',
    deposito: '6.85',
    kredit: '8.50'
  };

  if (loading && !rate) {
    // Loading state - skeleton loading bars
    return (
      <div className="rate-panel rate-panel-loading" role="region" aria-label="Loading interest rates">
        <div className="rate-panel-header">
          Suku Bunga Terbaru
        </div>
        <div className="rate-panel-content">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="rate-panel-row">
              <div className="pulse" style={{ width: '50%', height: '0.8rem', borderRadius: '0.4rem' }} />
              <div className="pulse" style={{ width: '30%', height: '0.8rem', borderRadius: '0.4rem' }} />
            </div>
          ))}
        </div>
        <div className="rate-panel-footer">
          Memuat...
        </div>
      </div>
    );
  }

  return (
    <div className="rate-panel" role="region" aria-label="Ringkasan suku bunga">
      <div className="rate-panel-header">
        Suku Bunga Terbaru
      </div>
      <div className="rate-panel-content">
        <div className="rate-panel-row">
          <span className="rate-panel-label">Tabungan:</span>
          <span className="rate-panel-value">{rateSummary.tabungan}%</span>
        </div>
        <div className="rate-panel-row">
          <span className="rate-panel-label">Deposito:</span>
          <span className="rate-panel-value">{rateSummary.deposito}%</span>
        </div>
        <div className="rate-panel-row">
          <span className="rate-panel-label">Kredit:</span>
          <span className="rate-panel-value">{rateSummary.kredit}%</span>
        </div>
      </div>
      <div className="rate-panel-footer">
        Berlaku hingga: Nov 2025
      </div>
    </div>
  );
}
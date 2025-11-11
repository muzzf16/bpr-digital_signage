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

  if (loading && !rate) {
    return (
      <div className="rate-panel">
        <div style={{ opacity: 0.85 }}>Memuat suku bunga...</div>
      </div>
    );
  }

  // Extract rate data with fallbacks
  const interest = rate?.interestRate ?? 0;
  const productName = rate?.productName || "Produk Tabungan";
  const displayUntil = rate?.displayUntil;

  return (
    <div className="rate-panel" role="region" aria-label={`Suku bunga ${productName}`}>
      <div className="rate-label">Tabungan</div>
      <div className="rate-value">
        {Number(interest).toLocaleString('id-ID', { maximumFractionDigits: 2 })}%
      </div>
      <div style={{ 
        marginTop: "0.6em", 
        fontSize: "clamp(0.9rem,1.2vw,1.2rem)", 
        color: "rgba(255,255,255,0.9)" 
      }}>
        Berlaku hingga: {displayUntil 
          ? new Date(displayUntil).toLocaleDateString('id-ID', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            }) 
          : '-'}
      </div>
    </div>
  );
}

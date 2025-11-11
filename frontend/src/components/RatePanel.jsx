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
    // Loading state - showing a small progress bar instead of text
    return (
      <div className="rate-panel" style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        height: '100%',
        alignItems: 'center',
        color: '#f5faff'
      }}>
        <div style={{ 
          fontSize: 'clamp(0.9rem, 1.4vw, 1.1rem)',
          marginBottom: '0.5vh'
        }}>
          Memuat suku bunga...
        </div>
        {/* Small loading animation */}
        <div style={{
          width: '60%',
          height: '4px',
          backgroundColor: 'rgba(255,255,255,0.2)',
          borderRadius: '2px',
          overflow: 'hidden'
        }}>
          <div style={{
            width: '30%',
            height: '100%',
            backgroundColor: '#50c878',
            animation: 'loading 1.5s infinite ease-in-out'
          }}></div>
        </div>
        <style>{`
          @keyframes loading {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(300%); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="rate-panel" role="region" aria-label="Ringkasan suku bunga" style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      height: '100%',
      color: '#f5faff',
      textAlign: 'center'
    }}>
      <div style={{
        fontSize: 'clamp(0.7rem, 1vw, 0.8rem)',
        fontWeight: '600',
        opacity: 0.85,
        marginBottom: '0.4vh'
      }}>
        Suku Bunga Terbaru
      </div>
      <div style={{
        fontSize: 'clamp(0.65rem, 0.9vw, 0.75rem)',
        lineHeight: '1.4',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.2vh'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.1vh 0' }}>
          <span style={{ opacity: 0.9 }}>Tabungan:</span>
          <span style={{ fontWeight: '700', color: '#50c878' }}>{rateSummary.tabungan}%</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.1vh 0' }}>
          <span style={{ opacity: 0.9 }}>Deposito:</span>
          <span style={{ fontWeight: '700', color: '#50c878' }}>{rateSummary.deposito}%</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.1vh 0' }}>
          <span style={{ opacity: 0.9 }}>Kredit:</span>
          <span style={{ fontWeight: '700', color: '#50c878' }}>{rateSummary.kredit}%</span>
        </div>
      </div>
      <div style={{
        fontSize: 'clamp(0.5rem, 0.7vw, 0.6rem)',
        opacity: 0.6,
        textAlign: 'center',
        marginTop: '0.4vh',
        paddingTop: '0.3vh',
        borderTop: '1px solid rgba(255,255,255,0.2)'
      }}>
        Berlaku hingga: Nov 2025
      </div>
    </div>
  );
}
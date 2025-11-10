import React, { useEffect, useState, useCallback } from "react";

// Constants
const REFRESH_INTERVAL = 30 * 60 * 1000; // 30 minutes
const API_KEY = "secret_dev_key";

export default function RatePanel({ productId, fallback }) {
  const [rate, setRate] = useState(fallback || null);
  const [loading, setLoading] = useState(!fallback);

  // Fetch rate data
  const fetchRate = useCallback(async () => {
    if (!productId) return;
    
    try {
      setLoading(true);
      const res = await fetch(`/api/rates/${encodeURIComponent(productId)}?api_key=${API_KEY}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const j = await res.json();
      setRate(j.rate);
    } catch (e) {
      console.error("Error fetching rate:", e);
    } finally {
      setLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    let mounted = true;

    if (productId) {
      fetchRate();
      
      // Set up refresh interval
      const intervalId = setInterval(() => {
        if (mounted) {
          fetchRate();
        }
      }, REFRESH_INTERVAL);

      return () => {
        mounted = false;
        clearInterval(intervalId);
      };
    } else {
      setLoading(false);
    }
  }, [productId, fetchRate]);

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

import React from "react";
import { useEconomicData } from "../context/EconomicContext";

// Format number with Indonesian locale
const formatNumber = (value) => {
  if (!value && value !== 0) return '0';
  return Number(value).toLocaleString('id-ID');
};

export default function EconPanel() {
  const { data, loading } = useEconomicData();

  if (loading && !data) {
    return <div className="econ-panel">Memuat info ekonomi...</div>;
  }

  // Extract data with fallbacks
  const usdRate = data?.currencyRates?.USD || 0;
  const sgdRate = data?.currencyRates?.SGD || 0;
  const goldPrice = data?.goldPrice?.gram || 0;
  const ihsgValue = data?.stockIndex?.price || '-';

  return (
    <div className="econ-panel" role="region" aria-label="Informasi ekonomi">
      <div className="econ-row">
        <div className="label">USD</div>
        <div className="value">Rp {formatNumber(usdRate)}</div>
      </div>
      <div className="econ-row">
        <div className="label">SGD</div>
        <div className="value">Rp {formatNumber(sgdRate)}</div>
      </div>
      <div className="econ-row">
        <div className="label">Emas / gram</div>
        <div className="value">Rp {formatNumber(goldPrice)}</div>
      </div>
      <div className="econ-row">
        <div className="label">IHSG</div>
        <div className="value">{ihsgValue}</div>
      </div>
      <div style={{ 
        marginTop: 8, 
        fontSize: '0.9rem', 
        color: 'rgba(255,255,255,0.85)' 
      }}>
        {data?.updatedAt ? `Update: ${new Date(data.updatedAt).toLocaleString()}` : ''}
      </div>
    </div>
  );
}

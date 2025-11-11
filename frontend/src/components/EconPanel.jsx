import React from "react";
import { useEconomicData } from "../context/EconomicContext";

// Get trend indicator based on change value
const getTrendIndicator = (change) => {
  if (!change) return '';

  // Check if change is a percentage string (e.g., "+0.34%")
  if (typeof change === 'string') {
    const numericValue = parseFloat(change.replace(/[^\d.-]/g, ''));
    if (isNaN(numericValue)) return '';

    if (numericValue > 0) {
      return { indicator: '▲', color: '#4caf50' }; // Green for positive
    } else if (numericValue < 0) {
      return { indicator: '▼', color: '#e74c3c' }; // Red for negative
    }
  }

  // For numeric values
  if (change > 0) {
    return { indicator: '▲', color: '#4caf50' }; // Green for positive
  } else if (change < 0) {
    return { indicator: '▼', color: '#e74c3c' }; // Red for negative
  }

  return { indicator: '', color: '#ffffff' }; // No indicator for zero
};

// Format number with Indonesian locale
const formatNumber = (value) => {
  if (!value && value !== 0) return '0';
  return Number(value).toLocaleString('id-ID');
};

export default function EconPanel() {
  const { data, loading } = useEconomicData();

  if (loading && !data) {
    return <div className="econ-panel" style={{ 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      height: '100%',
      color: '#f5faff',
      fontSize: 'clamp(0.9rem, 1.5vw, 1.1rem)'
    }}>
      Memuat info ekonomi...
    </div>;
  }

  // Extract data with fallbacks
  const usdRate = data?.currencyRates?.USD || 0;
  const sgdRate = data?.currencyRates?.SGD || 0;
  const goldPrice = data?.goldPrice?.gram;
  const ihsgValue = data?.stockIndex?.price;
  const ihsgChange = data?.stockIndex?.change; // Assuming this is in format like "+0.34%" or "-0.12%"

  // Get trend indicators
  const ihsgTrend = getTrendIndicator(ihsgChange);

  return (
    <div className="econ-panel" role="region" aria-label="Informasi ekonomi" style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-around',
      height: '100%',
      color: '#f5faff'
    }}>
      <div className="econ-row" style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0.3vh 0',
        borderBottom: '1px solid rgba(255,255,255,0.1)'
      }}>
        <div className="label" style={{ color: 'rgba(255,255,255,0.7)', fontSize: 'clamp(0.8rem, 1.2vw, 1rem)' }}>USD</div>
        <div className="value" style={{ fontWeight: '700', fontSize: 'clamp(0.9rem, 1.3vw, 1.1rem)', color: '#29b6f6' }}>Rp {formatNumber(usdRate)}</div>
      </div>
      <div className="econ-row" style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0.3vh 0',
        borderBottom: '1px solid rgba(255,255,255,0.1)'
      }}>
        <div className="label" style={{ color: 'rgba(255,255,255,0.7)', fontSize: 'clamp(0.8rem, 1.2vw, 1rem)' }}>SGD</div>
        <div className="value" style={{ fontWeight: '700', fontSize: 'clamp(0.9rem, 1.3vw, 1.1rem)', color: '#29b6f6' }}>Rp {formatNumber(sgdRate)}</div>
      </div>
      <div className="econ-row" style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0.3vh 0',
        borderBottom: '1px solid rgba(255,255,255,0.1)'
      }}>
        <div className="label" style={{ color: 'rgba(255,255,255,0.7)', fontSize: 'clamp(0.8rem, 1.2vw, 1rem)' }}>Emas</div>
        <div className="value" style={{ fontWeight: '700', fontSize: 'clamp(0.9rem, 1.3vw, 1.1rem)', color: '#ffd166' }}>{goldPrice ? `Rp ${formatNumber(goldPrice)}` : 'N/A'}</div>
      </div>
      <div className="econ-row" style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0.3vh 0'
      }}>
        <div className="label" style={{ color: 'rgba(255,255,255,0.7)', fontSize: 'clamp(0.8rem, 1.2vw, 1rem)' }}>IHSG</div>
        <div className="value" style={{ fontWeight: '700', fontSize: 'clamp(0.9rem, 1.3vw, 1.1rem)', display: 'flex', alignItems: 'center', color: '#4caf50' }}>
          <span>{ihsgValue !== undefined && ihsgValue !== null ? formatNumber(ihsgValue) : 'N/A'}</span>
          {ihsgTrend.indicator && (
            <span style={{
              marginLeft: '6px',
              color: ihsgTrend.color,
              fontSize: '0.8em'
            }}>
              {ihsgTrend.indicator} {ihsgChange}
            </span>
          )}
        </div>
      </div>
      <div style={{
        marginTop: '0.8vh',
        fontSize: '0.7rem',
        color: 'rgba(255,255,255,0.65)',
        textAlign: 'right'
      }}>
        {data?.updatedAt ? `Update: ${new Date(data.updatedAt).toLocaleString()}` : ''}
      </div>
    </div>
  );
}
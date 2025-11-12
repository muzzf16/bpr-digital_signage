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
    return <div className="econ-panel econ-panel-loading">
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
    <div className="econ-panel econ-panel-container" role="region" aria-label="Informasi ekonomi">
      <div className="econ-row">
        <div className="econ-label">USD</div>
        <div className="econ-value" style={{ color: '#29b6f6' }}>Rp {formatNumber(usdRate)}</div>
      </div>
      <div className="econ-row">
        <div className="econ-label">SGD</div>
        <div className="econ-value" style={{ color: '#29b6f6' }}>Rp {formatNumber(sgdRate)}</div>
      </div>
      <div className="econ-row">
        <div className="econ-label">Emas</div>
        <div className="econ-value" style={{ color: '#ffd166' }}>{goldPrice ? `Rp ${formatNumber(goldPrice)}` : 'N/A'}</div>
      </div>
      <div className="econ-row">
        <div className="econ-label">IHSG</div>
        <div className="econ-value" style={{ color: '#4caf50' }}>
          <span>{ihsgValue !== undefined && ihsgValue !== null ? formatNumber(ihsgValue) : 'N/A'}</span>
          {ihsgTrend.indicator && (
            <span className="econ-trend" style={{ color: ihsgTrend.color }}>
              {ihsgTrend.indicator} {ihsgChange}
            </span>
          )}
        </div>
      </div>
      <div className="econ-updated-at">
        {data?.updatedAt ? `Update: ${new Date(data.updatedAt).toLocaleString()}` : ''}
      </div>
    </div>
  );
}
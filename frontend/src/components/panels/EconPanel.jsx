import React from "react";
import PropTypes from 'prop-types';
import { useEconomicData } from "../../context/EconomicContext";
import { formatNumber, getTrendIndicator } from "../../utils/common";

const CurrencyRow = ({ label, value, color = '#29b6f6' }) => (
  <div className="econ-row flex justify-between items-center py-1 border-b border-gray-700 last:border-0">
    <span className="econ-label text-gray-300 font-medium">{label}</span>
    <span className="econ-value font-semibold" style={{ color }}>
      {value}
    </span>
  </div>
);

const TrendValue = ({ value, change, color = '#4caf50' }) => {
  const trend = getTrendIndicator(change);
  return (
    <div className="flex flex-col">
      <span className="font-semibold" style={{ color }}>{value}</span>
      {trend.indicator && (
        <span className="text-xs flex items-center gap-1 mt-1" style={{ color: trend.color }}>
          <span>{trend.indicator}</span>
          <span>{change}</span>
        </span>
      )}
    </div>
  );
};

TrendValue.propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  change: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  color: PropTypes.string
};

CurrencyRow.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  color: PropTypes.string
};

const EconPanel = ({ className = "" }) => {
  const { data, loading } = useEconomicData();

  if (loading && !data) {
    return (
      <div className={`econ-panel econ-panel-loading bg-gray-800/30 backdrop-blur-sm rounded-lg p-4 ${className}`}
           role="status"
           aria-label="Memuat informasi ekonomi">
        <div className="text-center text-gray-300">Memuat info ekonomi...</div>
      </div>
    );
  }

  // Extract data with fallbacks
  const usdRate = data?.currencyRates?.USD;
  const sgdRate = data?.currencyRates?.SGD;
  const goldPrice = data?.goldPrice?.gram;
  const ihsgValue = data?.stockIndex?.price;
  const ihsgChange = data?.stockIndex?.change;

  return (
    <div className={`econ-panel econ-panel-container bg-gray-800/30 backdrop-blur-sm rounded-lg p-4 ${className}`}
         role="region"
         aria-label="Informasi ekonomi">
      <div className="econ-panel-content">
        <CurrencyRow
          label="USD"
          value={`Rp ${formatNumber(usdRate)}`}
          color="#29b6f6"
        />

        <CurrencyRow
          label="SGD"
          value={`Rp ${formatNumber(sgdRate)}`}
          color="#29b6f6"
        />

        <CurrencyRow
          label="Emas"
          value={goldPrice ? `Rp ${formatNumber(goldPrice)}` : 'N/A'}
          color="#ffd166"
        />

        <div className="econ-row flex justify-between items-center py-1 border-b border-gray-700 last:border-0">
          <span className="econ-label text-gray-300 font-medium">IHSG</span>
          <TrendValue
            value={ihsgValue !== undefined && ihsgValue !== null ? formatNumber(ihsgValue) : 'N/A'}
            change={ihsgChange}
            color="#4caf50"
          />
        </div>
      </div>

      {data?.updatedAt && (
        <div className="econ-updated-at text-xs text-gray-400 mt-3 pt-2 border-t border-gray-700 text-right">
          Update: {new Date(data.updatedAt).toLocaleString('id-ID')}
        </div>
      )}
    </div>
  );
};

EconPanel.propTypes = {
  className: PropTypes.string
};

export default EconPanel;
// src/components/player/RightColumnSubComponents.jsx
// Sub-components for RightColumn to be used in the refactored Player layout

import React from 'react';
import { LazyProductHighlight, LazyNewsPanel, LazyEconPanel, LazyMiniChart } from '../panels';

// Overview component (for product highlights)
export const Overview = ({ economicData }) => {
  return (
    <div className="overview-module">
      <LazyProductHighlight />
    </div>
  );
};

// Currency component (for currency rates)
export const Currency = ({ economicData }) => {
  return (
    <div className="currency-module">
      <LazyEconPanel />
    </div>
  );
};

// NewsPanel component
export const NewsPanel = ({ economicData }) => {
  return (
    <div className="news-panel-module">
      <LazyNewsPanel />
    </div>
  );
};

// MiniChart component
export const MiniChart = ({ id, type = "line", data, title, currentValue, period }) => {
  // Use default data if not provided
  const chartData = data || [7120, 7135, 7150, 7145, 7160, 7155, 7165];
  const chartTitle = title || "IHSG";
  const chartValue = currentValue || "7,165.00 ▲ +0.12%";
  const chartPeriod = period || "7 hari";

  return (
    <div className="mini-chart-module">
      <LazyMiniChart
        type={type}
        data={chartData}
        title={chartTitle}
        currentValue={chartValue}
        period={chartPeriod}
      />
    </div>
  );
};
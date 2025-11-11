import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function EconomicManager() {
  const [economicData, setEconomicData] = useState({
    currencyRates: { USD: 0, SGD: 0, JPY: 0 },
    goldPrice: { gram: 0 },
    stockIndex: { IHSG: 0 }
  });

  useEffect(() => {
    fetchEconomicData();
  }, []);

  const fetchEconomicData = () => {
    axios.get('/api/economic')
      .then(res => {
        if (res.data.success) {
          setEconomicData(res.data.data);
        }
      })
      .catch(err => {
        console.error('Error fetching economic data:', err);
      });
  };

  const updateEconomicData = (type, value) => {
    const updatedData = { ...economicData };
    if (type === 'USD') {
      updatedData.currencyRates = { ...updatedData.currencyRates, USD: parseFloat(value) };
    } else if (type === 'SGD') {
      updatedData.currencyRates = { ...updatedData.currencyRates, SGD: parseFloat(value) };
    } else if (type === 'JPY') {
      updatedData.currencyRates = { ...updatedData.currencyRates, JPY: parseFloat(value) };
    } else if (type === 'goldPrice') {
      updatedData.goldPrice = { ...updatedData.goldPrice, gram: parseFloat(value) };
    } else if (type === 'IHSG') {
      updatedData.stockIndex = { ...updatedData.stockIndex, IHSG: parseFloat(value) };
    }

    setEconomicData(updatedData);
  };

  return (
    <div>
      <h2>Economic Data Manager</h2>
      <div className="economic-form" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
        <div className="form-group">
          <label>USD Rate:</label>
          <input
            type="number"
            value={economicData.currencyRates.USD}
            onChange={(e) => updateEconomicData('USD', e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>SGD Rate:</label>
          <input
            type="number"
            value={economicData.currencyRates.SGD}
            onChange={(e) => updateEconomicData('SGD', e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>JPY Rate:</label>
          <input
            type="number"
            value={economicData.currencyRates.JPY}
            onChange={(e) => updateEconomicData('JPY', e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Gold Price (per gram):</label>
          <input
            type="number"
            value={economicData.goldPrice.gram}
            onChange={(e) => updateEconomicData('goldPrice', e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>IHSG:</label>
          <input
            type="number"
            value={economicData.stockIndex.IHSG}
            onChange={(e) => updateEconomicData('IHSG', e.target.value)}
          />
        </div>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-end' }}>
          <button onClick={fetchEconomicData}>Refresh Data</button>
        </div>
      </div>
    </div>
  );
}
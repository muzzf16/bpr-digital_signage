import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function RateManager() {
  const [rates, setRates] = useState([]);
  const [newRate, setNewRate] = useState({
    productName: '',
    interestRate: 0,
    currency: 'IDR',
    effectiveDate: new Date().toISOString().split('T')[0],
    displayUntil: '',
    terms: ''
  });
  const [editingRate, setEditingRate] = useState(null);

  useEffect(() => {
    loadRates();
  }, []);

  const loadRates = () => {
    // In a real implementation, this would fetch from the backend API
    // For now, we'll simulate with mock data
    setRates([
      {
        id: 'tabungan-simapanas',
        productName: 'Tabungan Simapanas',
        interestRate: 4.25,
        currency: 'IDR',
        effectiveDate: '2025-01-01',
        displayUntil: '2025-12-31',
        terms: 'Bunga dihitung saldo rata-rata harian'
      },
      {
        id: 'kpr-special',
        productName: 'KPR Special',
        interestRate: 6.5,
        currency: 'IDR',
        effectiveDate: '2025-01-01',
        displayUntil: '2025-12-31',
        terms: 'Fixed rate untuk 5 tahun pertama'
      }
    ]);
  };

  const addRate = () => {
    if (!newRate.productName || newRate.interestRate === undefined) {
      alert('Please provide product name and interest rate');
      return;
    }
    
    const rateToAdd = {
      id: newRate.productName.toLowerCase().replace(/\s+/g, '-'),
      ...newRate,
      interestRate: parseFloat(newRate.interestRate)
    };
    
    setRates([...rates, rateToAdd]);
    setNewRate({
      productName: '',
      interestRate: 0,
      currency: 'IDR',
      effectiveDate: new Date().toISOString().split('T')[0],
      displayUntil: '',
      terms: ''
    });
  };

  const updateRate = () => {
    if (!editingRate.productName || editingRate.interestRate === undefined) {
      alert('Please provide product name and interest rate');
      return;
    }
    
    const updatedRates = rates.map(rate => 
      rate.id === editingRate.id ? editingRate : rate
    );
    
    setRates(updatedRates);
    setEditingRate(null);
  };

  const deleteRate = (id) => {
    if (window.confirm('Are you sure you want to delete this rate?')) {
      setRates(rates.filter(rate => rate.id !== id));
    }
  };

  const startEditing = (rate) => {
    setEditingRate({ ...rate });
  };

  const cancelEditing = () => {
    setEditingRate(null);
  };

  return (
    <div>
      <h2>Rate Manager</h2>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '20px', marginTop: '20px' }}>
        {/* Add New Rate */}
        <div style={{ border: '1px solid #ddd', padding: '20px', borderRadius: '8px' }}>
          <h3>Add New Rate</h3>
          <div className="form-group">
            <label>Product Name:</label>
            <input
              type="text"
              value={newRate.productName}
              onChange={(e) => setNewRate({...newRate, productName: e.target.value})}
              placeholder="e.g., Tabungan Simpanas"
            />
          </div>
          <div className="form-group">
            <label>Interest Rate (%):</label>
            <input
              type="number"
              step="0.01"
              value={newRate.interestRate}
              onChange={(e) => setNewRate({...newRate, interestRate: e.target.value})}
              placeholder="e.g., 4.25"
            />
          </div>
          <div className="form-group">
            <label>Currency:</label>
            <select
              value={newRate.currency}
              onChange={(e) => setNewRate({...newRate, currency: e.target.value})}
            >
              <option value="IDR">IDR (Indonesian Rupiah)</option>
              <option value="USD">USD (US Dollar)</option>
              <option value="SGD">SGD (Singapore Dollar)</option>
            </select>
          </div>
          <div className="form-group">
            <label>Effective Date:</label>
            <input
              type="date"
              value={newRate.effectiveDate}
              onChange={(e) => setNewRate({...newRate, effectiveDate: e.target.value})}
            />
          </div>
          <div className="form-group">
            <label>Display Until:</label>
            <input
              type="date"
              value={newRate.displayUntil}
              onChange={(e) => setNewRate({...newRate, displayUntil: e.target.value})}
            />
          </div>
          <div className="form-group">
            <label>Terms:</label>
            <textarea
              value={newRate.terms}
              onChange={(e) => setNewRate({...newRate, terms: e.target.value})}
              placeholder="Additional terms and conditions"
              rows="3"
            />
          </div>
          <button onClick={addRate}>Add Rate</button>
        </div>
        
        {/* Rate List */}
        <div style={{ border: '1px solid #ddd', padding: '20px', borderRadius: '8px' }}>
          <h3>Existing Rates</h3>
          <ul>
            {rates.map(rate => (
              <li key={rate.id} style={{ marginBottom: '15px', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
                {editingRate && editingRate.id === rate.id ? (
                  <div>
                    <div className="form-group">
                      <label>Product Name:</label>
                      <input
                        type="text"
                        value={editingRate.productName}
                        onChange={(e) => setEditingRate({...editingRate, productName: e.target.value})}
                      />
                    </div>
                    <div className="form-group">
                      <label>Interest Rate (%):</label>
                      <input
                        type="number"
                        step="0.01"
                        value={editingRate.interestRate}
                        onChange={(e) => setEditingRate({...editingRate, interestRate: parseFloat(e.target.value)})}
                      />
                    </div>
                    <div className="form-group">
                      <label>Currency:</label>
                      <select
                        value={editingRate.currency}
                        onChange={(e) => setEditingRate({...editingRate, currency: e.target.value})}
                      >
                        <option value="IDR">IDR</option>
                        <option value="USD">USD</option>
                        <option value="SGD">SGD</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Effective Date:</label>
                      <input
                        type="date"
                        value={editingRate.effectiveDate}
                        onChange={(e) => setEditingRate({...editingRate, effectiveDate: e.target.value})}
                      />
                    </div>
                    <div className="form-group">
                      <label>Display Until:</label>
                      <input
                        type="date"
                        value={editingRate.displayUntil}
                        onChange={(e) => setEditingRate({...editingRate, displayUntil: e.target.value})}
                      />
                    </div>
                    <div className="form-group">
                      <label>Terms:</label>
                      <textarea
                        value={editingRate.terms}
                        onChange={(e) => setEditingRate({...editingRate, terms: e.target.value})}
                        rows="2"
                      />
                    </div>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <button onClick={updateRate}>Save</button>
                      <button onClick={cancelEditing}>Cancel</button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <strong>{rate.productName}</strong> - {rate.interestRate}%
                    <div style={{ fontSize: '0.9em', color: '#666', marginTop: '5px' }}>
                      {rate.terms}
                    </div>
                    <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                      <button onClick={() => startEditing(rate)}>Edit</button>
                      <button onClick={() => deleteRate(rate.id)}>Delete</button>
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import RatePanel from './RatePanel';

const ProductHighlight = () => {
  const [currentProductIndex, setCurrentProductIndex] = useState(0);

  // Sample data - in a real implementation, this would come from an API
  const products = [
    { id: 1, title: 'Tabungan Simpanan', subtitle: 'Suku bunga', value: '8.5% p.a.', icon: '💰' },
    { id: 2, title: 'Deposito', subtitle: 'Tenor', value: '1–12 bulan', icon: '🏦' },
    { id: 3, title: 'Kredit Usaha', subtitle: 'Bunga spesial', value: 'Mulai 9.5%', icon: '💼' },
    { id: 4, title: 'Asuransi', subtitle: 'Perlindungan', value: 'Seumur hidup', icon: '🛡️' }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentProductIndex(prevIndex => (prevIndex + 1) % products.length);
    }, 10000); // Change every 10 seconds

    return () => clearInterval(interval);
  }, [products.length]);

  const currentProduct = products[currentProductIndex];

  return (
    <div className="product-highlight">
      <div className="product-highlight-header">
        Produk Unggulan
      </div>
      
      <div className="product-highlight-content">
        <div className="product-highlight-icon">
          {currentProduct.icon}
        </div>
        <h3 className="product-highlight-title">
          {currentProduct.title}
        </h3>
        <div className="product-highlight-subtitle">
          {currentProduct.subtitle}
        </div>
        <div className="product-highlight-value">
          {currentProduct.value}
        </div>
      </div>
      
      <div className="product-highlight-indicators">
        {products.map((_, idx) => (
          <div
            key={idx}
            className={`product-highlight-indicator ${idx === currentProductIndex ? 'product-highlight-indicator-active' : ''}`}
          />
        ))}
      </div>
      <RatePanel />
    </div>
  );
};

export default ProductHighlight;
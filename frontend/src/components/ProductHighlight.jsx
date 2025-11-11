import React, { useState, useEffect } from 'react';

const ProductHighlight = () => {
  const [currentProductIndex, setCurrentProductIndex] = useState(0);
  
  // Sample data - in a real implementation, this would come from an API
  const products = [
    { id: 1, title: 'Kredit Usaha Mikro', subtitle: 'Suku bunga mulai', value: '8.5% p.a.' },
    { id: 2, title: 'Deposito Berjangka', subtitle: 'Tenor fleksibel', value: '1–12 bulan' },
    { id: 3, title: 'Kredit Kendaraan', subtitle: 'Bunga spesial', value: 'November' },
    { id: 4, title: 'Asuransi Jiwa', subtitle: 'Perlindungan seumur hidup', value: 'Mulai Rp 100rb/bulan' }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentProductIndex(prevIndex => (prevIndex + 1) % products.length);
    }, 10000); // Change every 10 seconds

    return () => clearInterval(interval);
  }, [products.length]);

  const currentProduct = products[currentProductIndex];

  return (
    <div className="product-highlight" style={{
      background: 'linear-gradient(180deg, #073b68, #032b4f)',
      color: 'white',
      padding: '20px',
      borderRadius: '8px',
      boxShadow: '0 4px 16px rgba(0,0,0,0.35)',
      margin: '10px 0',
      minHeight: '120px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center'
    }}>
      <div style={{ marginBottom: '8px' }}>
        <h3 style={{ 
          margin: 0, 
          fontSize: 'clamp(1.1rem, 2.5vw, 1.5rem)',
          fontWeight: 600,
          color: '#f1c40f'
        }}>
          {currentProduct.title}
        </h3>
      </div>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        fontSize: 'clamp(0.9rem, 2vw, 1.1rem)'
      }}>
        <div>
          <div style={{ opacity: 0.9 }}>{currentProduct.subtitle}</div>
          <div style={{ 
            fontWeight: 'bold', 
            fontSize: 'clamp(1.1rem, 3vw, 1.4rem)',
            color: '#f1c40f',
            marginTop: '4px'
          }}>
            {currentProduct.value}
          </div>
        </div>
      </div>
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        marginTop: '10px'
      }}>
        {products.map((_, idx) => (
          <div
            key={idx}
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: idx === currentProductIndex ? '#f1c40f' : 'rgba(255,255,255,0.3)',
              margin: '0 4px'
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default ProductHighlight;
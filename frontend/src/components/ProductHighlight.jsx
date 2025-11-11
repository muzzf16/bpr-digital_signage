import React, { useState, useEffect } from 'react';

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
    <div className="product-highlight" style={{
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      color: '#f5faff'
    }}>
      <div style={{ 
        textAlign: 'center', 
        marginBottom: '0.8vh',
        fontSize: 'clamp(0.8rem, 1.2vw, 1rem)',
        opacity: 0.85
      }}>
        Produk Unggulan
      </div>
      
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        padding: '0.8vh 0'
      }}>
        <div style={{ fontSize: 'clamp(1.5rem, 3vw, 2.2rem)', marginBottom: '0.6vh' }}>
          {currentProduct.icon}
        </div>
        <h3 style={{
          margin: 0,
          fontSize: 'clamp(1rem, 1.8vw, 1.3rem)',
          fontWeight: 600,
          color: '#ffd166',
          marginBottom: '0.4vh'
        }}>
          {currentProduct.title}
        </h3>
        <div style={{ 
          fontSize: 'clamp(0.8rem, 1.2vw, 1rem)',
          marginBottom: '0.3vh',
          opacity: 0.9
        }}>
          {currentProduct.subtitle}
        </div>
        <div style={{
          fontWeight: '700',
          fontSize: 'clamp(1rem, 1.8vw, 1.4rem)',
          color: '#50c878',
          marginTop: '0.2vh'
        }}>
          {currentProduct.value}
        </div>
      </div>
      
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '3px',
        marginTop: '0.6vh',
        padding: '0.3vh 0'
      }}>
        {products.map((_, idx) => (
          <div
            key={idx}
            style={{
              width: idx === currentProductIndex ? '12px' : '6px',
              height: '4px',
              borderRadius: '2px',
              backgroundColor: idx === currentProductIndex ? '#ffd166' : 'rgba(255,255,255,0.3)',
              transition: 'width 0.3s ease'
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default ProductHighlight;
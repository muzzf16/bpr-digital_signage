import React, { useState, useEffect } from 'react';
import useSWR from 'swr';
import axios from 'axios';

// Constants for rate fetching
const REFRESH_INTERVAL = 30 * 60 * 1000; // 30 minutes
const API_KEY = import.meta.env.VITE_API_KEY || 'secret_dev_key';

const fetcher = async (url) => {
  try {
    const res = await axios.get(url);
    return res.data;
  } catch (error) {
    const newError = new Error('An error occurred while fetching the data.');
    newError.info = error.response?.data;
    newError.status = error.response?.status;
    throw newError;
  }
};

const ProductHighlight = () => {
  const [currentProductIndex, setCurrentProductIndex] = useState(0);

  // Fetch rate data
  const { data: rateData, error: rateError } = useSWR(
    `/api/rates/summary?api_key=${API_KEY}`, // Assuming a summary endpoint for all rates
    fetcher,
    { refreshInterval: REFRESH_INTERVAL }
  );

  const loadingRates = !rateData && !rateError;

  // Sample data - in a real implementation, this would come from an API
  const baseProducts = [
    { id: 1, title: 'Tabungan Simpanan', subtitle: 'Suku bunga', value: '8.5% p.a.', icon: '💰' },
    { id: 2, title: 'Deposito', subtitle: 'Tenor', value: '1–12 bulan', icon: '🏦' },
    { id: 3, title: 'Kredit Usaha', subtitle: 'Bunga spesial', value: 'Mulai 9.5%', icon: '💼' },
    { id: 4, title: 'Asuransi', subtitle: 'Perlindungan', value: 'Seumur hidup', icon: '🛡️' }
  ];

  // Add rate summary to products if available
  const products = [...baseProducts];
  if (!loadingRates && rateData?.rate) {
    products.push({
      id: 'rate-summary',
      title: 'Suku Bunga',
      subtitle: 'Deposito',
      value: `${rateData.rate.deposito}% p.a.`,
      icon: '📈'
    });
  } else if (loadingRates) {
    // Add a loading state for rates if still fetching
    products.push({
      id: 'rate-loading',
      title: 'Memuat Suku Bunga',
      subtitle: 'Mohon tunggu',
      value: '...',
      icon: '⏳'
    });
  }


  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentProductIndex(prevIndex => (prevIndex + 1) % products.length);
    }, 10000); // Change every 10 seconds

    return () => clearInterval(interval);
  }, [products.length]); // Depend on products.length to re-evaluate interval if products change

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
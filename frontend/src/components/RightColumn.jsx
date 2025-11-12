import React from 'react';
import ProductHighlight from './ProductHighlight';
import NewsPanel from './NewsPanel';
import EconPanel from './EconPanel';
import MiniChart from './MiniChart';

const RightColumn = ({ economicData }) => {
  const temperature = economicData?.weather?.temperature || 31;
  const condition = economicData?.weather?.condition || "Cerah Berawan";

  return (
    <div className="right-col" role="complementary">
      {/* Top Module: Weather Info */}
      <div className="right-col-module">
        <div style={{ fontSize: 'clamp(1.2rem, 2.5vw, 2.2rem)', fontWeight: 700, marginBottom: '0.3vh' }}>
          {temperature}°C
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4vw', fontSize: 'clamp(0.8rem, 1.3vw, 1rem)', textAlign: 'center' }}>
          <span>🌤️</span>
          <span>{condition} — Depok</span>
        </div>
      </div>

      {/* Middle Module: Product & News */}
      <div className="right-col-module grid-2-col">
        <div className="right-col-sub-module">
          <ProductHighlight />
        </div>
        <div className="right-col-sub-module">
          <NewsPanel />
        </div>
      </div>

      {/* Bottom Module: Economic Data with Mini Charts */}
      <div className="right-col-module grid-1-col">
        <div className="right-col-sub-module">
          <div style={{ height: '60%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <EconPanel />
          </div>
          <div style={{ height: '40%', marginTop: "0.5vh" }}>
            <MiniChart
              type="line"
              data={[7120, 7135, 7150, 7145, 7160, 7155, 7165]}
              title="IHSG"
              currentValue="7,165.00 ▲ +0.12%"
              color="#00bcd4"
              period="7 hari"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RightColumn;
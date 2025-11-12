import React from 'react';

const Branding = () => (
  <div className="branding">
    <div className="branding-container">
      <img
        src="/assets/logo-bpr.png"
        alt="Logo Bank Perekonomian Rakyat"
        onError={(e) => (e.currentTarget.style.display = "none")}
      />
      <div>
        <div>Bank</div>
        <div>Perekonomian Rakyat</div>
        <div>
          Solusi Keuangan Masyarakat — Aman & Terpercaya
        </div>
      </div>
    </div>
  </div>
);

export default Branding;
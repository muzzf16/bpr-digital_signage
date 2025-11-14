import React from 'react';

const Branding = ({ compact = false }) => {
  if (compact) {
    return (
      <div className="branding branding-compact">
        <div className="branding-logo-only">
          <img
            src="/assets/logo-bpr.png"
            alt="Logo BPR"
            onError={(e) => (e.currentTarget.style.display = "none")}
          />
        </div>
      </div>
    );
  }

  return (
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
};

export default Branding;
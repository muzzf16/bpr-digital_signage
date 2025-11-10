import React from "react";

export default function PromoCard({ item }) {
  const title = item?.title || "Promo Unggulan";
  const subtitle = item?.subtitle || "Nikmati layanan BPR terbaik";
  const rate = item?.rate || item?.cta || "";
  const image = item?.image || "/assets/demo.jpg";

  return (
    <div className="promo-card-content">
      <div className="promo-text" aria-hidden="false">
        <h1 className="promo-title">{title}</h1>
        <p className="promo-sub">{subtitle}</p>
        {rate && (
          <p style={{ 
            marginTop: "1.2em", 
            fontSize: "clamp(1rem, 2.4vw, 2.4rem)", 
            fontWeight: 700,
            color: "var(--gold)"
          }}>
            {rate}
          </p>
        )}
      </div>
      <div className="promo-media" aria-hidden="true">
        <img src={image} alt="Promo" />
      </div>
    </div>
  );
}

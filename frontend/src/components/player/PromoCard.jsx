import React from "react";

export default function PromoCard({ item }) {
  const title = item?.title || "Promo Unggulan";
  const subtitle = item?.subtitle || "Nikmati layanan BPR terbaik";
  const rate = item?.rate || item?.cta || "";
  const image = item?.image || "/assets/demo.jpg";

  return (
    <article className="promo-card" role="region" aria-label={title}>
      <div className="promo-inner">
        <div className="promo-text" aria-hidden="false">
          <h1 className="promo-title">{title}</h1>
          <p className="promo-sub">{subtitle}</p>
          {rate && (
            <p className="promo-rate">
              {rate}
            </p>
          )}
        </div>
        <figure className="promo-media" aria-hidden="true">
          <img src={image} alt="Promo" />
        </figure>
      </div>
    </article>
  );
}

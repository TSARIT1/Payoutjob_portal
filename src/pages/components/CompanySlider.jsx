import React, { useState } from "react";
import "./ImageCarousel.css";

function BrandTile({ item }) {
  const short = item.short || item.name.slice(0, 2).toUpperCase();
  const themeClass = item.theme ? `cs-theme-${item.theme}` : "cs-theme-blue";
  const [imgFailed, setImgFailed] = useState(false);
  const showLogo = Boolean(item.logo) && !imgFailed;

  return (
    <article className={`cs-brand-tile ${themeClass}`} title={item.name}>
      {item.openRoles && (
        <span className="cs-role-count">{item.openRoles.toLocaleString()}+ roles</span>
      )}
      <div className={`cs-brand-badge${showLogo ? ' cs-badge-logo' : ''}`}>
        {showLogo ? (
          <img
            src={item.logo}
            alt={`${item.name} logo`}
            className="cs-brand-logo-img"
            onError={() => setImgFailed(true)}
            loading="lazy"
            width="40"
            height="40"
          />
        ) : (
          short
        )}
      </div>
      <div className="cs-brand-copy">
        <h3>{item.name}</h3>
        <p>{item.label || 'Top MNC hiring company'}</p>
      </div>
    </article>
  );
}

const ImageCarousel = ({ images }) => {
  return (
    <div className="cs-logo-wall" aria-label="Top MNC companies hiring on PayoutJob">
      {images.map((item) => (
        <BrandTile key={item.name} item={item} />
      ))}
    </div>
  );
};

export default ImageCarousel;

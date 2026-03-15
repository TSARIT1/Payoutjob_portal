import React from "react";
import "./ImageCarousel.css";

function BrandTile({ item }) {
  const short = item.short || item.name.slice(0, 2).toUpperCase();
  const themeClass = item.theme ? `cs-theme-${item.theme}` : "cs-theme-blue";

  return (
    <article className={`cs-brand-tile ${themeClass}`} title={item.name}>
      <div className="cs-brand-badge">{short}</div>
      <div className="cs-brand-copy">
        <h3>{item.name}</h3>
        <p>{item.label || 'Top MNC hiring company'}</p>
      </div>
    </article>
  );
}

const ImageCarousel = ({ images }) => {
  return (
    <div className="cs-logo-wall" aria-label="Top MNC companies">
      {images.map((item) => (
        <BrandTile key={item.name} item={item} />
      ))}
    </div>
  );
};

export default ImageCarousel;

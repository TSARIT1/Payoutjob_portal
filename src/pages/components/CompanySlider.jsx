import React, { useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import "./ImageCarousel.css"; // Import the custom CSS

const NextArrow = ({ onClick }) => (
  <button onClick={onClick} className="cs-next-arrow">
    <FaChevronRight />
  </button>
);

const PrevArrow = ({ onClick }) => (
  <button onClick={onClick} className="cs-prev-arrow">
    <FaChevronLeft />
  </button>
);

function LogoCard({ item, index }) {
  const [isBroken, setIsBroken] = useState(false);
  const name = typeof item === "string" ? `Company ${index + 1}` : item.name;
  const src = typeof item === "string" ? item : item.src;
  const initials = String(name || "CO")
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  if (isBroken || !src) {
    return (
      <div className="cs-fallback" title={name}>
        <span>{initials}</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      onError={() => setIsBroken(true)}
      alt={name}
      loading="lazy"
      className="cs-image"
      referrerPolicy="no-referrer"
    />
  );
}

const ImageCarousel = ({ images }) => {
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 2,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: true,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  const groupedImages = [];
  for (let i = 0; i < images.length; i += 4) {
    groupedImages.push(images.slice(i, i + 4));
  }

  return (
    <div className="cs-carousel-wrapper">
      <Slider {...settings}>
        {groupedImages.map((group, idx) => (
          <div key={idx}>
            <div className="cs-image-grid">
              {group.map((img, i) => (
                <div key={i} className="cs-image-wrapper">
                  <LogoCard item={img} index={idx * 4 + i} />
                </div>
              ))}
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default ImageCarousel;

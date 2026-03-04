import React from "react";
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
                  <img
                    src={img}
                    onError={(e) => (e.target.src = "/fallback.png")}
                    alt={`Slide ${idx * 4 + i + 1}`}
                    className="cs-image"
                  />
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

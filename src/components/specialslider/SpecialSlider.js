// SpecialSlider.js
import React, { useRef } from "react";
import "./SpecialSlider.css";
import ProductCard from "../productcard/ProductCard";

const SpecialSlider = ({ title, subtitle, items, themeColor = "#8A3A3A", centerText = true }) => {
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    const scrollAmount = 300;
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="special-slider-bg" style={{ backgroundColor: themeColor }}>
      <div className="special-slider">
        <div className={`slider-header ${centerText ? "center" : ""}`}>
          <div>
            <h2>{title}</h2>
            {subtitle && <p className="slider-subtitle">{subtitle}</p>}
          </div>
        </div>

        <div className="slider-wrapper">
          <button className="scroll-btn left" onClick={() => scroll("left")}>‹</button>
          <div className="slider" ref={scrollRef}>
            {items.map((item, index) => (
              <div className="slider-item" key={index}>
                <ProductCard product={item} />
              </div>
            ))}
          </div>
          <button className="scroll-btn right" onClick={() => scroll("right")}>›</button>
        </div>
      </div>
    </div>
  );
};

export default SpecialSlider;

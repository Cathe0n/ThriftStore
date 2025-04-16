import React from "react";
import "./HorizontalSlider.css";
import { FaArrowRight } from "react-icons/fa";
import ProductCard from "../productcard/ProductCard";

function HorizontalSlider({ title, subtitle, items, onSeeAll, bgColor, centerText }) {
  const scrollRef = React.useRef();

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = scrollRef.current.offsetWidth / 2;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div
      className="horizontal-slider"
      style={{ backgroundColor: bgColor || "transparent" }}
    >
      <div className={`slider-header ${centerText ? "center" : ""}`}>
        <div>
          <h2>{title}</h2>
          {subtitle && <p className="slider-subtitle">{subtitle}</p>}
        </div>
        {!centerText && onSeeAll && (
          <button className="see-all-btn" onClick={onSeeAll}>
            See All <FaArrowRight size={12} />
          </button>
        )}
      </div>

      <div className="slider-wrapper">
        <button className="scroll-btn left" onClick={() => scroll("left")}>‹</button>
        <div className="slider" ref={scrollRef}>
          {items.map((item, index) => (
            <div className="slider-item" key={index}>
              {item.price !== undefined ? (
                <ProductCard product={item} />
              ) : (
                <>
                  <img src={item.image} alt={item.name} className="simple-card-image" />
                  <p className="simple-card-name">{item.name}</p>
                </>
              )}
            </div>
          ))}
        </div>
        <button className="scroll-btn right" onClick={() => scroll("right")}>›</button>
      </div>
    </div>
  );
}

export default HorizontalSlider;

import React from "react";
import "./HorizontalSlider.css";
import { FaArrowRight } from "react-icons/fa";
import CategoryCard from "../categorycard/CategoryCard";

function HorizontalSlider({ 
  title, 
  subtitle, 
  items, 
  onSeeAll, 
  onItemClick, // New prop for handling individual item clicks
  bgColor, 
  centerText,
  isProductData = false,
  loading = false
}) {
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

  const handleItemClick = (item) => {
    if (onItemClick) {
      onItemClick(item);
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
          {loading ? (
            <div className="slider-loading">
              {[...Array(4)].map((_, i) => (
                <div className="slider-item loading" key={i}>
                  <div className="loading-card"></div>
                </div>
              ))}
            </div>
          ) : (
            items.map((item, index) => (
              <div 
                className="slider-item" 
                key={index}
                onClick={() => !isProductData && handleItemClick(item)}
                style={{ cursor: !isProductData ? 'pointer' : 'default' }}
              >
                <CategoryCard 
                  item={item} 
                  isProduct={isProductData} 
                />
              </div>
            ))
          )}
        </div>
        <button className="scroll-btn right" onClick={() => scroll("right")}>›</button>
      </div>
    </div>
  );
}

export default HorizontalSlider;
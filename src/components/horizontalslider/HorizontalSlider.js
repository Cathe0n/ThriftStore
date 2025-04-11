import React from "react";
import "./HorizontalSlider.css";

function HorizontalSlider({ title, items, onSeeAll }) {
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
    <div className="horizontal-slider">
      <div className="slider-header">
        <h2>{title}</h2>
        <button className="see-all-btn" onClick={onSeeAll}>
          See All
        </button>
      </div>

      <div className="slider-wrapper">
        <button className="scroll-btn left" onClick={() => scroll("left")}>‹</button>
        <div className="slider" ref={scrollRef}>
          {items.map((item, index) => (
            <div className="slider-item" key={index}>
              <img src={item.image} alt={item.name} />
              <p>{item.name}</p>
            </div>
          ))}
        </div>
        <button className="scroll-btn right" onClick={() => scroll("right")}>›</button>
      </div>
    </div>
  );
}

export default HorizontalSlider;

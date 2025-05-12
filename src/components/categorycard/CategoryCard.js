import React from "react";
import { useNavigate } from "react-router-dom";
import "./CategoryCard.css";

const CategoryCard = ({ category }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    // Convert category name to URL-friendly format
    const categorySlug = category.name.toLowerCase()
                          .replace(/\s+/g, '-')
                          .replace(/[^\w-]+/g, '');
    navigate(`product/${categorySlug}`); // Relative to current path
  };
  
  return (
    <div className="category-card" onClick={handleClick}>
      <div className="category-image">
        <img src={category.image} alt={category.name} />
      </div>
      <div className="category-info">
        <h3 className="category-name">{category.name}</h3>
        <p className="category-description">{category.description}</p>
      </div>
    </div>
  );
};

export default CategoryCard;
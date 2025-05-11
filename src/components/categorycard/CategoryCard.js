import React from "react";
import { useNavigate } from "react-router-dom";
import "./CategoryCard.css";

const CategoryCard = ({ category }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/categories/${category.id}`);
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
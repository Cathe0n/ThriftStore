import React from "react";
import { useNavigate } from "react-router-dom";
import "./CategoryCard.css";

const CategoryCard = ({ item, isProduct }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (isProduct) {
      navigate(`/productInformation/${item.id}`);
    } else {
      const categorySlug = item.name.toLowerCase()
                         .replace(/\s+/g, '-')
                         .replace(/[^\w-]+/g, '');
      navigate(`/product/${categorySlug}`);
    }
  };

  return (
    <div className="category-card" onClick={handleClick}>
      <div className="category-image">
        <img 
          src={isProduct ? item.imagePath : item.image} 
          alt={isProduct ? item.product_name : item.name}
          onError={(e) => {
            e.target.src = '/images/placeholder.jpg';
          }}
        />
      </div>
      <div className="category-info">
        <h3 className="category-name">
          {isProduct ? item.product_name : item.name}
        </h3>
        {isProduct && item.brand && (
          <p className="category-brand">{item.brand}</p>
        )}
        {isProduct && item.price && (
          <p className="category-price">${item.price.toLocaleString()}</p>
        )}
      </div>
    </div>
  );
};

export default CategoryCard;
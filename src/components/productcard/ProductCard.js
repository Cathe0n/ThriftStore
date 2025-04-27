import React from "react";
import { useNavigate } from "react-router-dom";
import "./ProductCard.css";

const ProductCard = ({ product }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`product/`);
    
  };
  return (
    <div className="product-card" onClick={handleClick}>
      

      <div className="product-image">
        <img src={product.image} alt={product.name} />
      </div>
      <div className="product-info">
        <p className="product-brand">{product.brand}</p>
        <p className="product-description">{product.description}</p>
        <p className="product-price">Rp {product.price.toLocaleString("id-ID")}</p>
      </div>
    </div>
  );
};

export default ProductCard;

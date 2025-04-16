import React from "react";
import "./ProductCard.css";

const ProductCard = ({ product }) => {
  return (
    <div className="product-card">
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

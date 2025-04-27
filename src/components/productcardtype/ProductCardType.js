import React from "react";
import "./ProductCardType.css";

function ProductCardType({ product }) {
  return (
    <div className="product-card">
      <div className="product-image-container">
        <img 
          src={product.imageUrl} 
          alt={product.name} 
          className="product-image"
        />
      </div>
      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        <p className="product-price">Price: Rp {product.price.toLocaleString()}</p>
      </div>
    </div>
  );
}

export default ProductCardType;
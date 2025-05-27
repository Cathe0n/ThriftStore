import React from "react";
import "./ProductCard.css";

const ProductCard = ({ product, showAddToCartButton, onAddToCart, textColor = "white" }) => {
  return (
    <div className="product-card">
      <div className="product-image-wrapper">
        <img src={product.image} alt={product.name} className="product-image" />
      </div>
      <div className={`product-info ${textColor === "black" ? "text-black" : "text-white"}`}>
        <p className="product-brand">{product.brand}</p>
        <p className="product-description">{product.name}</p>
        <p className="product-price">Rp {product.price.toLocaleString("id-ID")}</p>
      </div>
      {showAddToCartButton && (
        <button className="add-to-cart-button" onClick={() => onAddToCart(product)}>
          Put into Cart
        </button>
      )}
    </div>
  );
};

export default ProductCard;

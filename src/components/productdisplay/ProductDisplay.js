// src/components/ProductDisplay/ProductDisplay.js
import React from 'react';
import './ProductDisplay.css'; // Create this CSS file for styling

const ProductDisplay = ({ product }) => {
  // Destructure with fallback values
  const {
    imagePath = '',
    product_name = 'Product Name Not Available',
    price = 0,
    id = ''
  } = product || {};

  // Format price to Indonesian Rupiah
  const formatPrice = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="product-display" key={id}>
      <div className="product-image-container">
        <img 
          src={imagePath || '/images/placeholder.jpg'} 
          alt={product_name}
          className="product-image"
        />
      </div>
      <div className="product-details">
        <h3 className="product-name">{product_name}</h3>
        <p className="product-price">{formatPrice(price)}</p>
      </div>
    </div>
  );
};

export default ProductDisplay;
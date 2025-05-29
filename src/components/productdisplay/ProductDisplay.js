import React from 'react';
import './ProductDisplay.css';
import { useNavigate } from 'react-router-dom';

const ProductDisplay = ({ product }) => {
  const navigate = useNavigate();

  const {
    imagePath = '',
    product_name = 'Product Name Not Available',
    price = 0,
    id = ''
  } = product || {};

  const formatPrice = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const handleClick = () => {
    navigate(`/productinformation/${id}`);
  };

  return (
    <div className="product-display" key={id} onClick={handleClick}>
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

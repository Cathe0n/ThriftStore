// src/components/selecteditems/SelectedItems.js
import React from 'react';
import './SelectedItems.css';

const SelectedItems = () => {
  return (
    <div className="selected-item">
      <div className="item-image"></div>
      <div className="item-details">
        <strong>White Collared Shirt</strong>
        <p>Price: Rp 200.000</p>
        <p>Size: XL</p>
        <p>Quantity: <span>1</span></p>
      </div>
    </div>
  );
};

export default SelectedItems;

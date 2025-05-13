import React, { useState } from "react";
import "./Editproductpage.css";

export const DashboardEditProductpage = () => {
  const [product, setProduct] = useState({
    type: "Ladies",
    product: "T-Shirt",
    name: "T-Shirt",
    code: "L-S-BX027",
    price: "350000",
    stock: {
      S: 1,
      M: 2,
      L: 3,
      XL: 0
    }
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProduct(prev => ({ ...prev, [name]: value }));
  };

  const handleStockChange = (size, value) => {
    setProduct(prev => ({
      ...prev,
      stock: { ...prev.stock, [size]: parseInt(value) || 0 }
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Updated product:", product);
    // Here you would typically send the data to your backend
    alert("Product updated successfully!");
  };

  return (
    <div className="edit-product-container">
      <h1>Edit Product</h1>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Type:</label>
          <input
            type="text"
            name="type"
            value={product.type}
            onChange={handleInputChange}
          />
        </div>

        <div className="form-group">
          <label>Product Category:</label>
          <input
            type="text"
            name="product"
            value={product.product}
            onChange={handleInputChange}
          />
        </div>

        <div className="form-group">
          <label>Product Name:</label>
          <input
            type="text"
            name="name"
            value={product.name}
            onChange={handleInputChange}
          />
        </div>

        <div className="form-group">
          <label>Product Code:</label>
          <input
            type="text"
            name="code"
            value={product.code}
            onChange={handleInputChange}
          />
        </div>

        <div className="form-group">
          <label>Price:</label>
          <input
            type="text"
            name="price"
            value={product.price}
            onChange={handleInputChange}
          />
        </div>

        <div className="stock-group">
          <h3>Stock:</h3>
          {Object.entries(product.stock).map(([size, quantity]) => (
            <div key={size} className="stock-item">
              <label>{size}:</label>
              <input
                type="number"
                value={quantity}
                onChange={(e) => handleStockChange(size, e.target.value)}
                min="0"
              />
            </div>
          ))}
        </div>

        <div className="button-group">
          <button type="submit" className="save-btn">Save Changes</button>
          <button type="button" className="cancel-btn">Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default DashboardEditProductpage;
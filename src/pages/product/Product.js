import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ProductCardType from "../../components/productcardtype/ProductCardType";
import "./Product.css";

// Mock data - replace with your actual data source
const products = [
    {
      id: 1,
      name: "White Collared Shirt",
      price: 200000,
      imageUrl: "/images/bottoms.jpg",
      category: "women"
    },
    {
      id: 2,
      name: "White Collared Shirt",
      price: 200000,
      imageUrl: "/images/bottoms.jpg",
      category: "kids"
    },
    {
      id: 3,
      name: "White Collared Shirt",
      price: 200000,
      imageUrl: "/images/bottoms.jpg",
      category: "men"
    },
    {
      id: 4,
      name: "White Collared Shirt",
      price: 200000,
      imageUrl: "/images/bottoms.jpg",
      category: "men"
    },
    // Add more products as needed
  ];
  
  function Product() {
    const location = useLocation();
    const navigate = useNavigate();
  
    const getSection = () => {
      if (location.pathname.includes("women")) return "Women";
      if (location.pathname.includes("men")) return "Men";
      if (location.pathname.includes("kids")) return "Kids";
      return "Everyone";
    };
  
    // Filter products based on current category
    const filteredProducts = products.filter(product => 
      product.category.toLowerCase() === getSection().toLowerCase()
    );
  
    return (
      <div className="product-page">
        <h1 className="product-section-title">{getSection().toUpperCase()}</h1>
        
        <div className="product-grid">
            
          {filteredProducts.map(products => (
            <ProductCardType 
              key={products.id} 
              product={products} 
              onClick={() => navigate(`/product/${products.id}`)}
            />
          ))}
        </div>
      </div>
    );
  }
  
  export default Product;
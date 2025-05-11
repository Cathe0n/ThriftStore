import React from "react";
import { useLocation } from "react-router-dom";
import ProductCard from "../../components/productcard/ProductCard";
import "./Product.css";

// Mock data - replace with your actual data source
const products = [
  {
    id: 1,
    name: "White Collared Shirt",
    price: 200000,
    imageUrl: "/images/bottoms.jpg",
    category: "women",
    brand: "Brand Name",      // Added for consistency with ProductCard
    description: "Product description"  // Added for consistency
  },
  {
    id: 2,
    name: "White Collared Shirt",
    price: 200000,
    imageUrl: "/images/bottoms.jpg",
    category: "kids",
    brand: "Brand Name",
    description: "Product description"
  },
  // ... other products
];

function Product() {
  const location = useLocation();

  const getSection = () => {
    if (location.pathname.includes("women")) return "Women";
    if (location.pathname.includes("men")) return "Men";
    if (location.pathname.includes("kids")) return "Kids";
    return "Everyone";
  };

  const filteredProducts = products.filter(product => 
    product.category.toLowerCase() === getSection().toLowerCase()
  );

  return (
    <div className="product-page">
      <h1 className="product-section-title">{getSection().toUpperCase()}</h1>
      
      <div className="product-grid">
        {filteredProducts.map(product => (
          <ProductCard
            key={product.id} 
            product={product}  // All product data is passed here
            // onClick removed - handled internally by ProductCard
          />
        ))}
      </div>
    </div>
  );
}

export default Product;
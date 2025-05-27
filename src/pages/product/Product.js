import React from "react";
import { useLocation } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { GET_PRODUCTS_BY_CATEGORY } from "../../graphql/mutations";
import ProductDisplay from "../../components/productdisplay/ProductDisplay";
import "./Product.css";


function Product() {
  const location = useLocation();
  const { categoryType } = location.state || {};
  const { state } = location;

  console.log(state); // Check what's received

  // Fetch products using Apollo Client
  const { loading, error, data } = useQuery(GET_PRODUCTS_BY_CATEGORY, {
    variables: { categoryType },
    skip: !categoryType // Skip query if categoryType is missing
  });

  if (loading) return <div className="product-page loading">Loading products...</div>;
  if (error) return <div className="product-page error">Error loading products: {error.message}</div>;
  if (!data) return <div className="product-page">No products found.</div>;

  const products = data.getProductbyCategory || [];
  console.log(products); // Check the fetched products
  return (
    <div className="product-page">
      <h1 className="product-section-title">
        {location.state?.category?.toUpperCase() || "PRODUCTS"}
      </h1>
      

      {/* Render product cards */}
      <div className="product-grid">
        {products.map(product => (  
          <ProductDisplay
            key={product.id} 
            product={product}
          />
        ))}
      </div>
    </div>
  );
}

export default Product;
import React from "react";
import { useLocation } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { GET_PRODUCTS_BY_CATEGORY } from "../../graphql/mutations";
import { GET_PRODUCTS_BY_BRAND } from "../../graphql/mutations";
import ProductDisplay from "../../components/productdisplay/ProductDisplay";
import "./Product.css";


function Product() {
  const location = useLocation();
  const { categoryType, brand } = location.state || {};
  const { state } = location;

  console.log(state); // Check what's received

  // Determine which query to use based on state
  const isBrand = Boolean(brand);
  const query = isBrand ? GET_PRODUCTS_BY_BRAND : GET_PRODUCTS_BY_CATEGORY;
  const variables = isBrand ? { brand } : { categoryType };

  // Fetch products using Apollo Client
  const { loading, error, data } = useQuery(query, {
    variables,
    skip: !categoryType && !brand // Skip query if neither is present
  });

  if (loading) return <div className="product-page loading">Loading products...</div>;
  if (error) return <div className="product-page error">Error loading products: {error.message}</div>;
  if (!data) return <div className="product-page">No products found.</div>;

  const products = isBrand 
    ? data.getProductbyBrand || [] 
    : data.getProductbyCategory || [];

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
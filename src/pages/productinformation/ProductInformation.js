import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./ProductInformation.css";

const ProductInformation = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState("");

  useEffect(() => {
    // In a real app, you would fetch the product data from an API using the id
    // For now, we'll simulate fetching data
    const fetchProduct = async () => {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Mock data - in a real app, this would come from your backend
        const mockProducts = [
          {
            id: "1",
            name: "Premium Running Shoes",
            brand: "Nike",
            price: 1200000,
            description: "High-performance running shoes with cushioning technology",
            image: "https://example.com/shoe1.jpg",
            images: [
              "https://example.com/shoe1.jpg",
              "https://example.com/shoe2.jpg",
              "https://example.com/shoe3.jpg"
            ],
            sizes: ["38", "39", "40", "41", "42"],
            stock: 15
          },
          // Add more mock products as needed
        ];
        
        const foundProduct = mockProducts.find(p => p.id === id);
        setProduct(foundProduct);
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProduct();
  }, [id]);

  const handleOrder = () => {
    if (!selectedSize) {
      alert("Please select a size first");
      return;
    }
    alert(`Order placed for ${product.name} (Size: ${selectedSize})`);
    // In a real app, you would add to cart or proceed to checkout
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (!product) {
    return <div className="not-found">Product not found</div>;
  }

  return (
    <div className="product-information">
      <div className="product-gallery">
        <div className="main-image">
          <img src={product.image} alt={product.name} />
        </div>
        <div className="thumbnail-container">
          {product.images.map((img, index) => (
            <img 
              key={index} 
              src={img} 
              alt={`${product.name} ${index + 1}`} 
              className="thumbnail"
            />
          ))}
        </div>
      </div>
      
      <div className="product-details">
        <h1 className="product-name">{product.name}</h1>
        <p className="product-brand">{product.brand}</p>
        <p className="product-price">Rp {product.price.toLocaleString("id-ID")}</p>
        
        <div className="size-selection">
          <h3>Size</h3>
          <div className="size-options">
            {product.sizes.map(size => (
              <button
                key={size}
                className={`size-btn ${selectedSize === size ? "selected" : ""}`}
                onClick={() => setSelectedSize(size)}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
        
        <button className="order-button" onClick={handleOrder}>
          Add to Cart
        </button>
        
        <div className="product-description">
          <h3>Description</h3>
          <p>{product.description}</p>
        </div>
        
        <div className="stock-info">
          <p>{product.stock} items available</p>
        </div>
      </div>
    </div>
  );
};

export default ProductInformation;
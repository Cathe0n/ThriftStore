import React, { useEffect, useState, useContext, useRef } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { GET_PRODUCT_BY_ID } from "../../graphql/mutations";
import { useQuery } from "@apollo/client";
import { FaHeart, FaRegHeart, FaShoppingBag } from "react-icons/fa";
import "./ProductInformation.css";

const ProductInformation = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [product, setProduct] = useState(null);
  // const [loading, setLoading] = useState(true);
  // const [selectedSize, setSelectedSize] = useState("");
  const [activeTooltip, setActiveTooltip] = useState(null);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [flyingItems, setFlyingItems] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const headerBagRef = useRef(null);
  const addToCartButtonRef = useRef(null);

  const { loading, error, data } = useQuery(GET_PRODUCT_BY_ID, {
  variables: { id: `${id}` },
});

// Add this after the useQuery hook
useEffect(() => {
  if (data?.getProductbyId) {
    // Transform the API response to match your component's expected format
    const transformedProduct = {
      id: data.getProductbyId.id,
      name: data.getProductbyId.product_name,
      brand: data.getProductbyId.brand, // Using category_type as brand
      price: data.getProductbyId.price,
      description: data.getProductbyId.description,
      images: [data.getProductbyId.imagePath], // Assuming imagePath is a single string
      stock: data.getProductbyId.Total_stock,
    };
    setProduct(transformedProduct);
    // setLoading(false);
  }
}, [data]);

  // useEffect(() => {
  //   const fetchProduct = async () => {
  //     try {
  //       await new Promise(resolve => setTimeout(resolve, 500));
        
  //       const mockProducts = [
  //         {
  //           id: "1",
  //           name: "Premium Running Shoes",
  //           brand: "Nike",
  //           price: 1200000,
  //           description: "High-performance running shoes with cushioning technology",
  //           images: [
  //             "https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
  //             "https://images.unsplash.com/photo-1600269452121-4f2416e55c28?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
  //             "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80"
  //           ],
  //           sizes: ["38", "39", "40", "41", "42"],
  //           stock: {
  //             "38": 5,
  //             "39": 8,
  //             "40": 10,
  //             "41": 7,
  //             "42": 7
  //           }
  //         },
  //       ];
        
  //       const foundProduct = mockProducts.find(p => p.id === id);
  //       setProduct(foundProduct);
  //     } catch (error) {
  //       console.error("Error fetching product:", error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };
    
  //   fetchProduct();
  // }, [id]);

  const handleOrder = () => {
    if (!user) {
      setActiveTooltip('login');
      setTimeout(() => setActiveTooltip(null), 2000);
      return;
    }
    
    // if (!selectedSize) {
    //   setActiveTooltip('size');
    //   setTimeout(() => setActiveTooltip(null), 2000);
    //   return;
    // }
    
    const buttonRect = addToCartButtonRef.current.getBoundingClientRect();
    const startX = buttonRect.left + buttonRect.width / 2;
    const startY = buttonRect.top + buttonRect.height / 2;

    const newItem = {
      id: Date.now(),
      x: startX,
      y: startY,
      progress: 0
    };
    setFlyingItems([...flyingItems, newItem]);
    
    // setTimeout(() => {
    //   alert(`Added ${product.name} (Size: ${selectedSize}) to cart`);
    // }, 1000);

    setTimeout(() => {
      alert(`Added ${product.name} to cart`);
    }, 1000);
  };

  const handleWishlistClick = () => {
    if (!user) {
      setActiveTooltip('wishlist-login');
      setTimeout(() => setActiveTooltip(null), 2000);
      return;
    }
    setIsWishlisted(!isWishlisted);
  };

  // SELECTED SIZE IS COMMENTED NOW
  const handleAddToCartHover = () => {
    if (!user) {
      setActiveTooltip('login');
    } 
    // else if (!selectedSize) {
    //   setActiveTooltip('size');
    // }
  };

  const handleThumbnailClick = (index) => {
    setCurrentImageIndex(index);
  };

  useEffect(() => {
    if (flyingItems.length === 0) return;

    const animationFrame = requestAnimationFrame(() => {
      setFlyingItems(prevItems => {
        if (prevItems.length === 0) return [];
        
        const bagPosition = headerBagRef.current?.getBoundingClientRect();
        if (!bagPosition) return prevItems;

        return prevItems.map(item => {
          const progress = Math.min(1, (item.progress || 0) + 0.05);
          const easeOutCubic = t => (--t) * t * t + 1;
          const currentProgress = easeOutCubic(progress);
          
          const endX = bagPosition.left + bagPosition.width / 2;
          const endY = bagPosition.top + bagPosition.height / 2;
          
          return {
            ...item,
            x: item.x + (endX - item.x) * currentProgress,
            y: item.y + (endY - item.y) * currentProgress,
            progress,
            opacity: 1 - currentProgress,
            scale: 0.5 + currentProgress * 0.5
          };
        }).filter(item => item.progress < 1);
      });
    });

    return () => cancelAnimationFrame(animationFrame);
  }, [flyingItems]);

  if (loading) {
  return <div className="loading">Loading...</div>;
}

if (error) {
  console.error("Full error details:", error.networkError?.result, error.graphQLErrors);
  return <div>Error loading product</div>;
}

if (!product) {
  return <div className="not-found">Product not found</div>;
}

  return (
    <div className="product-information">
      {flyingItems.map(item => (
        <div 
          key={item.id}
          className="flying-item"
          style={{
            left: `${item.x}px`,
            top: `${item.y}px`,
            opacity: item.opacity,
            transform: `translate(-50%, -50%) scale(${item.scale})`,
          }}
        >
          <FaShoppingBag />
        </div>
      ))}

      <div className="product-gallery">
        <div className="main-image-container">
          {/* <img 
            src={product.images[currentImageIndex]} 
            alt={product.name} 
            className={`main-image ${currentImageIndex === 0 ? 'first-image' : ''}`}
          /> */}
          <img 
            src={product.images[0]} // Now using the single image
            alt={product.name} 
            className={`main-image ${currentImageIndex === 0 ? 'first-image' : ''}`}
          />
        </div>
        <div className="thumbnail-container">
          {product.images.map((img, index) => (
            <img 
              key={index} 
              src={img} 
              alt={`${product.name} ${index + 1}`} 
              className={`thumbnail ${index === currentImageIndex ? 'active' : ''}`}
              onClick={() => handleThumbnailClick(index)}
            />
          ))}
        </div>
      </div>
      
      <div className="product-details">
        <div className="product-header">
          <h1 className="product-name">{product.name}</h1>
          <div 
            className="wishlist-icon"
            onClick={handleWishlistClick}
            onMouseEnter={() => !user && setActiveTooltip('wishlist-login')}
            onMouseLeave={() => setActiveTooltip(null)}
          >
            {isWishlisted ? (
              <FaHeart className="heart-icon filled" />
            ) : (
              <FaRegHeart className="heart-icon" />
            )}
            {activeTooltip === 'wishlist-login' && (
              <div className="wishlist-tooltip">Please log in to add to wishlist</div>
            )}
          </div>
        </div>
        
        <p className="product-brand">{product.brand}</p>
        <p className="product-price">Rp {product.price.toLocaleString("id-ID")}</p>
        
        {/* SIZE IS COMMENTED OUT FOR NOW */}
        {/* <div className="size-selection">
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
          <p className="size-stock">
            Stock: {selectedSize ? product.stock[selectedSize] : "Please select a size"}
          </p>
        </div> */}
        
        <button 
          ref={addToCartButtonRef}
          className="order-button" 
          onClick={handleOrder}
          onMouseEnter={handleAddToCartHover}
          onMouseLeave={() => setActiveTooltip(null)}
        >
          Add to Cart
          {activeTooltip === 'size' && (
            <div className="size-tooltip">Please select a size</div>
          )}
          {activeTooltip === 'login' && (
            <div className="login-tooltip">Please log in to add to cart</div>
          )}
        </button>
        
        <div className="product-description">
          <h3>Description</h3>
          <p>{product.description}</p>
        </div>
      </div>

      <div 
        ref={headerBagRef} 
        className="header-bag-reference"
        style={{ top: '35px', right: '165px' }}
      ></div>
    </div>
  );
};

export default ProductInformation;
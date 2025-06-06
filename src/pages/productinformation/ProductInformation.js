import React, { useEffect, useState, useContext, useRef } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { GET_PRODUCT_BY_ID, GET_PRODUCT_SIZE_STOCK } from "../../graphql/mutations";
import { useQuery, useLazyQuery } from "@apollo/client";
import { FaHeart, FaRegHeart, FaShoppingBag } from "react-icons/fa";
import "./ProductInformation.css";

const sizeOptions = ["S", "M", "L", "XL", "XXL"];

const ProductInformation = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [product, setProduct] = useState(null);
  const [activeTooltip, setActiveTooltip] = useState(null);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [flyingItems, setFlyingItems] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");
  const [sizeStock, setSizeStock] = useState({});
  const [stockLoading, setStockLoading] = useState(true);
  const headerBagRef = useRef(null);
  const addToCartButtonRef = useRef(null);

  const { loading, error, data } = useQuery(GET_PRODUCT_BY_ID, {
    variables: { id: `${id}` },
  });

  const [fetchStock] = useLazyQuery(GET_PRODUCT_SIZE_STOCK, {
    onCompleted: (res) => {
      // not used in bulk load anymore
    },
  });

  useEffect(() => {
    if (data?.getProductbyId) {
      const transformedProduct = {
        id: data.getProductbyId.id,
        name: data.getProductbyId.product_name,
        brand: data.getProductbyId.brand,
        price: data.getProductbyId.price,
        description: data.getProductbyId.description,
        images: data.getProductbyId.imagePath
          ? data.getProductbyId.imagePath
              .split(",")
              .map((url) => url.trim())
              .filter((url) => url !== "")
          : [],
        stock: data.getProductbyId.Total_stock,
      };
      setProduct(transformedProduct);
    }
  }, [data]);

  // Fetch all size stocks when product is ready
  useEffect(() => {
    const fetchAllSizes = async () => {
      if (!product) return;
      setStockLoading(true);

      const stockResults = {};
      const promises = sizeOptions.map((size) =>
        fetchStock({ variables: { product_id: product.id, size_type: size } })
          .then((res) => {
            const stock = res.data?.getProductbySize?.stock_amount ?? 0;
            stockResults[size] = stock;
          })
          .catch(() => {
            stockResults[size] = 0;
          })
      );

      await Promise.all(promises);
      setSizeStock(stockResults);
      setStockLoading(false);
    };

    fetchAllSizes();
  }, [product]);

  const handleOrder = () => {
    if (!user) {
      setActiveTooltip("login");
      setTimeout(() => setActiveTooltip(null), 2000);
      return;
    }

    if (!selectedSize) {
      setActiveTooltip("size");
      setTimeout(() => setActiveTooltip(null), 2000);
      return;
    }

    const buttonRect = addToCartButtonRef.current.getBoundingClientRect();
    const startX = buttonRect.left + buttonRect.width / 2;
    const startY = buttonRect.top + buttonRect.height / 2;

    const newItem = {
      id: Date.now(),
      x: startX,
      y: startY,
      progress: 0,
    };
    setFlyingItems([...flyingItems, newItem]);

    setTimeout(() => {
      alert(`Added ${product.name} (Size: ${selectedSize}) to cart`);
    }, 1000);
  };

  const handleWishlistClick = () => {
    if (!user) {
      setActiveTooltip("wishlist-login");
      setTimeout(() => setActiveTooltip(null), 2000);
      return;
    }
    setIsWishlisted(!isWishlisted);
  };

  const handleAddToCartHover = () => {
    if (!user) {
      setActiveTooltip("login");
    } else if (!selectedSize) {
      setActiveTooltip("size");
    }
  };

  const handleThumbnailClick = (index) => {
    setCurrentImageIndex(index);
  };

  const handleSizeClick = (size) => {
    setSelectedSize(size);
  };

  useEffect(() => {
    if (flyingItems.length === 0) return;

    const animationFrame = requestAnimationFrame(() => {
      setFlyingItems((prevItems) => {
        if (prevItems.length === 0) return [];

        const bagPosition = headerBagRef.current?.getBoundingClientRect();
        if (!bagPosition) return prevItems;

        return prevItems
          .map((item) => {
            const progress = Math.min(1, (item.progress || 0) + 0.05);
            const easeOutCubic = (t) => (--t) * t * t + 1;
            const currentProgress = easeOutCubic(progress);

            const endX = bagPosition.left + bagPosition.width / 2;
            const endY = bagPosition.top + bagPosition.height / 2;

            return {
              ...item,
              x: item.x + (endX - item.x) * currentProgress,
              y: item.y + (endY - item.y) * currentProgress,
              progress,
              opacity: 1 - currentProgress,
              scale: 0.5 + currentProgress * 0.5,
            };
          })
          .filter((item) => item.progress < 1);
      });
    });

    return () => cancelAnimationFrame(animationFrame);
  }, [flyingItems]);

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div>Error loading product</div>;
  if (!product) return <div className="not-found">Product not found</div>;

  return (
    <div className="product-information">
      {flyingItems.map((item) => (
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
          <img
            src={product.images[currentImageIndex]}
            alt={product.name}
            className={`main-image ${currentImageIndex === 0 ? "first-image" : ""}`}
          />
        </div>
        <div className="thumbnail-container">
          {product.images.map((img, index) => (
            <img
              key={index}
              src={img}
              alt={`${product.name} ${index + 1}`}
              className={`thumbnail ${index === currentImageIndex ? "active" : ""}`}
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
            onMouseEnter={() => !user && setActiveTooltip("wishlist-login")}
            onMouseLeave={() => setActiveTooltip(null)}
          >
            {isWishlisted ? (
              <FaHeart className="heart-icon filled" />
            ) : (
              <FaRegHeart className="heart-icon" />
            )}
            {activeTooltip === "wishlist-login" && (
              <div className="wishlist-tooltip">Please log in to add to wishlist</div>
            )}
          </div>
        </div>

        <p className="product-brand">{product.brand}</p>
        <p className="product-price">Rp {product.price.toLocaleString("id-ID")}</p>

        <div className="size-selection">
          <h3>Size</h3>
          {stockLoading ? (
            <p className="size-stock">Loading sizes...</p>
          ) : (
            <>
              <div className="size-options">
                {sizeOptions.map((size) => (
                  <button
                    key={size}
                    className={`size-btn ${selectedSize === size ? "selected" : ""}`}
                    onClick={() => handleSizeClick(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
              <p className="size-stock">
                {selectedSize
                  ? `Stock: ${sizeStock[selectedSize] ?? 0}`
                  : "Please select a size"}
              </p>
            </>
          )}
        </div>

        <button
          ref={addToCartButtonRef}
          className="order-button"
          onClick={handleOrder}
          onMouseEnter={handleAddToCartHover}
          onMouseLeave={() => setActiveTooltip(null)}
          disabled={
            !selectedSize ||
            stockLoading ||
            (selectedSize && sizeStock[selectedSize] === 0)
          }
        >
          Add to Cart
          {activeTooltip === "size" && <div className="size-tooltip">Please select a size</div>}
          {activeTooltip === "login" && <div className="login-tooltip">Please log in to add to cart</div>}
        </button>

        <div className="product-description">
          <h3>Description</h3>
          <p>{product.description}</p>
        </div>
      </div>

      <div
        ref={headerBagRef}
        className="header-bag-reference"
        style={{ top: "35px", right: "165px" }}
      ></div>
    </div>
  );
};

export default ProductInformation;

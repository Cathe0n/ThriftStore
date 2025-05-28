import React, { useState } from "react";
import "./Wishlist.css";
import ProductCard from "../../components/productcard/ProductCard";
import { FaTimes } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";

const Wishlist = () => {
  const { user } = useAuth();

  const [wishlistItems, setWishlistItems] = useState([
    {
      image: "/images/women/dries.jpg",
      name: "embellished crepe bustier top",
      brand: "Dries Van Noten",
      price: 889000,
    },
    {
      image: "/images/women/burberry.jpg",
      name: "cropped trench jacket",
      brand: "Burberry",
      price: 23599000,
    },
    {
      image: "/categories/women/activewear.webp",
      name: "active joggers",
      brand: "Nike",
      price: 320000,
    },
  ]);

  const handleAddToCart = (product) => {
    console.log("Added to cart:", product);
    // TODO: Add to cart logic
  };

  const handleRemoveFromWishlist = (index) => {
    const updated = [...wishlistItems];
    updated.splice(index, 1);
    setWishlistItems(updated);
  };

  return (
    <div className="wishlist-page">
      <h2 className="wishlist-title">Your Wishlist</h2>

      {!user ? (
        <p className="empty-message">
          Please log in to your account to view your wishlist.
        </p>
      ) : wishlistItems.length === 0 ? (
        <p className="empty-message">Your wishlist is currently empty.</p>
      ) : (
        <div className="wishlist-items-container">
          {wishlistItems.map((item, index) => (
            <div className="wishlist-item-wrapper" key={index}>
              <ProductCard
                product={item}
                showAddToCartButton={true}
                onAddToCart={handleAddToCart}
                textColor="black"
              />
              <button
                className="remove-button"
                onClick={() => handleRemoveFromWishlist(index)}
              >
                <FaTimes />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;

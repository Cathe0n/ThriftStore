import React, { useEffect, useState } from "react";
import "./Wishlist.css";
import ProductDisplay from "../../components/productdisplay/ProductDisplay";
import { FaTimes } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
import {
  GET_WISHLIST_BY_CUSTOMER_ID,
  REMOVE_FROM_WISHLIST,
  GET_PRODUCT_BY_ID,
} from "../../graphql/mutations";
import { useNavigate } from "react-router-dom";
import client from "../../apollo/client";

const Wishlist = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [wishlistItems, setWishlistItems] = useState([]);
  const [productDetails, setProductDetails] = useState({});

  const [fetchWishlist] = useLazyQuery(GET_WISHLIST_BY_CUSTOMER_ID, {
    onCompleted: async (res) => {
      const items = res.getWishListByCustomerId || [];
      setWishlistItems(items);

      // Fetch product details for each wishlist item
      const detailFetches = await Promise.all(
        items.map((item) =>
          client
            .query({
              query: GET_PRODUCT_BY_ID,
              variables: { id: item.product_id },
            })
            .then((res) => ({ id: item.product_id, data: res.data.getProductbyId }))
            .catch(() => null)
        )
      );

      const detailsMap = {};
      detailFetches.forEach((entry) => {
        if (entry && entry.data) {
          detailsMap[entry.id] = entry.data;
        }
      });

      setProductDetails(detailsMap);
    },
    onError: (err) => {
      console.error("Failed to fetch wishlist:", err.message);
    },
    fetchPolicy: "network-only",
  });

  const [removeFromWishlist] = useMutation(REMOVE_FROM_WISHLIST, {
    onCompleted: () => {
      fetchWishlist();
    },
    onError: (err) => {
      console.error("Failed to remove from wishlist:", err.message);
    },
  });

  useEffect(() => {
    if (user?.token) {
      fetchWishlist();
    }
  }, [user]);

  const handleRemoveFromWishlist = (wishlist_id) => {
    removeFromWishlist({ variables: { wishlist_id } });
  };

  const handleProductClick = (product_id) => {
    navigate(`/productinformation/${product_id}`);
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
          {wishlistItems.map((item) => {
            const product = productDetails[item.product_id];
            return (
              <div
                className="wishlist-item-wrapper"
                key={item.id}
                onClick={() => handleProductClick(item.product_id)}
                style={{ cursor: "pointer" }}
              >
                <ProductDisplay
                  product={{
                    id: item.product_id,
                    product_name: item.product_name,
                    price: product?.price || 0,
                    brand: product?.brand || "",
                    images: product?.imagePath
                      ? product.imagePath.split(",").map((url) => url.trim())
                      : [],
                  }}
                />
                <button
                  className="remove-button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveFromWishlist(item.id);
                  }}
                >
                  <FaTimes />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
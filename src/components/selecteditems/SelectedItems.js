import React from 'react';
import './SelectedItems.css';
import { useMutation } from "@apollo/client";
import { REMOVE_FROM_CART } from "../../graphql/mutations";
import { FaTimes } from "react-icons/fa";

const SelectedItems = ({ item, onRemove }) => {
  const [removeFromCart] = useMutation(REMOVE_FROM_CART, {
    onCompleted: () => {
      if (onRemove) onRemove(item.ShoppingCartID);
    },
    onError: (err) => {
      console.error("Failed to remove item from cart:", err.message);
    }
  });

  const handleDelete = () => {
    if (!item.ShoppingCartID) {
      console.warn("No ShoppingCartID provided");
      return;
    }

    removeFromCart({
      variables: { ShoppingCartID: item.ShoppingCartID }
    });
  };

  return (
    <div className="selected-item">
      <button className="remove-item-btn" onClick={handleDelete} title="Remove from cart">
        <FaTimes />
      </button>
      <img src={item.imagePath} alt={item.product_name} className="item-image" />
      <div className="item-info">
        <h4 className="item-name">{item.product_name}</h4>
        <p className="item-brand">{item.brand}</p>
        <p className="item-size">Size: {item.size_type || "N/A"}</p>
        <p className="item-qty">Quantity: {item.quantity}</p>
        <p className="item-price">Rp {item.price?.toLocaleString("id-ID")}</p>
      </div>
    </div>
  );
};

export default SelectedItems;

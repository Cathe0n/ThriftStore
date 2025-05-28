import React from 'react';
import './ShoppingBag.css';
import SelectedItems from '../../components/selecteditems/SelectedItems';
import { useAuth } from '../../context/AuthContext';

const ShoppingBag = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="shoppingbag-container">
        <h2>Shopping Bag</h2>
        <p className="empty-message">
          Please log in to view your shopping bag.
        </p>
      </div>
    );
  }

  return (
    <div className="shoppingbag-container">
      <h2>Shopping Bag</h2>

      <div className="location-box">
        <strong>LOCATION</strong>
        <p>Address: Jl. Alam Sutera Indah 5</p>
        <p>No.13 RT.02/RW.001</p>
      </div>

      <div className="content-area">
        <div className="items-list">
          <SelectedItems />
          <SelectedItems />
          {/* You can render dynamically based on user's bag later */}
        </div>

        <div className="payment-summary">
          <h4>PAYMENT SUMMARY</h4>
          <p>Total Price: Rp 400.000</p>
          <p>Shipping Cost: Rp 25.000</p>
          <h4>Total Billing: <strong>Rp 425.000</strong></h4>
          <button className="pay-now">PAY NOW</button>
        </div>
      </div>
    </div>
  );
};

export default ShoppingBag;

import React, { useEffect, useState } from 'react';
import './ShoppingBag.css';
import SelectedItems from '../../components/selecteditems/SelectedItems';
import { useAuth } from '../../context/AuthContext';
import { useLazyQuery, useMutation } from '@apollo/client';
import {
  GET_SHOPPINGCART_BY_CUSTOMER_ID,
  GET_PRODUCT_BY_ID,
  CREATE_ORDER,
  REMOVE_FROM_CART
} from '../../graphql/mutations';
import client from '../../apollo/client';
import { toast } from 'react-toastify';
import { FaCheckCircle, FaTimes } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ClipLoader } from 'react-spinners';

const ShoppingBag = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [cartItems, setCartItems] = useState([]);
  const [locationModalOpen, setLocationModalOpen] = useState(false);
  const [shippingAddress, setShippingAddress] = useState('');
  const [paymentConfirmed, setPaymentConfirmed] = useState(false);
  const [loading, setLoading] = useState(true);

  const [fetchCart] = useLazyQuery(GET_SHOPPINGCART_BY_CUSTOMER_ID, {
    fetchPolicy: 'network-only',
    onCompleted: async (res) => {
      const items = res?.getShoppingcartBycustomerId || [];

      const detailedItems = await Promise.all(
        items.map(async (item) => {
          console.log("item from backend:", item);
          try {
            const productRes = await client.query({
              query: GET_PRODUCT_BY_ID,
              variables: { id: item.product_id },
              fetchPolicy: 'network-only'
            });
            const product = productRes.data.getProductbyId;
            return {
              ...item,
              size_type: item.size_type,
              imagePath: product.imagePath?.split(',')[0]?.trim() || '',
              brand: product.brand,
              price: product.price,
              product_name: product.product_name,
              ShoppingCartID: item.id
            };
          } catch (err) {
            console.error(err);
            return item;
          }
        })
      );

      setCartItems(detailedItems);
      setLoading(false);
    },
    onError: (err) => {
      toast.error('Failed to fetch cart');
      console.error(err);
      setLoading(false);
    }
  });

  const [createOrder] = useMutation(CREATE_ORDER);
  const [removeFromCart] = useMutation(REMOVE_FROM_CART);

  useEffect(() => {
    if (user) {
      setLoading(true);
      fetchCart();
    }
  }, [user]);

  const handlePayNow = () => {
    if (!shippingAddress.trim()) {
      toast.error('Please enter your shipping address');
      return;
    }

    Promise.all(
      cartItems.map(async (item) => {
        try {
          await createOrder({
            variables: {
              product_id: item.product_id,
              quantity: item.quantity,
              size_type: item.size_type,
              location: shippingAddress
            }
          });
          await removeFromCart({ variables: { ShoppingCartID: item.ShoppingCartID } });
        } catch (err) {
          console.error('Order error:', err.message);
        }
      })
    ).then(() => {
      toast.success('Order placed!');
      setCartItems([]);
      setPaymentConfirmed(true);

      setTimeout(() => {
        setPaymentConfirmed(false);
        setLocationModalOpen(false);
        setShippingAddress('');
        navigate('/userTransaction');
      }, 2000);
    });
  };

  const handleRemoveFromState = async (id) => {
    const removedItem = cartItems.find((item) => item.ShoppingCartID === id);
    if (!removedItem) return;

    setCartItems((prev) =>
      prev.map((item) =>
        item.ShoppingCartID === id ? { ...item, removing: true } : item
      )
    );

    await new Promise((resolve) => setTimeout(resolve, 300)); // Wait for animation

    try {
      await removeFromCart({ variables: { ShoppingCartID: id } });
      toast.success('Item removed from cart');
      fetchCart(); // Refresh the cart
    } catch (err) {
      toast.error('Failed to remove item');
      console.error(err);
    }
  };

  const totalPrice = cartItems.reduce((acc, item) => acc + item.total_price, 0);
  const shippingCost = 25000;
  const billing = totalPrice + shippingCost;

  if (!user) {
    return (
      <div className="shoppingbag-container">
        <h2>Shopping Bag</h2>
        <p className="empty-message">Please log in to view your shopping bag.</p>
      </div>
    );
  }

  return (
    <div className="shoppingbag-container">
      <h2>Shopping Bag</h2>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>
          <ClipLoader size={50} color="#000" />
        </div>
      ) : (
        <div className="content-area">
          <div className="items-list">
            <AnimatePresence>
              {cartItems.map((item) =>
                !item.removing ? (
                  <motion.div
                    key={item.ShoppingCartID}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10, transition: { duration: 0.3 } }}
                  >
                    <SelectedItems item={item} onRemove={handleRemoveFromState} />
                  </motion.div>
                ) : null
              )}
            </AnimatePresence>
          </div>

          <div className="payment-summary-box">
            <h4>PAYMENT SUMMARY</h4>
            <p>Total Price: Rp {totalPrice.toLocaleString('id-ID')}</p>
            <p>Shipping Cost: Rp {shippingCost.toLocaleString('id-ID')}</p>
            <h4>
              Total Billing: <strong>Rp {billing.toLocaleString('id-ID')}</strong>
            </h4>
            <button className="pay-now" onClick={() => setLocationModalOpen(true)}>
              PAY NOW
            </button>
          </div>
        </div>
      )}

      {locationModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <button className="close-modal" onClick={() => setLocationModalOpen(false)}>
              <FaTimes />
            </button>
            <h3>Enter your Location:</h3>
            <textarea
              value={shippingAddress}
              onChange={(e) => setShippingAddress(e.target.value)}
              placeholder="Your address here..."
              rows={4}
            />
            <button className="pay-now" onClick={handlePayNow}>
              Confirm Payment
            </button>

            {paymentConfirmed && (
              <div className="confirmation">
                <FaCheckCircle className="tick-icon" />
                <p>Payment Confirmed!</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ShoppingBag;

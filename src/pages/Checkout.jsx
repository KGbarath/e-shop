import React, { useState, useContext } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';

function Checkout() {
  const { id } = useParams();
  const { state } = useLocation();
  const { cart, clearCart, loading, error: cartError } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [address, setAddress] = useState({
    street: '',
    city: '',
    state: '',
    zip: '',
    country: '',
  });
  const [paymentMethod, setPaymentMethod] = useState('credit_card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  const handleOrder = async (e) => {
    e.preventDefault();
    if (!user) {
      alert('Please log in to place an order.');
      navigate('/login');
      return;
    }
    setIsProcessing(true);
    setMessage('');

    try {
      let items, total;
      if (id && state?.product) {
        // Single product checkout
        const { product, quantity } = state;
        items = [{ productId: product._id, quantity, price: product.price }];
        total = product.price * quantity;
      } else {
        // Cart checkout
        if (!cart?.items?.length) {
          setMessage('Cart is empty.');
          setIsProcessing(false);
          return;
        }
        items = cart.items.map((item) => ({
          productId: item.productId._id,
          quantity: item.quantity,
          price: item.productId.price,
        }));
        total = items.reduce((acc, item) => acc + item.quantity * item.price, 0);
      }

      const orderData = {
        items,
        total,
        address,
        paymentMethod,
      };

      const res = await axios.post(
        'http://localhost:5000/api/orders',
        orderData,
        { headers: { Authorization: `Bearer ${user.token}` } }
      );

      if (res.status === 201) {
        setMessage('Order placed successfully!');
        if (!id) clearCart(); // Clear cart only for cart checkout
        setTimeout(() => navigate('/orders'), 2000);
      }
    } catch (err) {
      console.error('Error placing order:', err);
      setMessage(cartError || err.response?.data?.message || 'Failed to place order. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="checkout-container">
      <h2>Checkout</h2>
      {message && <p className="order-message">{message}</p>}
      {cartError && <p style={{ color: '#ff6f61' }}>{cartError}</p>}
      <form className="checkout-form" onSubmit={handleOrder}>
        <h3>Shipping Address</h3>
        <input
          name="street"
          placeholder="Street"
          value={address.street}
          onChange={handleChange}
          required
        />
        <input
          name="city"
          placeholder="City"
          value={address.city}
          onChange={handleChange}
          required
        />
        <input
          name="state"
          placeholder="State"
          value={address.state}
          onChange={handleChange}
          required
        />
        <input
          name="zip"
          placeholder="ZIP Code"
          value={address.zip}
          onChange={handleChange}
          required
        />
        <input
          name="country"
          placeholder="Country"
          value={address.country}
          onChange={handleChange}
          required
        />
        <h3>Payment Method</h3>
        <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
          <option value="credit_card">Credit Card</option>
          <option value="paypal">PayPal</option>
          <option value="cod">Cash on Delivery</option>
        </select>
        <button type="submit" disabled={isProcessing || loading}>
          {isProcessing || loading ? (
            <span>Processing... <span className="loader"></span></span>
          ) : (
            'Place Order'
          )}
        </button>
      </form>
    </div>
  );
}

export default Checkout;
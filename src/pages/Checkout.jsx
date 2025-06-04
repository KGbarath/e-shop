import React, { useState, useContext } from 'react';
import { CartContext } from '../context/CartContext';
import api from '../api';

function Checkout() {
  const { cart, setCart } = useContext(CartContext);
  const [address, setAddress] = useState({
    street: '', city: '', state: '', zip: '', country: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  const handleOrder = async () => {
    if (!cart.items.length) return setMessage('Cart is empty');

    const total = cart.items.reduce((acc, item) => acc + item.quantity * item.productId.price, 0);
    const items = cart.items.map(item => ({
      productId: item.productId._id,
      quantity: item.quantity,
      price: item.productId.price,
    }));

    try {
      setLoading(true);
      const res = await api.post('/orders', { items, total, address });
      setMessage('Order placed successfully!');
      setCart({ items: [] });
    } catch (err) {
      setMessage(err.response?.data?.message || 'Order failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Checkout</h2>
      <input name="street" placeholder="Street" onChange={handleChange} /><br/>
      <input name="city" placeholder="City" onChange={handleChange} /><br/>
      <input name="state" placeholder="State" onChange={handleChange} /><br/>
      <input name="zip" placeholder="ZIP Code" onChange={handleChange} /><br/>
      <input name="country" placeholder="Country" onChange={handleChange} /><br/>
      <button onClick={handleOrder} disabled={loading}>
        {loading ? 'Placing Order...' : 'Place Order'}
      </button>
      {message && <p>{message}</p>}
    </div>
  );
}

export default Checkout;

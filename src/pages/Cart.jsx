import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import api from '../api/api';

function Cart() {
  const { cart, setCart } = useContext(CartContext);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const res = await api.get('/cart');
        setCart(res.data);
      } catch (err) {
        setError('Failed to load cart. Please login again.');
      } finally {
        setLoading(false);
      }
    };
    fetchCart();
  }, [setCart]);

  const handleRemove = async (productId) => {
    try {
      await api.delete(`/cart/${productId}`);
      setCart(prev => ({
        ...prev,
        items: prev.items.filter(item => item.productId._id !== productId)
      }));
    } catch (err) {
      setError('Failed to remove item.');
    }
  };

  const handleCheckout = () => {
    navigate('/checkout');
  };

  if (loading) return <div>Loading Cart...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h2>Your Cart</h2>
      {cart?.items?.length > 0 ? (
        <>
          <ul>
            {cart.items.map((item) => (
              <li key={item.productId._id}>
                {item.productId.name} - Qty: {item.quantity}
                <button onClick={() => handleRemove(item.productId._id)}>Remove</button>
              </li>
            ))}
          </ul>
          <button onClick={handleCheckout}>Checkout</button>
        </>
      ) : (
        <p>No items in cart.</p>
      )}
    </div>
  );
}

export default Cart;

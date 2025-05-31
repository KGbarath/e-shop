import { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from './AuthContext';

export const CartContext = createContext();

// Define fetchCart outside the component to avoid scoping issues
const fetchCart = async (user, verifyToken, setCart, setUser, setLoading, setError) => {
  console.log('fetchCart called with user:', user);
  if (!user || !user.token) {
    console.log('No user or token, setting empty cart');
    setCart({ items: [] });
    return;
  }
  const isTokenValid = await verifyToken();
  if (!isTokenValid) {
    setCart({ items: [] });
    return;
  }
  try {
    setLoading(true);
    setError('');
    console.log('Fetching cart with token:', user.token);
    const res = await axios.get('http://localhost:5000/api/cart', {
      headers: { Authorization: `Bearer ${user.token}` },
    });
    console.log('Fetch cart response:', res.data);
    setCart(res.data);
  } catch (error) {
    console.error('Fetch cart error:', {
      status: error.response?.status,
      message: error.response?.data?.message || error.message,
    });
    if (error.response?.status === 401) {
      setUser(null);
      localStorage.removeItem('user');
      setError('Your session has expired. Please log in again.');
    } else {
      setError(error.response?.data?.message || 'Failed to fetch cart. Please try again later.');
    }
    setCart({ items: [] });
  } finally {
    setLoading(false);
  }
};

export const CartProvider = ({ children }) => {
  const { user, setUser, verifyToken, authError } = useContext(AuthContext);
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    console.log('useEffect in CartProvider triggered');
    if (typeof fetchCart !== 'function') {
      console.error('fetchCart is not a function. Current value:', fetchCart);
      return;
    }
    fetchCart(user, verifyToken, setCart, setUser, setLoading, setError);
  }, [user, setUser, verifyToken]);

  const addToCart = async (productId, quantity = 1) => {
    if (!user || !user.token) {
      setError('Please log in to add items to your cart.');
      return false;
    }
    const isTokenValid = await verifyToken();
    if (!isTokenValid) {
      setError('Your session has expired. Please log in again.');
      return false;
    }
    try {
      setLoading(true);
      setError('');
      if (!productId || quantity < 1) {
        setError('Invalid product or quantity.');
        return false;
      }
      const objectIdRegex = /^[0-9a-fA-F]{24}$/;
      if (!objectIdRegex.test(productId)) {
        setError('Invalid product ID. Please try again.');
        return false;
      }
      console.log('Adding to cart:', { productId, quantity, token: user.token });
      const res = await axios.post(
        'http://localhost:5000/api/cart',
        { productId, quantity },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      console.log('Add to cart response:', res.data);
      if (res.status === 200 || res.status === 201) {
        setCart(res.data);
        return true;
      }
      setError('Failed to add to cart. Please try again later.');
      return false;
    } catch (error) {
      console.error('Add to cart error:', {
        status: error.response?.status,
        message: error.response?.data?.message || error.message,
      });
      if (error.response?.status === 401) {
        setUser(null);
        localStorage.removeItem('user');
        setError('Your session has expired. Please log in again.');
      } else {
        setError(error.response?.data?.message || 'Error adding to cart. Please try again later.');
      }
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (productId, quantity) => {
    if (!user || !user.token) {
      setError('Please log in to update cart.');
      return;
    }
    const isTokenValid = await verifyToken();
    if (!isTokenValid) {
      setError('Your session has expired. Please log in again.');
      return;
    }
    try {
      setLoading(true);
      setError('');
      const objectIdRegex = /^[0-9a-fA-F]{24}$/;
      if (!objectIdRegex.test(productId)) {
        setError('Invalid product ID. Please try again.');
        return;
      }
      const res = await axios.put(
        'http://localhost:5000/api/cart',
        { productId, quantity },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      setCart(res.data);
    } catch (error) {
      console.error('Update quantity error:', {
        status: error.response?.status,
        message: error.response?.data?.message || error.message,
      });
      if (error.response?.status === 401) {
        setUser(null);
        localStorage.removeItem('user');
        setError('Your session has expired. Please log in again.');
      } else {
        setError(error.response?.data?.message || 'Error updating cart quantity. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (productId) => {
    if (!user || !user.token) {
      setError('Please log in to remove items from cart.');
      return;
    }
    const isTokenValid = await verifyToken();
    if (!isTokenValid) {
      setError('Your session has expired. Please log in again.');
      return;
    }
    try {
      setLoading(true);
      setError('');
      const objectIdRegex = /^[0-9a-fA-F]{24}$/;
      if (!objectIdRegex.test(productId)) {
        setError('Invalid product ID. Please try again.');
        return;
      }
      const res = await axios.delete(`http://localhost:5000/api/cart/${productId}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setCart(res.data);
    } catch (error) {
      console.error('Remove from cart error:', {
        status: error.response?.status,
        message: error.response?.data?.message || error.message,
      });
      if (error.response?.status === 401) {
        setUser(null);
        localStorage.removeItem('user');
        setError('Your session has expired. Please log in again.');
      } else {
        setError(error.response?.data?.message || 'Error removing from cart. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async () => {
    if (!user || !user.token) {
      setError('Please log in to clear cart.');
      return;
    }
    const isTokenValid = await verifyToken();
    if (!isTokenValid) {
      setError('Your session has expired. Please log in again.');
      return;
    }
    try {
      setLoading(true);
      setError('');
      await axios.delete('http://localhost:5000/api/cart', {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setCart({ items: [] });
    } catch (error) {
      console.error('Clear cart error:', {
        status: error.response?.status,
        message: error.response?.data?.message || error.message,
      });
      if (error.response?.status === 401) {
        setUser(null);
        localStorage.removeItem('user');
        setError('Your session has expired. Please log in again.');
      } else {
        setError(error.response?.data?.message || 'Error clearing cart. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, updateQuantity, removeFromCart, clearCart, loading, error }}>
      {children}
    </CartContext.Provider>
  );
};
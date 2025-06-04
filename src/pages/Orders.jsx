import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import OrderSummary from '../components/OrderSummary';
import axios from 'axios';

function Orders() {
  const { user, verifyToken } = useContext(AuthContext);
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) {
        navigate('/login');
        return;
      }
      const isTokenValid = await verifyToken();
      if (!isTokenValid) {
        navigate('/login');
        return;
      }
      try {
        const res = await axios.get('http://localhost:5000/api/orders', {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setOrders(res.data);
      } catch (err) {
        console.error('Error fetching orders:', err);
        setError('Failed to load orders. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [user, verifyToken, navigate]);

  if (loading) return <div className="container">Loading orders...<span className="loader"></span></div>;
  if (error) return <div className="container">{error}</div>;

  return (
    <div className="container">
      <h2>Your Orders</h2>
      {orders.length > 0 ? (
        <div className="orders-list">
          {orders.map((order) => (
            <div key={order._id} className="order-card">
              <OrderSummary order={order} />
            </div>
          ))}
        </div>
      ) : (
        <p>You have no orders yet.</p>
      )}
    </div>
  );
}

export default Orders;
import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import '../styles/Profile.css';

function Profile() {
  const { user, verifyToken, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user || !user.token) {
      navigate('/login', { state: { from: '/profile' } });
      return;
    }

    const fetchOrders = async () => {
      const isTokenValid = await verifyToken();
      if (!isTokenValid) {
        navigate('/login', { state: { from: '/profile' } });
        return;
      }

      try {
        setLoading(true);
        setError('');
        const res = await axios.get('http://localhost:5000/api/orders/my-orders', {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setOrders(res.data);
      } catch (error) {
        console.error('Fetch orders error:', {
          status: error.response?.status,
          message: error.response?.data?.message || error.message,
        });
        if (error.response?.status === 401) {
          navigate('/login', { state: { from: '/profile' } });
        } else {
          setError(error.response?.data?.message || 'Failed to fetch orders. Please try again later.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user, navigate, verifyToken]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="container">
        <h2>Loading Profile...</h2>
        <span className="loader"></span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <h2>Error</h2>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="container">
      <h2>Profile</h2>
      <div className="profile-details">
        <h3>User Details</h3>
        <p><strong>Name:</strong> {user?.name || 'N/A'}</p>
        <p><strong>Email:</strong> {user?.email || 'N/A'}</p>
        <button className="btn logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>
      <div className="order-history">
        <h3>Order History</h3>
        {orders.length > 0 ? (
          <div className="orders-list">
            {orders.map((order) => (
              <div key={order._id} className="order-card">
                <p><strong>Order ID:</strong> {order._id}</p>
                <p><strong>Total:</strong> ${order.total.toFixed(2)}</p>
                <p><strong>Date:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>
                <h4>Items:</h4>
                <ul>
                  {order.items.map((item, index) => (
                    <li key={index}>
                      Product ID: {item.productId} (x{item.quantity}) - ${item.price.toFixed(2)}
                    </li>
                  ))}
                </ul>
                <h4>Shipping Address:</h4>
                <p>
                  {order.address.street}, {order.address.city}, {order.address.state}, {order.address.zip}, {order.address.country}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p>No orders found.</p>
        )}
      </div>
    </div>
  );
}

export default Profile;
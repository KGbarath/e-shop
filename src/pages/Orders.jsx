import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import OrderSummary from '../components/OrderSummary';

function Orders() {
  const { user } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (user) {
      axios
        .get('http://localhost:5000/api/orders', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        })
        .then((res) => setOrders(res.data))
        .catch((error) => console.error('Failed to fetch orders:', error));
    }
  }, [user]);

  if (!user) return <div className="container">Please log in</div>;

  return (
    <div className="container">
      <h2 style={{ fontSize: '24px', marginBottom: '20px' }}>Your Orders</h2>
      {orders.length === 0 ? (
        <p>No orders found</p>
      ) : (
        <div>
          {orders.map((order) => (
            <OrderSummary key={order._id} order={order} />
          ))}
        </div>
      )}
    </div>
  );
}

export default Orders;
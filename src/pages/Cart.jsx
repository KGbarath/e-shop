import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import CartItem from '../components/CartItem';

function Cart() {
  const { cart, removeFromCart, updateQuantity, loading, error } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (!user) {
      alert('Please log in to proceed to checkout.');
      navigate('/login');
      return;
    }
    if (!cart?.items?.length) {
      alert('Your cart is empty.');
      return;
    }
    navigate('/checkout');
  };

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity < 1) return;
    updateQuantity(productId, newQuantity);
  };

  if (loading) return <div className="cart-container">Loading Cart...<span className="loader"></span></div>;
  if (error) return <div className="cart-container">{error}</div>;

  const total = cart?.items?.reduce((acc, item) => acc + item.quantity * item.productId.price, 0) || 0;

  return (
    <div className="cart-container">
      <h2>Your Cart</h2>
      {cart?.items?.length > 0 ? (
        <>
          <div className="cart-grid">
            {cart.items.map((item) => (
              <div key={item.productId._id} className="cart-card">
                <CartItem item={item} />
                <div style={{ marginTop: '10px' }}>
                  <button
                    onClick={() => handleQuantityChange(item.productId._id, item.quantity - 1)}
                    disabled={item.quantity <= 1 || loading}
                  >
                    -
                  </button>
                  <span style={{ margin: '0 10px' }}>{item.quantity}</span>
                  <button
                    onClick={() => handleQuantityChange(item.productId._id, item.quantity + 1)}
                    disabled={loading}
                  >
                    +
                  </button>
                  <button
                    onClick={() => removeFromCart(item.productId._id)}
                    disabled={loading}
                    style={{ marginLeft: '10px' }}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="order-summary">
            <h3>Cart Summary</h3>
            <p>Total: ${total.toFixed(2)}</p>
            <button className="checkout-button" onClick={handleCheckout} disabled={loading}>
              Proceed to Checkout
            </button>
          </div>
        </>
      ) : (
        <p>Your cart is empty.</p>
      )}
    </div>
  );
}

export default Cart;
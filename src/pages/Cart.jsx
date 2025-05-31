import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import '../styles/Cart.css';

function Cart() {
  const { cart, loading, error, removeFromCart, updateQuantity } = useContext(CartContext);
  const navigate = useNavigate();

  const handleCheckout = () => {
    navigate('/checkout');
  };

  if (loading) {
    return (
      <div className="container">
        <h2>Loading Cart...</h2>
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
      <h2>Your Cart</h2>
      {cart?.items?.length > 0 ? (
        <>
          <div className="cart-items">
            {cart.items.map((item) => (
              item.productId?._id ? (
                <div key={item.productId._id} className="cart-item">
                  <h3>{item.productId.name}</h3>
                  <p>Price: ${item.productId.price.toFixed(2)}</p>
                  <p>Quantity: {item.quantity}</p>
                  <button
                    className="btn"
                    onClick={() => updateQuantity(item.productId._id, item.quantity + 1)}
                  >
                    +
                  </button>
                  <button
                    className="btn"
                    onClick={() => updateQuantity(item.productId._id, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                  >
                    -
                  </button>
                  <button
                    className="btn"
                    onClick={() => removeFromCart(item.productId._id)}
                  >
                    Remove
                  </button>
                </div>
              ) : null
            ))}
          </div>
          <button className="btn checkout-btn" onClick={handleCheckout}>
            Proceed to Checkout
          </button>
        </>
      ) : (
        <p>Your cart is empty.</p>
      )}
    </div>
  );
}

export default Cart;
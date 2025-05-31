import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';

function ProductCard({ product }) {
  const { addToCart, loading, error: cartError } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isAdding, setIsAdding] = useState(false);
  const [error, setError] = useState('');

  const handleAddToCart = async () => {
    if (!user) {
      alert('Please log in to add items to your cart.');
      navigate('/login');
      return;
    }
    setIsAdding(true);
    setError('');
    try {
      const success = await addToCart(product._id, 1);
      if (success) {
        alert('Product added to cart successfully!');
      } else {
        setError(cartError || 'Failed to add product to cart. Please try again.');
      }
    } catch (err) {
      setError('Error adding to cart: ' + (err.message || 'Unknown error'));
    } finally {
      setIsAdding(false);
    }
  };

  const handleBuyNow = () => {
    if (!user) {
      alert('Please log in to buy this product.');
      navigate('/login');
      return;
    }
    navigate(`/checkout/${product._id}`, { state: { product } });
  };

  return (
    <div className="product-card">
      <Link to={`/products/${product._id}`}>
        <img src={product.images[0]} alt={product.name} />
        <h3>{product.name}</h3>
      </Link>
      <p className="price">${product.price}</p>
      <p className="rating">{'★'.repeat(Math.round(product.rating))}</p>
      {error && <p style={{ color: '#ff6f61', fontSize: '14px' }}>{error}</p>}
      <button onClick={handleAddToCart} disabled={isAdding || loading} aria-label={`Add ${product.name} to cart`}>
        {isAdding || loading ? (
          <span>Adding... <span className="loader"></span></span>
        ) : (
          'Add to Cart'
        )}
      </button>
      <button
        className="buy-btn"
        onClick={handleBuyNow}
        style={{ marginLeft: '10px' }}
        aria-label={`Buy ${product.name} now`}
      >
        Buy Now
      </button>
    </div>
  );
}

export default ProductCard;
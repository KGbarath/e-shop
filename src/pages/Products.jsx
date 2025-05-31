import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { CartContext } from '../context/CartContext';
import { useNavigate, useLocation } from 'react-router-dom';

function Products() {
  const { addToCart } = useContext(CartContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError('');
        const searchParams = new URLSearchParams(location.search);
        const searchQuery = searchParams.get('search') || '';
        const res = await axios.get('http://localhost:5000/api/products', {
          params: { search: searchQuery },
        });
        console.log('Fetch products response:', res.data);
        setProducts(res.data);
      } catch (error) {
        console.error('Fetch products error:', {
          status: error.response?.status,
          message: error.response?.data?.message || error.message,
        });
        setError(error.response?.data?.message || 'Failed to load products. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [location.search]);

  const handleAddToCart = async (productId) => {
    const success = await addToCart(productId);
    if (!success) {
      console.log('Add to cart failed');
    }
  };

  const handleBuyNow = (product) => {
    navigate(`/checkout/${product._id}`, { state: { product } });
  };

  if (loading) {
    return (
      <div className="container">
        <h2>Loading Products...</h2>
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
      <h2>Products</h2>
      <div className="product-list">
        {products.length > 0 ? (
          products.map((product) => (
            <div key={product._id} className="product-card">
              {product.images && product.images.length > 0 ? (
                <img src={product.images[0]} alt={product.name} className="product-image" />
              ) : (
                <div className="product-image-placeholder">No Image Available</div>
              )}
              <h3>{product.name}</h3>
              <p>Price: ${product.price.toFixed(2)}</p>
              <p>{product.description}</p>
              <button className="btn" onClick={() => handleAddToCart(product._id)}>
                Add to Cart
              </button>
              <button className="btn" onClick={() => handleBuyNow(product)}>
                Buy Now
              </button>
            </div>
          ))
        ) : (
          <p>No products available.</p>
        )}
      </div>
    </div>
  );
}

export default Products;
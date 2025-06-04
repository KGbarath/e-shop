import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';

function ProductDetails() {
  const { id } = useParams();
  const { addToCart, loading, error: cartError } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loadingProduct, setLoadingProduct] = useState(true);
  const [error, setError] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [review, setReview] = useState({ rating: 5, comment: '' });
  const [reviews, setReviews] = useState([]);

  const mockProduct = {
    _id: id,
    name: 'Sample Product',
    price: 99,
    images: ['https://via.placeholder.com/350'],
    category: 'Sample Category',
    description: 'This is a sample product description.',
    rating: 4.5,
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/products/${id}`);
        setProduct(res.data);
        setReviews(res.data.reviews || []);
      } catch (err) {
        console.error('Error fetching product:', err);
        setError('Failed to load product. Showing mock data instead.');
        setProduct(mockProduct);
        setReviews([]);
      } finally {
        setLoadingProduct(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    if (!user) {
      alert('Please log in to add items to your cart.');
      navigate('/login');
      return;
    }
    setIsAdding(true);
    setError('');
    try {
      const success = await addToCart(product._id, quantity);
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
    navigate(`/checkout/${product._id}`, { state: { product, quantity } });
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      alert('Please log in to submit a review.');
      navigate('/login');
      return;
    }
    try {
      const res = await axios.post(
        `http://localhost:5000/api/products/${id}/reviews`,
        { rating: review.rating, comment: review.comment },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      setReviews([...reviews, res.data]);
      setReview({ rating: 5, comment: '' });
      alert('Review submitted successfully!');
    } catch (err) {
      console.error('Error submitting review:', err);
      alert('Failed to submit review. Please try again.');
    }
  };

  if (loadingProduct) return <div className="container">Loading product...<span className="loader"></span></div>;
  if (!product) return <div className="container">{error || 'Product not found.'}</div>;

  return (
    <div className="container">
      <div className="product-details">
        <img src={product.images[0]} alt={product.name} />
        <div>
          <h2>{product.name}</h2>
          <p className="price">${product.price}</p>
          <p>Category: {product.category}</p>
          <p>{product.description}</p>
          <p className="rating">{'★'.repeat(Math.round(product.rating))}</p>
          <div className="form-group">
            <label>Quantity:</label>
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value)))}
            />
          </div>
          {error && <p style={{ color: '#ff6f61', fontSize: '14px' }}>{error}</p>}
          <button onClick={handleAddToCart} disabled={isAdding || loading}>
            {isAdding || loading ? (
              <span>Adding... <span className="loader"></span></span>
            ) : (
              'Add to Cart'
            )}
          </button>
          <button className="buy-btn" onClick={handleBuyNow} style={{ marginLeft: '10px' }}>
            Buy Now
          </button>
        </div>
      </div>
      <div className="reviews">
        <h3>Reviews</h3>
        {reviews.length > 0 ? (
          reviews.map((rev, index) => (
            <div key={index} className="review">
              <p>Rating: {'★'.repeat(rev.rating)}</p>
              <p>{rev.comment}</p>
              <p>By: {rev.user?.name || 'Anonymous'}</p>
            </div>
          ))
        ) : (
          <p>No reviews yet.</p>
        )}
        <div className="review-form">
          <h4>Write a Review</h4>
          <form onSubmit={handleReviewSubmit}>
            <div className="form-group">
              <label>Rating:</label>
              <select
                value={review.rating}
                onChange={(e) => setReview({ ...review, rating: parseInt(e.target.value) })}
              >
                {[1, 2, 3, 4, 5].map((num) => (
                  <option key={num} value={num}>{num} Stars</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Comment:</label>
              <textarea
                value={review.comment}
                onChange={(e) => setReview({ ...review, comment: e.target.value })}
                placeholder="Write your review..."
                required
              ></textarea>
            </div>
            <button type="submit">Submit Review</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;
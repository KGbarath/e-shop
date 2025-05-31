import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useContext } from 'react';
import { CartContext } from '../context/CartContext';

function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const { addToCart } = useContext(CartContext);
  const [reviews, setReviews] = useState([
    { id: 1, user: 'John Doe', rating: 4, comment: 'Great product!' },
    { id: 2, user: 'Jane Smith', rating: 5, comment: 'Absolutely love it!' },
  ]);
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });

  useEffect(() => {
    axios.get(`http://localhost:5000/api/products/${id}`)
      .then((res) => setProduct(res.data))
      .catch((error) => console.error('Failed to fetch product:', error));
  }, [id]);

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    setReviews([...reviews, {
      id: reviews.length + 1,
      user: 'Current User', // Replace with actual user data if available
      rating: newReview.rating,
      comment: newReview.comment,
    }]);
    setNewReview({ rating: 5, comment: '' });
  };

  if (!product) return <div className="container">Loading...</div>;

  return (
    <div className="container">
      <div className="product-details">
        <img src={product.images[0] || 'https://via.placeholder.com/300'} alt={product.name} />
        <div>
          <h2 style={{ fontSize: '24px' }}>{product.name}</h2>
          <p>{product.description || 'No description available'}</p>
          <p style={{ fontSize: '18px', fontWeight: 'bold', color: '#e91e63' }}>${product.price}</p>
          <p>Category: {product.category || 'N/A'}</p>
          <p>Stock: {product.stock || 'N/A'}</p>
          <button className="btn" onClick={() => addToCart(product._id, 1)}>Add to Cart</button>
        </div>
      </div>
      <div className="reviews">
        <h3>Reviews</h3>
        {reviews.length === 0 ? (
          <p>No reviews yet</p>
        ) : (
          reviews.map((review) => (
            <div key={review.id} className="review">
              <p><strong>{review.user}</strong> ({'★'.repeat(review.rating) + '☆'.repeat(5 - review.rating)})</p>
              <p>{review.comment}</p>
            </div>
          ))
        )}
        <div className="review-form">
          <h4>Write a Review</h4>
          <div>
            <div className="form-group">
              <label>Rating</label>
              <select
                value={newReview.rating}
                onChange={(e) => setNewReview({ ...newReview, rating: parseInt(e.target.value) })}
              >
                {[1, 2, 3, 4, 5].map((num) => (
                  <option key={num} value={num}>{num} Stars</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Comment</label>
              <textarea
                value={newReview.comment}
                onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                rows="3"
              />
            </div>
            <button className="btn" onClick={handleReviewSubmit}>Submit Review</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;
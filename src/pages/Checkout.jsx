import { useState, useContext, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import axios from 'axios';

function Checkout() {
  const { user, verifyToken } = useContext(AuthContext);
  const { cart, clearCart, loading } = useContext(CartContext);
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [address, setAddress] = useState({
    street: '',
    city: '',
    state: '',
    zip: '',
    country: '',
  });
  const [step, setStep] = useState('address'); // Steps: address, confirm, success, failed
  const [singleProduct, setSingleProduct] = useState(location.state?.product || null);
  const [productLoading, setProductLoading] = useState(false);
  const [productError, setProductError] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    console.log('Checkout useEffect - User state:', user);
    if (!user || !user.token) {
      console.log('No user or token, redirecting to login');
      navigate('/login', { state: { from: location.pathname } });
      return;
    }

    const checkTokenAndFetchProduct = async () => {
      const isTokenValid = await verifyToken();
      if (!isTokenValid) {
        setProductError('Your session has expired. Please log in again.');
        navigate('/login', { state: { from: location.pathname } });
        return;
      }

      if (id && !singleProduct) {
        setProductLoading(true);
        setProductError(null);
        try {
          console.log('Fetching product with token:', user.token);
          const res = await axios.get(`http://localhost:5000/api/products/${id}`, {
            headers: { Authorization: `Bearer ${user.token}` },
          });
          if (res.status === 200) {
            const product = res.data;
            // Validate that product._id is a valid ObjectId (24-character hex string)
            const objectIdRegex = /^[0-9a-fA-F]{24}$/;
            if (!product._id || !objectIdRegex.test(product._id)) {
              throw new Error('Invalid product ID received from server');
            }
            // Validate required product fields
            if (!product.name || typeof product.price !== 'number' || product.price < 0) {
              throw new Error('Product data is incomplete or invalid');
            }
            setSingleProduct(product);
          } else {
            setProductError('Failed to load product. Please try again later.');
          }
        } catch (err) {
          console.error('Fetch product error:', {
            status: err.response?.status,
            message: err.response?.data?.message || err.message,
          });
          if (err.response?.status === 401) {
            console.log('Unauthorized when fetching product, redirecting to login');
            navigate('/login', { state: { from: location.pathname } });
          } else {
            setProductError(err.message || 'Failed to load product. Please try again later.');
          }
        } finally {
          setProductLoading(false);
        }
      }
    };

    checkTokenAndFetchProduct();
  }, [user, navigate, id, singleProduct, location.pathname, verifyToken]);

  const handleAddressChange = (e) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  const handleProceedToConfirm = () => {
    if (!address.street || !address.city || !address.state || !address.zip || !address.country) {
      alert('Please fill in all address fields.');
      return;
    }
    setStep('confirm');
  };

  const handlePayment = async () => {
    console.log('User state before placing order:', user);
    if (!user?.token) {
      setErrorMessage('Authentication error. Please log in again.');
      navigate('/login', { state: { from: location.pathname } });
      return;
    }

    const isTokenValid = await verifyToken();
    if (!isTokenValid) {
      setErrorMessage('Your session has expired. Please log in again.');
      navigate('/login', { state: { from: location.pathname } });
      return;
    }

    try {
      const orderData = {
        items: singleProduct
          ? [{ productId: singleProduct._id, quantity: 1, price: singleProduct.price }]
          : (cart?.items || []).map((item) => ({
              productId: item.productId?._id,
              quantity: item.quantity,
              price: item.productId?.price || 0,
            })),
        total: singleProduct
          ? singleProduct.price
          : (cart?.items || []).reduce((sum, item) => sum + (item.quantity * (item.productId?.price || 0)), 0),
        address,
      };

      if (!orderData.items.every(item => item.productId && /^[0-9a-fA-F]{24}$/.test(item.productId))) {
        setErrorMessage('One or more products in your order are invalid. Please try again.');
        setStep('failed');
        return;
      }
      if (!orderData.items.every(item => item.quantity > 0 && item.price >= 0)) {
        setErrorMessage('Order contains invalid items (quantity or price). Please try again.');
        setStep('failed');
        return;
      }
      if (!orderData.total || orderData.total <= 0) {
        setErrorMessage('Total amount is invalid. Please try again.');
        setStep('failed');
        return;
      }
      if (!orderData.address || !Object.values(orderData.address).every(val => val)) {
        setErrorMessage('Please fill in all address fields.');
        setStep('failed');
        return;
      }

      console.log('Placing order:', orderData);

      if (!orderData.items.length) {
        setErrorMessage('No items to purchase. Please add items to your cart.');
        setStep('failed');
        return;
      }

      const response = await axios.post('http://localhost:5000/api/orders', orderData, {
        headers: { Authorization: `Bearer ${user.token}` },
      });

      console.log('Order response:', {
        status: response.status,
        data: response.data,
      });

      if (response.status === 201) {
        if (!singleProduct) {
          await clearCart();
        }
        setStep('success');
      } else {
        setErrorMessage('Failed to place order. Please try again later.');
        setStep('failed');
      }
    } catch (error) {
      console.error('Order error:', {
        status: error.response?.status,
        message: error.response?.data?.message || error.message,
        stack: error.stack,
      });
      if (error.response?.status === 401) {
        setErrorMessage('Your session has expired. Please log in again.');
        navigate('/login', { state: { from: location.pathname } });
      } else {
        setErrorMessage(error.response?.data?.message || 'Error processing your order. Please try again later.');
        setStep('failed');
      }
    }
  };

  if (productLoading) {
    return (
      <div className="container">
        <h2>Loading Product...</h2>
        <span className="loader"></span>
      </div>
    );
  }

  if (productError) {
    return (
      <div className="container">
        <h2>Error</h2>
        <p>{productError}</p>
        <button className="btn" onClick={() => navigate('/products')}>Back to Products</button>
      </div>
    );
  }

  if (!singleProduct && id) {
    return (
      <div className="container">
        <h2>Product Not Found</h2>
        <button className="btn" onClick={() => navigate('/products')}>Back to Products</button>
      </div>
    );
  }

  if (step === 'success') {
    const cartItems = cart?.items || [];
    const total = singleProduct
      ? singleProduct.price
      : cartItems.reduce((sum, item) => sum + (item.quantity * (item.productId?.price || 0)), 0);

    return (
      <div className="container">
        <h2>Order Successful! 🎉</h2>
        <div className="order-summary">
          <h3>Order Details</h3>
          <p><strong>Items:</strong></p>
          <ul>
            {singleProduct ? (
              <li key={singleProduct._id}>{singleProduct.name} - ${singleProduct.price.toFixed(2)}</li>
            ) : cartItems.length > 0 ? (
              cartItems.map((item) => (
                item.productId?._id ? (
                  <li key={item.productId._id}>
                    {item.productId.name} (x{item.quantity}) - ${(item.quantity * (item.productId.price || 0)).toFixed(2)}
                  </li>
                ) : null
              ))
            ) : (
              <li>No items found.</li>
            )}
          </ul>
          <p>
            <strong>Total:</strong> ${total.toFixed(2)}
          </p>
          <h3>Shipping Address</h3>
          <p>{address.street}, {address.city}, {address.state}, {address.zip}, {address.country}</p>
        </div>
        <button className="btn" onClick={() => navigate('/')}>Back to Home</button>
      </div>
    );
  }

  if (step === 'failed') {
    return (
      <div className="container">
        <h2>Order Failed</h2>
        <p>{errorMessage || 'Something went wrong. Please try again.'}</p>
        <button className="btn" onClick={() => setStep('address')}>Try Again</button>
        <button className="btn" onClick={() => navigate('/products')} style={{ marginLeft: '10px' }}>
          Back to Products
        </button>
      </div>
    );
  }

  if (step === 'confirm') {
    const cartItems = cart?.items || [];
    const total = singleProduct
      ? singleProduct.price
      : cartItems.reduce((sum, item) => sum + (item.quantity * (item.productId?.price || 0)), 0);

    return (
      <div className="container">
        <h2>Confirm Your Order</h2>
        <div className="order-summary">
          <h3>Order Summary</h3>
          {singleProduct ? (
            <div>
              <p>{singleProduct.name} - ${singleProduct.price.toFixed(2)}</p>
              <p><strong>Total:</strong> ${singleProduct.price.toFixed(2)}</p>
            </div>
          ) : cartItems.length > 0 ? (
            <>
              {cartItems.map((item) => (
                item.productId?._id ? (
                  <div key={item.productId._id}>
                    <p>{item.productId.name} (x{item.quantity}) - ${(item.quantity * (item.productId.price || 0)).toFixed(2)}</p>
                  </div>
                ) : null
              ))}
              <p>
                <strong>Total:</strong> ${total.toFixed(2)}
              </p>
            </>
          ) : (
            <p>No items in cart.</p>
          )}
          <h3>Shipping Address</h3>
          <p>{address.street}, {address.city}, {address.state}, {address.zip}, {address.country}</p>
        </div>
        <button className="btn" onClick={handlePayment} disabled={loading}>
          {loading ? (
            <span>Processing... <span className="loader"></span></span>
          ) : (
            'Confirm Order'
          )}
        </button>
        <button
          className="btn"
          onClick={() => setStep('address')}
          style={{ marginLeft: '10px', background: 'linear-gradient(90deg, #b2dfdb, #d1eceb)' }}
        >
          Edit Address
        </button>
      </div>
    );
  }

  return (
    <div className="container">
      <h2>Shipping Address</h2>
      <div className="form-group">
        <label>Street</label>
        <input type="text" name="street" value={address.street} onChange={handleAddressChange} />
      </div>
      <div className="form-group">
        <label>City</label>
        <input type="text" name="city" value={address.city} onChange={handleAddressChange} />
      </div>
      <div className="form-group">
        <label>State</label>
        <input type="text" name="state" value={address.state} onChange={handleAddressChange} />
      </div>
      <div className="form-group">
        <label>ZIP Code</label>
        <input type="text" name="zip" value={address.zip} onChange={handleAddressChange} />
      </div>
      <div className="form-group">
        <label>Country</label>
        <input type="text" name="country" value={address.country} onChange={handleAddressChange} />
      </div>
      <button className="btn" onClick={handleProceedToConfirm}>Proceed to Confirm</button>
    </div>
  );
}

export default Checkout;
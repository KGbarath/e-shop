import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function OfferPopup() {
  const [isVisible, setIsVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if popup was closed in this session
    const hasClosedPopup = sessionStorage.getItem('popupClosed');
    if (hasClosedPopup === 'true') {
      setIsVisible(false);
      return;
    }

    // Show popup after 5 seconds
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsVisible(false);
      sessionStorage.setItem('popupClosed', 'true'); // Use sessionStorage for session persistence
    }, 500);
  };

  if (!isVisible) return null;

  return (
    <>
      <div className="offer-overlay" onClick={handleClose}></div>
      <div className={`offer-popup ${isClosing ? 'closing' : ''}`}>
        <button className="close-btn" onClick={handleClose}>✖</button>
        <h3>Get 20% Off!</h3>
        <p>Use code: SAVE20 at checkout</p>
        <button onClick={() => navigate('/products')}>Shop Now</button>
      </div>
    </>
  );
}

export default OfferPopup;
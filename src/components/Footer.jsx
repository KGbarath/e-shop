import { useState } from 'react';

function Footer() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (email) {
      setMessage('Thank you for subscribing!');
      setEmail('');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  return (
    <footer className="footer">
      <div className="container">
        <div className="newsletter">
          <h3>Subscribe to Our Newsletter</h3>
          <div>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button onClick={handleNewsletterSubmit}>Subscribe</button>
          </div>
          {message && <p style={{ marginTop: '10px' }}>{message}</p>}
        </div>
        <p>© 2025 E-Shop. All rights reserved.</p>
        <div>
          <a href="/about">About</a>
          <a href="/contact">Contact</a>
          <a href="https://twitter.com">Twitter</a>
          <a href="https://facebook.com">Facebook</a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
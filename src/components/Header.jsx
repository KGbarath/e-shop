import { useContext, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import axios from 'axios';

function Header() {
  const { user, logout } = useContext(AuthContext);
  const { cart } = useContext(CartContext);
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const categories = ['Electronics', 'Clothing', 'Books', 'Home', 'Toys'];

  const mockProducts = [
    { _id: 'mock1', name: 'Smartphone', price: 699, category: 'Electronics' },
    { _id: 'mock2', name: 'Laptop', price: 1299, category: 'Electronics' },
    { _id: 'mock3', name: 'T-Shirt', price: 29, category: 'Clothing' },
    { _id: 'mock4', name: 'Jeans', price: 59, category: 'Clothing' },
    { _id: 'mock5', name: 'Book: Sci-Fi', price: 19, category: 'Books' },
    { _id: 'mock6', name: 'Book: Fantasy', price: 24, category: 'Books' },
    { _id: 'mock7', name: 'Headphones', price: 99, category: 'Electronics' },
    { _id: 'mock8', name: 'Tablet', price: 499, category: 'Electronics' },
    { _id: 'mock9', name: 'Jacket', price: 89, category: 'Clothing' },
    { _id: 'mock10', name: 'Sneakers', price: 69, category: 'Clothing' },
    { _id: 'mock11', name: 'Book: Mystery', price: 22, category: 'Books' },
    { _id: 'mock12', name: 'Book: Romance', price: 18, category: 'Books' },
    { _id: 'mock13', name: 'Lamp', price: 45, category: 'Home' },
    { _id: 'mock14', name: 'Chair', price: 120, category: 'Home' },
    { _id: 'mock15', name: 'Teddy Bear', price: 25, category: 'Toys' },
    { _id: 'mock16', name: 'Puzzle', price: 15, category: 'Toys' },
    { _id: 'mock17', name: 'Smartwatch', price: 199, category: 'Electronics' },
    { _id: 'mock18', name: 'Dress', price: 49, category: 'Clothing' },
    { _id: 'mock19', name: 'Book: History', price: 30, category: 'Books' },
    { _id: 'mock20', name: 'Rug', price: 80, category: 'Home' },
    { _id: 'mock21', name: 'Toy Car', price: 20, category: 'Toys' },
    { _id: 'mock22', name: 'Speaker', price: 150, category: 'Electronics' },
    { _id: 'mock23', name: 'Sofa', price: 450, category: 'Home' },
    { _id: 'mock24', name: 'Board Game', price: 35, category: 'Toys' },
    { _id: 'mock25', name: 'Scarf', price: 15, category: 'Clothing' },
  ];

  useEffect(() => {
    axios.get('http://localhost:5000/api/products')
      .then((res) => {
        setAllProducts([...res.data, ...mockProducts]);
      })
      .catch((error) => {
        console.error('Failed to fetch products for suggestions:', error);
        setAllProducts(mockProducts);
      });
  }, []);

  useEffect(() => {
    if (searchQuery.trim()) {
      const filteredSuggestions = allProducts
        .filter((product) =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .slice(0, 5);
      setSuggestions(filteredSuggestions);
    } else {
      setSuggestions([]);
    }
  }, [searchQuery, allProducts]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${searchQuery}`);
      setSuggestions([]);
      setIsMenuOpen(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion.name);
    navigate(`/products?search=${suggestion.name}`);
    setSuggestions([]);
    setIsMenuOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    setIsDropdownOpen(false);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <header className="header">
      <div className="container">
        <Link to="/" className="logo">E-Shop</Link>
        <button className="hamburger" onClick={toggleMenu}>
          {isMenuOpen ? '✖' : '☰'}
        </button>
        <nav className="nav-links" style={isMenuOpen ? { display: 'flex' } : {}}>
          <Link to="/products">Products</Link>
          <div className={`dropdown ${isDropdownOpen ? 'active' : ''}`}>
            <button className="dropdown-toggle" onClick={toggleDropdown}>
              Categories
            </button>
            <div className="dropdown-menu">
              {categories.map((category) => (
                <Link
                  key={category}
                  to={`/products?category=${category}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {category}
                </Link>
              ))}
            </div>
          </div>
          {user ? (
            <>
              <Link to="/profile" onClick={() => setIsMenuOpen(false)}>Profile</Link>
              <Link to="/cart" onClick={() => setIsMenuOpen(false)}>
                Cart ({cart?.items.length || 0})
              </Link>
              <Link to="/orders" onClick={() => setIsMenuOpen(false)}>Orders</Link>
              <button
                onClick={() => {
                  logout();
                  navigate('/');
                  setIsMenuOpen(false);
                }}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setIsMenuOpen(false)}>Login</Link>
              <Link to="/register" onClick={() => setIsMenuOpen(false)}>Register</Link>
            </>
          )}
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button onClick={handleSearch}>🔍</button>
            {suggestions.length > 0 && (
              <div className="search-suggestions">
                {suggestions.map((suggestion) => (
                  <div
                    key={suggestion._id}
                    onClick={() => handleSuggestionClick(suggestion)}
                  >
                    {suggestion.name}
                  </div>
                ))}
              </div>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}

export default Header;
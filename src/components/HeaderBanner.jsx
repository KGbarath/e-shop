import { useNavigate } from 'react-router-dom';

function HeaderBanner() {
  const navigate = useNavigate();

  return (
    <div className="header-banner">
      <h1>Welcome to E-Shop!</h1>
      <button onClick={() => navigate('/products')}>Explore Now</button>
    </div>
  );
}

export default HeaderBanner;
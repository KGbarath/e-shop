import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from '../api'; // Import axios

const Profile = () => {
  const { user, setUser, logout } = useAuth(); // Destructure setUser
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get('/auth/profile'); // Use imported axios
        setUser(response.data); // Use setUser from context
      } catch (error) {
        console.error('Error fetching profile:', error);
        logout();
        navigate('/login');
      }
    };
    fetchUserProfile();
  }, [logout, navigate]);

  if (!user) return <div>Loading...</div>;

  return (
    <div className="profile-details">
      <h2>Profile</h2>
      <p>Name: {user.name}</p>
      <p>Email: {user.email}</p>
      <button onClick={() => navigate('/orders')}>View Orders</button>
      <button className="logout-btn" onClick={logout}>Logout</button>
    </div>
  );
};

export default Profile;
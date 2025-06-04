import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

function Profile() {
  const { user, logout, authError } = useContext(AuthContext);
  const navigate = useNavigate();
  const [editMode, setEditMode] = useState(false);
  const [updatedUser, setUpdatedUser] = useState(user || {});
  const [error, setError] = useState('');

  const handleUpdate = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await axios.put(
        'http://localhost:5000/api/users/profile',
        updatedUser,
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      setUser(res.data);
      setEditMode(false);
      alert('Profile updated successfully!');
    } catch (err) {
      console.error('Error updating profile:', err);
      setError('Failed to update profile. Please try again.');
    }
  };

  const handleChange = (e) => {
    setUpdatedUser({ ...updatedUser, [e.target.name]: e.target.value });
  };

  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <div className="container">
      <h2>Your Profile</h2>
      {authError && <p style={{ color: '#ff6f61' }}>{authError}</p>}
      {error && <p style={{ color: '#ff6f61' }}>{error}</p>}
      <div className="profile-details">
        {editMode ? (
          <form onSubmit={handleUpdate}>
            <div className="form-group">
              <label>Name:</label>
              <input
                type="text"
                name="name"
                value={updatedUser.name || ''}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Email:</label>
              <input
                type="email"
                name="email"
                value={updatedUser.email || ''}
                onChange={handleChange}
                required
              />
            </div>
            <button type="submit">Save Changes</button>
            <button
              type="button"
              onClick={() => {
                setEditMode(false);
                setUpdatedUser(user);
              }}
              style={{ marginLeft: '10px' }}
            >
              Cancel
            </button>
          </form>
        ) : (
          <>
            <p><strong>Name:</strong> {user.name}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <button onClick={() => setEditMode(true)}>Edit Profile</button>
          </>
        )}
      </div>
      <button
        className="logout-btn"
        onClick={() => {
          logout();
          navigate('/');
        }}
      >
        Logout
      </button>
    </div>
  );
}

export default Profile;
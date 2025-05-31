import { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || null);
  const [authError, setAuthError] = useState('');

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  const login = async (email, password) => {
    try {
      setAuthError('');
      const res = await axios.post('http://localhost:5000/api/auth/login', { email, password });
      console.log('Login response:', res.data);
      if (res.status === 200) {
        setUser(res.data);
        console.log('Login successful');
        return true;
      }
      setAuthError('Login failed. Please try again.');
      return false;
    } catch (error) {
      console.error('Login error:', {
        status: error.response?.status,
        message: error.response?.data?.message || error.message,
      });
      setAuthError(error.response?.data?.message || 'Error logging in. Please try again later.');
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setAuthError('');
    localStorage.removeItem('user');
  };

  const verifyToken = async () => {
    if (!user || !user.token) {
      setUser(null);
      return false;
    }
    try {
      const res = await axios.get('http://localhost:5000/api/auth/verify', {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      if (res.status === 200) {
        return true;
      }
      setUser(null);
      setAuthError('Session expired. Please log in again.');
      return false;
    } catch (error) {
      console.error('Token verification error:', {
        status: error.response?.status,
        message: error.response?.data?.message || error.message,
      });
      setUser(null);
      setAuthError(error.response?.data?.message || 'Session expired. Please log in again.');
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout, verifyToken, authError }}>
      {children}
    </AuthContext.Provider>
  );
};
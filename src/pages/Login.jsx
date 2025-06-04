import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext'; // fix if needed
import api from '../api/api'; // ✅ fixed
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const { setUser } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const res = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      setUser(res.data.user);
      alert('Login successful!');
      navigate('/');
    } catch (err) {
      alert(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <input placeholder='Email' value={email} onChange={(e) => setEmail(e.target.value)} />
      <input placeholder='Password' type='password' value={password} onChange={(e) => setPassword(e.target.value)} />
      <button onClick={handleLogin}>Login</button>
    </div>
  );
};

export default Login;

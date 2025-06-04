import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api'; // ✅ Correct path to axios config

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/auth/login', formData);
      localStorage.setItem('token', res.data.token);
      alert('Login successful');
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="login">
      <form onSubmit={handleSubmit}>
        <h2>Login</h2>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <input name="email" placeholder="Email" onChange={handleChange} required />
        <input name="password" type="password" placeholder="Password" onChange={handleChange} required />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default Login;

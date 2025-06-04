import React, { useState } from 'react';
import api from '../api'; // ✅ Correct path to axios config

function Register() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });
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
      await api.post('/auth/register', formData);
      alert('Registered successfully! Please login.');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="register">
      <form onSubmit={handleSubmit}>
        <h2>Register</h2>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <input name="username" placeholder="Username" onChange={handleChange} required />
        <input name="email" placeholder="Email" onChange={handleChange} required />
        <input name="password" type="password" placeholder="Password" onChange={handleChange} required />
        <button type="submit">Register</button>
      </form>
    </div>
  );
}

export default Register;

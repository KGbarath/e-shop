import React, { useState } from 'react';
import api from '../api/api'; // ✅ fixed

const Register = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '' });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async () => {
    try {
      const res = await api.post('/auth/register', form);
      localStorage.setItem('token', res.data.token);
      alert('Registration successful!');
    } catch (err) {
      alert(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div>
      <h2>Register</h2>
      <input name='name' placeholder='Name' onChange={handleChange} />
      <input name='email' placeholder='Email' onChange={handleChange} />
      <input name='password' placeholder='Password' type='password' onChange={handleChange} />
      <button onClick={handleRegister}>Register</button>
    </div>
  );
};

export default Register;

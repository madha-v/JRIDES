import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaEnvelope, FaLock, FaCar } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import './Auth.css';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post('/auth/login', form);
      login(data);
      toast.success(`Welcome back, ${data.name}! 🚗`);
      if (data.role === 'admin') navigate('/admin');
      else if (data.role === 'owner' || data.role === 'agency') navigate('/owner/dashboard');
      else navigate('/vehicles');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-brand"><FaCar /> JRIDES</div>
        <h2 className="auth-title">Welcome Back</h2>
        <p className="auth-sub">Login to continue your journey</p>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email Address</label>
            <div className="input-icon-wrap">
              <FaEnvelope className="input-icon" />
              <input type="email" name="email" className="form-control input-iconed"
                placeholder="you@example.com" value={form.email} onChange={handleChange} required />
            </div>
          </div>
          <div className="form-group">
            <label>Password</label>
            <div className="input-icon-wrap">
              <FaLock className="input-icon" />
              <input type="password" name="password" className="form-control input-iconed"
                placeholder="••••••••" value={form.password} onChange={handleChange} required />
            </div>
          </div>
          <button type="submit" className="btn btn-primary btn-block btn-lg" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <p className="auth-footer">
          Don't have an account? <Link to="/register">Sign Up</Link>
        </p>
        <div className="demo-accounts">
          <p>Demo accounts:</p>
          <code>admin@jrides.com / admin123</code>
        </div>
      </div>
    </div>
  );
}

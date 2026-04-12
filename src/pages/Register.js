import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaUser, FaEnvelope, FaLock, FaPhone, FaCar } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import './Auth.css';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '', role: 'user' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    if (form.password.length < 6) return toast.error('Password must be at least 6 characters');
    setLoading(true);
    try {
      const { data } = await api.post('/auth/register', form);
      login(data);
      toast.success(`Account created! Welcome, ${data.name}! 🎉`);
      if (data.role === 'owner' || data.role === 'agency') navigate('/owner/dashboard');
      else navigate('/vehicles');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-brand"><FaCar /> JRIDES</div>
        <h2 className="auth-title">Create Account</h2>
        <p className="auth-sub">Join thousands of riders and owners</p>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name</label>
            <div className="input-icon-wrap">
              <FaUser className="input-icon" />
              <input type="text" name="name" className="form-control input-iconed"
                placeholder="Your full name" value={form.name} onChange={handleChange} required />
            </div>
          </div>
          <div className="form-group">
            <label>Email Address</label>
            <div className="input-icon-wrap">
              <FaEnvelope className="input-icon" />
              <input type="email" name="email" className="form-control input-iconed"
                placeholder="you@example.com" value={form.email} onChange={handleChange} required />
            </div>
          </div>
          <div className="form-group">
            <label>Phone Number</label>
            <div className="input-icon-wrap">
              <FaPhone className="input-icon" />
              <input type="tel" name="phone" className="form-control input-iconed"
                placeholder="10-digit phone" value={form.phone} onChange={handleChange} />
            </div>
          </div>
          <div className="form-group">
            <label>Password</label>
            <div className="input-icon-wrap">
              <FaLock className="input-icon" />
              <input type="password" name="password" className="form-control input-iconed"
                placeholder="Min. 6 characters" value={form.password} onChange={handleChange} required />
            </div>
          </div>
          <div className="form-group">
            <label>I want to</label>
            <div className="role-tabs">
              {[
                { val: 'user', label: '🙋 Rent Vehicles' },
                { val: 'owner', label: '🚗 List My Vehicle' },
                { val: 'agency', label: '🏢 Rental Agency' },
              ].map(r => (
                <button key={r.val} type="button"
                  className={`role-tab ${form.role === r.val ? 'active' : ''}`}
                  onClick={() => setForm({ ...form, role: r.val })}>
                  {r.label}
                </button>
              ))}
            </div>
          </div>
          <button type="submit" className="btn btn-primary btn-block btn-lg" disabled={loading}>
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>
        <p className="auth-footer">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}

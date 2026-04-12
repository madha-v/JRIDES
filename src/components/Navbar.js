import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaCar, FaBars, FaTimes, FaUser, FaSignOutAlt, FaTachometerAlt } from 'react-icons/fa';
import './Navbar.css';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropOpen, setDropOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMenuOpen(false);
    setDropOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="container navbar-inner">
        <Link to="/" className="navbar-brand">
          <FaCar className="brand-icon" />
          <span>J<span className="brand-accent">RIDES</span></span>
        </Link>

        <div className={`navbar-links ${menuOpen ? 'open' : ''}`}>
          <Link to="/vehicles" className={isActive('/vehicles') ? 'active' : ''} onClick={() => setMenuOpen(false)}>Browse Vehicles</Link>
          {user && (
            <>
              <Link to="/my-bookings" className={isActive('/my-bookings') ? 'active' : ''} onClick={() => setMenuOpen(false)}>My Bookings</Link>
              {(user.role === 'owner' || user.role === 'agency') && (
                <>
                  <Link to="/owner/dashboard" className={isActive('/owner/dashboard') ? 'active' : ''} onClick={() => setMenuOpen(false)}>My Fleet</Link>
                  <Link to="/owner/requests" className={isActive('/owner/requests') ? 'active' : ''} onClick={() => setMenuOpen(false)}>Requests</Link>
                </>
              )}
              {user.role === 'admin' && (
                <Link to="/admin" className={isActive('/admin') ? 'active' : ''} onClick={() => setMenuOpen(false)}>Admin</Link>
              )}
            </>
          )}
        </div>

        <div className="navbar-actions">
          {user ? (
            <div className="user-menu" onMouseLeave={() => setDropOpen(false)}>
              <button className="user-btn" onClick={() => setDropOpen(!dropOpen)}>
                <div className="avatar">{user.name?.[0]?.toUpperCase()}</div>
                <span className="user-name">{user.name.split(' ')[0]}</span>
              </button>
              {dropOpen && (
                <div className="dropdown">
                  <div className="drop-header">
                    <div className="drop-name">{user.name}</div>
                    <div className="drop-role">{user.role}</div>
                  </div>
                  <Link to="/profile" className="drop-item" onClick={() => setDropOpen(false)}>
                    <FaUser /> Profile
                  </Link>
                  {user.role === 'admin' && (
                    <Link to="/admin" className="drop-item" onClick={() => setDropOpen(false)}>
                      <FaTachometerAlt /> Admin Dashboard
                    </Link>
                  )}
                  {(user.role === 'owner' || user.role === 'agency') && (
                    <Link to="/owner/dashboard" className="drop-item" onClick={() => setDropOpen(false)}>
                      <FaTachometerAlt /> Owner Dashboard
                    </Link>
                  )}
                  <button className="drop-item danger" onClick={handleLogout}>
                    <FaSignOutAlt /> Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="auth-btns">
              <Link to="/login" className="btn btn-outline btn-sm">Login</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Sign Up</Link>
            </div>
          )}
          <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </div>
    </nav>
  );
}

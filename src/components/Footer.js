import React from 'react';
import { Link } from 'react-router-dom';
import { FaCar, FaGithub, FaLinkedin } from 'react-icons/fa';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div className="footer-brand">
          <div className="footer-logo"><FaCar /> JRIDES</div>
          <p>Peer-to-peer vehicle rental platform connecting owners and renters across India.</p>
        </div>
        <div className="footer-links">
          <div className="footer-col">
            <h4>Platform</h4>
            <Link to="/vehicles">Browse Vehicles</Link>
            <Link to="/register">Become an Owner</Link>
            <Link to="/register">Register</Link>
          </div>
          <div className="footer-col">
            <h4>Account</h4>
            <Link to="/login">Login</Link>
            <Link to="/my-bookings">My Bookings</Link>
            <Link to="/profile">Profile</Link>
          </div>
        </div>
      </div>
      <div className="footer-bottom container">
        <span>© 2024 JRIDES by JoshwaRides. All rights reserved.</span>
        <div className="footer-socials">
          <a href="#"><FaGithub /></a>
          <a href="#"><FaLinkedin /></a>
        </div>
      </div>
    </footer>
  );
}

import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaSearch, FaShieldAlt, FaMoneyBillWave, FaUsers, FaArrowRight, FaCar, FaMotorcycle } from 'react-icons/fa';
import VehicleCard from '../components/VehicleCard';
import api from '../utils/api';
import './Home.css';

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/vehicles?limit=6').then(r => setFeatured(r.data.slice(0, 6))).catch(() => {});
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/vehicles?search=${search}`);
  };

  return (
    <div className="home">
      {/* Hero */}
      <section className="hero">
        <div className="hero-bg"></div>
        <div className="container hero-content">
          <div className="hero-badge">🚀 India's Trusted P2P Rental Platform</div>
          <h1 className="hero-title">
            Find Your Perfect<br />
            <span className="hero-accent">Ride Today</span>
          </h1>
          <p className="hero-sub">
            Rent verified two-wheelers and four-wheelers from trusted local owners.
            Safe, affordable, and hassle-free.
          </p>
          <form className="hero-search" onSubmit={handleSearch}>
            <div className="search-input-wrap">
              <FaSearch className="search-icon" />
              <input
                type="text"
                placeholder="Search by city, brand, or vehicle type..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="search-input"
              />
            </div>
            <button type="submit" className="btn btn-primary btn-lg">Search Rides</button>
          </form>
          <div className="hero-types">
            <Link to="/vehicles?type=two-wheeler" className="type-chip">
              <FaMotorcycle /> Two Wheelers
            </Link>
            <Link to="/vehicles?type=four-wheeler" className="type-chip">
              <FaCar /> Four Wheelers
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="stats-bar">
        <div className="container stats-inner">
          <div className="stat"><span className="stat-num">500+</span><span>Vehicles Listed</span></div>
          <div className="stat-div"></div>
          <div className="stat"><span className="stat-num">1200+</span><span>Happy Renters</span></div>
          <div className="stat-div"></div>
          <div className="stat"><span className="stat-num">50+</span><span>Cities Covered</span></div>
          <div className="stat-div"></div>
          <div className="stat"><span className="stat-num">100%</span><span>Verified Owners</span></div>
        </div>
      </section>

      {/* Featured Vehicles */}
      {featured.length > 0 && (
        <section className="section">
          <div className="container">
            <div className="section-header">
              <div>
                <h2 className="section-title">Featured Vehicles</h2>
                <p className="section-sub">Handpicked and verified rides near you</p>
              </div>
              <Link to="/vehicles" className="btn btn-outline">View All <FaArrowRight /></Link>
            </div>
            <div className="grid-3">
              {featured.map(v => <VehicleCard key={v._id} vehicle={v} />)}
            </div>
          </div>
        </section>
      )}

      {/* How it works */}
      <section className="section how-section">
        <div className="container">
          <div className="section-header center">
            <div>
              <h2 className="section-title">How It Works</h2>
              <p className="section-sub">Renting a vehicle has never been easier</p>
            </div>
          </div>
          <div className="grid-3 steps">
            {[
              { n: '01', title: 'Search & Filter', desc: 'Browse hundreds of verified vehicles by location, type, or price range.' },
              { n: '02', title: 'Book Instantly', desc: 'Select your dates, send a booking request, and get owner confirmation.' },
              { n: '03', title: 'Ride & Return', desc: 'Pick up your vehicle, enjoy your ride, and return it hassle-free.' },
            ].map(s => (
              <div className="step-card" key={s.n}>
                <div className="step-num">{s.n}</div>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why choose */}
      <section className="section">
        <div className="container">
          <div className="section-header center">
            <div>
              <h2 className="section-title">Why Choose JRIDES?</h2>
              <p className="section-sub">We make rentals safe, simple, and rewarding</p>
            </div>
          </div>
          <div className="grid-3">
            {[
              { icon: <FaShieldAlt />, title: 'Verified & Safe', desc: 'All vehicles and owners go through our strict verification process including RC and license checks.' },
              { icon: <FaMoneyBillWave />, title: 'Best Prices', desc: 'No hidden fees. Pay only for what you book. Competitive rates from local owners.' },
              { icon: <FaUsers />, title: 'Community Driven', desc: 'A trusted network of owners and renters building a sustainable rental ecosystem.' },
            ].map(f => (
              <div className="feature-card" key={f.title}>
                <div className="feature-icon">{f.icon}</div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <div className="container cta-inner">
          <div>
            <h2>Own a Vehicle? Start Earning Today!</h2>
            <p>List your idle vehicle and earn extra income every month. Thousands of renters are looking.</p>
          </div>
          <div className="cta-btns">
            <Link to="/register" className="btn btn-primary btn-lg">List Your Vehicle</Link>
            <Link to="/vehicles" className="btn btn-outline btn-lg" style={{ color: 'white', borderColor: 'rgba(255,255,255,0.4)' }}>Browse Rides</Link>
          </div>
        </div>
      </section>
    </div>
  );
}

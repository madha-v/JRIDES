import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaUsers, FaCar, FaCalendarCheck, FaIdCard, FaCheckCircle, FaTimes } from 'react-icons/fa';
import api from '../utils/api';
import './Dashboard.css';
import './AdminDashboard.css';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/dashboard').then(r => setStats(r.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading-center"><div className="spinner"></div></div>;
  if (!stats) return <div className="container"><p>Failed to load dashboard</p></div>;

  const statCards = [
    { icon: '👥', label: 'Total Users', value: stats.users, color: '#3b82f6' },
    { icon: '🚗', label: 'Total Vehicles', value: stats.vehicles, color: '#f97316' },
    { icon: '📅', label: 'Total Bookings', value: stats.bookings, color: '#22c55e' },
    { icon: '⏳', label: 'Pending DL Verifications', value: stats.pendingDL, color: '#f59e0b' },
  ];

  return (
    <div className="container dashboard-page">
      <div className="dash-header">
        <div><h1>Admin Dashboard</h1><p>Manage your entire platform from here</p></div>
      </div>

      <div className="stats-grid">
        {statCards.map(s => (
          <div className="stat-card" key={s.label}>
            <div className="stat-icon">{s.icon}</div>
            <div className="stat-value" style={{ color: s.color }}>{s.value}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="admin-nav-grid">
        {[
          { to: '/admin/users', icon: <FaUsers />, title: 'Manage Users', desc: 'View, verify, block/unblock users and check DL documents' },
          { to: '/admin/vehicles', icon: <FaCar />, title: 'Manage Vehicles', desc: 'Review and verify vehicle listings and documents' },
          { to: '/admin/bookings', icon: <FaCalendarCheck />, title: 'All Bookings', desc: 'Monitor all rental transactions and booking statuses' },
        ].map(item => (
          <Link to={item.to} key={item.to} className="admin-nav-card card">
            <div className="admin-nav-icon">{item.icon}</div>
            <h3>{item.title}</h3>
            <p>{item.desc}</p>
            <span className="admin-nav-arrow">→</span>
          </Link>
        ))}
      </div>

      {stats.recentBookings?.length > 0 && (
        <div className="card" style={{ marginTop: 32 }}>
          <div style={{ padding: '20px 24px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '1rem' }}>Recent Bookings</h3>
            <Link to="/admin/bookings" className="btn btn-outline btn-sm">View All</Link>
          </div>
          <div className="vehicles-table-wrap">
            <table className="vehicles-table">
              <thead>
                <tr><th>Vehicle</th><th>Renter</th><th>Date</th><th>Amount</th><th>Status</th></tr>
              </thead>
              <tbody>
                {stats.recentBookings.map(b => (
                  <tr key={b._id}>
                    <td>{b.vehicle?.brand} {b.vehicle?.model}</td>
                    <td>{b.renter?.name}</td>
                    <td>{new Date(b.createdAt).toLocaleDateString()}</td>
                    <td><strong style={{ color: 'var(--primary)' }}>Rs.{b.totalAmount}</strong></td>
                    <td><span className={`badge badge-${b.status === 'approved' ? 'success' : b.status === 'pending' ? 'warning' : 'danger'}`} style={{ textTransform: 'capitalize' }}>{b.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

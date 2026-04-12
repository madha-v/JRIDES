import React, { useState, useEffect } from 'react';
import { FaSearch, FaCalendarAlt } from 'react-icons/fa';
import api from '../utils/api';
import './Dashboard.css';
import './AdminPages.css';

const statusColors = { pending: 'warning', approved: 'success', rejected: 'danger', cancelled: 'mid', completed: 'info' };

export default function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    api.get('/admin/bookings').then(r => setBookings(r.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const filtered = bookings.filter(b => {
    const matchSearch = !search ||
      b.vehicle?.brand?.toLowerCase().includes(search.toLowerCase()) ||
      b.renter?.name?.toLowerCase().includes(search.toLowerCase()) ||
      b.owner?.name?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || b.status === statusFilter;
    return matchSearch && matchStatus;
  });

  if (loading) return <div className="loading-center"><div className="spinner"></div></div>;

  return (
    <div className="container dashboard-page">
      <div className="dash-header">
        <div><h1>All Bookings</h1><p>{bookings.length} total bookings</p></div>
      </div>
      <div className="admin-filters">
        <div className="admin-search">
          <FaSearch />
          <input className="form-control" placeholder="Search vehicle, renter, owner..." value={search} onChange={e => setSearch(e.target.value)} style={{ paddingLeft: 36 }} />
        </div>
        <select className="form-control" value={statusFilter} onChange={e => setStatusFilter(e.target.value)} style={{ width: 160 }}>
          <option value="all">All Status</option>
          {['pending','approved','rejected','cancelled','completed'].map(s => (
            <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
          ))}
        </select>
      </div>
      <div className="card vehicles-table-wrap">
        <table className="vehicles-table">
          <thead>
            <tr><th>Vehicle</th><th>Renter</th><th>Owner</th><th>Dates</th><th>Days</th><th>Amount</th><th>Status</th></tr>
          </thead>
          <tbody>
            {filtered.map(b => (
              <tr key={b._id}>
                <td><strong>{b.vehicle?.brand} {b.vehicle?.model}</strong></td>
                <td>{b.renter?.name}<br /><small style={{ color: 'var(--mid)' }}>{b.renter?.email}</small></td>
                <td>{b.owner?.name}</td>
                <td style={{ fontSize: '0.82rem' }}>
                  <FaCalendarAlt style={{ color: 'var(--mid)', marginRight: 4 }} />
                  {new Date(b.startDate).toLocaleDateString()} - {new Date(b.endDate).toLocaleDateString()}
                </td>
                <td>{b.totalDays}d</td>
                <td><strong style={{ color: 'var(--primary)' }}>Rs.{b.totalAmount}</strong></td>
                <td><span className={`badge badge-${statusColors[b.status] || 'mid'}`} style={{ textTransform: 'capitalize' }}>{b.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <div className="empty-state"><h3>No bookings found</h3></div>}
      </div>
    </div>
  );
}

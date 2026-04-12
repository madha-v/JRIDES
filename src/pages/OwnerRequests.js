import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { FaCalendarAlt, FaUser, FaCheckCircle, FaTimes, FaIdCard } from 'react-icons/fa';
import api from '../utils/api';
import './Bookings.css';
import './OwnerRequests.css';

const statusColors = { pending: 'warning', approved: 'success', rejected: 'danger', cancelled: 'mid', completed: 'info' };

export default function OwnerRequests() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    api.get('/bookings/owner-requests').then(r => setBookings(r.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/bookings/${id}/status`, { status });
      setBookings(prev => prev.map(b => b._id === id ? { ...b, status } : b));
      toast.success(`Booking ${status}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update');
    }
  };

  const filtered = filter === 'all' ? bookings : bookings.filter(b => b.status === filter);

  if (loading) return <div className="loading-center"><div className="spinner"></div></div>;

  return (
    <div className="container bookings-page">
      <div className="page-header">
        <h1>Booking Requests</h1>
        <p>{bookings.length} total request{bookings.length !== 1 ? 's' : ''}</p>
      </div>

      <div className="filter-tabs">
        {['all', 'pending', 'approved', 'rejected', 'cancelled'].map(f => (
          <button key={f} className={`filter-tab ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>
            {f.charAt(0).toUpperCase() + f.slice(1)}
            {f === 'pending' && bookings.filter(b => b.status === 'pending').length > 0 && (
              <span className="tab-count">{bookings.filter(b => b.status === 'pending').length}</span>
            )}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state">
          <h3>No {filter !== 'all' ? filter : ''} requests</h3>
          <p>Booking requests from renters will appear here</p>
        </div>
      ) : (
        <div className="bookings-list">
          {filtered.map(b => (
            <div key={b._id} className="booking-item card">
              <div className="booking-vehicle-img">
                <img src={b.vehicle?.images?.[0] ? `http://localhost:5000${b.vehicle.images[0]}` : `https://via.placeholder.com/120x90/1e293b/f97316?text=V`} alt="" />
              </div>
              <div className="booking-details">
                <div className="booking-top">
                  <div>
                    <h3>{b.vehicle?.brand} {b.vehicle?.model}</h3>
                    <p className="booking-vehicle-sub">{b.vehicle?.name}</p>
                  </div>
                  <span className={`badge badge-${statusColors[b.status] || 'mid'}`} style={{ textTransform: 'capitalize', height: 'fit-content' }}>
                    {b.status}
                  </span>
                </div>

                <div className="renter-info">
                  <FaUser />
                  <strong>{b.renter?.name}</strong>
                  <span>{b.renter?.email}</span>
                  <span>{b.renter?.phone}</span>
                  {b.renter?.dlVerified
                    ? <span className="badge badge-success" style={{ fontSize: '0.72rem' }}><FaIdCard /> DL Verified</span>
                    : b.renter?.drivingLicense
                      ? <span className="badge badge-warning" style={{ fontSize: '0.72rem' }}>DL Pending</span>
                      : <span className="badge badge-danger" style={{ fontSize: '0.72rem' }}>No DL</span>}
                </div>

                <div className="booking-meta">
                  <span><FaCalendarAlt /> {new Date(b.startDate).toLocaleDateString()} to {new Date(b.endDate).toLocaleDateString()}</span>
                  <span>{b.totalDays} day{b.totalDays !== 1 ? 's' : ''}</span>
                </div>

                {b.message && <div className="renter-message">"{b.message}"</div>}

                <div className="booking-footer">
                  <div className="booking-price">
                    <span>Rs.{b.totalAmount}</span>
                  </div>
                  {b.status === 'pending' && (
                    <div className="booking-actions">
                      <button className="btn btn-success btn-sm" onClick={() => updateStatus(b._id, 'approved')}>
                        <FaCheckCircle /> Approve
                      </button>
                      <button className="btn btn-danger btn-sm" onClick={() => updateStatus(b._id, 'rejected')}>
                        <FaTimes /> Reject
                      </button>
                    </div>
                  )}
                  {b.status === 'approved' && (
                    <button className="btn btn-outline btn-sm" onClick={() => updateStatus(b._id, 'completed')}>
                      Mark Completed
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

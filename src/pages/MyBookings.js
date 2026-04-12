import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaCalendarAlt, FaCar, FaMapMarkerAlt } from 'react-icons/fa';
import api from '../utils/api';
import './Bookings.css';

const statusColors = { pending: 'warning', approved: 'success', rejected: 'danger', cancelled: 'mid', completed: 'info' };

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/bookings/my-bookings').then(r => setBookings(r.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const handleCancel = async (id) => {
    if (!window.confirm('Cancel this booking?')) return;
    try {
      await api.put(`/bookings/${id}/cancel`);
      setBookings(prev => prev.map(b => b._id === id ? { ...b, status: 'cancelled' } : b));
      toast.success('Booking cancelled');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to cancel');
    }
  };

  if (loading) return <div className="loading-center"><div className="spinner"></div></div>;

  return (
    <div className="container bookings-page">
      <div className="page-header">
        <h1>My Bookings</h1>
        <p>{bookings.length} total booking{bookings.length !== 1 ? 's' : ''}</p>
      </div>
      {bookings.length === 0 ? (
        <div className="empty-state">
          <FaCar size={48} color="var(--mid)" />
          <h3>No bookings yet</h3>
          <p>Find and book your first vehicle</p>
          <Link to="/vehicles" className="btn btn-primary">Browse Vehicles</Link>
        </div>
      ) : (
        <div className="bookings-list">
          {bookings.map(b => (
            <div key={b._id} className="booking-item card">
              <div className="booking-vehicle-img">
                <img src={b.vehicle?.images?.[0] ? `http://localhost:5000${b.vehicle.images[0]}` : `https://via.placeholder.com/120x90/1e293b/f97316?text=${encodeURIComponent(b.vehicle?.brand || 'V')}`} alt="" />
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
                <div className="booking-meta">
                  <span><FaCalendarAlt /> {new Date(b.startDate).toLocaleDateString()} – {new Date(b.endDate).toLocaleDateString()}</span>
                  <span><FaMapMarkerAlt /> {b.pickupLocation}</span>
                </div>
                <div className="booking-footer">
                  <div className="booking-price">
                    <span>₹{b.totalAmount}</span>
                    <span className="days-label">{b.totalDays} day{b.totalDays !== 1 ? 's' : ''}</span>
                  </div>
                  <div className="booking-owner">
                    Owner: <strong>{b.owner?.name}</strong> · {b.owner?.phone}
                  </div>
                  <div className="booking-actions">
                    <Link to={`/vehicles/${b.vehicle?._id}`} className="btn btn-outline btn-sm">View Vehicle</Link>
                    {b.status === 'pending' && (
                      <button className="btn btn-danger btn-sm" onClick={() => handleCancel(b._id)}>Cancel</button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

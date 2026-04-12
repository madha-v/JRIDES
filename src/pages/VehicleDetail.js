import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaMapMarkerAlt, FaGasPump, FaCog, FaCheckCircle, FaCalendarAlt, FaUser, FaPhone } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import './VehicleDetail.css';

export default function VehicleDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState({ startDate: '', endDate: '', message: '' });
  const [bookingLoading, setBookingLoading] = useState(false);
  const [activeImg, setActiveImg] = useState(0);

  useEffect(() => {
    api.get(`/vehicles/${id}`).then(r => setVehicle(r.data)).catch(() => toast.error('Vehicle not found')).finally(() => setLoading(false));
  }, [id]);

  const calcDays = () => {
    if (!booking.startDate || !booking.endDate) return 0;
    const diff = new Date(booking.endDate) - new Date(booking.startDate);
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  };

  const handleBook = async (e) => {
    e.preventDefault();
    if (!user) { toast.info('Please login to book'); return navigate('/login'); }
    if (user._id === vehicle.owner._id) return toast.error("You can't book your own vehicle");
    if (calcDays() < 1) return toast.error('Select valid dates');
    setBookingLoading(true);
    try {
      await api.post('/bookings', { vehicleId: id, ...booking });
      toast.success('Booking request sent! 🎉');
      navigate('/my-bookings');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Booking failed');
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) return <div className="loading-center"><div className="spinner"></div></div>;
  if (!vehicle) return <div className="container"><div className="empty-state"><h3>Vehicle not found</h3></div></div>;

  const imgs = vehicle.images?.length > 0
    ? vehicle.images.map(i => `http://localhost:5000${i}`)
    : [`https://via.placeholder.com/800x450/1e293b/f97316?text=${encodeURIComponent(vehicle.brand)}`];

  const today = new Date().toISOString().split('T')[0];
  const days = calcDays();

  return (
    <div className="vdetail-page container">
      <div className="vdetail-grid">
        {/* Left: Images + Info */}
        <div className="vdetail-left">
          <div className="vdetail-gallery">
            <img src={imgs[activeImg]} alt={vehicle.name} className="vdetail-main-img" />
            {imgs.length > 1 && (
              <div className="vdetail-thumbs">
                {imgs.map((img, i) => (
                  <img key={i} src={img} alt="" className={`vdetail-thumb ${i === activeImg ? 'active' : ''}`}
                    onClick={() => setActiveImg(i)} />
                ))}
              </div>
            )}
          </div>

          <div className="vdetail-info">
            <div className="vdetail-title-row">
              <div>
                <h1 className="vdetail-title">{vehicle.brand} {vehicle.model}</h1>
                <p className="vdetail-sub">{vehicle.name} · {vehicle.year}</p>
              </div>
              <div className="vdetail-price">
                <span className="vd-price-amt">₹{vehicle.pricePerDay}</span>
                <span className="vd-price-label">/day</span>
              </div>
            </div>

            <div className="vdetail-badges">
              <span className="badge badge-info">{vehicle.type}</span>
              <span className="badge badge-mid">{vehicle.category}</span>
              {vehicle.isVerified && <span className="badge badge-success"><FaCheckCircle /> Verified</span>}
              {vehicle.isAvailable ? <span className="badge badge-success">Available</span> : <span className="badge badge-danger">Not Available</span>}
            </div>

            <div className="vdetail-specs">
              <div className="spec-item"><FaMapMarkerAlt /><div><span>Location</span><strong>{vehicle.city}, {vehicle.location}</strong></div></div>
              <div className="spec-item"><FaGasPump /><div><span>Fuel</span><strong>{vehicle.fuelType}</strong></div></div>
              <div className="spec-item"><FaCog /><div><span>Transmission</span><strong>{vehicle.transmission}</strong></div></div>
              <div className="spec-item"><FaUser /><div><span>Seats</span><strong>{vehicle.seats}</strong></div></div>
            </div>

            {vehicle.description && (
              <div className="vdetail-desc">
                <h3>About this vehicle</h3>
                <p>{vehicle.description}</p>
              </div>
            )}

            {vehicle.features?.length > 0 && (
              <div className="vdetail-features">
                <h3>Features</h3>
                <div className="features-list">
                  {vehicle.features.map(f => <span key={f} className="feature-tag"><FaCheckCircle />{f}</span>)}
                </div>
              </div>
            )}

            <div className="owner-card">
              <div className="owner-avatar">{vehicle.owner?.name?.[0]?.toUpperCase()}</div>
              <div>
                <strong>{vehicle.owner?.name}</strong>
                <p>{vehicle.owner?.city}</p>
                {vehicle.owner?.isVerified && <span className="badge badge-success" style={{ fontSize: '0.7rem' }}><FaCheckCircle /> Verified Owner</span>}
              </div>
              {user && vehicle.owner?.phone && (
                <a href={`tel:${vehicle.owner.phone}`} className="btn btn-outline btn-sm" style={{ marginLeft: 'auto' }}>
                  <FaPhone /> Call
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Right: Booking */}
        <div className="vdetail-right">
          <div className="booking-card card">
            <h3 className="booking-title">Book This Vehicle</h3>
            {!vehicle.isAvailable ? (
              <div className="not-avail">This vehicle is currently unavailable</div>
            ) : (
              <form onSubmit={handleBook}>
                <div className="form-group">
                  <label><FaCalendarAlt /> Start Date</label>
                  <input type="date" className="form-control" min={today}
                    value={booking.startDate} onChange={e => setBooking({ ...booking, startDate: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label><FaCalendarAlt /> End Date</label>
                  <input type="date" className="form-control" min={booking.startDate || today}
                    value={booking.endDate} onChange={e => setBooking({ ...booking, endDate: e.target.value })} required />
                </div>
                {days > 0 && (
                  <div className="price-summary">
                    <div className="price-row"><span>₹{vehicle.pricePerDay} × {days} day{days > 1 ? 's' : ''}</span><span>₹{vehicle.pricePerDay * days}</span></div>
                    <div className="price-row total"><span>Total</span><span>₹{vehicle.pricePerDay * days}</span></div>
                  </div>
                )}
                <div className="form-group">
                  <label>Message to Owner (optional)</label>
                  <textarea className="form-control" rows={3} placeholder="Any specific requirements..."
                    value={booking.message} onChange={e => setBooking({ ...booking, message: e.target.value })} />
                </div>
                <button type="submit" className="btn btn-primary btn-block btn-lg" disabled={bookingLoading}>
                  {bookingLoading ? 'Sending Request...' : 'Request to Book'}
                </button>
                {!user && <p className="book-login-hint">You need to <a href="/login">login</a> to book</p>}
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

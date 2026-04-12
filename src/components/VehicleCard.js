import React from 'react';
import { Link } from 'react-router-dom';
import { FaMapMarkerAlt, FaStar, FaGasPump, FaCog, FaCheckCircle } from 'react-icons/fa';
import './VehicleCard.css';

export default function VehicleCard({ vehicle }) {
  const img = vehicle.images?.[0]
    ? `http://localhost:5000${vehicle.images[0]}`
    : `https://via.placeholder.com/400x240/1e293b/f97316?text=${encodeURIComponent(vehicle.brand)}`;

  return (
    <div className="vcard">
      <div className="vcard-img-wrap">
        <img src={img} alt={vehicle.name} className="vcard-img" />
        <span className={`vcard-type ${vehicle.type === 'two-wheeler' ? 'two' : 'four'}`}>
          {vehicle.type === 'two-wheeler' ? '🛵 Two Wheeler' : '🚗 Four Wheeler'}
        </span>
        {vehicle.isVerified && (
          <span className="vcard-verified"><FaCheckCircle /> Verified</span>
        )}
      </div>
      <div className="vcard-body">
        <div className="vcard-top">
          <h3 className="vcard-title">{vehicle.brand} {vehicle.model}</h3>
          <div className="vcard-price">
            <span className="price-amt">₹{vehicle.pricePerDay}</span>
            <span className="price-label">/day</span>
          </div>
        </div>
        <p className="vcard-name">{vehicle.name} · {vehicle.year}</p>
        <div className="vcard-meta">
          <span><FaMapMarkerAlt /> {vehicle.city}</span>
          <span><FaGasPump /> {vehicle.fuelType}</span>
          <span><FaCog /> {vehicle.transmission}</span>
        </div>
        {vehicle.rating > 0 && (
          <div className="vcard-rating">
            <FaStar /> {vehicle.rating.toFixed(1)} ({vehicle.totalRatings})
          </div>
        )}
        <Link to={`/vehicles/${vehicle._id}`} className="btn btn-primary btn-block" style={{ marginTop: 12 }}>
          View Details
        </Link>
      </div>
    </div>
  );
}

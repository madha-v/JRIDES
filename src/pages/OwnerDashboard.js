import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaPlus, FaEdit, FaTrash, FaToggleOn, FaToggleOff, FaCar } from 'react-icons/fa';
import api from '../utils/api';
import './Dashboard.css';

export default function OwnerDashboard() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/vehicles/owner/my-vehicles').then(r => setVehicles(r.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const toggleAvailability = async (id, current) => {
    try {
      await api.put(`/vehicles/${id}`, { isAvailable: !current });
      setVehicles(prev => prev.map(v => v._id === id ? { ...v, isAvailable: !current } : v));
      toast.success(`Marked as ${!current ? 'available' : 'unavailable'}`);
    } catch { toast.error('Failed to update'); }
  };

  const deleteVehicle = async (id) => {
    if (!window.confirm('Delete this vehicle?')) return;
    try {
      await api.delete(`/vehicles/${id}`);
      setVehicles(prev => prev.filter(v => v._id !== id));
      toast.success('Vehicle deleted');
    } catch { toast.error('Failed to delete'); }
  };

  if (loading) return <div className="loading-center"><div className="spinner"></div></div>;

  return (
    <div className="container dashboard-page">
      <div className="dash-header">
        <div><h1>My Fleet</h1><p>{vehicles.length} vehicle{vehicles.length !== 1 ? 's' : ''} listed</p></div>
        <Link to="/owner/add-vehicle" className="btn btn-primary"><FaPlus /> Add Vehicle</Link>
      </div>

      {vehicles.length === 0 ? (
        <div className="empty-state">
          <FaCar size={48} color="var(--mid)" />
          <h3>No vehicles listed yet</h3>
          <p>Start earning by listing your vehicle</p>
          <Link to="/owner/add-vehicle" className="btn btn-primary"><FaPlus /> Add Your First Vehicle</Link>
        </div>
      ) : (
        <div className="vehicles-table-wrap card">
          <table className="vehicles-table">
            <thead>
              <tr>
                <th>Vehicle</th>
                <th>Type</th>
                <th>Price/Day</th>
                <th>City</th>
                <th>Status</th>
                <th>Availability</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {vehicles.map(v => (
                <tr key={v._id}>
                  <td>
                    <div className="table-vehicle">
                      <div className="tv-img">
                        {v.images?.[0] ? <img src={`http://localhost:5000${v.images[0]}`} alt="" /> : <FaCar />}
                      </div>
                      <div>
                        <strong>{v.brand} {v.model}</strong>
                        <span>{v.year}</span>
                      </div>
                    </div>
                  </td>
                  <td><span className="badge badge-info" style={{ textTransform: 'capitalize' }}>{v.category}</span></td>
                  <td><strong style={{ color: 'var(--primary)' }}>₹{v.pricePerDay}</strong></td>
                  <td>{v.city}</td>
                  <td>
                    {v.isVerified
                      ? <span className="badge badge-success">Verified</span>
                      : <span className="badge badge-warning">Pending</span>}
                  </td>
                  <td>
                    <button className={`toggle-btn ${v.isAvailable ? 'on' : 'off'}`} onClick={() => toggleAvailability(v._id, v.isAvailable)}>
                      {v.isAvailable ? <><FaToggleOn /> Available</> : <><FaToggleOff /> Unavailable</>}
                    </button>
                  </td>
                  <td>
                    <div className="table-actions">
                      <Link to={`/vehicles/${v._id}`} className="btn btn-outline btn-sm">View</Link>
                      <button className="btn btn-danger btn-sm" onClick={() => deleteVehicle(v._id)}><FaTrash /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="quick-links">
        <Link to="/owner/requests" className="qlink-card card">
          <h3>Booking Requests</h3>
          <p>View and manage rental requests from renters</p>
          <span className="btn btn-outline btn-sm" style={{ marginTop: 12 }}>View Requests →</span>
        </Link>
        <Link to="/owner/add-vehicle" className="qlink-card card">
          <h3>Add Vehicle</h3>
          <p>List a new vehicle and start earning</p>
          <span className="btn btn-primary btn-sm" style={{ marginTop: 12 }}>Add Vehicle →</span>
        </Link>
      </div>
    </div>
  );
}

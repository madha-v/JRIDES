import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { FaCheckCircle, FaBan, FaSearch } from 'react-icons/fa';
import api from '../utils/api';
import './Dashboard.css';
import './AdminPages.css';

export default function AdminVehicles() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    api.get('/admin/vehicles').then(r => setVehicles(r.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const verifyVehicle = async (id) => {
    try {
      await api.put(`/admin/vehicles/${id}/verify`);
      setVehicles(prev => prev.map(v => v._id === id ? { ...v, isVerified: true } : v));
      toast.success('Vehicle verified!');
    } catch { toast.error('Failed'); }
  };

  const toggleVehicle = async (id) => {
    try {
      await api.put(`/admin/vehicles/${id}/toggle`);
      setVehicles(prev => prev.map(v => v._id === id ? { ...v, isActive: !v.isActive } : v));
      toast.success('Status updated');
    } catch { toast.error('Failed'); }
  };

  const filtered = vehicles.filter(v =>
    v.name?.toLowerCase().includes(search.toLowerCase()) ||
    v.brand?.toLowerCase().includes(search.toLowerCase()) ||
    v.city?.toLowerCase().includes(search.toLowerCase()) ||
    v.owner?.name?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div className="loading-center"><div className="spinner"></div></div>;

  return (
    <div className="container dashboard-page">
      <div className="dash-header">
        <div><h1>Manage Vehicles</h1><p>{vehicles.length} total vehicles</p></div>
      </div>
      <div className="admin-search">
        <FaSearch />
        <input className="form-control" placeholder="Search by name, brand, city, owner..." value={search} onChange={e => setSearch(e.target.value)} style={{ paddingLeft: 36 }} />
      </div>
      <div className="card vehicles-table-wrap">
        <table className="vehicles-table">
          <thead>
            <tr><th>Vehicle</th><th>Owner</th><th>Type</th><th>City</th><th>Price</th><th>Verified</th><th>Active</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {filtered.map(v => (
              <tr key={v._id}>
                <td>
                  <div className="table-vehicle">
                    <div className="tv-img">
                      {v.images?.[0] ? <img src={`http://localhost:5000${v.images[0]}`} alt="" /> : '🚗'}
                    </div>
                    <div>
                      <strong>{v.brand} {v.model}</strong>
                      <span>{v.year}</span>
                    </div>
                  </div>
                </td>
                <td>{v.owner?.name}<br /><small style={{ color: 'var(--mid)' }}>{v.owner?.email}</small></td>
                <td><span className="badge badge-mid" style={{ textTransform: 'capitalize', fontSize: '0.75rem' }}>{v.category}</span></td>
                <td>{v.city}</td>
                <td><strong style={{ color: 'var(--primary)' }}>Rs.{v.pricePerDay}</strong></td>
                <td>
                  {v.isVerified
                    ? <span className="badge badge-success"><FaCheckCircle /> Yes</span>
                    : <span className="badge badge-warning">No</span>}
                </td>
                <td>
                  {v.isActive
                    ? <span className="badge badge-success">Active</span>
                    : <span className="badge badge-danger">Inactive</span>}
                </td>
                <td>
                  <div className="table-actions">
                    {!v.isVerified && (
                      <button className="btn btn-success btn-sm" onClick={() => verifyVehicle(v._id)}>
                        <FaCheckCircle /> Verify
                      </button>
                    )}
                    <button className={`btn btn-sm ${v.isActive ? 'btn-danger' : 'btn-outline'}`} onClick={() => toggleVehicle(v._id)}>
                      <FaBan /> {v.isActive ? 'Deactivate' : 'Activate'}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <div className="empty-state"><h3>No vehicles found</h3></div>}
      </div>
    </div>
  );
}

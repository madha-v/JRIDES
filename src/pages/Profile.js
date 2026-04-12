import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaUpload, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import './Profile.css';

export default function Profile() {
  const { user, login } = useAuth();
  const [form, setForm] = useState({ name: '', phone: '', address: '', city: '' });
  const [dlFile, setDlFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dlLoading, setDlLoading] = useState(false);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    api.get('/auth/profile').then(r => {
      setProfile(r.data);
      setForm({ name: r.data.name || '', phone: r.data.phone || '', address: r.data.address || '', city: r.data.city || '' });
    }).catch(() => {});
  }, []);

  const handleUpdate = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.put('/auth/profile', form);
      setProfile(data.user);
      login({ ...user, name: form.name });
      toast.success('Profile updated!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDLUpload = async e => {
    e.preventDefault();
    if (!dlFile) return toast.error('Select a file first');
    setDlLoading(true);
    const fd = new FormData();
    fd.append('dl', dlFile);
    try {
      await api.post('/auth/upload-dl', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      toast.success('Driving license uploaded! Pending admin verification.');
      const { data } = await api.get('/auth/profile');
      setProfile(data);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Upload failed');
    } finally {
      setDlLoading(false);
    }
  };

  if (!profile) return <div className="loading-center"><div className="spinner"></div></div>;

  return (
    <div className="container profile-page">
      <div className="profile-grid">
        <div className="profile-sidebar">
          <div className="card profile-card">
            <div className="profile-avatar">{profile.name?.[0]?.toUpperCase()}</div>
            <h2>{profile.name}</h2>
            <span className="badge badge-info" style={{ textTransform: 'capitalize', margin: '6px auto' }}>{profile.role}</span>
            <div className="profile-status">
              {profile.isVerified
                ? <span className="verified-tag"><FaCheckCircle /> Verified Account</span>
                : <span className="unverified-tag"><FaTimesCircle /> Not Verified</span>}
              {profile.dlVerified
                ? <span className="verified-tag"><FaCheckCircle /> DL Verified</span>
                : profile.drivingLicense
                  ? <span className="pending-tag">DL Pending Verification</span>
                  : <span className="unverified-tag">No DL Uploaded</span>}
            </div>
            <div className="profile-meta">
              <span><FaEnvelope /> {profile.email}</span>
              {profile.phone && <span><FaPhone /> {profile.phone}</span>}
              {profile.city && <span><FaMapMarkerAlt /> {profile.city}</span>}
            </div>
            <p className="joined-date">Member since {new Date(profile.createdAt).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}</p>
          </div>
        </div>

        <div className="profile-main">
          <div className="card" style={{ padding: 28, marginBottom: 24 }}>
            <h3 className="section-form-title">Edit Profile</h3>
            <form onSubmit={handleUpdate}>
              <div className="form-grid-2">
                <div className="form-group">
                  <label><FaUser /> Full Name</label>
                  <input className="form-control" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label><FaPhone /> Phone</label>
                  <input className="form-control" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="10-digit number" />
                </div>
                <div className="form-group">
                  <label><FaMapMarkerAlt /> City</label>
                  <input className="form-control" value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} placeholder="Your city" />
                </div>
                <div className="form-group">
                  <label>Address</label>
                  <input className="form-control" value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} placeholder="Your address" />
                </div>
              </div>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </form>
          </div>

          <div className="card" style={{ padding: 28 }}>
            <h3 className="section-form-title">Driving License</h3>
            <p style={{ color: 'var(--mid)', fontSize: '0.9rem', marginBottom: 16 }}>
              Upload your driving license for identity verification. Required to rent vehicles.
            </p>
            {profile.drivingLicense && (
              <div className="dl-status">
                <span>{profile.dlVerified ? '✅ Verified' : '⏳ Under Review'}</span>
                <a href={`http://localhost:5000${profile.drivingLicense}`} target="_blank" rel="noreferrer" className="btn btn-outline btn-sm">View Uploaded DL</a>
              </div>
            )}
            <form onSubmit={handleDLUpload} style={{ marginTop: 16 }}>
              <div className="dl-upload-row">
                <input type="file" accept="image/*,.pdf" onChange={e => setDlFile(e.target.files[0])} className="form-control" style={{ flex: 1 }} />
                <button type="submit" className="btn btn-primary" disabled={dlLoading}>
                  <FaUpload /> {dlLoading ? 'Uploading...' : 'Upload DL'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

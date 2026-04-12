import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { FaBan, FaCheckCircle, FaIdCard, FaSearch } from 'react-icons/fa';
import api from '../utils/api';
import './Dashboard.css';
import './AdminPages.css';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    api.get('/admin/users').then(r => setUsers(r.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const toggleBlock = async (id) => {
    try {
      const { data } = await api.put(`/admin/users/${id}/block`);
      setUsers(prev => prev.map(u => u._id === id ? { ...u, isBlocked: data.isBlocked } : u));
      toast.success(data.message);
    } catch { toast.error('Failed'); }
  };

  const verifyDL = async (id) => {
    try {
      await api.put(`/admin/users/${id}/verify-dl`);
      setUsers(prev => prev.map(u => u._id === id ? { ...u, dlVerified: true, isVerified: true } : u));
      toast.success('DL verified!');
    } catch { toast.error('Failed'); }
  };

  const filtered = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase()) ||
    u.role.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div className="loading-center"><div className="spinner"></div></div>;

  return (
    <div className="container dashboard-page">
      <div className="dash-header">
        <div><h1>Manage Users</h1><p>{users.length} registered users</p></div>
      </div>
      <div className="admin-search">
        <FaSearch />
        <input className="form-control" placeholder="Search by name, email or role..." value={search} onChange={e => setSearch(e.target.value)} style={{ paddingLeft: 36 }} />
      </div>
      <div className="card vehicles-table-wrap">
        <table className="vehicles-table">
          <thead>
            <tr><th>User</th><th>Role</th><th>Phone</th><th>City</th><th>DL</th><th>Status</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {filtered.map(u => (
              <tr key={u._id}>
                <td>
                  <div className="table-vehicle">
                    <div className="user-avatar-sm">{u.name?.[0]?.toUpperCase()}</div>
                    <div>
                      <strong>{u.name}</strong>
                      <span>{u.email}</span>
                    </div>
                  </div>
                </td>
                <td><span className="badge badge-info" style={{ textTransform: 'capitalize' }}>{u.role}</span></td>
                <td>{u.phone || '—'}</td>
                <td>{u.city || '—'}</td>
                <td>
                  {u.drivingLicense
                    ? u.dlVerified
                      ? <span className="badge badge-success"><FaCheckCircle /> Verified</span>
                      : <span className="badge badge-warning">Pending</span>
                    : <span className="badge badge-mid">None</span>}
                </td>
                <td>
                  {u.isBlocked
                    ? <span className="badge badge-danger">Blocked</span>
                    : <span className="badge badge-success">Active</span>}
                </td>
                <td>
                  <div className="table-actions">
                    {u.drivingLicense && !u.dlVerified && (
                      <button className="btn btn-success btn-sm" onClick={() => verifyDL(u._id)} title="Verify DL">
                        <FaIdCard /> Verify DL
                      </button>
                    )}
                    <button className={`btn btn-sm ${u.isBlocked ? 'btn-outline' : 'btn-danger'}`} onClick={() => toggleBlock(u._id)}>
                      <FaBan /> {u.isBlocked ? 'Unblock' : 'Block'}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <div className="empty-state"><h3>No users found</h3></div>}
      </div>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FaFilter, FaTimes } from 'react-icons/fa';
import VehicleCard from '../components/VehicleCard';
import api from '../utils/api';
import './Vehicles.css';

export default function Vehicles() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    type: searchParams.get('type') || '',
    category: '',
    city: '',
    minPrice: '',
    maxPrice: '',
  });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => { fetchVehicles(); }, []);

  const fetchVehicles = async (f = filters) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      Object.entries(f).forEach(([k, v]) => { if (v) params.append(k, v); });
      const { data } = await api.get(`/vehicles?${params}`);
      setVehicles(data);
    } catch { setVehicles([]); }
    finally { setLoading(false); }
  };

  const handleFilter = (e) => {
    e.preventDefault();
    fetchVehicles(filters);
  };

  const handleReset = () => {
    const reset = { search: '', type: '', category: '', city: '', minPrice: '', maxPrice: '' };
    setFilters(reset);
    fetchVehicles(reset);
  };

  return (
    <div className="vehicles-page">
      <div className="container">
        <div className="vehicles-header">
          <div>
            <h1>Browse Vehicles</h1>
            <p>{vehicles.length} vehicles available</p>
          </div>
          <button className="btn btn-outline btn-sm" onClick={() => setShowFilters(!showFilters)}>
            <FaFilter /> {showFilters ? 'Hide' : 'Show'} Filters
          </button>
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <div className="filter-panel">
            <form onSubmit={handleFilter} className="filter-form">
              <div className="filter-grid">
                <div className="form-group">
                  <label>Search</label>
                  <input className="form-control" placeholder="Brand, model, city..."
                    value={filters.search} onChange={e => setFilters({ ...filters, search: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>City</label>
                  <input className="form-control" placeholder="e.g. Delhi, Mumbai"
                    value={filters.city} onChange={e => setFilters({ ...filters, city: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>Vehicle Type</label>
                  <select className="form-control" value={filters.type}
                    onChange={e => setFilters({ ...filters, type: e.target.value })}>
                    <option value="">All Types</option>
                    <option value="two-wheeler">Two Wheeler</option>
                    <option value="four-wheeler">Four Wheeler</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Category</label>
                  <select className="form-control" value={filters.category}
                    onChange={e => setFilters({ ...filters, category: e.target.value })}>
                    <option value="">All Categories</option>
                    <option value="bike">Bike</option>
                    <option value="scooter">Scooter</option>
                    <option value="car">Car</option>
                    <option value="suv">SUV</option>
                    <option value="van">Van</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Min Price (₹/day)</label>
                  <input type="number" className="form-control" placeholder="0"
                    value={filters.minPrice} onChange={e => setFilters({ ...filters, minPrice: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>Max Price (₹/day)</label>
                  <input type="number" className="form-control" placeholder="5000"
                    value={filters.maxPrice} onChange={e => setFilters({ ...filters, maxPrice: e.target.value })} />
                </div>
              </div>
              <div className="filter-actions">
                <button type="submit" className="btn btn-primary">Apply Filters</button>
                <button type="button" className="btn btn-outline" onClick={handleReset}><FaTimes /> Reset</button>
              </div>
            </form>
          </div>
        )}

        {loading ? (
          <div className="loading-center"><div className="spinner"></div></div>
        ) : vehicles.length === 0 ? (
          <div className="empty-state">
            <h3>No vehicles found</h3>
            <p>Try adjusting your filters or search term</p>
            <button className="btn btn-primary" onClick={handleReset}>Clear Filters</button>
          </div>
        ) : (
          <div className="grid-3" style={{ marginTop: 28 }}>
            {vehicles.map(v => <VehicleCard key={v._id} vehicle={v} />)}
          </div>
        )}
      </div>
    </div>
  );
}

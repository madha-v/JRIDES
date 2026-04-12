import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaUpload } from 'react-icons/fa';
import api from '../utils/api';
import './AddVehicle.css';

export default function AddVehicle() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState([]);
  const [form, setForm] = useState({
    name: '', brand: '', model: '', year: new Date().getFullYear(),
    type: 'four-wheeler', category: 'car', fuelType: 'petrol',
    transmission: 'manual', seats: 4, pricePerDay: '',
    location: '', city: '', description: '', features: ''
  });

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    if (!form.pricePerDay || form.pricePerDay < 1) return toast.error('Enter a valid price');
    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      images.forEach(img => fd.append('images', img));
      await api.post('/vehicles', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      toast.success('Vehicle listed successfully!');
      navigate('/owner/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add vehicle');
    } finally {
      setLoading(false);
    }
  };

  const twoWheelerCategories = ['bike', 'scooter'];
  const fourWheelerCategories = ['car', 'suv', 'van'];
  const categories = form.type === 'two-wheeler' ? twoWheelerCategories : fourWheelerCategories;

  return (
    <div className="container add-vehicle-page">
      <div className="add-vehicle-header">
        <h1>List a New Vehicle</h1>
        <p>Fill in the details below to list your vehicle for rent</p>
      </div>
      <form onSubmit={handleSubmit} className="add-vehicle-form">
        <div className="form-section card">
          <h2 className="form-section-title">Basic Information</h2>
          <div className="form-grid-2">
            <div className="form-group">
              <label>Vehicle Name / Title *</label>
              <input name="name" className="form-control" placeholder="e.g. My Honda City" value={form.name} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Brand *</label>
              <input name="brand" className="form-control" placeholder="e.g. Honda, Yamaha" value={form.brand} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Model *</label>
              <input name="model" className="form-control" placeholder="e.g. City, Activa" value={form.model} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Year *</label>
              <input type="number" name="year" className="form-control" min="2000" max={new Date().getFullYear()} value={form.year} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Vehicle Type *</label>
              <select name="type" className="form-control" value={form.type}
                onChange={e => setForm({ ...form, type: e.target.value, category: e.target.value === 'two-wheeler' ? 'bike' : 'car' })}>
                <option value="two-wheeler">Two Wheeler</option>
                <option value="four-wheeler">Four Wheeler</option>
              </select>
            </div>
            <div className="form-group">
              <label>Category *</label>
              <select name="category" className="form-control" value={form.category} onChange={handleChange}>
                {categories.map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
              </select>
            </div>
          </div>
        </div>

        <div className="form-section card">
          <h2 className="form-section-title">Vehicle Specs</h2>
          <div className="form-grid-2">
            <div className="form-group">
              <label>Fuel Type</label>
              <select name="fuelType" className="form-control" value={form.fuelType} onChange={handleChange}>
                <option value="petrol">Petrol</option>
                <option value="diesel">Diesel</option>
                <option value="electric">Electric</option>
                <option value="cng">CNG</option>
              </select>
            </div>
            <div className="form-group">
              <label>Transmission</label>
              <select name="transmission" className="form-control" value={form.transmission} onChange={handleChange}>
                <option value="manual">Manual</option>
                <option value="automatic">Automatic</option>
              </select>
            </div>
            <div className="form-group">
              <label>Number of Seats</label>
              <input type="number" name="seats" className="form-control" min="2" max="12" value={form.seats} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Price Per Day (Rs.) *</label>
              <input type="number" name="pricePerDay" className="form-control" placeholder="e.g. 800" min="1" value={form.pricePerDay} onChange={handleChange} required />
            </div>
          </div>
        </div>

        <div className="form-section card">
          <h2 className="form-section-title">Location</h2>
          <div className="form-grid-2">
            <div className="form-group">
              <label>City *</label>
              <input name="city" className="form-control" placeholder="e.g. Delhi" value={form.city} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Pickup Location / Address *</label>
              <input name="location" className="form-control" placeholder="Full pickup address" value={form.location} onChange={handleChange} required />
            </div>
          </div>
        </div>

        <div className="form-section card">
          <h2 className="form-section-title">Additional Details</h2>
          <div className="form-group">
            <label>Description</label>
            <textarea name="description" className="form-control" rows={4}
              placeholder="Describe your vehicle condition, extras, rules..." value={form.description} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Features (comma-separated)</label>
            <input name="features" className="form-control" placeholder="e.g. AC, GPS, Bluetooth, Sunroof"
              value={form.features} onChange={handleChange} />
          </div>
        </div>

        <div className="form-section card">
          <h2 className="form-section-title">Vehicle Photos</h2>
          <div className="upload-area" onClick={() => document.getElementById('imgInput').click()}>
            <FaUpload size={28} color="var(--mid)" />
            <p>Click to upload photos (max 5)</p>
            <span>JPG, PNG up to 5MB each</span>
            <input id="imgInput" type="file" multiple accept="image/*" style={{ display: 'none' }}
              onChange={e => setImages(Array.from(e.target.files).slice(0, 5))} />
          </div>
          {images.length > 0 && (
            <div className="img-preview">
              {images.map((img, i) => (
                <div key={i} className="preview-thumb">
                  <img src={URL.createObjectURL(img)} alt="" />
                  <button type="button" onClick={() => setImages(images.filter((_, j) => j !== i))}>x</button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="form-submit">
          <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
            {loading ? 'Listing Vehicle...' : 'List Vehicle'}
          </button>
        </div>
      </form>
    </div>
  );
}

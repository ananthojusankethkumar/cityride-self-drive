import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Plus } from 'lucide-react';

export default function AddCarModal() {
  const { isAddCarModalOpen, setIsAddCarModalOpen, addCar } = useApp();

  const [name, setName] = useState('');
  const [brand, setBrand] = useState('');
  const [category, setCategory] = useState('Electric');
  const [transmission, setTransmission] = useState('Automatic');
  const [fuelType, setFuelType] = useState('Electric');
  const [seats, setSeats] = useState(5);
  const [pricePerHour, setPricePerHour] = useState(20);
  const [pricePerDay, setPricePerDay] = useState(140);
  const [licensePlate, setLicensePlate] = useState('');
  const [image, setImage] = useState('');
  const [features, setFeatures] = useState('GPS Navigation, Bluetooth Audio, Keyless Access');

  if (!isAddCarModalOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name || !brand || !licensePlate) {
      alert('Please fill out car name, brand, and license plate.');
      return;
    }

    addCar({
      name,
      brand,
      category,
      transmission,
      fuelType,
      seats: Number(seats),
      pricePerHour: Number(pricePerHour),
      pricePerDay: Number(pricePerDay),
      licensePlate,
      image: image.trim(),
      specs: {
        range: fuelType === 'Electric' ? '450 km' : '650 km',
        acceleration: '0-100 in 4.5s',
        topSpeed: '220 km/h'
      },
      features: features.split(',').map(f => f.trim()).filter(Boolean)
    });

    setIsAddCarModalOpen(false);
    // Reset fields
    setName('');
    setBrand('');
    setLicensePlate('');
    setImage('');
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-container" style={{ maxWidth: '700px' }}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Plus size={22} className="text-indigo-400" />
            <h2 className="modal-title">Add New Vehicle to Fleet</h2>
          </div>
          <button className="modal-close" onClick={() => setIsAddCarModalOpen(false)}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body">
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Vehicle Name / Model</label>
              <input
                type="text"
                placeholder="e.g. Audi e-tron GT"
                className="form-input"
                value={name}
                onChange={e => setName(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Make / Brand</label>
              <input
                type="text"
                placeholder="e.g. Audi, BMW, Tesla"
                className="form-input"
                value={brand}
                onChange={e => setBrand(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Category</label>
              <select
                className="form-select"
                value={category}
                onChange={e => setCategory(e.target.value)}
              >
                <option value="Electric">Electric (EV)</option>
                <option value="Sports">Sports / Performance</option>
                <option value="SUV">SUV & Crossover</option>
                <option value="Luxury">Luxury Sedan</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Transmission</label>
              <select
                className="form-select"
                value={transmission}
                onChange={e => setTransmission(e.target.value)}
              >
                <option value="Automatic">Automatic</option>
                <option value="Manual">Manual</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Fuel / Powertrain</label>
              <select
                className="form-select"
                value={fuelType}
                onChange={e => setFuelType(e.target.value)}
              >
                <option value="Electric">Electric</option>
                <option value="Petrol">Petrol</option>
                <option value="Hybrid">Hybrid</option>
                <option value="Diesel">Diesel</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Seating Capacity</label>
              <input
                type="number"
                min="2"
                max="9"
                className="form-input"
                value={seats}
                onChange={e => setSeats(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Hourly Rate (₹)</label>
              <input
                type="number"
                min="5"
                className="form-input"
                value={pricePerHour}
                onChange={e => setPricePerHour(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Daily Rate (₹)</label>
              <input
                type="number"
                min="30"
                className="form-input"
                value={pricePerDay}
                onChange={e => setPricePerDay(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">License Plate Number</label>
              <input
                type="text"
                placeholder="e.g. CA-9921-X"
                className="form-input"
                value={licensePlate}
                onChange={e => setLicensePlate(e.target.value)}
                required
              />
            </div>

            <div className="form-group full-width">
              <label className="form-label">Key Features (comma separated)</label>
              <input
                type="text"
                className="form-input"
                value={features}
                onChange={e => setFeatures(e.target.value)}
              />
            </div>

            <div className="form-group full-width">
              <label className="form-label">Vehicle Image URL</label>
              <input
                type="text"
                placeholder="Paste a direct image URL (https://...)"
                className="form-input"
                value={image}
                onChange={e => setImage(e.target.value)}
                required
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button
              type="button"
              className="btn-secondary btn-sm"
              onClick={() => setIsAddCarModalOpen(false)}
            >
              Cancel
            </button>
            <button type="submit" className="book-btn">
              Add Vehicle to App
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

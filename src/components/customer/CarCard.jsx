import React from 'react';
import { Star, Fuel, Gauge, Users, Zap, MapPin } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function CarCard({ car }) {
  const { setSelectedCarForBooking, setIsBookingModalOpen } = useApp();

  const handleBookClick = () => {
    setSelectedCarForBooking(car);
    setIsBookingModalOpen(true);
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'Available':
        return 'available';
      case 'Rented':
        return 'rented';
      default:
        return 'maintenance';
    }
  };

  return (
    <div className="car-card">
      <div className="car-image-container">
        <img src={car.image} alt={car.name} className="car-image" loading="lazy" />
        <span className="category-tag">{car.category}</span>
        <span className={`status-badge ${getStatusClass(car.status)}`}>
          {car.status}
        </span>
      </div>

      <div className="car-details">
        <div className="car-title-row">
          <h3 className="car-name">{car.name}</h3>
          <div className="rating-pill">
            <Star size={14} fill="#f59e0b" color="#f59e0b" />
            <span>{car.rating} ({car.reviewsCount})</span>
          </div>
        </div>

        <p className="car-brand-subtitle">
          <MapPin size={12} style={{ display: 'inline', marginRight: '4px' }} />
          {car.location}
        </p>

        {/* Specifications snippet */}
        <div className="specs-grid">
          <div className="spec-item">
            <Fuel size={16} />
            <span>{car.fuelType}</span>
          </div>
          <div className="spec-item">
            <Gauge size={16} />
            <span>{car.transmission}</span>
          </div>
          <div className="spec-item">
            <Users size={16} />
            <span>{car.seats} Seats</span>
          </div>
        </div>

        {/* Features tag list */}
        {car.features && (
          <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginBottom: '1rem' }}>
            {car.features.slice(0, 2).map((feat, idx) => (
              <span
                key={idx}
                style={{
                  fontSize: '0.7rem',
                  background: 'var(--bg-secondary)',
                  color: 'var(--text-secondary)',
                  padding: '2px 8px',
                  borderRadius: '4px',
                  border: '1px solid var(--border-color)'
                }}
              >
                ✓ {feat}
              </span>
            ))}
          </div>
        )}

        {/* Price & Book Button */}
        <div className="price-booking-row">
          <div className="price-display">
            <div className="price-amount">
              ₹{car.pricePerDay}
              <span style={{ fontSize: '0.8rem', fontWeight: 'normal', color: 'var(--text-muted)' }}>/day</span>
            </div>
            <div className="price-period">₹{car.pricePerHour}/hour</div>
          </div>

          <button
            className="book-btn"
            disabled={car.status !== 'Available'}
            onClick={handleBookClick}
          >
            {car.status === 'Available' ? 'Book Car' : 'Unavailable'}
          </button>
        </div>
      </div>
    </div>
  );
}

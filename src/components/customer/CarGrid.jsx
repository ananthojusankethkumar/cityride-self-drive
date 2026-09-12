import React, { useState } from 'react';
import CarCard from './CarCard';
import { SlidersHorizontal, CarFront } from 'lucide-react';

export default function CarGrid({ cars, searchQuery, selectedLocation }) {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('popular');

  const categories = ['All', 'Electric', 'Sports', 'SUV', 'Luxury'];

  // Filter cars based on search, location, category
  const filteredCars = cars.filter(car => {
    const matchesSearch =
      car.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      car.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      car.fuelType.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesLocation =
      selectedLocation === 'All' || !selectedLocation || car.location === selectedLocation;

    const matchesCategory =
      selectedCategory === 'All' || car.category === selectedCategory;

    return matchesSearch && matchesLocation && matchesCategory;
  });

  // Sort cars
  const sortedCars = [...filteredCars].sort((a, b) => {
    if (sortBy === 'price-low') return a.pricePerDay - b.pricePerDay;
    if (sortBy === 'price-high') return b.pricePerDay - a.pricePerDay;
    if (sortBy === 'rating') return b.rating - a.rating;
    return 0; // Default order
  });

  return (
    <section style={{ padding: '2rem 0 4rem' }}>
      <div className="container">
        {/* Toolbar */}
        <div className="fleet-toolbar">
          <div className="category-tabs">
            {categories.map(cat => (
              <button
                key={cat}
                className={`tab-btn ${selectedCategory === cat ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat === 'All' ? 'All Fleet' : cat}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <SlidersHorizontal size={16} style={{ color: 'var(--text-muted)' }} />
            <select
              className="sort-select"
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
            >
              <option value="popular">Sort: Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>
        </div>

        {/* Cars Grid */}
        {sortedCars.length > 0 ? (
          <div className="cars-grid">
            {sortedCars.map(car => (
              <CarCard key={car.id} car={car} />
            ))}
          </div>
        ) : (
          <div
            style={{
              padding: '4rem 2rem',
              background: 'var(--bg-card)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-color)',
              textAlign: 'center'
            }}
          >
            <CarFront size={48} style={{ color: 'var(--text-muted)', marginBottom: '1rem' }} />
            <h3 style={{ fontSize: '1.3rem', marginBottom: '0.5rem' }}>No Vehicles Match Your Search</h3>
            <p style={{ color: 'var(--text-secondary)' }}>
              Try adjusting your category filter, location, or search keywords.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

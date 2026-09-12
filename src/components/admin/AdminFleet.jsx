import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { PlusCircle, Search, Trash2, Edit, CarFront } from 'lucide-react';

export default function AdminFleet() {
  const {
    cars,
    updateCarStatus,
    deleteCar,
    setIsAddCarModalOpen
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const filteredCars = cars.filter(car => {
    const matchesSearch =
      car.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      car.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      car.licensePlate.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === 'All' || car.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div>
      {/* Header Toolbar */}
      <div
        style={{
          display: 'flex',
          justify: 'space-between',
          alignItems: 'center',
          marginBottom: '1.5rem',
          flexWrap: 'wrap',
          gap: '1rem'
        }}
      >
        <div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Fleet Management</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Add, update operational status, or retire vehicles from your fleet.
          </p>
        </div>

        <button
          className="book-btn"
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          onClick={() => setIsAddCarModalOpen(true)}
        >
          <PlusCircle size={18} />
          <span>Add New Vehicle</span>
        </button>
      </div>

      {/* Table Card */}
      <div className="data-table-card">
        {/* Filters bar */}
        <div className="table-header-toolbar">
          <div style={{ display: 'flex', gap: '0.75rem', flex: 1, maxWidth: '500px' }}>
            <div style={{ position: 'relative', flex: 1 }}>
              <input
                type="text"
                placeholder="Search car, brand, or license plate..."
                className="search-input"
                style={{ width: '100%', paddingLeft: '2.5rem' }}
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
              <Search
                size={16}
                style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--text-muted)'
                }}
              />
            </div>

            <select
              className="sort-select"
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
            >
              <option value="All">All Statuses</option>
              <option value="Available">Available</option>
              <option value="Rented">Rented</option>
              <option value="Maintenance">Maintenance</option>
            </select>
          </div>

          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Showing <strong>{filteredCars.length}</strong> of <strong>{cars.length}</strong> vehicles
          </div>
        </div>

        {/* Fleet Table */}
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Vehicle & Model</th>
                <th>Category</th>
                <th>Specs</th>
                <th>Rates</th>
                <th>License Plate & Hub</th>
                <th>Status Toggle</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCars.length > 0 ? (
                filteredCars.map(car => (
                  <tr key={car.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <img
                          src={car.image}
                          alt={car.name}
                          style={{
                            width: '70px',
                            height: '50px',
                            borderRadius: '8px',
                            objectFit: 'cover'
                          }}
                        />
                        <div>
                          <strong style={{ fontSize: '0.95rem' }}>{car.name}</strong>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                            {car.brand} • ★ {car.rating} ({car.reviewsCount})
                          </div>
                        </div>
                      </div>
                    </td>

                    <td>
                      <span className="category-tag" style={{ position: 'static' }}>
                        {car.category}
                      </span>
                    </td>

                    <td>
                      <div style={{ fontSize: '0.8rem' }}>
                        {car.transmission} • {car.fuelType}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {car.seats} Seats
                      </div>
                    </td>

                    <td>
                      <div style={{ fontWeight: 800 }}>₹{car.pricePerDay}<span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 'normal' }}>/day</span></div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>₹{car.pricePerHour}/hr</div>
                    </td>

                    <td>
                      <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>{car.licensePlate}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{car.location}</div>
                    </td>

                    <td>
                      <select
                        value={car.status}
                        onChange={e => updateCarStatus(car.id, e.target.value)}
                        style={{
                          background:
                            car.status === 'Available'
                              ? 'var(--status-available-bg)'
                              : car.status === 'Rented'
                              ? 'var(--status-rented-bg)'
                              : 'var(--status-maintenance-bg)',
                          color:
                            car.status === 'Available'
                              ? 'var(--status-available)'
                              : car.status === 'Rented'
                              ? 'var(--status-rented)'
                              : 'var(--status-maintenance)',
                          border: '1px solid var(--border-color)',
                          padding: '0.4rem 0.6rem',
                          borderRadius: 'var(--radius-full)',
                          fontWeight: 700,
                          fontSize: '0.8rem',
                          cursor: 'pointer'
                        }}
                      >
                        <option value="Available">Available</option>
                        <option value="Rented">Rented</option>
                        <option value="Maintenance">Maintenance</option>
                      </select>
                    </td>

                    <td>
                      <button
                        className="btn-danger btn-sm"
                        onClick={() => {
                          if (window.confirm(`Are you sure you want to remove "${car.name}" from fleet?`)) {
                            deleteCar(car.id);
                          }
                        }}
                        title="Remove vehicle"
                      >
                        <Trash2 size={14} />
                        <span>Delete</span>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '3rem' }}>
                    <CarFront size={36} style={{ color: 'var(--text-muted)', marginBottom: '0.5rem' }} />
                    <div>No vehicles match your search query.</div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

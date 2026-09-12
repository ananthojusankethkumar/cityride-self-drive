import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Search, Calendar, CheckCircle2, Key, RotateCcw, XCircle, FileText } from 'lucide-react';

export default function AdminBookings() {
  const { bookings, updateBookingStatus, cancelBooking } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const filteredBookings = bookings.filter(b => {
    const matchesSearch =
      b.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.customerEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.carName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.licenseNumber.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'All' || b.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div>
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
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Customer Reservations & Handovers</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Verify driver credentials, issue keyless handover, process returns, or cancel bookings.
          </p>
        </div>
      </div>

      <div className="data-table-card">
        {/* Toolbar */}
        <div className="table-header-toolbar">
          <div style={{ display: 'flex', gap: '0.75rem', flex: 1, maxWidth: '500px' }}>
            <div style={{ position: 'relative', flex: 1 }}>
              <input
                type="text"
                placeholder="Search ID, customer name, license, or car..."
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
              <option value="Confirmed">Confirmed</option>
              <option value="Active">Active Rental</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>

          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Total <strong>{filteredBookings.length}</strong> bookings recorded
          </div>
        </div>

        {/* Table */}
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Booking Ref</th>
                <th>Customer & License</th>
                <th>Vehicle Booked</th>
                <th>Rental Dates</th>
                <th>Location & Protection</th>
                <th>Total Paid</th>
                <th>Status</th>
                <th>Lifecycle Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredBookings.length > 0 ? (
                filteredBookings.map(b => (
                  <tr key={b.id}>
                    <td>
                      <strong style={{ color: 'var(--accent-primary)', fontSize: '0.95rem' }}>{b.id}</strong>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{b.createdAt}</div>
                    </td>

                    <td>
                      <div style={{ fontWeight: 700 }}>{b.customerName}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{b.customerEmail}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--status-available)', fontWeight: 600 }}>
                        🪪 {b.licenseNumber}
                      </div>
                    </td>

                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <img
                          src={b.carImage}
                          alt={b.carName}
                          style={{ width: '45px', height: '35px', borderRadius: '4px', objectFit: 'cover' }}
                        />
                        <span style={{ fontWeight: 600, fontSize: '0.85rem' }}>{b.carName}</span>
                      </div>
                    </td>

                    <td>
                      <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>
                        {b.startDate} → {b.endDate}
                      </div>
                    </td>

                    <td>
                      <div style={{ fontSize: '0.8rem' }}>{b.pickupLocation}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {b.insurancePlan}
                      </div>
                    </td>

                    <td>
                      <strong style={{ fontSize: '1rem', color: 'var(--text-primary)' }}>
                        ₹{b.totalPrice}
                      </strong>
                    </td>

                    <td>
                      <span className={`status-badge ${b.status.toLowerCase()}`}>
                        {b.status}
                      </span>
                    </td>

                    <td>
                      <div className="action-btn-group">
                        {b.status === 'Confirmed' && (
                          <button
                            className="btn-primary btn-sm"
                            onClick={() => updateBookingStatus(b.id, 'Active')}
                            title="Hand over car & unlock keyless pass"
                          >
                            <Key size={14} />
                            <span>Handover</span>
                          </button>
                        )}

                        {b.status === 'Active' && (
                          <button
                            className="btn-primary btn-sm"
                            style={{ background: 'var(--status-available)' }}
                            onClick={() => updateBookingStatus(b.id, 'Completed')}
                            title="Process return & finalize trip"
                          >
                            <CheckCircle2 size={14} />
                            <span>Return</span>
                          </button>
                        )}

                        {(b.status === 'Confirmed' || b.status === 'Active') && (
                          <button
                            className="btn-danger btn-sm"
                            onClick={() => cancelBooking(b.id)}
                            title="Cancel reservation"
                          >
                            <XCircle size={14} />
                            <span>Cancel</span>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center', padding: '3rem' }}>
                    <Calendar size={36} style={{ color: 'var(--text-muted)', marginBottom: '0.5rem' }} />
                    <div>No customer bookings found.</div>
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

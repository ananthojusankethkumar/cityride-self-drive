import React from 'react';
import { useApp } from '../../context/AppContext';
import { X, Ticket, Calendar, MapPin, AlertCircle, FileText } from 'lucide-react';

export default function MyBookingsModal() {
  const {
    isMyBookingsOpen,
    setIsMyBookingsOpen,
    bookings,
    cancelBooking
  } = useApp();

  if (!isMyBookingsOpen) return null;

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Confirmed':
        return <span className="status-badge" style={{ background: 'rgba(59, 130, 246, 0.15)', color: '#3b82f6' }}>Confirmed</span>;
      case 'Active':
        return <span className="status-badge available">Active Rental</span>;
      case 'Completed':
        return <span className="status-badge" style={{ background: 'rgba(148, 163, 184, 0.15)', color: '#94a3b8' }}>Completed</span>;
      default:
        return <span className="status-badge maintenance">Cancelled</span>;
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-container" style={{ maxWidth: '750px' }}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Ticket size={22} className="text-indigo-400" />
            <h2 className="modal-title">My Self-Drive Trips & Passes</h2>
          </div>
          <button className="modal-close" onClick={() => setIsMyBookingsOpen(false)}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          {bookings.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {bookings.map(booking => (
                <div
                  key={booking.id}
                  style={{
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-md)',
                    padding: '1.25rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                      <img
                        src={booking.carImage}
                        alt={booking.carName}
                        style={{ width: '80px', height: '60px', borderRadius: '8px', objectFit: 'cover' }}
                      />
                      <div>
                        <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--accent-primary)' }}>
                          {booking.id}
                        </div>
                        <h4 style={{ fontSize: '1.1rem', fontWeight: 700 }}>{booking.carName}</h4>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                          Renter: {booking.customerName} ({booking.customerEmail})
                        </div>
                      </div>
                    </div>
                    {getStatusBadge(booking.status)}
                  </div>

                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                      gap: '0.75rem',
                      background: 'var(--bg-card)',
                      padding: '0.85rem',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '0.85rem'
                    }}
                  >
                    <div>
                      <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.75rem' }}>
                        Rental Period
                      </span>
                      <Calendar size={14} style={{ display: 'inline', marginRight: '4px' }} />
                      <strong>{booking.startDate} → {booking.endDate}</strong>
                    </div>

                    <div>
                      <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.75rem' }}>
                        Pickup Hub
                      </span>
                      <MapPin size={14} style={{ display: 'inline', marginRight: '4px' }} />
                      <strong>{booking.pickupLocation}</strong>
                    </div>

                    <div>
                      <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.75rem' }}>
                        Total Paid
                      </span>
                      <strong style={{ color: 'var(--accent-primary)', fontSize: '1rem' }}>
                        ₹{booking.totalPrice}
                      </strong>
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      License: {booking.licenseNumber} • Created {booking.createdAt}
                    </div>

                    {booking.status === 'Confirmed' && (
                      <button
                        className="btn-danger btn-sm"
                        onClick={() => cancelBooking(booking.id)}
                      >
                        Cancel Booking
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
              <AlertCircle size={40} style={{ color: 'var(--text-muted)', marginBottom: '0.5rem' }} />
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>No Active Trips Found</h3>
              <p style={{ color: 'var(--text-secondary)' }}>
                You haven't booked any vehicles yet. Explore our fleet and book your self-drive ride today!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

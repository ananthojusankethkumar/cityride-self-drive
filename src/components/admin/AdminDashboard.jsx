import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  DollarSign,
  Car,
  Clock,
  Users,
  TrendingUp,
  PlusCircle,
  ShieldCheck,
  CheckCircle,
  Calendar
} from 'lucide-react';

export default function AdminDashboard() {
  const {
    cars,
    bookings,
    customers,
    setAdminTab,
    setIsAddCarModalOpen,
    updateBookingStatus,
    acceptBooking
  } = useApp();

  // Metrics Calculation
  const totalRevenue = bookings.reduce((sum, b) => {
    return b.status !== 'Cancelled' ? sum + b.totalPrice : sum;
  }, 0);

  const activeRentalsCount = cars.filter(c => c.status === 'Rented').length;
  const availableCount = cars.filter(c => c.status === 'Available').length;
  const totalCarsCount = cars.length;

  const utilizationRate = totalCarsCount > 0
    ? Math.round((activeRentalsCount / totalCarsCount) * 100)
    : 0;

  // Category counts for chart
  const categoryCounts = cars.reduce((acc, car) => {
    acc[car.category] = (acc[car.category] || 0) + 1;
    return acc;
  }, {});

  return (
    <div>
      {/* Top Banner & Quick Actions */}
      <div
        style={{
          display: 'flex',
          justify: 'space-between',
          alignItems: 'center',
          marginBottom: '2rem',
          flexWrap: 'wrap',
          gap: '1rem'
        }}
      >
        <div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Executive Overview</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Real-time fleet performance, customer activity, and rental revenue analytics.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            className="book-btn"
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            onClick={() => setIsAddCarModalOpen(true)}
          >
            <PlusCircle size={18} />
            <span>Add Vehicle</span>
          </button>
          <button
            className="btn-secondary btn-sm"
            onClick={() => setAdminTab('bookings')}
          >
            <Calendar size={16} />
            <span>View All Bookings</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="metrics-grid">
        {/* Metric 1 */}
        <div className="metric-card">
          <div className="metric-icon" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10b981' }}>
            <DollarSign size={26} />
          </div>
          <div className="metric-info">
            <h3>Total Revenue</h3>
            <div className="metric-value">₹{totalRevenue.toLocaleString()}</div>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="metric-card">
          <div className="metric-icon" style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b' }}>
            <Clock size={26} />
          </div>
          <div className="metric-info">
            <h3>Active Rentals</h3>
            <div className="metric-value">{activeRentalsCount} vehicles</div>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="metric-card">
          <div className="metric-icon" style={{ background: 'rgba(99, 102, 241, 0.15)', color: '#6366f1' }}>
            <Car size={26} />
          </div>
          <div className="metric-info">
            <h3>Total Fleet</h3>
            <div className="metric-value">{totalCarsCount} cars</div>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="metric-card">
          <div className="metric-icon" style={{ background: 'rgba(6, 182, 212, 0.15)', color: '#06b6d4' }}>
            <TrendingUp size={26} />
          </div>
          <div className="metric-info">
            <h3>Utilization Rate</h3>
            <div className="metric-value">{utilizationRate}%</div>
          </div>
        </div>

        {/* Metric 5 */}
        <div className="metric-card">
          <div className="metric-icon" style={{ background: 'rgba(236, 72, 153, 0.15)', color: '#ec4899' }}>
            <Users size={26} />
          </div>
          <div className="metric-info">
            <h3>Registered Renter Base</h3>
            <div className="metric-value">{customers.length} users</div>
          </div>
        </div>
      </div>

      {/* Analytics Breakdown & Recent Activity */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1.5rem', marginBottom: '2rem' }}>
        {/* Fleet Composition Visual */}
        <div
          style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-md)',
            padding: '1.5rem'
          }}
        >
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem' }}>
            Fleet Composition
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {Object.entries(categoryCounts).map(([cat, count]) => {
              const pct = Math.round((count / totalCarsCount) * 100);
              return (
                <div key={cat}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '4px' }}>
                    <span style={{ fontWeight: 600 }}>{cat}</span>
                    <span style={{ color: 'var(--text-muted)' }}>{count} cars ({pct}%)</span>
                  </div>
                  <div
                    style={{
                      height: '8px',
                      background: 'var(--bg-secondary)',
                      borderRadius: '4px',
                      overflow: 'hidden'
                    }}
                  >
                    <div
                      style={{
                        height: '100%',
                        width: `${pct}%`,
                        background: 'var(--accent-gradient)',
                        borderRadius: '4px'
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div
            style={{
              marginTop: '1.5rem',
              paddingTop: '1rem',
              borderTop: '1px solid var(--border-color)',
              fontSize: '0.85rem',
              color: 'var(--text-muted)'
            }}
          >
            Available for Booking: <strong style={{ color: 'var(--status-available)' }}>{availableCount}</strong>
          </div>
        </div>

        {/* Recent Bookings Table Preview */}
        <div className="data-table-card">
          <div className="table-header-toolbar">
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Recent Reservations</h3>
            <button className="btn-secondary btn-sm" onClick={() => setAdminTab('bookings')}>
              Manage All →
            </button>
          </div>

          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Booking ID</th>
                  <th>Customer</th>
                  <th>Vehicle</th>
                  <th>Dates</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {bookings.slice(0, 5).map(b => (
                  <tr key={b.id}>
                    <td>
                      <strong style={{ color: 'var(--accent-primary)' }}>{b.id}</strong>
                    </td>
                    <td>
                      <div>{b.customerName}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{b.customerEmail}</div>
                    </td>
                    <td>{b.carName}</td>
                    <td>{b.startDate} → {b.endDate}</td>
                    <td><strong>₹{b.totalPrice}</strong></td>
                    <td>
                      <span className={`status-badge ${b.status.toLowerCase()}`}>
                        {b.status}
                      </span>
                    </td>
                    <td>
                      {b.status === 'Pending' && (
                        <button
                          className="btn-primary btn-sm"
                          style={{ background: '#10b981' }}
                          onClick={() => acceptBooking(b.id)}
                        >
                          Accept
                        </button>
                      )}
                      {b.status === 'Confirmed' && (
                        <button
                          className="btn-primary btn-sm"
                          onClick={() => updateBookingStatus(b.id, 'Active')}
                        >
                          Handover
                        </button>
                      )}
                      {b.status === 'Active' && (
                        <button
                          className="btn-primary btn-sm"
                          style={{ background: 'var(--status-available)' }}
                          onClick={() => updateBookingStatus(b.id, 'Completed')}
                        >
                          Complete
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

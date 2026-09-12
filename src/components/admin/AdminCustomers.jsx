import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Search, ShieldCheck, UserCheck, Phone, Mail } from 'lucide-react';

export default function AdminCustomers() {
  const { customers } = useApp();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCustomers = customers.filter(c => {
    return (
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phone.includes(searchQuery) ||
      c.licenseNumber.toLowerCase().includes(searchQuery.toLowerCase())
    );
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
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Customer Directory & Verified Drivers</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            View customer identity records, driving license status, total rentals, and spend history.
          </p>
        </div>
      </div>

      <div className="data-table-card">
        {/* Search */}
        <div className="table-header-toolbar">
          <div style={{ position: 'relative', width: '100%', maxWidth: '400px' }}>
            <input
              type="text"
              placeholder="Search customer name, email, phone, or license..."
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

          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Total <strong>{filteredCustomers.length}</strong> customers registered
          </div>
        </div>

        {/* Table */}
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Customer ID</th>
                <th>Full Name & Contact</th>
                <th>License Verification</th>
                <th>Total Rentals</th>
                <th>Lifetime Spend</th>
                <th>Account Tier</th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.length > 0 ? (
                filteredCustomers.map(c => (
                  <tr key={c.id}>
                    <td>
                      <strong style={{ color: 'var(--accent-primary)' }}>{c.id}</strong>
                    </td>
                    <td>
                      <div style={{ fontWeight: 700 }}>{c.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Mail size={12} /> {c.email}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Phone size={12} /> {c.phone}
                      </div>
                    </td>

                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <ShieldCheck size={16} style={{ color: 'var(--status-available)' }} />
                        <span style={{ fontWeight: 600, fontSize: '0.85rem' }}>{c.licenseNumber}</span>
                      </div>
                      <span style={{ fontSize: '0.7rem', color: 'var(--status-available)' }}>
                        ✓ Identity & DL Verified
                      </span>
                    </td>

                    <td>
                      <strong style={{ fontSize: '1.05rem' }}>{c.totalBookings} trips</strong>
                    </td>

                    <td>
                      <strong style={{ fontSize: '1.05rem', color: 'var(--accent-primary)' }}>
                        ₹{c.totalSpent.toLocaleString()}
                      </strong>
                    </td>

                    <td>
                      <span
                        className="status-badge"
                        style={{
                          background: 'rgba(99, 102, 241, 0.15)',
                          color: 'var(--accent-primary)',
                          position: 'static'
                        }}
                      >
                        {c.status || 'Verified Member'}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '3rem' }}>
                    <UserCheck size={36} style={{ color: 'var(--text-muted)', marginBottom: '0.5rem' }} />
                    <div>No customers found matching search query.</div>
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

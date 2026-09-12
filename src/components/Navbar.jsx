import React from 'react';
import { useApp } from '../context/AppContext';
import { Zap, User, Moon, Sun, Ticket } from 'lucide-react';

export default function Navbar() {
  const {
    activePanel,
    navigateToPanel,
    theme,
    toggleTheme,
    bookings,
    setIsMyBookingsOpen
  } = useApp();

  const activeCustomerBookings = bookings.filter(
    b => b.status === 'Confirmed' || b.status === 'Active'
  ).length;

  return (
    <header className="navbar">
      <div className="container navbar-container">
        {/* Brand Logo */}
        <a href="/" className="brand-logo" onClick={(e) => { e.preventDefault(); navigateToPanel('customer'); }}>
          <div className="brand-icon">
            <Zap size={26} fill="white" />
          </div>
          <div className="brand-text">
            City<span>Ride</span>
          </div>
        </a>

        {/* Customer view only */}
        <div className="mode-switcher" title="Customer portal">
          <button className={`mode-btn ${activePanel === 'customer' ? 'active' : ''}`} onClick={() => navigateToPanel('customer')}>
            <User size={16} />
            <span>Customer Portal</span>
          </button>
        </div>

        {/* Actions (My Bookings, Theme Toggle, Reset Data) */}
        <div className="nav-actions">
          {activePanel === 'customer' && (
            <button
              className="icon-btn"
              onClick={() => setIsMyBookingsOpen(true)}
              title="My Self-Drive Passes & Trips"
            >
              <Ticket size={20} />
              {activeCustomerBookings > 0 && (
                <span className="badge-count">{activeCustomerBookings}</span>
              )}
            </button>
          )}

          <button
            className="icon-btn"
            onClick={toggleTheme}
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>

        </div>
      </div>
    </header>
  );
}

import React from 'react';
import { useApp } from '../context/AppContext';
import { User, Moon, Sun } from 'lucide-react';

export default function Navbar() {
  const {
    activePanel,
    navigateToPanel,
    theme,
    toggleTheme,
  } = useApp();

  return (
    <header className="navbar">
      <div className="container navbar-container">
        {/* Brand Logo */}
        <a href="/" className="brand-logo" onClick={(e) => { e.preventDefault(); navigateToPanel('customer'); }}>
          <img
            src="/logo.png"
            alt="City Ride"
            style={{ height: '42px', width: '42px', borderRadius: '8px', objectFit: 'cover' }}
          />
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

        {/* Actions */}
        <div className="nav-actions">
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

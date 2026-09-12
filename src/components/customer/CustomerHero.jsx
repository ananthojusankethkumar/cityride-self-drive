import React from 'react';
import { MapPin, Calendar, Search } from 'lucide-react';

export default function CustomerHero({
  searchQuery,
  setSearchQuery,
  selectedLocation,
  setSelectedLocation,
  startDate,
  setStartDate,
  endDate,
  setEndDate
}) {
  return (
    <section className="hero-section">
      <div className="container">
        <div className="hero-content">
          <h1 className="hero-title">
            Welcome to <span>City Ride</span>
          </h1>
        </div>

        {/* Search Card */}
        <div className="search-card">
          {/* Location */}
          <div className="search-field">
            <label>
              <MapPin size={14} /> City & Pickup Station
            </label>
            <select
              className="search-input"
              value={selectedLocation}
              onChange={e => setSelectedLocation(e.target.value)}
            >
              <option value="All">Nagole, Hyderabad</option>
            </select>
          </div>

          {/* Start Date */}
          <div className="search-field">
            <label>
              <Calendar size={14} /> Pickup Date
            </label>
            <input
              type="date"
              className="search-input"
              value={startDate}
              onChange={e => setStartDate(e.target.value)}
            />
          </div>

          {/* End Date */}
          <div className="search-field">
            <label>
              <Calendar size={14} /> Return Date
            </label>
            <input
              type="date"
              className="search-input"
              value={endDate}
              onChange={e => setEndDate(e.target.value)}
            />
          </div>

          {/* Search keyword input */}
          <div className="search-field">
            <label>
              <Search size={14} /> Vehicle / Model
            </label>
            <input
              type="text"
              placeholder="e.g. Thar, BMW, Nexon EV..."
              className="search-input"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Search CTA */}
          <button className="search-btn">
            <Search size={18} />
            <span>Find Rides</span>
          </button>
        </div>
      </div>
    </section>
  );
}

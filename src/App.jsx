import React, { useState } from 'react';
import { useApp } from './context/AppContext';
import Navbar from './components/Navbar';
import Toast from './components/Toast';

// Customer Components
import CustomerHero from './components/customer/CustomerHero';
import CarGrid from './components/customer/CarGrid';
import BookingModal from './components/customer/BookingModal';
import MyBookingsModal from './components/customer/MyBookingsModal';

// Admin Components
import AdminDashboard from './components/admin/AdminDashboard';
import AdminFleet from './components/admin/AdminFleet';
import AdminBookings from './components/admin/AdminBookings';
import AdminCustomers from './components/admin/AdminCustomers';
import AddCarModal from './components/admin/AddCarModal';

// Icons
import { LayoutDashboard, Car, Calendar, Users, ShieldCheck, Heart, Sparkles } from 'lucide-react';

export default function App() {
  const { activePanel, adminTab, setAdminTab, cars } = useApp();

  // Customer Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('All');
  const [startDate, setStartDate] = useState('2026-09-15');
  const [endDate, setEndDate] = useState('2026-09-18');

  return (
    <div className="app-layout">
      {/* Top Navbar */}
      <Navbar />

      {/* Main Content Area */}
      <main className="main-content">
        {activePanel === 'customer' ? (
          <>
            {/* Customer Hero Banner */}
            <CustomerHero
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              selectedLocation={selectedLocation}
              setSelectedLocation={setSelectedLocation}
              startDate={startDate}
              setStartDate={setStartDate}
              endDate={endDate}
              setEndDate={setEndDate}
            />

            {/* Fleet Showcase Grid */}
            <CarGrid
              cars={cars}
              searchQuery={searchQuery}
              selectedLocation={selectedLocation}
            />

            {/* Customer Modals */}
            <BookingModal />
            <MyBookingsModal />

            {/* Customer Panel Footer Credit */}
            <div style={{ textAlign: 'center', padding: '1.5rem 0', borderTop: '1px solid var(--border-color)', marginTop: '2rem', fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}>
              Powered by <strong style={{ color: 'var(--text-secondary)' }}>X-ITE Engine</strong> &amp; <strong style={{ color: 'var(--accent-primary)' }}>Bluey</strong> <Sparkles size={14} />
            </div>
          </>
        ) : (
          /* Operations Center View */
          <div className="container" style={{ paddingTop: '2rem' }}>
            {/* Admin Nav Sub-Tabs Header */}
            <div className="admin-header" style={{ paddingTop: 0 }}>
              <div className="admin-title-row">
                <div className="admin-title-group">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-primary)', fontSize: '0.85rem', fontWeight: 700, marginBottom: '4px' }}>
                    <ShieldCheck size={16} /> OPERATIONS CENTER
                  </div>
                  <h1>Fleet & Operations Management</h1>
                </div>
              </div>

              <div className="admin-nav-tabs">
                <button
                  className={`admin-tab ${adminTab === 'dashboard' ? 'active' : ''}`}
                  onClick={() => setAdminTab('dashboard')}
                >
                  <LayoutDashboard size={18} />
                  <span>Dashboard Overview</span>
                </button>
                <button
                  className={`admin-tab ${adminTab === 'fleet' ? 'active' : ''}`}
                  onClick={() => setAdminTab('fleet')}
                >
                  <Car size={18} />
                  <span>Fleet Management</span>
                </button>
                <button
                  className={`admin-tab ${adminTab === 'bookings' ? 'active' : ''}`}
                  onClick={() => setAdminTab('bookings')}
                >
                  <Calendar size={18} />
                  <span>Customer Bookings</span>
                </button>
                <button
                  className={`admin-tab ${adminTab === 'customers' ? 'active' : ''}`}
                  onClick={() => setAdminTab('customers')}
                >
                  <Users size={18} />
                  <span>Customer Directory</span>
                </button>
              </div>
            </div>

            {/* Selected Admin View */}
            {adminTab === 'dashboard' && <AdminDashboard />}
            {adminTab === 'fleet' && <AdminFleet />}
            {adminTab === 'bookings' && <AdminBookings />}
            {adminTab === 'customers' && <AdminCustomers />}

            {/* Add Car Modal */}
            <AddCarModal />

            {/* Admin Panel Footer Credit */}
            <div style={{ textAlign: 'center', padding: '1.5rem 0', borderTop: '1px solid var(--border-color)', marginTop: '2rem', fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}>
              Powered by <strong style={{ color: 'var(--text-secondary)' }}>X-ITE Engine</strong> &amp; <strong style={{ color: 'var(--accent-primary)' }}>Bluey</strong> <Sparkles size={14} />
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer
        style={{
          borderTop: '1px solid var(--border-color)',
          background: 'var(--bg-secondary)',
          padding: '2.5rem 0',
          marginTop: 'auto'
        }}
      >
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ fontWeight: 800, fontSize: '1.2rem', fontFamily: 'var(--font-heading)', marginBottom: '4px' }}>
              Drive<span style={{ color: 'var(--accent-primary)' }}>Pulse</span> Self-Drive
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Next-generation keyless self-drive car rental platform & fleet operations system.
            </div>
          </div>

          <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            Powered by <strong>X-ITE Engine & Bluey</strong> <Sparkles size={14} className="text-indigo-400" />
          </div>
        </div>
      </footer>

      {/* Toast Notification Container */}
      <Toast />
    </div>
  );
}

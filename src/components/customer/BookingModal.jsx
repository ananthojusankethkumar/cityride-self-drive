import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, CheckCircle2, QrCode, Sparkles, Clock, CalendarDays } from 'lucide-react';

export default function BookingModal() {
  const {
    selectedCarForBooking,
    isBookingModalOpen,
    setIsBookingModalOpen,
    createBooking
  } = useApp();

  const [step, setStep] = useState(1);

  // Booking Form State
  const [startDate, setStartDate] = useState('2026-09-15');
  const [endDate, setEndDate] = useState('2026-09-18');

  // Hours / Days toggle
  const [rentalMode, setRentalMode] = useState('days'); // 'days' | 'hours'
  const [hours, setHours] = useState(3);

  const pickupLocation = 'Nagole, Hyderabad';

  // Customer Details State
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');

  // Created Booking Result
  const [createdTicket, setCreatedTicket] = useState(null);

  if (!isBookingModalOpen || !selectedCarForBooking) return null;

  // Calculate rental duration
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end - start);
  const days = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

  // Costs calculation based on mode
  const carRate = rentalMode === 'hours'
    ? selectedCarForBooking.pricePerHour * hours
    : selectedCarForBooking.pricePerDay * days;

  const durationLabel = rentalMode === 'hours'
    ? `${hours} hour${hours > 1 ? 's' : ''} x ₹${selectedCarForBooking.pricePerHour}`
    : `${days} day${days > 1 ? 's' : ''} x ₹${selectedCarForBooking.pricePerDay}`;

  const processingFee = 25.76;
  const totalPrice = carRate + processingFee;

  const handleNextStep = async (e) => {
    e.preventDefault();
    if (step === 1) {
      setStep(2);
    } else if (step === 2) {
      if (!customerName || !customerEmail || !licenseNumber) {
        alert('Please fill out all required customer details.');
        return;
      }

      const booking = await createBooking({
        carId: selectedCarForBooking.id,
        carName: selectedCarForBooking.name,
        carImage: selectedCarForBooking.image,
        customerName,
        customerEmail,
        customerPhone: customerPhone || '+91 00000 00000',
        licenseNumber,
        startDate,
        endDate: rentalMode === 'hours' ? startDate : endDate,
        pickupLocation,
        totalPrice
      });

      if (booking) {
        // Send confirmation email via Vercel serverless function
        fetch('/api/send-booking-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            customerName,
            customerEmail,
            customerPhone: customerPhone || '+91 00000 00000',
            licenseNumber,
            carName: selectedCarForBooking.name,
            bookingId: booking.id,
            startDate,
            endDate: rentalMode === 'hours' ? startDate : endDate,
            pickupLocation,
            rentalMode,
            hours,
            days,
            carRate,
            processingFee,
            totalPrice: totalPrice.toFixed(2),
            durationLabel
          })
        }).catch(err => console.error('Email send failed:', err));

        setCreatedTicket(booking);
        setStep(3);
      }
    }
  };

  const closeModal = () => {
    setIsBookingModalOpen(false);
    setStep(1);
    setCreatedTicket(null);
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-container">
        {/* Modal Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Sparkles size={20} className="text-indigo-400" />
            <h2 className="modal-title">
              {step === 3 ? 'Booking Confirmed!' : `Book ${selectedCarForBooking.name}`}
            </h2>
          </div>
          <button className="modal-close" onClick={closeModal}>
            <X size={20} />
          </button>
        </div>

        {/* Step Indicator */}
        {step < 3 && (
          <div style={{ display: 'flex', borderBottom: '1px solid var(--border-color)' }}>
            <div
              style={{
                flex: 1,
                padding: '0.75rem',
                textAlign: 'center',
                fontWeight: 600,
                fontSize: '0.85rem',
                background: step === 1 ? 'rgba(99, 102, 241, 0.1)' : 'transparent',
                color: step === 1 ? 'var(--accent-primary)' : 'var(--text-muted)',
                borderBottom: step === 1 ? '2px solid var(--accent-primary)' : 'none'
              }}
            >
              1. Dates &amp; Duration
            </div>
            <div
              style={{
                flex: 1,
                padding: '0.75rem',
                textAlign: 'center',
                fontWeight: 600,
                fontSize: '0.85rem',
                background: step === 2 ? 'rgba(99, 102, 241, 0.1)' : 'transparent',
                color: step === 2 ? 'var(--accent-primary)' : 'var(--text-muted)',
                borderBottom: step === 2 ? '2px solid var(--accent-primary)' : 'none'
              }}
            >
              2. Driver Information
            </div>
          </div>
        )}

        <div className="modal-body">
          {/* STEP 1: DATES & DURATION */}
          {step === 1 && (
            <form onSubmit={handleNextStep}>
              <div className="form-grid">

                {/* Pickup Location — fixed */}
                <div className="form-group full-width">
                  <label className="form-label">Pickup &amp; Drop-off Location</label>
                  <input
                    className="form-input"
                    value="Nagole, Hyderabad"
                    readOnly
                    style={{ opacity: 0.7, cursor: 'default' }}
                  />
                </div>

                {/* Hours / Days Toggle */}
                <div className="form-group full-width">
                  <label className="form-label">Rental Duration Type</label>
                  <div
                    style={{
                      display: 'flex',
                      background: 'var(--bg-secondary)',
                      border: '1px solid var(--border-color)',
                      borderRadius: 'var(--radius-sm)',
                      padding: '4px',
                      gap: '4px'
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => setRentalMode('hours')}
                      style={{
                        flex: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.4rem',
                        padding: '0.6rem 1rem',
                        borderRadius: 'var(--radius-sm)',
                        border: 'none',
                        fontWeight: 700,
                        fontSize: '0.9rem',
                        cursor: 'pointer',
                        background: rentalMode === 'hours' ? 'var(--accent-primary)' : 'transparent',
                        color: rentalMode === 'hours' ? '#fff' : 'var(--text-muted)',
                        transition: 'all 0.2s'
                      }}
                    >
                      <Clock size={15} /> By Hours
                    </button>
                    <button
                      type="button"
                      onClick={() => setRentalMode('days')}
                      style={{
                        flex: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.4rem',
                        padding: '0.6rem 1rem',
                        borderRadius: 'var(--radius-sm)',
                        border: 'none',
                        fontWeight: 700,
                        fontSize: '0.9rem',
                        cursor: 'pointer',
                        background: rentalMode === 'days' ? 'var(--accent-primary)' : 'transparent',
                        color: rentalMode === 'days' ? '#fff' : 'var(--text-muted)',
                        transition: 'all 0.2s'
                      }}
                    >
                      <CalendarDays size={15} /> By Days
                    </button>
                  </div>
                </div>

                {/* Hours mode: single date + number of hours */}
                {rentalMode === 'hours' && (
                  <>
                    <div className="form-group">
                      <label className="form-label">Pickup Date</label>
                      <input
                        type="date"
                        className="form-input"
                        value={startDate}
                        onChange={e => setStartDate(e.target.value)}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Number of Hours</label>
                      <input
                        type="number"
                        min="1"
                        max="23"
                        className="form-input"
                        value={hours}
                        onChange={e => setHours(Math.max(1, Math.min(23, Number(e.target.value))))}
                        required
                      />
                    </div>
                  </>
                )}

                {/* Days mode: start + end date */}
                {rentalMode === 'days' && (
                  <>
                    <div className="form-group">
                      <label className="form-label">Start Date</label>
                      <input
                        type="date"
                        className="form-input"
                        value={startDate}
                        onChange={e => setStartDate(e.target.value)}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">End Date</label>
                      <input
                        type="date"
                        className="form-input"
                        value={endDate}
                        onChange={e => setEndDate(e.target.value)}
                        required
                      />
                    </div>
                  </>
                )}
              </div>

              {/* Price Summary */}
              <div
                style={{
                  marginTop: '1.5rem',
                  padding: '1rem 1.25rem',
                  background: 'var(--bg-secondary)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-color)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem', fontSize: '0.9rem' }}>
                  <span>Vehicle Rate ({durationLabel})</span>
                  <span>₹{carRate}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem', fontSize: '0.9rem' }}>
                  <span>Processing Fee</span>
                  <span>₹25.76</span>
                </div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginTop: '0.75rem',
                    paddingTop: '0.75rem',
                    borderTop: '1px solid var(--border-color)',
                    fontWeight: 800,
                    fontSize: '1.15rem'
                  }}
                >
                  <span>Total Amount</span>
                  <span style={{ color: 'var(--accent-primary)' }}>₹{totalPrice.toFixed(2)}</span>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
                <button type="submit" className="book-btn">
                  Continue to Driver Info →
                </button>
              </div>
            </form>
          )}

          {/* STEP 2: DRIVER INFO */}
          {step === 2 && (
            <form onSubmit={handleNextStep}>
              <div className="form-grid">
                <div className="form-group full-width">
                  <label className="form-label">Full Legal Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Rahul Sharma"
                    className="form-input"
                    value={customerName}
                    onChange={e => setCustomerName(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <input
                    type="email"
                    placeholder="rahul@example.com"
                    className="form-input"
                    value={customerEmail}
                    onChange={e => setCustomerEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Phone Number</label>
                  <input
                    type="tel"
                    placeholder="+91 98765 43210"
                    className="form-input"
                    value={customerPhone}
                    onChange={e => setCustomerPhone(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group full-width">
                  <label className="form-label">Driving License Number</label>
                  <input
                    type="text"
                    placeholder="e.g. TS0920230012345"
                    className="form-input"
                    value={licenseNumber}
                    onChange={e => setLicenseNumber(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div
                style={{
                  marginTop: '1.5rem',
                  padding: '1rem',
                  background: 'rgba(16, 185, 129, 0.08)',
                  border: '1px solid rgba(16, 185, 129, 0.2)',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.85rem',
                  color: 'var(--status-available)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                <CheckCircle2 size={16} />
                <span>Instant keyless unlock pass will be generated immediately upon confirmation.</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1.5rem' }}>
                <button
                  type="button"
                  className="btn-secondary btn-sm"
                  onClick={() => setStep(1)}
                >
                  ← Back
                </button>
                <button type="submit" className="book-btn">
                  Confirm &amp; Reserve (₹{totalPrice.toFixed(2)})
                </button>
              </div>
            </form>
          )}

          {/* STEP 3: CONFIRMATION TICKET */}
          {step === 3 && createdTicket && (
            <div style={{ textAlign: 'center' }}>
              <div
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  background: 'rgba(16, 185, 129, 0.15)',
                  color: 'var(--status-available)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1rem'
                }}
              >
                <CheckCircle2 size={36} />
              </div>

              <h3 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Booking Confirmed!</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1rem' }}>
                Your reservation key code has been sent to <strong>{createdTicket.customerEmail}</strong>.
              </p>

              <div className="ticket-pass">
                <div style={{ fontWeight: 800, color: 'var(--accent-primary)', fontSize: '1.2rem' }}>
                  BOOKING REF: {createdTicket.id}
                </div>
                <div style={{ fontSize: '0.95rem', fontWeight: 700, margin: '0.4rem 0' }}>
                  {createdTicket.carName}
                </div>

                <div className="qr-placeholder" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                  <QrCode size={80} color="#000" />
                  <span style={{ fontSize: '0.65rem', color: '#333', fontWeight: 700 }}>UN-LOCK PASS</span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', fontSize: '0.8rem', textAlign: 'left', marginTop: '1rem' }}>
                  <div>
                    <span style={{ color: 'var(--text-muted)' }}>Pickup Hub:</span>
                    <div style={{ fontWeight: 600 }}>{createdTicket.pickupLocation}</div>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-muted)' }}>Dates:</span>
                    <div style={{ fontWeight: 600 }}>{createdTicket.startDate} → {createdTicket.endDate}</div>
                  </div>
                </div>
              </div>

              <div style={{ marginTop: '1.5rem' }}>
                <button className="book-btn" style={{ width: '100%' }} onClick={closeModal}>
                  Done &amp; View My Trips
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

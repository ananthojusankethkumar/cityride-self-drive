export default async function handler(req, res) {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const {
    customerName,
    customerEmail,
    customerPhone,
    licenseNumber,
    carName,
    bookingId,
    startDate,
    endDate,
    pickupLocation,
    rentalMode,
    hours,
    days,
    carRate,
    processingFee,
    totalPrice,
    durationLabel
  } = req.body;

  const RESEND_API_KEY = process.env.RESEND_API_KEY;

  if (!RESEND_API_KEY) {
    return res.status(500).json({ error: 'Missing RESEND_API_KEY' });
  }

  const dateDisplay = rentalMode === 'hours'
    ? `${startDate} — ${hours} hour${hours > 1 ? 's' : ''}`
    : `${startDate} → ${endDate}`;

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Booking Confirmation – City Ride</title>
  <style>
    body { margin:0; padding:0; background:#0a0a0f; font-family: 'Segoe UI', Arial, sans-serif; color:#e2e8f0; }
    .wrapper { max-width:600px; margin:0 auto; padding:32px 16px; }
    .card { background:#13131a; border:1px solid #2a2a3a; border-radius:16px; overflow:hidden; }
    .header { background:linear-gradient(135deg,#1a1a2e,#16213e); padding:32px 28px; text-align:center; border-bottom:1px solid #2a2a3a; }
    .logo-text { font-size:28px; font-weight:900; color:#fff; letter-spacing:-0.03em; }
    .logo-text span { color:#d4a017; }
    .tagline { font-size:13px; color:#94a3b8; margin-top:4px; }
    .badge { display:inline-block; background:rgba(212,160,23,0.15); color:#d4a017; border:1px solid rgba(212,160,23,0.3); border-radius:20px; padding:4px 14px; font-size:12px; font-weight:700; margin-top:12px; }
    .body { padding:28px; }
    .greeting { font-size:18px; font-weight:700; margin-bottom:6px; }
    .sub { color:#94a3b8; font-size:14px; margin-bottom:24px; }
    .booking-ref { background:rgba(212,160,23,0.08); border:1px solid rgba(212,160,23,0.25); border-radius:10px; padding:16px 20px; text-align:center; margin-bottom:24px; }
    .booking-ref-label { font-size:11px; color:#94a3b8; font-weight:700; letter-spacing:0.1em; text-transform:uppercase; }
    .booking-ref-id { font-size:26px; font-weight:900; color:#d4a017; letter-spacing:0.05em; margin-top:4px; }
    .section-title { font-size:12px; font-weight:700; color:#64748b; text-transform:uppercase; letter-spacing:0.08em; margin-bottom:12px; }
    .info-grid { display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-bottom:24px; }
    .info-item { background:#1e1e2e; border:1px solid #2a2a3a; border-radius:8px; padding:12px 14px; }
    .info-label { font-size:11px; color:#64748b; margin-bottom:3px; }
    .info-value { font-size:14px; font-weight:600; color:#e2e8f0; }
    .bill-box { background:#1e1e2e; border:1px solid #2a2a3a; border-radius:10px; padding:16px 20px; margin-bottom:24px; }
    .bill-row { display:flex; justify-content:space-between; font-size:14px; padding:6px 0; border-bottom:1px solid #2a2a3a; }
    .bill-row:last-child { border-bottom:none; }
    .bill-total { display:flex; justify-content:space-between; font-size:18px; font-weight:800; padding-top:12px; margin-top:4px; border-top:2px solid #2a2a3a; color:#d4a017; }
    .note { background:rgba(16,185,129,0.08); border:1px solid rgba(16,185,129,0.2); border-radius:8px; padding:14px 16px; font-size:13px; color:#10b981; margin-bottom:24px; }
    .footer { text-align:center; padding:20px 28px; border-top:1px solid #2a2a3a; font-size:12px; color:#475569; }
    @media(max-width:480px){ .info-grid{ grid-template-columns:1fr; } }
  </style>
</head>
<body>
<div class="wrapper">
  <div class="card">

    <!-- Header -->
    <div class="header">
      <div class="logo-text">City<span>Ride</span></div>
      <div class="tagline">Self-Drive Car Rentals · Nagole, Hyderabad</div>
      <div class="badge">✓ Booking Confirmed</div>
    </div>

    <!-- Body -->
    <div class="body">
      <div class="greeting">Hi ${customerName}! 👋</div>
      <div class="sub">Your booking is confirmed. Here are your trip details below.</div>

      <!-- Booking Ref -->
      <div class="booking-ref">
        <div class="booking-ref-label">Booking Reference</div>
        <div class="booking-ref-id">${bookingId}</div>
      </div>

      <!-- Car & Trip Info -->
      <div class="section-title">Trip Details</div>
      <div class="info-grid">
        <div class="info-item">
          <div class="info-label">Vehicle</div>
          <div class="info-value">${carName}</div>
        </div>
        <div class="info-item">
          <div class="info-label">Pickup Location</div>
          <div class="info-value">${pickupLocation}</div>
        </div>
        <div class="info-item">
          <div class="info-label">Rental Period</div>
          <div class="info-value">${dateDisplay}</div>
        </div>
        <div class="info-item">
          <div class="info-label">Phone</div>
          <div class="info-value">${customerPhone}</div>
        </div>
        <div class="info-item">
          <div class="info-label">License Number</div>
          <div class="info-value">${licenseNumber}</div>
        </div>
        <div class="info-item">
          <div class="info-label">Status</div>
          <div class="info-value" style="color:#3b82f6;">Confirmed</div>
        </div>
      </div>

      <!-- Bill -->
      <div class="section-title">Bill Summary</div>
      <div class="bill-box">
        <div class="bill-row">
          <span>Vehicle Rate (${durationLabel})</span>
          <span>₹${carRate}</span>
        </div>
        <div class="bill-row">
          <span>Processing Fee</span>
          <span>₹${processingFee}</span>
        </div>
        <div class="bill-total">
          <span>Total Paid</span>
          <span>₹${Number(totalPrice).toFixed(2)}</span>
        </div>
      </div>

      <!-- Note -->
      <div class="note">
        📍 Please arrive at <strong>${pickupLocation}</strong> with your driving license and this booking reference. Our team will be ready for you!
      </div>
    </div>

    <!-- Footer -->
    <div class="footer">
      City Ride · Nagole, Hyderabad<br/>
      Questions? Contact us at your pickup location.<br/><br/>
      Powered by <strong>X-ITE Engine &amp; Bluey</strong>
    </div>

  </div>
</div>
</body>
</html>
  `;

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'City Ride <bookings@updates.cityride.com>',
        to: [customerEmail],
        subject: `Booking Confirmed! ${bookingId} — ${carName} | City Ride`,
        html
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Resend error:', data);
      return res.status(500).json({ error: data });
    }

    return res.status(200).json({ success: true, id: data.id });
  } catch (err) {
    console.error('Send email failed:', err);
    return res.status(500).json({ error: err.message });
  }
}

'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

export default function BookAppointment() {
  const params = useParams();
  const doctorId = params.id;

  const [doctor, setDoctor] = useState(null);
  const [formData, setFormData] = useState({
    patient: '',
    phone: '',
    date: '',
    time: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const res = await fetch(`/api/doctors?id=${doctorId}`);
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setDoctor(data.find(d => d.id === parseInt(doctorId)) || data[0]);
        }
      } catch (err) {
        console.error('Failed to fetch doctor', err);
      }
    };
    if (doctorId) fetchDoctor();
  }, [doctorId]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ doctorId, ...formData }),
      });

      if (res.ok) {
        setSubmitted(true);
      } else {
        const data = await res.json();
        setError(data.error || 'Something went wrong.');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Get tomorrow's date for min date
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  return (
    <div className="booking-page">
      <div className="container booking-container">
        <div className="booking-header">
          <span className="section-badge">Appointment</span>
          <h1>Book Your Appointment</h1>
          {doctor && (
            <p style={{ color: 'var(--text-light)', marginTop: '8px' }}>
              Booking with <strong style={{ color: 'var(--accent-blue)' }}>{doctor.name}</strong> — {doctor.speciality}, {doctor.location}
            </p>
          )}
        </div>

        {submitted ? (
          <div style={{ textAlign: 'center' }}>
            <div className="success-message" style={{ marginBottom: '24px' }}>
              <div style={{ fontSize: '48px', marginBottom: '12px' }}>✅</div>
              <h3 style={{ color: '#155724', marginBottom: '8px' }}>Appointment Booked Successfully!</h3>
              <p style={{ color: '#155724', fontWeight: 400 }}>
                Your appointment with {doctor?.name} has been confirmed.
                Our team will contact you at <strong>{formData.phone}</strong> shortly.
              </p>
            </div>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="/" className="btn btn-primary">Back to Home</Link>
              <Link href="/doctors" className="btn btn-outline">Find More Doctors</Link>
            </div>
          </div>
        ) : (
          <form className="booking-form" onSubmit={handleSubmit}>
            {doctor && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                padding: '16px',
                background: 'var(--surface-alt)',
                borderRadius: 'var(--radius-sm)',
                marginBottom: '28px',
                border: '1px solid var(--border)',
              }}>
                <img
                  src={doctor.imageUrl}
                  alt={doctor.name}
                  style={{ width: '56px', height: '56px', borderRadius: '50%', objectFit: 'cover' }}
                  onError={(e) => {
                    e.target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 56 56"><rect fill="%23e2e8f0" width="56" height="56" rx="28"/><text x="28" y="36" text-anchor="middle" font-size="24">👨‍⚕️</text></svg>';
                  }}
                />
                <div>
                  <strong>{doctor.name}</strong>
                  <div style={{ fontSize: '13px', color: 'var(--text-light)' }}>
                    {doctor.speciality} &bull; {doctor.location} &bull; {doctor.experience}
                  </div>
                </div>
              </div>
            )}

            <div className="form-group">
              <label className="form-label" htmlFor="patient">Full Name *</label>
              <input
                type="text"
                id="patient"
                name="patient"
                className="form-input"
                placeholder="Enter your full name"
                value={formData.patient}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="phone">Phone Number *</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                className="form-input"
                placeholder="+91 XXXXX XXXXX"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label" htmlFor="date">Preferred Date *</label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  className="form-input"
                  min={minDate}
                  value={formData.date}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="time">Preferred Time *</label>
                <select
                  id="time"
                  name="time"
                  className="form-select"
                  value={formData.time}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select a time slot</option>
                  <option value="09:00 AM">09:00 AM</option>
                  <option value="10:00 AM">10:00 AM</option>
                  <option value="11:00 AM">11:00 AM</option>
                  <option value="12:00 PM">12:00 PM</option>
                  <option value="02:00 PM">02:00 PM</option>
                  <option value="03:00 PM">03:00 PM</option>
                  <option value="04:00 PM">04:00 PM</option>
                  <option value="05:00 PM">05:00 PM</option>
                </select>
              </div>
            </div>

            {error && (
              <div style={{
                background: '#f8d7da',
                color: '#721c24',
                padding: '12px 16px',
                borderRadius: 'var(--radius-sm)',
                marginBottom: '20px',
                fontSize: '14px',
                border: '1px solid #f5c6cb',
              }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              className="btn btn-primary btn-lg"
              style={{ width: '100%' }}
              disabled={loading}
            >
              {loading ? (
                <>
                  <span style={{
                    width: '18px',
                    height: '18px',
                    border: '2px solid rgba(255,255,255,0.3)',
                    borderTopColor: 'white',
                    borderRadius: '50%',
                    animation: 'spin 0.8s linear infinite',
                    display: 'inline-block',
                  }} />
                  <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                  Booking...
                </>
              ) : (
                'Confirm Appointment'
              )}
            </button>

            <p style={{ textAlign: 'center', marginTop: '16px', fontSize: '13px', color: 'var(--text-light)' }}>
              By booking, you agree to our Terms of Service and Privacy Policy.
            </p>
          </form>
        )}
      </div>
    </div>
  );
}

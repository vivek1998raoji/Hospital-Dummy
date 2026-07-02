'use client';
import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

function BookingForm() {
  const searchParams = useSearchParams();
  const [doctors, setDoctors] = useState([]);
  const [specialities, setSpecialities] = useState([]);
  const [packages, setPackages] = useState([]);
  const [bookingType, setBookingType] = useState('doctor'); // 'doctor' or 'package'
  const [form, setForm] = useState({
    name: '', email: '', phone: '', 
    speciality: searchParams.get('speciality') || '', 
    doctor: searchParams.get('doctor') || '',
    hospital: searchParams.get('location') || '', 
    date: '', time: '', message: '',
    healthPackage: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    Promise.all([
      fetch('/api/doctors').then(r => r.json()),
      fetch('/api/specialities').then(r => r.json()),
      fetch('/api/health-checkups').then(r => r.json()),
    ]).then(([docs, specs, pkgs]) => {
      setDoctors(docs);
      setSpecialities(specs);
      setPackages(pkgs);

      const initialType = searchParams.get('type');
      const initialPackageName = searchParams.get('package');
      const initialDocSlug = searchParams.get('doctor');

      let defaultBookingType = 'doctor';
      let selectedPkg = '';

      if (initialType === 'package' || initialPackageName) {
        defaultBookingType = 'package';
        if (initialPackageName) {
          const found = pkgs.find(p => p.name === initialPackageName || p.slug === initialPackageName);
          if (found) {
            selectedPkg = found.name;
          } else {
            selectedPkg = initialPackageName;
          }
        }
      }

      setBookingType(defaultBookingType);

      setForm(prev => {
        const nextForm = { ...prev };
        if (defaultBookingType === 'package') {
          nextForm.healthPackage = selectedPkg;
        }

        // Auto-fill speciality and hospital from doctor if doctor is prefilled
        if (initialDocSlug && defaultBookingType === 'doctor') {
          const doc = docs.find(d => d.slug === initialDocSlug);
          if (doc) {
            nextForm.doctor = initialDocSlug;
            nextForm.speciality = nextForm.speciality || doc.speciality;
            nextForm.hospital = nextForm.hospital || doc.location;
          }
        }
        return nextForm;
      });
    });
  }, [searchParams]);

  const filteredDoctors = doctors.filter(d => {
    const matchSpeciality = !form.speciality || d.speciality === form.speciality;
    const matchHospital = !form.hospital || d.location === form.hospital;
    return matchSpeciality && matchHospital;
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          bookingType
        }),
      });
      setSubmitted(true);
    } catch { setSubmitted(true); }
    setLoading(false);
  };

  if (submitted) {
    return (
      <div className="success-message" style={{ padding: '48px', textAlign: 'center' }}>
        <div style={{ fontSize: '64px', marginBottom: '16px' }}>✅</div>
        <h2 style={{ color: 'var(--success)', fontSize: '24px', marginBottom: '8px' }}>Appointment Request Submitted!</h2>
        <p style={{ color: 'var(--gray-500)', marginBottom: '24px' }}>
          Our team will confirm your appointment within 2 hours. You will receive a confirmation on your registered phone and email.
        </p>
        <Link href="/" className="btn btn-primary">← Back to Home</Link>
      </div>
    );
  }

  return (
    <form className="booking-form" onSubmit={handleSubmit}>
      {/* Visual Toggles Segment */}
      <div style={{
        display: 'flex',
        background: 'var(--gray-100)',
        padding: '6px',
        borderRadius: 'var(--radius-md)',
        marginBottom: '28px',
        border: '1px solid var(--gray-200)',
      }}>
        <button
          type="button"
          onClick={() => {
            setBookingType('doctor');
            setForm(prev => ({ ...prev, healthPackage: '' }));
          }}
          style={{
            flex: 1,
            padding: '12px 16px',
            borderRadius: 'var(--radius-sm)',
            border: 'none',
            fontSize: '14px',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all var(--transition-base)',
            background: bookingType === 'doctor' ? 'var(--white)' : 'transparent',
            color: bookingType === 'doctor' ? 'var(--primary)' : 'var(--gray-500)',
            boxShadow: bookingType === 'doctor' ? 'var(--shadow-sm)' : 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
          }}
        >
          🩺 Consult a Specialist
        </button>
        <button
          type="button"
          onClick={() => {
            setBookingType('package');
            setForm(prev => ({ ...prev, doctor: '', speciality: '' }));
          }}
          style={{
            flex: 1,
            padding: '12px 16px',
            borderRadius: 'var(--radius-sm)',
            border: 'none',
            fontSize: '14px',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all var(--transition-base)',
            background: bookingType === 'package' ? 'var(--white)' : 'transparent',
            color: bookingType === 'package' ? 'var(--primary)' : 'var(--gray-500)',
            boxShadow: bookingType === 'package' ? 'var(--shadow-sm)' : 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
          }}
        >
          🔬 Book a Health Package
        </button>
      </div>

      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '24px', fontWeight: 700, marginBottom: '24px', color: 'var(--gray-900)' }}>
        Patient Details
      </h2>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Full Name *</label>
          <input className="form-input" required placeholder="Your full name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
        </div>
        <div className="form-group">
          <label className="form-label">Email *</label>
          <input className="form-input" type="email" required placeholder="your@email.com" value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Phone *</label>
          <input className="form-input" required placeholder="+91-XXXXXXXXXX" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} />
        </div>
        <div className="form-group">
          <label className="form-label">Hospital Location *</label>
          <select className="form-select" required value={form.hospital} onChange={e => setForm({...form, hospital: e.target.value})}>
            <option value="">Select Hospital</option>
            <option>Gurugram</option><option>Faridabad</option>
            <option>Ahmedabad</option><option>Bhuj</option>
          </select>
        </div>
      </div>

      <h3 style={{ fontSize: '18px', fontWeight: 700, margin: '24px 0 16px', color: 'var(--gray-900)', borderTop: '1px solid var(--gray-100)', paddingTop: '24px' }}>
        Booking Details
      </h3>

      {bookingType === 'doctor' ? (
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Speciality</label>
            <select className="form-select" value={form.speciality} onChange={e => setForm({...form, speciality: e.target.value, doctor: ''})}>
              <option value="">Select Speciality</option>
              {specialities.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Doctor</label>
            <select 
              className="form-select" 
              value={form.doctor} 
              onChange={e => {
                const docSlug = e.target.value;
                const doc = doctors.find(d => d.slug === docSlug);
                if (doc) {
                  setForm(prev => ({
                    ...prev,
                    doctor: docSlug,
                    speciality: doc.speciality,
                    hospital: doc.location
                  }));
                } else {
                  setForm(prev => ({ ...prev, doctor: docSlug }));
                }
              }}
            >
              <option value="">Select Doctor (Optional)</option>
              {filteredDoctors.map(d => <option key={d.id} value={d.slug}>{d.name} — {d.speciality}</option>)}
            </select>
          </div>
        </div>
      ) : (
        <div className="form-group">
          <label className="form-label">Select Health Package *</label>
          <select 
            className="form-select" 
            required 
            value={form.healthPackage} 
            onChange={e => setForm({...form, healthPackage: e.target.value})}
          >
            <option value="">-- Choose a Health Checkup Package --</option>
            {packages.map(p => (
              <option key={p.id} value={p.name}>
                {p.name} ({p.price})
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Preferred Date *</label>
          <input className="form-input" type="date" required value={form.date} onChange={e => setForm({...form, date: e.target.value})} />
        </div>
        <div className="form-group">
          <label className="form-label">Preferred Time</label>
          <select className="form-select" value={form.time} onChange={e => setForm({...form, time: e.target.value})}>
            <option value="">Any Time</option>
            <option>Morning (8 AM - 12 PM)</option>
            <option>Afternoon (12 PM - 4 PM)</option>
            <option>Evening (4 PM - 8 PM)</option>
          </select>
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Reason for Visit / Message</label>
        <textarea className="form-input" rows="4" placeholder="Briefly describe your health concern..." value={form.message} onChange={e => setForm({...form, message: e.target.value})} style={{ resize: 'vertical' }} />
      </div>

      <button type="submit" className="btn btn-primary btn-xl" disabled={loading} style={{ width: '100%' }}>
        {loading ? '⏳ Submitting...' : '📅 Confirm Appointment'}
      </button>
    </form>
  );
}

export default function BookAppointmentPage() {
  return (
    <>
      <section className="page-header">
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div className="breadcrumb"><Link href="/">Home</Link><span className="breadcrumb-sep">/</span><span>Book Appointment</span></div>
          <h1>Book an Appointment</h1>
          <p>Schedule a consultation with India&apos;s top specialists. Same-day appointments available.</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: '40px' }}>
            {/* Form */}
            <div>
              <Suspense fallback={<div style={{ padding: '48px', textAlign: 'center' }}>Loading form...</div>}>
                <BookingForm />
              </Suspense>
            </div>

            {/* Sidebar */}
            <div>
              <div className="card card--accent" style={{ padding: '28px', marginBottom: '20px' }}>
                <h3 style={{ fontSize: '17px', fontWeight: 700, marginBottom: '16px', color: 'var(--gray-900)' }}>📞 Book by Phone</h3>
                <p style={{ fontSize: '14px', color: 'var(--gray-500)', lineHeight: 1.7, marginBottom: '16px' }}>
                  Prefer to speak with our team? Call our appointment helpline for instant booking.
                </p>
                <a href="tel:+911244141414" className="btn btn-primary" style={{ width: '100%' }}>📞 +91-124-4141414</a>
              </div>

              <div className="card" style={{ padding: '24px', marginBottom: '20px' }}>
                <h4 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '16px' }}>💡 Quick Tips</h4>
                <ul style={{ fontSize: '13px', color: 'var(--gray-500)', lineHeight: 2 }}>
                  <li>• Carry previous medical records and reports</li>
                  <li>• Arrive 15 minutes before your appointment</li>
                  <li>• Bring your insurance card if applicable</li>
                  <li>• List all current medications</li>
                  <li>• Fasting may be required for some tests</li>
                </ul>
              </div>

              <div className="card" style={{ padding: '24px', background: 'var(--accent-glow)' }}>
                <h4 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '8px', color: 'var(--accent-dark)' }}>🌍 International Patient?</h4>
                <p style={{ fontSize: '13px', color: 'var(--gray-600)', lineHeight: 1.7, marginBottom: '12px' }}>
                  We provide visa assistance, airport pickup, language interpreters, and dedicated coordinators.
                </p>
                <Link href="/international-patients" className="btn btn-ghost btn-sm" style={{ padding: '4px 0' }}>Learn More →</Link>
              </div>

              <div className="card" style={{ padding: '24px', marginTop: '20px' }}>
                <h4 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '12px' }}>🕐 OPD Timings</h4>
                <p style={{ fontSize: '14px', color: 'var(--gray-600)', lineHeight: 1.8 }}>
                  <strong>Mon - Sat:</strong> 8:00 AM - 8:00 PM<br />
                  <strong>Sunday:</strong> Select doctors available<br />
                  <strong>Emergency:</strong> 24/7, 365 days
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

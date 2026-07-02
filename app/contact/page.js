'use client';
import { useState } from 'react';
import Link from 'next/link';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', hospital: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      setSubmitted(true);
    } catch (err) {
      alert('Failed to submit. Please try again.');
    }
    setLoading(false);
  };

  const hospitals = [
    { name: 'Gurugram', address: 'Golf Course Ext Rd, Sushant Lok II, Sector 56, Gurugram, Haryana 122011', phone: '1800-309-4444', email: 'gurugram@marengoasiahospitals.com' },
    { name: 'Faridabad', address: 'Plot No. 1, HUDA Staff Colony, Sector 16, Faridabad, Haryana 121002', phone: '1800-309-2222', email: 'faridabad@marengoasiahospitals.com' },
    { name: 'Ahmedabad', address: 'Off Science City Rd, Sola, Ahmedabad, Gujarat 380060', phone: '1800-309-2222', email: 'ahmedabad@marengoasiahospitals.com' },
    { name: 'Bhuj', address: 'Bhuj, Gujarat 370001', phone: '1800-309-2222', email: 'bhuj@marengoasiahospitals.com' },
  ];

  return (
    <>
      <section className="page-header">
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div className="breadcrumb"><Link href="/">Home</Link><span className="breadcrumb-sep">/</span><span>Contact Us</span></div>
          <h1>Contact Us</h1>
          <p>We&apos;re here to help. Reach out to us for appointments, enquiries, or feedback.</p>
        </div>
      </section>

      {/* Emergency Strip */}
      <section style={{ background: 'linear-gradient(135deg, #ef4444, #f97316)', padding: '20px 0', color: 'white' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'center', gap: '40px', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700 }}>
            🚨 Emergency (24/7): <a href="tel:+911244242424" style={{ color: 'white', textDecoration: 'underline' }}>+91-124-4242424</a>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700 }}>
            📞 Helpline: <a href="tel:+911244141414" style={{ color: 'white', textDecoration: 'underline' }}>+91-124-4141414</a>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700 }}>
            💬 WhatsApp: <a href="https://wa.me/911244141414" style={{ color: 'white', textDecoration: 'underline' }}>Chat Now</a>
          </div>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="section">
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '40px' }}>
            {/* Form */}
            <div>
              <div className="section-eyebrow" style={{ marginBottom: '16px' }}>📝 Send Us a Message</div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '28px', fontWeight: 700, marginBottom: '24px', color: 'var(--gray-900)' }}>
                Get in Touch
              </h2>
              {submitted ? (
                <div className="success-message">
                  <div style={{ fontSize: '48px', marginBottom: '16px' }}>✅</div>
                  <h3 style={{ color: 'var(--success)', fontSize: '20px', marginBottom: '8px' }}>Message Sent Successfully!</h3>
                  <p style={{ color: 'var(--gray-500)' }}>Our team will get back to you within 24 hours.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="booking-form">
                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Full Name *</label>
                      <input className="form-input" required value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="Your full name" />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Email *</label>
                      <input className="form-input" type="email" required value={form.email} onChange={e => setForm({...form, email: e.target.value})} placeholder="your@email.com" />
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Phone *</label>
                      <input className="form-input" required value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} placeholder="+91-XXXXXXXXXX" />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Hospital</label>
                      <select className="form-select" value={form.hospital} onChange={e => setForm({...form, hospital: e.target.value})}>
                        <option value="">Select Hospital</option>
                        {hospitals.map(h => <option key={h.name} value={h.name}>{h.name}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Subject</label>
                    <input className="form-input" value={form.subject} onChange={e => setForm({...form, subject: e.target.value})} placeholder="How can we help?" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Message *</label>
                    <textarea className="form-input" rows="5" required value={form.message} onChange={e => setForm({...form, message: e.target.value})} placeholder="Tell us about your enquiry..." style={{ resize: 'vertical' }} />
                  </div>
                  <button type="submit" className="btn btn-primary btn-lg" disabled={loading} style={{ width: '100%' }}>
                    {loading ? '⏳ Sending...' : '📤 Send Message'}
                  </button>
                </form>
              )}
            </div>

            {/* Quick Info */}
            <div>
              <div className="card card--accent" style={{ padding: '32px', marginBottom: '20px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '20px', color: 'var(--gray-900)' }}>📞 Quick Contact</h3>
                {[
                  { icon: '📞', label: 'General Enquiry', value: '+91-124-4141414' },
                  { icon: '🚑', label: 'Emergency (24/7)', value: '+91-124-4242424' },
                  { icon: '📧', label: 'Email', value: 'info@marengoasiahospitals.com' },
                  { icon: '💬', label: 'WhatsApp', value: '+91-124-4141414' },
                  { icon: '🌍', label: 'International', value: '+91-124-4343434' },
                ].map((item, i) => (
                  <div key={i} style={{ display: 'flex', gap: '12px', padding: '10px 0', borderBottom: i < 4 ? '1px solid var(--gray-100)' : 'none' }}>
                    <span style={{ fontSize: '20px' }}>{item.icon}</span>
                    <div>
                      <p style={{ fontSize: '12px', color: 'var(--gray-400)' }}>{item.label}</p>
                      <p style={{ fontSize: '15px', fontWeight: 600, color: 'var(--gray-800)' }}>{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="card" style={{ padding: '24px', background: 'var(--gray-50)' }}>
                <h4 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '12px' }}>🕐 Working Hours</h4>
                <p style={{ fontSize: '14px', color: 'var(--gray-600)', lineHeight: 1.8 }}>
                  OPD: Mon-Sat, 8:00 AM - 8:00 PM<br />
                  Emergency: 24/7, 365 days<br />
                  Pharmacy: 24/7<br />
                  Diagnostics: Mon-Sat, 7:00 AM - 9:00 PM
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Hospital Contacts Grid */}
      <section className="section section--alt">
        <div className="container">
          <div className="section-header">
            <div className="section-eyebrow">🏥 Our Hospitals</div>
            <h2 className="section-title">Hospital-wise Contact Details</h2>
          </div>
          <div className="grid-3 grid">
            {hospitals.map((h, i) => (
              <div key={i} className="card" style={{ padding: '28px' }}>
                <h3 style={{ fontSize: '17px', fontWeight: 700, color: 'var(--gray-900)', marginBottom: '12px' }}>
                  🏥 Marengo Asia Hospitals, {h.name}
                </h3>
                <p style={{ fontSize: '14px', color: 'var(--gray-500)', lineHeight: 1.7, marginBottom: '12px' }}>{h.address}</p>
                <p style={{ fontSize: '14px', marginBottom: '4px' }}>📞 <a href={`tel:${h.phone.replace(/-/g,'')}`} style={{ color: 'var(--accent)', fontWeight: 600 }}>{h.phone}</a></p>
                <p style={{ fontSize: '14px' }}>📧 <a href={`mailto:${h.email}`} style={{ color: 'var(--accent)', fontWeight: 600 }}>{h.email}</a></p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Map Placeholder */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <div className="section-eyebrow">📍 Find Us</div>
            <h2 className="section-title">Our Location</h2>
          </div>
          <div style={{
            background: 'var(--gray-100)', borderRadius: 'var(--radius-lg)', height: '400px',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column',
            border: '2px dashed var(--gray-300)',
          }}>
            <span style={{ fontSize: '48px', marginBottom: '16px' }}>🗺️</span>
            <p style={{ color: 'var(--gray-500)', fontSize: '16px' }}>Interactive Map Coming Soon</p>
            <p style={{ color: 'var(--gray-400)', fontSize: '13px' }}>CH Baktawar Singh Rd, Sector 38, Gurugram, Haryana 122001</p>
          </div>
        </div>
      </section>
    </>
  );
}

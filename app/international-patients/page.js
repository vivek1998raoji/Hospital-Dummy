'use client';
import { useState } from 'react';
import Link from 'next/link';

export default function InternationalPatientsPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', country: '', condition: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const services = [
    { icon: '📋', title: 'Pre-Arrival Assessment', desc: 'Comprehensive medical review of your case before you travel. Our specialists provide treatment plan and cost estimate.' },
    { icon: '✈️', title: 'Visa Assistance', desc: 'Medical visa invitation letter and documentation support. Fast-track visa processing for urgent cases.' },
    { icon: '🚗', title: 'Airport Pickup', desc: 'Complimentary airport pickup and drop in air-conditioned vehicles. Meet-and-greet service at arrival terminal.' },
    { icon: '🗣️', title: 'Language Interpreters', desc: 'Interpreters available in Arabic, Russian, French, Swahili, Bengali, and 10+ other languages.' },
    { icon: '🏨', title: 'Accommodation', desc: 'Nearby guest houses and serviced apartments at special rates. In-campus accommodation for attendants.' },
    { icon: '🛡️', title: 'Insurance Support', desc: 'We work with international insurance providers. TPA facilitation and direct billing arrangements.' },
    { icon: '👤', title: 'Dedicated Coordinator', desc: 'Personal patient coordinator assigned throughout your stay — from arrival to discharge to follow-up.' },
    { icon: '📞', title: 'Post-Treatment Follow-up', desc: 'Telemedicine consultations after you return home. Ongoing care coordination with your local physician.' },
  ];

  const countries = [
    { flag: '🇦🇪', name: 'UAE' }, { flag: '🇧🇩', name: 'Bangladesh' }, { flag: '🇮🇶', name: 'Iraq' },
    { flag: '🇦🇫', name: 'Afghanistan' }, { flag: '🇰🇪', name: 'Kenya' }, { flag: '🇳🇬', name: 'Nigeria' },
    { flag: '🇷🇺', name: 'Russia' }, { flag: '🇺🇿', name: 'Uzbekistan' }, { flag: '🇪🇹', name: 'Ethiopia' },
    { flag: '🇴🇲', name: 'Oman' }, { flag: '🇹🇿', name: 'Tanzania' }, { flag: '🇲🇲', name: 'Myanmar' },
    { flag: '🇲🇻', name: 'Maldives' }, { flag: '🇸🇩', name: 'Sudan' }, { flag: '🇬🇧', name: 'UK' },
    { flag: '🇺🇸', name: 'USA' }, { flag: '🇨🇦', name: 'Canada' }, { flag: '🇦🇺', name: 'Australia' },
  ];

  return (
    <>
      <section className="page-header">
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div className="breadcrumb"><Link href="/">Home</Link><span className="breadcrumb-sep">/</span><span>International Patients</span></div>
          <h1>International Patient Services</h1>
          <p>World-class healthcare for patients from 50+ countries — seamless care from arrival to recovery</p>
        </div>
      </section>

      {/* Services */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <div className="section-eyebrow">🌍 Our Services</div>
            <h2 className="section-title">Comprehensive International Patient Support</h2>
            <p className="section-subtitle">End-to-end support to make your medical journey smooth and stress-free</p>
          </div>
          <div className="grid-4 grid">
            {services.map((s, i) => (
              <div key={i} className="feature-card">
                <div className="feature-icon">{s.icon}</div>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Countries */}
      <section className="section section--alt">
        <div className="container">
          <div className="section-header">
            <div className="section-eyebrow">🌐 Global Reach</div>
            <h2 className="section-title">Countries We Serve</h2>
          </div>
          <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '12px' }}>
            {countries.map((c, i) => (
              <div key={i} className="card" style={{ textAlign: 'center', padding: '16px' }}>
                <div style={{ fontSize: '32px', marginBottom: '4px' }}>{c.flag}</div>
                <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--gray-700)' }}>{c.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <div className="stats-strip">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-item"><div className="stat-number">50+</div><div className="stat-label">Countries Served</div></div>
            <div className="stat-item"><div className="stat-number">10+</div><div className="stat-label">Languages</div></div>
            <div className="stat-item"><div className="stat-number">24/7</div><div className="stat-label">Support</div></div>
            <div className="stat-item"><div className="stat-number">50,000+</div><div className="stat-label">International Patients</div></div>
          </div>
        </div>
      </div>

      {/* Enquiry Form */}
      <section className="section">
        <div className="container" style={{ maxWidth: '700px' }}>
          <div className="section-header">
            <div className="section-eyebrow">📝 Enquiry</div>
            <h2 className="section-title">Send Us Your Medical Query</h2>
          </div>
          {submitted ? (
            <div className="success-message">
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>✅</div>
              <h3 style={{ color: 'var(--success)', marginBottom: '8px' }}>Enquiry Submitted!</h3>
              <p style={{ color: 'var(--gray-500)' }}>Our international patient team will contact you within 24 hours.</p>
            </div>
          ) : (
            <form className="booking-form" onSubmit={e => { e.preventDefault(); setSubmitted(true); }}>
              <div className="form-row">
                <div className="form-group"><label className="form-label">Full Name *</label><input className="form-input" required value={form.name} onChange={e => setForm({...form, name: e.target.value})} /></div>
                <div className="form-group"><label className="form-label">Email *</label><input className="form-input" type="email" required value={form.email} onChange={e => setForm({...form, email: e.target.value})} /></div>
              </div>
              <div className="form-row">
                <div className="form-group"><label className="form-label">Phone (with country code) *</label><input className="form-input" required value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} /></div>
                <div className="form-group"><label className="form-label">Country *</label><input className="form-input" required value={form.country} onChange={e => setForm({...form, country: e.target.value})} /></div>
              </div>
              <div className="form-group"><label className="form-label">Medical Condition</label><input className="form-input" value={form.condition} onChange={e => setForm({...form, condition: e.target.value})} placeholder="Brief description of your condition" /></div>
              <div className="form-group"><label className="form-label">Message</label><textarea className="form-input" rows="4" value={form.message} onChange={e => setForm({...form, message: e.target.value})} style={{ resize: 'vertical' }} /></div>
              <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }}>Submit Enquiry →</button>
            </form>
          )}
        </div>
      </section>

      <section className="cta-banner">
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <h2>Planning Your Medical Trip to India?</h2>
          <p>Our international patient team is available 24/7 to assist you</p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
            <a href="tel:+911244343434" className="btn btn-white btn-lg">📞 +91-124-4343434</a>
            <a href="mailto:international@marengoasiahospitals.com" className="btn btn-outline btn-lg" style={{ borderColor: 'rgba(255,255,255,0.3)', color: 'white' }}>📧 Email Us</a>
          </div>
        </div>
      </section>
    </>
  );
}

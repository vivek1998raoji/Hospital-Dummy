'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function HealthCheckupsPage() {
  const [checkups, setCheckups] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/health-checkups').then(r => r.json()).then(d => { setCheckups(d); setLoading(false); });
  }, []);

  return (
    <>
      <section className="page-header">
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div className="breadcrumb"><Link href="/">Home</Link><span className="breadcrumb-sep">/</span><span>Health Checkups</span></div>
          <h1>Preventive Health Checkups</h1>
          <p>Comprehensive health screening packages designed by India&apos;s top specialists for early disease detection</p>
        </div>
      </section>

      {/* Why Preventive Health */}
      <section className="section" style={{ paddingBottom: '48px' }}>
        <div className="container">
          <div className="section-header">
            <div className="section-eyebrow">🛡️ Prevention is Better Than Cure</div>
            <h2 className="section-title">Why Regular Health Checkups?</h2>
          </div>
          <div className="grid-4 grid">
            {[
              { icon: '🔍', title: 'Early Detection', desc: 'Detect diseases in early stages when they are most treatable' },
              { icon: '📊', title: 'Track Your Health', desc: 'Monitor vital health parameters and track trends over time' },
              { icon: '💰', title: 'Save on Treatment', desc: 'Preventive care costs far less than treating advanced diseases' },
              { icon: '🧘', title: 'Peace of Mind', desc: 'Know your health status and take proactive steps for wellness' },
            ].map((item, i) => (
              <div key={i} className="feature-card">
                <div className="feature-icon">{item.icon}</div>
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Packages */}
      <section className="section section--alt">
        <div className="container">
          <div className="section-header">
            <div className="section-eyebrow">🩺 Our Packages</div>
            <h2 className="section-title">Health Checkup Packages</h2>
            <p className="section-subtitle">Choose from our curated packages or create a custom checkup plan</p>
          </div>
          {loading ? <div className="text-center"><p>Loading...</p></div> : (
            <div className="grid-3 grid">
              {checkups.map(hc => (
                <div key={hc.id} className={`price-card ${hc.popular ? 'price-card--popular' : ''}`}>
                  {hc.popular && <span className="badge badge--popular" style={{ position: 'absolute', top: '16px', right: '16px' }}>🔥 Popular</span>}
                  <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--gray-900)', marginBottom: '8px', paddingRight: hc.popular ? '80px' : '0' }}>{hc.name}</h3>
                  <div className="price-amount" style={{ marginBottom: '12px' }}>{hc.price}</div>
                  <p style={{ fontSize: '14px', color: 'var(--gray-500)', lineHeight: 1.7, marginBottom: '16px' }}>{hc.description}</p>
                  <div style={{ borderTop: '1px solid var(--gray-100)', paddingTop: '16px', marginBottom: '20px' }}>
                    <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--gray-700)', marginBottom: '8px' }}>Tests Included:</p>
                    <p style={{ fontSize: '12px', color: 'var(--gray-500)', lineHeight: 1.8 }}>{hc.tests}</p>
                  </div>
                  <Link href={`/book?package=${encodeURIComponent(hc.name)}&type=package`} className="btn btn-primary mt-auto" style={{ width: '100%' }}>Book Now →</Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* How it Works */}
      <section className="section">
        <div className="container" style={{ maxWidth: '800px' }}>
          <div className="section-header">
            <div className="section-eyebrow">📋 Process</div>
            <h2 className="section-title">How It Works</h2>
          </div>
          {[
            { step: '1', title: 'Choose Your Package', desc: 'Select from our curated health checkup packages based on your age, gender, and health goals.' },
            { step: '2', title: 'Book Your Slot', desc: 'Schedule your appointment online or call us. Morning slots available for fasting tests.' },
            { step: '3', title: 'Visit the Hospital', desc: 'Arrive fasting (8-12 hours). Our team will guide you through all tests in 3-4 hours.' },
            { step: '4', title: 'Get Your Report', desc: 'Receive your detailed health report within 24-48 hours with doctor consultation included.' },
          ].map((item, i) => (
            <div key={i} className="card" style={{ padding: '24px', marginBottom: '16px', display: 'flex', gap: '20px', alignItems: 'center' }}>
              <div style={{
                width: '52px', height: '52px', borderRadius: 'var(--radius-full)',
                background: 'var(--gradient-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '20px', fontWeight: 800, color: 'white', flexShrink: 0,
              }}>{item.step}</div>
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--gray-900)', marginBottom: '4px' }}>{item.title}</h3>
                <p style={{ fontSize: '14px', color: 'var(--gray-500)', lineHeight: 1.7 }}>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="cta-banner">
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <h2>Need a Custom Health Checkup?</h2>
          <p>Our wellness team will create a personalized health screening plan for you</p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
            <Link href="/book?type=package" className="btn btn-white btn-lg">📅 Book Checkup</Link>
            <a href="tel:+911244141414" className="btn btn-outline btn-lg" style={{ borderColor: 'rgba(255,255,255,0.3)', color: 'white' }}>📞 Call for Custom Package</a>
          </div>
        </div>
      </section>
    </>
  );
}

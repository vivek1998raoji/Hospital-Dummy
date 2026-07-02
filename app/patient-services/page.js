'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function PatientServicesPage() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/services').then(r => r.json()).then(d => { setServices(d); setLoading(false); });
  }, []);

  const categories = [...new Set(services.map(s => s.category))];

  return (
    <>
      <section className="page-header">
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div className="breadcrumb"><Link href="/">Home</Link><span className="breadcrumb-sep">/</span><span>Patient Services</span></div>
          <h1>Patient Services</h1>
          <p>Comprehensive support services designed to make your hospital experience comfortable and seamless</p>
        </div>
      </section>

      {/* Emergency */}
      <section style={{ background: 'linear-gradient(135deg, #ef4444, #f97316)', padding: '32px 0', color: 'white' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '4px' }}>🚨 Emergency Services — 24/7</h2>
            <p style={{ opacity: 0.9 }}>Level-I Trauma Centre with rapid response teams. Average door-to-doctor time: 3 minutes.</p>
          </div>
          <a href="tel:+911244242424" className="btn btn-white btn-lg">📞 Call Emergency</a>
        </div>
      </section>

      {/* Services by Category */}
      {loading ? (
        <div className="section text-center"><p>Loading services...</p></div>
      ) : (
        categories.map((cat, ci) => (
          <section key={cat} className={`section ${ci % 2 === 1 ? 'section--alt' : ''}`}>
            <div className="container">
              <div className="section-header">
                <div className="section-eyebrow">🏥 {cat}</div>
                <h2 className="section-title">{cat} Services</h2>
              </div>
              <div className="grid-3 grid">
                {services.filter(s => s.category === cat).map(svc => (
                  <div key={svc.id} className="feature-card">
                    <div className="feature-icon">{svc.icon}</div>
                    <h3>{svc.name}</h3>
                    <p>{svc.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        ))
      )}

      <section className="cta-banner">
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <h2>Need Assistance?</h2>
          <p>Our patient services team is available to help you with any query</p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
            <a href="tel:+911244141414" className="btn btn-white btn-lg">📞 Call Helpline</a>
            <Link href="/contact" className="btn btn-outline btn-lg" style={{ borderColor: 'rgba(255,255,255,0.3)', color: 'white' }}>Contact Us</Link>
          </div>
        </div>
      </section>
    </>
  );
}

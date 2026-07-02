'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

function getAvatarColor(name) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return `hsl(${Math.abs(hash) % 360}, 55%, 45%)`;
}

export default function PatientStoriesPage() {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/testimonials').then(r => r.json()).then(d => { setTestimonials(d); setLoading(false); });
  }, []);

  const featured = testimonials.filter(t => t.featured);
  const others = testimonials.filter(t => !t.featured);

  return (
    <>
      <section className="page-header">
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div className="breadcrumb"><Link href="/">Home</Link><span className="breadcrumb-sep">/</span><span>Patient Stories</span></div>
          <h1>Patient Stories</h1>
          <p>Real stories of hope, healing, and world-class care from patients around the world</p>
        </div>
      </section>

      {/* Featured */}
      {featured.length > 0 && (
        <section className="section">
          <div className="container">
            <div className="section-header">
              <div className="section-eyebrow">⭐ Featured Stories</div>
              <h2 className="section-title">Inspiring Patient Journeys</h2>
            </div>
            <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))' }}>
              {featured.map(t => (
                <div key={t.id} className="testimonial-card" style={{ padding: '32px' }}>
                  <div className="testimonial-stars" style={{ marginBottom: '16px' }}>{'★'.repeat(t.rating)}</div>
                  <p style={{ fontSize: '15px', color: 'var(--gray-600)', lineHeight: 1.9, marginBottom: '24px', fontStyle: 'italic' }}>
                    &ldquo;{t.content}&rdquo;
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', borderTop: '1px solid var(--gray-100)', paddingTop: '16px' }}>
                    <div className="testimonial-avatar" style={{
                      background: `linear-gradient(135deg, ${getAvatarColor(t.patient)}, ${getAvatarColor(t.patient + 'z')})`,
                    }}>
                      {t.patient.split(' ').map(w => w[0]).join('')}
                    </div>
                    <div>
                      <p style={{ fontWeight: 700, fontSize: '15px', color: 'var(--gray-900)' }}>{t.patient}</p>
                      <p style={{ fontSize: '13px', color: 'var(--gray-400)' }}>📍 {t.location}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* All Stories */}
      <section className="section section--alt">
        <div className="container">
          <div className="section-header">
            <div className="section-eyebrow">💬 All Stories</div>
            <h2 className="section-title">More Patient Experiences</h2>
          </div>
          {loading ? <p className="text-center">Loading...</p> : (
            <div className="grid-3 grid">
              {others.map(t => (
                <div key={t.id} className="testimonial-card">
                  <div className="testimonial-stars" style={{ marginBottom: '12px' }}>{'★'.repeat(t.rating)}</div>
                  <p style={{ fontSize: '14px', color: 'var(--gray-600)', lineHeight: 1.8, marginBottom: '20px', fontStyle: 'italic' }}>
                    &ldquo;{t.content.slice(0, 200)}...&rdquo;
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div className="testimonial-avatar" style={{ width: '40px', height: '40px', fontSize: '14px', background: `linear-gradient(135deg, ${getAvatarColor(t.patient)}, ${getAvatarColor(t.patient + 'z')})` }}>
                      {t.patient.split(' ').map(w => w[0]).join('')}
                    </div>
                    <div>
                      <p style={{ fontWeight: 700, fontSize: '14px' }}>{t.patient}</p>
                      <p style={{ fontSize: '12px', color: 'var(--gray-400)' }}>{t.location}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="cta-banner">
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <h2>Share Your Story</h2>
          <p>Your experience can inspire others. Tell us about your journey at Marengo Asia Hospitals.</p>
          <Link href="/contact" className="btn btn-white btn-lg">📝 Share Your Story</Link>
        </div>
      </section>
    </>
  );
}

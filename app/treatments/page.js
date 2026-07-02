'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function TreatmentsPage() {
  const [treatments, setTreatments] = useState([]);
  const [filter, setFilter] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/treatments').then(r => r.json()).then(d => { setTreatments(d); setLoading(false); });
  }, []);

  const specialities = [...new Set(treatments.map(t => t.speciality))].sort();
  const filtered = filter ? treatments.filter(t => t.speciality === filter) : treatments;

  return (
    <>
      <section className="page-header">
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div className="breadcrumb"><Link href="/">Home</Link><span className="breadcrumb-sep">/</span><span>Treatments</span></div>
          <h1>Treatments & Procedures</h1>
          <p>World-class surgical and medical treatments powered by cutting-edge technology and India&apos;s finest specialists</p>
        </div>
      </section>

      {/* Filter */}
      <section style={{ marginTop: '-30px', position: 'relative', zIndex: 10 }}>
        <div className="container">
          <div className="card card--elevated" style={{ padding: '20px', display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
            <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--gray-700)', marginRight: '8px' }}>Filter by Speciality:</span>
            <button className={`btn btn-sm ${!filter ? 'btn-primary' : 'btn-outline'}`} onClick={() => setFilter('')}>All</button>
            {specialities.map(s => (
              <button key={s} className={`btn btn-sm ${filter === s ? 'btn-primary' : 'btn-outline'}`} onClick={() => setFilter(s)}>
                {s}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Treatments Grid */}
      <section className="section" style={{ paddingTop: '32px' }}>
        <div className="container">
          <p style={{ fontSize: '14px', color: 'var(--gray-500)', marginBottom: '24px' }}>
            Showing <strong>{filtered.length}</strong> treatment{filtered.length !== 1 ? 's' : ''}
            {filter && <> in <span className="badge badge--blue">{filter}</span></>}
          </p>
          {loading ? (
            <div className="text-center" style={{ padding: '60px' }}><p style={{ color: 'var(--gray-400)' }}>Loading...</p></div>
          ) : (
            <div className="grid-3 grid">
              {filtered.map(t => (
                <Link href={`/treatments/${t.slug}`} key={t.id} className="card card--interactive" style={{ padding: '28px', display: 'flex', flexDirection: 'column' }}>
                  <span className="badge badge--accent" style={{ alignSelf: 'flex-start', marginBottom: '12px' }}>{t.speciality}</span>
                  <h3 style={{ fontSize: '17px', fontWeight: 700, color: 'var(--gray-900)', marginBottom: '8px' }}>{t.name}</h3>
                  <p style={{ fontSize: '14px', color: 'var(--gray-500)', lineHeight: 1.7, flex: 1 }}>{t.description}</p>
                  <span className="btn btn-ghost btn-sm" style={{ marginTop: '16px', padding: '4px 0', alignSelf: 'flex-start' }}>Learn More →</span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Why Choose */}
      <section className="section section--alt">
        <div className="container">
          <div className="section-header">
            <div className="section-eyebrow">💎 Why Choose Us</div>
            <h2 className="section-title">Advanced Treatment Technology</h2>
          </div>
          <div className="grid-4 grid">
            {[
              { icon: '🤖', title: 'Robotic Surgery', desc: 'Precision surgery with da Vinci Xi for minimal invasiveness' },
              { icon: '🎯', title: 'CyberKnife', desc: 'Non-invasive radiosurgery for tumours with sub-mm accuracy' },
              { icon: '🔬', title: '3T MRI & PET-CT', desc: 'Advanced imaging for accurate diagnosis and treatment planning' },
              { icon: '💉', title: 'Immunotherapy', desc: 'Latest cancer immunotherapy and targeted therapy protocols' },
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

      <section className="cta-banner">
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <h2>Need a Treatment Consultation?</h2>
          <p>Our specialists will guide you through the best treatment options for your condition</p>
          <Link href="/book" className="btn btn-white btn-lg">📅 Book Consultation</Link>
        </div>
      </section>
    </>
  );
}

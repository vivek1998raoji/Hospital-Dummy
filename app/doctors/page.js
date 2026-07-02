'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

function getInitials(name) {
  return name.replace('Dr. ', '').split(' ').map(w => w[0]).join('').slice(0, 2);
}
function getAvatarColor(name) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return `hsl(${Math.abs(hash) % 360}, 55%, 45%)`;
}

export default function DoctorsPage() {
  const [doctors, setDoctors] = useState([]);
  const [search, setSearch] = useState('');
  const [specFilter, setSpecFilter] = useState('');
  const [locFilter, setLocFilter] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/doctors').then(r => r.json()).then(d => { setDoctors(d); setLoading(false); });
  }, []);

  // Dynamic Client-side SEO update
  useEffect(() => {
    fetch('/api/pages?slug=doctors')
      .then(r => r.json())
      .then(page => {
        if (page && page.metaTitle) {
          document.title = page.metaTitle;
          const metaDesc = document.querySelector('meta[name="description"]');
          if (metaDesc) metaDesc.setAttribute('content', page.metaDescription || '');
        }
      })
      .catch(() => {});
  }, []);

  const specialities = [...new Set(doctors.map(d => d.speciality))].sort();
  const locations = [...new Set(doctors.map(d => d.location))].sort();

  const filtered = doctors.filter(d => {
    const matchSearch = !search || d.name.toLowerCase().includes(search.toLowerCase()) || d.designation.toLowerCase().includes(search.toLowerCase());
    const matchSpec = !specFilter || d.speciality === specFilter;
    const matchLoc = !locFilter || d.location === locFilter;
    return matchSearch && matchSpec && matchLoc;
  });

  return (
    <>
      {/* Page Header */}
      <section className="page-header">
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div className="breadcrumb">
            <Link href="/">Home</Link>
            <span className="breadcrumb-sep">/</span>
            <span>Doctors</span>
          </div>
          <h1>Our Expert Doctors</h1>
          <p>800+ world-renowned specialists dedicated to delivering exceptional clinical outcomes across 30+ specialities</p>
        </div>
      </section>

      {/* Search & Filters */}
      <section style={{ marginTop: '-30px', position: 'relative', zIndex: 10 }}>
        <div className="container">
          <div className="card card--elevated" style={{ padding: '24px', display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
            <div style={{ flex: '1 1 300px' }}>
              <input
                type="text"
                className="form-input"
                placeholder="🔍 Search doctors by name or designation..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <div style={{ flex: '0 1 200px' }}>
              <select className="form-select" value={specFilter} onChange={e => setSpecFilter(e.target.value)}>
                <option value="">All Specialities</option>
                {specialities.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div style={{ flex: '0 1 160px' }}>
              <select className="form-select" value={locFilter} onChange={e => setLocFilter(e.target.value)}>
                <option value="">All Locations</option>
                {locations.map(l => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>
            <button className="btn btn-outline btn-sm" onClick={() => { setSearch(''); setSpecFilter(''); setLocFilter(''); }}>
              Clear
            </button>
          </div>
        </div>
      </section>

      {/* Results Count */}
      <section className="section" style={{ paddingTop: '32px' }}>
        <div className="container">
          <p style={{ fontSize: '14px', color: 'var(--gray-500)', marginBottom: '24px' }}>
            Showing <strong style={{ color: 'var(--gray-800)' }}>{filtered.length}</strong> doctor{filtered.length !== 1 ? 's' : ''}
            {specFilter && <> in <span className="badge badge--blue">{specFilter}</span></>}
            {locFilter && <> at <span className="badge badge--green">{locFilter}</span></>}
          </p>

          {loading ? (
            <div className="text-center" style={{ padding: '60px 0' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>⏳</div>
              <p style={{ color: 'var(--gray-400)' }}>Loading doctors...</p>
            </div>
          ) : (
            <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
              {filtered.map(doc => (
                <div key={doc.id} className="doctor-card">
                  <div style={{
                    height: '180px',
                    background: `linear-gradient(135deg, ${getAvatarColor(doc.name)}, ${getAvatarColor(doc.name + 'x')})`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '48px', fontWeight: 800, color: 'rgba(255,255,255,0.9)', fontFamily: 'var(--font-display)',
                    overflow: 'hidden',
                  }}>
                    {doc.imageUrl ? (
                      <img src={doc.imageUrl} alt={doc.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      getInitials(doc.name)
                    )}
                  </div>
                  <div className="doctor-card-body">
                    <h3>{doc.name}</h3>
                    <p style={{ fontSize: '13px', color: 'var(--gray-500)', marginBottom: '4px' }}>{doc.designation}</p>
                    <p style={{ fontSize: '12px', color: 'var(--gray-400)', marginBottom: '10px' }}>{doc.qualification}</p>
                    <div className="doctor-meta">
                      <span className="badge badge--blue">{doc.speciality}</span>
                      <span className="badge badge--green">{doc.location}</span>
                      <span className="badge badge--purple">{doc.experience}</span>
                    </div>
                    <div style={{ display: 'flex', gap: '8px', marginTop: '14px' }}>
                      <Link href={`/doctors/${doc.slug}`} className="btn btn-outline btn-sm" style={{ flex: 1 }}>View Profile</Link>
                      <Link href={`/book?doctor=${doc.slug}`} className="btn btn-primary btn-sm" style={{ flex: 1 }}>Book Appointment</Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loading && filtered.length === 0 && (
            <div className="text-center" style={{ padding: '60px 0' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔍</div>
              <h3 style={{ color: 'var(--gray-700)', marginBottom: '8px' }}>No doctors found</h3>
              <p style={{ color: 'var(--gray-400)' }}>Try adjusting your search or filter criteria</p>
            </div>
          )}
        </div>
      </section>

      {/* Stats Strip */}
      <div className="stats-strip">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-item"><div className="stat-number">800+</div><div className="stat-label">Doctors</div></div>
            <div className="stat-item"><div className="stat-number">30+</div><div className="stat-label">Specialities</div></div>
            <div className="stat-item"><div className="stat-number">6</div><div className="stat-label">Hospitals</div></div>
            <div className="stat-item"><div className="stat-number">50+</div><div className="stat-label">Countries Served</div></div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <section className="cta-banner">
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <h2>Need Expert Medical Advice?</h2>
          <p>Book a consultation with India&apos;s top specialists. Video consultations also available.</p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/book" className="btn btn-white btn-lg">📅 Book Appointment</Link>
            <a href="tel:+911244141414" className="btn btn-outline btn-lg" style={{ borderColor: 'rgba(255,255,255,0.3)', color: 'white' }}>📞 Call Now</a>
          </div>
        </div>
      </section>
    </>
  );
}

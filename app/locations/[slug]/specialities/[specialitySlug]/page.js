'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { getSpecialityContent } from '../../../../../lib/specialityContent';

function getInitials(name) {
  return name.replace('Dr. ', '').split(' ').map(w => w[0]).join('').slice(0, 2);
}
function getAvatarColor(name) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return `hsl(${Math.abs(hash) % 360}, 55%, 45%)`;
}

export default function LocationSpecialityDetailPage() {
  const { slug, specialitySlug } = useParams();
  const [speciality, setSpeciality] = useState(null);
  const [location, setLocation] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [treatments, setTreatments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openFaq, setOpenFaq] = useState(null);

  useEffect(() => {
    Promise.all([
      fetch('/api/specialities').then(r => r.ok ? r.json() : []),
      fetch('/api/locations').then(r => r.ok ? r.json() : []),
      fetch('/api/doctors').then(r => r.ok ? r.json() : []),
      fetch('/api/treatments').then(r => r.ok ? r.json() : []),
    ]).then(([specs, locs, docs, treats]) => {
      const validSpecs = Array.isArray(specs) ? specs : [];
      const validLocs = Array.isArray(locs) ? locs : [];
      const validDocs = Array.isArray(docs) ? docs : [];
      const validTreats = Array.isArray(treats) ? treats : [];

      const spec = validSpecs.find(s => s.slug === specialitySlug);
      const loc = validLocs.find(l => l.slug === slug);
      setSpeciality(spec);
      setLocation(loc);
      if (spec && loc) {
        setDoctors(validDocs.filter(d => d.speciality === spec.name && d.location === loc.name));
        setTreatments(validTreats.filter(t => t.speciality === spec.name));
        
        // Dynamic client-side SEO update
        if (spec.metaTitle) {
          document.title = `${spec.metaTitle} in ${loc.name} | Vivek Hospital`;
          const metaDesc = document.querySelector('meta[name="description"]');
          if (metaDesc) metaDesc.setAttribute('content', spec.metaDescription || '');
        }
      }
      setLoading(false);
    }).catch(err => {
      console.error("Error loading location speciality details:", err);
      setLoading(false);
    });
  }, [slug, specialitySlug]);

  if (loading) return (
    <div style={{ paddingTop: '140px', textAlign: 'center' }}>
      <div style={{ fontSize: '48px', marginBottom: '16px' }}>⏳</div>
      <p style={{ color: 'var(--gray-400)' }}>Loading details...</p>
    </div>
  );

  if (!speciality || !location) return (
    <div style={{ paddingTop: '140px', textAlign: 'center' }}>
      <div style={{ fontSize: '48px', marginBottom: '16px' }}>❌</div>
      <h2 style={{ marginBottom: '16px' }}>Department Not Found</h2>
      <Link href="/locations" className="btn btn-primary">← Back to Hospitals</Link>
    </div>
  );

  const content = getSpecialityContent(specialitySlug);
  const bookUrl = `/book?location=${encodeURIComponent(location.name)}&speciality=${encodeURIComponent(speciality.name)}`;

  return (
    <>
      {/* ===== HERO HEADER ===== */}
      <section 
        className="page-header" 
        style={{ 
          paddingBottom: '50px',
          backgroundImage: location.image ? `linear-gradient(rgba(15, 23, 42, 0.75), rgba(15, 23, 42, 0.85)), url(${location.image})` : 'var(--gradient-primary)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          color: 'white'
        }}
      >
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div className="breadcrumb">
            <Link href="/" style={{ color: 'white' }}>Home</Link><span className="breadcrumb-sep">/</span>
            <Link href="/locations" style={{ color: 'white' }}>Hospitals</Link><span className="breadcrumb-sep">/</span>
            <Link href={`/locations/${location.slug}`} style={{ color: 'white' }}>{location.name}</Link><span className="breadcrumb-sep">/</span>
            <span>{speciality.name}</span>
          </div>
          <div style={{ fontSize: '64px', marginBottom: '16px' }}>{speciality.icon}</div>
          <h1>{speciality.name} at Vivek Hospital, {location.name}</h1>
          <p style={{ maxWidth: '700px', margin: '0 auto', marginTop: '12px', fontSize: '18px', opacity: 0.9 }}>
            {content.tagline}
          </p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', marginTop: '28px' }}>
            <Link href={bookUrl} className="btn btn-white btn-lg">📅 Book Appointment in {location.name}</Link>
            <a href={`tel:${location.phone.replace(/-/g, '')}`} className="btn btn-outline btn-lg" style={{ borderColor: 'rgba(255,255,255,0.3)', color: 'white' }}>📞 Call {location.name}</a>
          </div>
        </div>
      </section>

      {/* ===== STATS BAR ===== */}
      <section style={{ marginTop: '-30px', position: 'relative', zIndex: 10 }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
            {content.stats.map((s, i) => (
              <div key={i} className="card card--elevated" style={{ textAlign: 'center', padding: '24px' }}>
                <div style={{ fontSize: '28px', fontWeight: 800, color: 'var(--accent)', lineHeight: 1, marginBottom: '4px' }}>{s.num}</div>
                <div style={{ fontSize: '13px', color: 'var(--gray-500)', fontWeight: 500 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== SECTION 1: COMPREHENSIVE OVERVIEW ===== */}
      <section className="section">
        <div className="container" style={{ maxWidth: '960px' }}>
          <div className="section-header" style={{ textAlign: 'left', marginLeft: 0, maxWidth: '100%' }}>
            <div className="section-eyebrow">📋 Overview</div>
            <h2 className="section-title">About {speciality.name} at Vivek Hospital, {location.name}</h2>
          </div>
          <div style={{ fontSize: '15px', color: 'var(--gray-600)', lineHeight: 2 }}>
            {content.overview.split('\n\n').map((para, i) => (
              <p key={i} style={{ marginBottom: '20px' }}>{para}</p>
            ))}
          </div>
        </div>
      </section>

      {/* ===== SECTION 2: WHY CHOOSE US ===== */}
      <section className="section section--alt">
        <div className="container">
          <div className="section-header">
            <div className="section-eyebrow">🏆 Why Choose Us</div>
            <h2 className="section-title">Why Choose Vivek Hospital, {location.name}?</h2>
          </div>
          <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
            {content.whyChoose.map((item, i) => (
              <div key={i} className="card" style={{ padding: '24px', display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                <div style={{
                  width: '40px', height: '40px', borderRadius: 'var(--radius-full)',
                  background: 'var(--accent-glow)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '18px', fontWeight: 800, color: 'var(--accent)', flexShrink: 0,
                }}>✓</div>
                <p style={{ fontSize: '14px', color: 'var(--gray-700)', lineHeight: 1.7, fontWeight: 500 }}>{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== SECTION 6: OUR SPECIALISTS (Location Filtered) ===== */}
      {doctors.length > 0 && (
        <section className="section">
          <div className="container">
            <div className="section-header">
              <div className="section-eyebrow">👨‍⚕️ Our Specialists in {location.name}</div>
              <h2 className="section-title">Expert {speciality.name} Doctors at Vivek Hospital, {location.name}</h2>
              <p className="section-subtitle">
                Our local team of renowned specialists brings decades of experience to deliver exceptional outcomes in {location.name}
              </p>
            </div>
            <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
              {doctors.map(doc => (
                <Link href={`/doctors/${doc.slug}`} key={doc.id} className="doctor-card">
                  <div style={{
                    height: '180px',
                    background: `linear-gradient(135deg, ${getAvatarColor(doc.name)}, ${getAvatarColor(doc.name + 'x')})`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '48px', fontWeight: 800, color: 'rgba(255,255,255,0.9)', fontFamily: 'var(--font-display)',
                    overflow: 'hidden',
                  }}>{doc.imageUrl ? (
                    <img src={doc.imageUrl} alt={doc.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    getInitials(doc.name)
                  )}</div>
                  <div className="doctor-card-body">
                    <h3>{doc.name}</h3>
                    <p style={{ fontSize: '13px', color: 'var(--gray-500)', marginBottom: '4px' }}>{doc.designation}</p>
                    <p style={{ fontSize: '12px', color: 'var(--gray-400)', marginBottom: '10px' }}>{doc.qualification}</p>
                    <div className="doctor-meta">
                      <span className="badge badge--green">{doc.location}</span>
                      <span className="badge badge--purple">{doc.experience}</span>
                    </div>
                    <div style={{ marginTop: '12px' }}>
                      <span className="btn btn-primary btn-sm" style={{ width: '100%' }}>Book Appointment</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ===== SECTION 7: TREATMENTS & PROCEDURES ===== */}
      {treatments.length > 0 && (
        <section className="section section--alt">
          <div className="container">
            <div className="section-header">
              <div className="section-eyebrow">💉 Treatments & Procedures</div>
              <h2 className="section-title">Treatments Available in {speciality.name}</h2>
            </div>
            <div className="grid-3 grid">
              {treatments.map(t => (
                <Link href={`/treatments/${t.slug}`} key={t.id} className="card card--interactive" style={{ padding: '28px', display: 'flex', flexDirection: 'column' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--gray-900)', marginBottom: '8px' }}>{t.name}</h3>
                  <p style={{ fontSize: '14px', color: 'var(--gray-500)', lineHeight: 1.7, flex: 1 }}>{t.description}</p>
                  <span className="btn btn-ghost btn-sm" style={{ marginTop: '12px', padding: '4px 0', alignSelf: 'flex-start' }}>Learn More →</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ===== FINAL CTA BANNER ===== */}
      <section className="cta-banner">
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <h2>Consult a {speciality.name} Specialist in {location.name}</h2>
          <p style={{ maxWidth: '600px', margin: '0 auto 24px' }}>
            Book a consultation with our local experts. Same-day appointments available.
          </p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href={bookUrl} className="btn btn-white btn-lg">📅 Book Appointment</Link>
            <a href={`tel:${location.phone.replace(/-/g, '')}`} className="btn btn-outline btn-lg" style={{ borderColor: 'rgba(255,255,255,0.3)', color: 'white' }}>📞 Call {location.phone}</a>
          </div>
        </div>
      </section>
    </>
  );
}

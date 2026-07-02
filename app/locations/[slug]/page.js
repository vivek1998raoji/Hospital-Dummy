'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

function getInitials(name) {
  return name.replace('Dr. ', '').split(' ').map(w => w[0]).join('').slice(0, 2);
}
function getAvatarColor(name) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return `hsl(${Math.abs(hash) % 360}, 55%, 45%)`;
}

export default function LocationDetailPage() {
  const { slug } = useParams();
  const [location, setLocation] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [specialities, setSpecialities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/locations').then(r => r.ok ? r.json() : []),
      fetch('/api/doctors').then(r => r.ok ? r.json() : []),
      fetch('/api/specialities').then(r => r.ok ? r.json() : []),
    ]).then(([locs, docs, specs]) => {
      const validLocs = Array.isArray(locs) ? locs : [];
      const validDocs = Array.isArray(docs) ? docs : [];
      const validSpecs = Array.isArray(specs) ? specs : [];

      const loc = validLocs.find(l => l.slug === slug);
      setLocation(loc);
      if (loc) {
        setDoctors(validDocs.filter(d => d.location === loc.name));
        
        // Filter specialities active in this hospital branch from database string
        const activeSpecs = loc.specialities
          ? validSpecs.filter(s => loc.specialities.split(',').map(x => x.trim()).includes(s.name))
          : validSpecs.slice(0, 12); // Fallback to first 12 if none assigned
        
        setSpecialities(activeSpecs);
        
        // Dynamic client-side SEO update
        if (loc) {
          // Meta Title
          document.title = loc.metaTitle || `Marengo Asia Hospitals, ${loc.name} | Best Multi-Speciality Care`;
          
          // Meta Description
          let metaDesc = document.querySelector('meta[name="description"]');
          if (!metaDesc) {
            metaDesc = document.createElement('meta');
            metaDesc.setAttribute('name', 'description');
            document.head.appendChild(metaDesc);
          }
          metaDesc.setAttribute('content', loc.metaDescription || `Consult leading specialists at Marengo Asia Hospitals ${loc.name}. State-of-the-art infrastructure and modular OTs.`);

          // Meta Keywords
          let metaKeys = document.querySelector('meta[name="keywords"]');
          if (!metaKeys) {
            metaKeys = document.createElement('meta');
            metaKeys.setAttribute('name', 'keywords');
            document.head.appendChild(metaKeys);
          }
          metaKeys.setAttribute('content', loc.metaKeywords || `hospital in ${loc.name}, best doctor ${loc.name}, cardiac care`);

          // Canonical URL
          let canonical = document.querySelector('link[rel="canonical"]');
          if (!canonical) {
            canonical = document.createElement('link');
            canonical.setAttribute('rel', 'canonical');
            document.head.appendChild(canonical);
          }
          canonical.setAttribute('href', loc.canonicalUrl || window.location.href);

          // Robots
          let robots = document.querySelector('meta[name="robots"]');
          if (!robots) {
            robots = document.createElement('meta');
            robots.setAttribute('name', 'robots');
            document.head.appendChild(robots);
          }
          robots.setAttribute('content', loc.robots || 'index, follow');

          // Open Graph (OG) Tags
          const ogTags = {
            'og:title': loc.ogTitle || loc.metaTitle || `Marengo Asia Hospitals, ${loc.name}`,
            'og:description': loc.ogDescription || loc.metaDescription || '',
            'og:image': loc.ogImage || loc.image || '',
            'og:type': 'website',
            'og:url': loc.canonicalUrl || window.location.href
          };
          Object.keys(ogTags).forEach(property => {
            let tag = document.querySelector(`meta[property="${property}"]`);
            if (!tag) {
              tag = document.createElement('meta');
              tag.setAttribute('property', property);
              document.head.appendChild(tag);
            }
            tag.setAttribute('content', ogTags[property]);
          });

          // Schema JSON-LD Injection
          if (loc.schemaJson) {
            let schemaScript = document.querySelector('#schema-json-ld');
            if (!schemaScript) {
              schemaScript = document.createElement('script');
              schemaScript.setAttribute('type', 'application/ld+json');
              schemaScript.setAttribute('id', 'schema-json-ld');
              document.head.appendChild(schemaScript);
            }
            schemaScript.innerHTML = loc.schemaJson;
          }
        }
      }
      setLoading(false);
    }).catch(err => {
      console.error("Error loading hospital details:", err);
      setLoading(false);
    });
  }, [slug]);

  if (loading) return <div style={{ paddingTop: '140px', textAlign: 'center' }}><p style={{ color: 'var(--gray-400)' }}>Loading hospital details...</p></div>;
  if (!location) return <div style={{ paddingTop: '140px', textAlign: 'center' }}><h2>Hospital not found</h2><Link href="/locations" className="btn btn-primary" style={{ marginTop: '16px' }}>← All Hospitals</Link></div>;

  const facilities = [
    { icon: '🏥', name: 'Operation Theatres', desc: 'State-of-the-art modular OTs with laminar airflow' },
    { icon: '🫀', name: 'Cath Labs', desc: 'Digital flat-panel cardiac catheterization labs' },
    { icon: '🛏️', name: 'ICU & Critical Care', desc: 'Multi-disciplinary ICUs with 24/7 intensivist coverage' },
    { icon: '🔬', name: 'Diagnostics Lab', desc: 'NABL-accredited lab with 2000+ tests and same-day reports' },
    { icon: '📡', name: 'Radiology Centre', desc: '3T MRI, 256-slice CT, PET-CT, digital mammography' },
    { icon: '💊', name: '24/7 Pharmacy', desc: 'In-house pharmacy with all essential and specialty medications' },
    { icon: '🩸', name: 'Blood Bank', desc: 'Licensed blood bank with component separation facility' },
    { icon: '🚑', name: 'Emergency & Trauma', desc: 'Level-I trauma centre with helipad and rapid response' },
  ];

  return (
    <>
      {/* Header with building picture overlay background */}
      <section 
        className="page-header" 
        style={{ 
          paddingBottom: '40px',
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
            <span>{location.name}</span>
          </div>
          <h1>Marengo Asia Hospitals, {location.name}</h1>
          <p style={{ maxWidth: '700px', margin: '12px auto 0', opacity: 0.9 }} dangerouslySetInnerHTML={{ __html: location.description }} />
        </div>
      </section>

      {/* Quick Stats */}
      <section style={{ marginTop: '-30px', position: 'relative', zIndex: 10 }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
            {[
              { icon: '🛏️', num: location.beds, label: 'Beds' },
              { icon: '👨‍⚕️', num: `${doctors.length}+`, label: 'Doctors' },
              { icon: '🏥', num: `${specialities.length}+`, label: 'Departments' },
              { icon: '🏆', num: '24/7', label: 'Emergency' },
            ].map((s, i) => (
              <div key={i} className="card card--elevated" style={{ textAlign: 'center', padding: '24px' }}>
                <div style={{ fontSize: '28px', marginBottom: '8px' }}>{s.icon}</div>
                <div style={{ fontSize: '28px', fontWeight: 800, color: 'var(--accent)', lineHeight: 1 }}>{s.num}</div>
                <div style={{ fontSize: '13px', color: 'var(--gray-500)', marginTop: '4px' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Info */}
      <section className="section" style={{ paddingTop: '40px', paddingBottom: '40px' }}>
        <div className="container">
          <div className="card card--accent" style={{ padding: '28px', display: 'flex', gap: '40px', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--gray-900)', marginBottom: '4px' }}>📍 {location.address}</h3>
              <p style={{ fontSize: '14px', color: 'var(--gray-500)' }}>📞 {location.phone}</p>
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <Link href={`/book?location=${encodeURIComponent(location.name)}`} className="btn btn-primary">📅 Book Appointment</Link>
              <a href={`tel:${location.phone.replace(/-/g, '')}`} className="btn btn-outline">📞 Call Now</a>
            </div>
          </div>
        </div>
      </section>

      {/* Specialities active in this location */}
      <section className="section section--alt">
        <div className="container">
          <div className="section-header">
            <div className="section-eyebrow">🏅 Specialities Available</div>
            <h2 className="section-title">Departments at {location.name}</h2>
          </div>
          {specialities.length === 0 ? (
            <p style={{ textAlign: 'center', fontStyle: 'italic', color: 'var(--gray-400)' }}>No departments active at this branch currently.</p>
          ) : (
            <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))' }}>
              {specialities.map(spec => (
                <Link href={`/locations/${location.slug}/specialities/${spec.slug}`} key={spec.id} className="speciality-card" style={{ padding: '20px' }}>
                  <div className="speciality-icon" style={{ width: '56px', height: '56px', fontSize: '24px' }}>{spec.icon}</div>
                  <h3 style={{ fontSize: '14px' }}>{spec.name}</h3>
                </Link>
              ))}
            </div>
          )}
          <div className="text-center" style={{ marginTop: '24px' }}>
            <Link href="/specialities" className="btn btn-outline">View All Specialities →</Link>
          </div>
        </div>
      </section>

      {/* Doctors */}
      {doctors.length > 0 && (
        <section className="section">
          <div className="container">
            <div className="section-header">
              <div className="section-eyebrow">👨‍⚕️ Our Doctors</div>
              <h2 className="section-title">Doctors at {location.name}</h2>
            </div>
            <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
              {doctors.map(doc => (
                <Link href={`/doctors/${doc.slug}`} key={doc.id} className="doctor-card">
                  <div style={{
                    height: '160px',
                    background: `linear-gradient(135deg, ${getAvatarColor(doc.name)}, ${getAvatarColor(doc.name + 'x')})`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '44px', fontWeight: 800, color: 'rgba(255,255,255,0.9)', fontFamily: 'var(--font-display)',
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
                    <p style={{ fontSize: '13px', color: 'var(--gray-500)', marginBottom: '8px' }}>{doc.designation}</p>
                    <div className="doctor-meta">
                      <span className="badge badge--blue">{doc.speciality}</span>
                      <span className="badge badge--purple">{doc.experience}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Facilities */}
      <section className="section section--alt">
        <div className="container">
          <div className="section-header">
            <div className="section-eyebrow">🏗️ Infrastructure</div>
            <h2 className="section-title">Facilities & Infrastructure</h2>
          </div>
          <div className="grid-4 grid">
            {facilities.map((f, i) => (
              <div key={i} className="feature-card" style={{ textAlign: 'center' }}>
                <div className="feature-icon" style={{ margin: '0 auto 12px' }}>{f.icon}</div>
                <h3 style={{ fontSize: '15px' }}>{f.name}</h3>
                <p style={{ fontSize: '13px' }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-banner">
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <h2>Book an Appointment at {location.name}</h2>
          <p>Consult our specialists at Marengo Asia Hospitals, {location.name}</p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
            <Link href={`/book?location=${encodeURIComponent(location.name)}`} className="btn btn-white btn-lg">📅 Book Now</Link>
            <a href={`tel:${location.phone.replace(/-/g, '')}`} className="btn btn-outline btn-lg" style={{ borderColor: 'rgba(255,255,255,0.3)', color: 'white' }}>
              📞 {location.phone}
            </a>
          </div>
        </div>
      </section>
    </>
  );
}

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

export default function DoctorDetailPage() {
  const { slug } = useParams();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/doctors/${slug}`)
      .then(r => r.json())
      .then(d => {
        setDoctor(d);
        // Dynamic client-side SEO update
        if (d) {
          // Meta Title
          document.title = d.metaTitle || `${d.name} - ${d.designation} | Marengo Asia Hospitals`;
          
          // Meta Description
          let metaDesc = document.querySelector('meta[name="description"]');
          if (!metaDesc) {
            metaDesc = document.createElement('meta');
            metaDesc.setAttribute('name', 'description');
            document.head.appendChild(metaDesc);
          }
          metaDesc.setAttribute('content', d.metaDescription || `Book an appointment with ${d.name}, leading ${d.designation} at Marengo Asia Hospitals.`);

          // Meta Keywords
          let metaKeys = document.querySelector('meta[name="keywords"]');
          if (!metaKeys) {
            metaKeys = document.createElement('meta');
            metaKeys.setAttribute('name', 'keywords');
            document.head.appendChild(metaKeys);
          }
          metaKeys.setAttribute('content', d.metaKeywords || `${d.name}, ${d.speciality}, Marengo Asia Hospitals`);

          // Canonical URL
          let canonical = document.querySelector('link[rel="canonical"]');
          if (!canonical) {
            canonical = document.createElement('link');
            canonical.setAttribute('rel', 'canonical');
            document.head.appendChild(canonical);
          }
          canonical.setAttribute('href', d.canonicalUrl || window.location.href);

          // Robots
          let robots = document.querySelector('meta[name="robots"]');
          if (!robots) {
            robots = document.createElement('meta');
            robots.setAttribute('name', 'robots');
            document.head.appendChild(robots);
          }
          robots.setAttribute('content', d.robots || 'index, follow');

          // Open Graph (OG) Tags
          const ogTags = {
            'og:title': d.ogTitle || d.metaTitle || d.name,
            'og:description': d.ogDescription || d.metaDescription || '',
            'og:image': d.ogImage || d.imageUrl || '',
            'og:type': 'website',
            'og:url': d.canonicalUrl || window.location.href
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
          if (d.schemaJson) {
            let schemaScript = document.querySelector('#schema-json-ld');
            if (!schemaScript) {
              schemaScript = document.createElement('script');
              schemaScript.setAttribute('type', 'application/ld+json');
              schemaScript.setAttribute('id', 'schema-json-ld');
              document.head.appendChild(schemaScript);
            }
            schemaScript.innerHTML = d.schemaJson;
          }
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [slug]);

  if (loading) return (
    <div style={{ paddingTop: '120px', textAlign: 'center' }}>
      <div style={{ fontSize: '48px' }}>⏳</div>
      <p style={{ color: 'var(--gray-400)', marginTop: '16px' }}>Loading doctor profile...</p>
    </div>
  );

  if (!doctor) return (
    <div style={{ paddingTop: '120px', textAlign: 'center' }}>
      <div style={{ fontSize: '48px' }}>❌</div>
      <h2 style={{ margin: '16px 0 8px' }}>Doctor Not Found</h2>
      <Link href="/doctors" className="btn btn-primary" style={{ marginTop: '16px' }}>← Back to Doctors</Link>
    </div>
  );

  return (
    <>
      {/* Doctor Header */}
      <section style={{
        background: `linear-gradient(135deg, ${getAvatarColor(doctor.name)}, ${getAvatarColor(doctor.name + 'dark')})`,
        padding: '130px 0 60px', color: 'white', position: 'relative', overflow: 'hidden',
      }}>
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div className="breadcrumb" style={{ opacity: 0.7, marginBottom: '24px' }}>
            <Link href="/" style={{ color: 'white' }}>Home</Link>
            <span className="breadcrumb-sep">/</span>
            <Link href="/doctors" style={{ color: 'white' }}>Doctors</Link>
            <span className="breadcrumb-sep">/</span>
            <span>{doctor.name}</span>
          </div>
          <div style={{ display: 'flex', gap: '32px', alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{
              width: '140px', height: '140px', borderRadius: '20px',
              background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(10px)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '52px', fontWeight: 800, fontFamily: 'var(--font-display)',
              border: '2px solid rgba(255,255,255,0.2)',
              overflow: 'hidden'
            }}>
              {doctor.imageUrl ? (
                <img src={doctor.imageUrl} alt={doctor.imageAlt || doctor.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                getInitials(doctor.name)
              )}
            </div>
            <div>
              <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '36px', fontWeight: 700, marginBottom: '8px' }}>
                {doctor.name}
              </h1>
              <p style={{ fontSize: '18px', opacity: 0.9, marginBottom: '12px' }}>{doctor.designation}</p>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <span className="badge" style={{ background: 'rgba(255,255,255,0.15)', color: 'white', border: '1px solid rgba(255,255,255,0.2)' }}>
                  ❤️ {doctor.speciality}
                </span>
                <span className="badge" style={{ background: 'rgba(255,255,255,0.15)', color: 'white', border: '1px solid rgba(255,255,255,0.2)' }}>
                  📍 {doctor.location}
                </span>
                <span className="badge" style={{ background: 'rgba(255,255,255,0.15)', color: 'white', border: '1px solid rgba(255,255,255,0.2)' }}>
                  🕐 {doctor.experience}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="section">
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '32px' }}>
            {/* Left Column */}
            <div>
              {/* About */}
              <div className="card" style={{ marginBottom: '24px', padding: '32px' }}>
                <div className="section-eyebrow" style={{ marginBottom: '16px' }}>👨‍⚕️ About</div>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '24px', fontWeight: 700, marginBottom: '16px', color: 'var(--gray-900)' }}>
                  About {doctor.name}
                </h2>
                <div style={{ fontSize: '15px', color: 'var(--gray-600)', lineHeight: 1.8 }} dangerouslySetInnerHTML={{ __html: doctor.about }} />
              </div>

              {/* Qualifications */}
              <div className="card" style={{ marginBottom: '24px', padding: '32px' }}>
                <div className="section-eyebrow" style={{ marginBottom: '16px' }}>🎓 Qualifications</div>
                <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '16px', color: 'var(--gray-900)' }}>Education & Training</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {doctor.qualification.split(', ').map((q, i) => (
                    <span key={i} className="badge badge--accent" style={{ fontSize: '13px', padding: '6px 14px' }}>{q}</span>
                  ))}
                </div>
              </div>

              {/* Languages */}
              <div className="card" style={{ padding: '32px' }}>
                <div className="section-eyebrow" style={{ marginBottom: '16px' }}>🌐 Languages</div>
                <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '16px', color: 'var(--gray-900)' }}>Languages Spoken</h3>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {(doctor.languages || 'English, Hindi').split(', ').map((l, i) => (
                    <span key={i} className="badge badge--gray" style={{ fontSize: '13px', padding: '6px 14px' }}>{l}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Sidebar */}
            <div>
              {/* Book Appointment Card */}
              <div className="card card--accent" style={{ padding: '32px', marginBottom: '24px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--gray-900)', marginBottom: '16px' }}>
                  📅 Book Appointment
                </h3>
                <p style={{ fontSize: '14px', color: 'var(--gray-500)', lineHeight: 1.7, marginBottom: '20px' }}>
                  Consult with {doctor.name} at Marengo Asia Hospitals, {doctor.location}. Same-day appointments available.
                </p>
                <Link href={`/book?doctor=${doctor.slug}`} className="btn btn-primary" style={{ width: '100%' }}>
                  Book Now →
                </Link>
                <div style={{ textAlign: 'center', margin: '12px 0', color: 'var(--gray-400)', fontSize: '13px' }}>or</div>
                <a href="tel:+911244141414" className="btn btn-outline" style={{ width: '100%' }}>
                  📞 Call +91-124-4141414
                </a>
              </div>

              {/* Quick Info Card */}
              <div className="card" style={{ padding: '24px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '20px', color: 'var(--gray-900)' }}>Quick Info</h3>
                {[
                  { label: 'Speciality', value: doctor.speciality, icon: '❤️' },
                  { label: 'Hospital', value: `Marengo Asia Hospitals, ${doctor.location}`, icon: '🏥' },
                  { label: 'Experience', value: doctor.experience, icon: '🕐' },
                  { label: 'Designation', value: doctor.designation, icon: '👔' },
                ].map((item, i) => (
                  <div key={i} style={{ display: 'flex', gap: '12px', padding: '10px 0', borderBottom: i < 3 ? '1px solid var(--gray-100)' : 'none' }}>
                    <span style={{ fontSize: '18px' }}>{item.icon}</span>
                    <div>
                      <p style={{ fontSize: '12px', color: 'var(--gray-400)', marginBottom: '2px' }}>{item.label}</p>
                      <p style={{ fontSize: '14px', fontWeight: 600, color: 'var(--gray-800)' }}>{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-banner">
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <h2>Looking for Another Specialist?</h2>
          <p>Browse our directory of 800+ expert doctors across 30+ specialities</p>
          <Link href="/doctors" className="btn btn-white btn-lg">View All Doctors →</Link>
        </div>
      </section>
    </>
  );
}

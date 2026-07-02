'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { getSpecialityContent } from '../../../lib/specialityContent';

function getInitials(name) {
  return name.replace('Dr. ', '').split(' ').map(w => w[0]).join('').slice(0, 2);
}
function getAvatarColor(name) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return `hsl(${Math.abs(hash) % 360}, 55%, 45%)`;
}

export default function SpecialityDetailPage() {
  const { slug } = useParams();
  const [speciality, setSpeciality] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [treatments, setTreatments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openFaq, setOpenFaq] = useState(null);

  useEffect(() => {
    Promise.all([
      fetch('/api/specialities').then(r => r.ok ? r.json() : []),
      fetch('/api/doctors').then(r => r.ok ? r.json() : []),
      fetch('/api/treatments').then(r => r.ok ? r.json() : []),
    ]).then(([specs, docs, treats]) => {
      const validSpecs = Array.isArray(specs) ? specs : [];
      const validDocs = Array.isArray(docs) ? docs : [];
      const validTreats = Array.isArray(treats) ? treats : [];

      const spec = validSpecs.find(s => s.slug === slug);
      setSpeciality(spec);
      if (spec) {
        setDoctors(validDocs.filter(d => d.speciality === spec.name));
        setTreatments(validTreats.filter(t => t.speciality === spec.name));

        // Dynamic client-side SEO update
        // Meta Title
        document.title = spec.metaTitle || `${spec.name} - Super Speciality Care | Vivek Hospital`;
        
        // Meta Description
        let metaDesc = document.querySelector('meta[name="description"]');
        if (!metaDesc) {
          metaDesc = document.createElement('meta');
          metaDesc.setAttribute('name', 'description');
          document.head.appendChild(metaDesc);
        }
        metaDesc.setAttribute('content', spec.metaDescription || `Consult top specialists in ${spec.name} at Vivek Hospital. World-class technology and outcomes.`);

        // Meta Keywords
        let metaKeys = document.querySelector('meta[name="keywords"]');
        if (!metaKeys) {
          metaKeys = document.createElement('meta');
          metaKeys.setAttribute('name', 'keywords');
          document.head.appendChild(metaKeys);
        }
        metaKeys.setAttribute('content', spec.metaKeywords || `${spec.name}, cardiology, bypass surgery`);

        // Canonical URL
        let canonical = document.querySelector('link[rel="canonical"]');
        if (!canonical) {
          canonical = document.createElement('link');
          canonical.setAttribute('rel', 'canonical');
          document.head.appendChild(canonical);
        }
        canonical.setAttribute('href', spec.canonicalUrl || window.location.href);

        // Robots
        let robots = document.querySelector('meta[name="robots"]');
        if (!robots) {
          robots = document.createElement('meta');
          robots.setAttribute('name', 'robots');
          document.head.appendChild(robots);
        }
        robots.setAttribute('content', spec.robots || 'index, follow');

        // Open Graph (OG) Tags
        const ogTags = {
          'og:title': spec.ogTitle || spec.metaTitle || spec.name,
          'og:description': spec.ogDescription || spec.metaDescription || '',
          'og:image': spec.ogImage || spec.image || '',
          'og:type': 'website',
          'og:url': spec.canonicalUrl || window.location.href
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
        if (spec.schemaJson) {
          let schemaScript = document.querySelector('#schema-json-ld');
          if (!schemaScript) {
            schemaScript = document.createElement('script');
            schemaScript.setAttribute('type', 'application/ld+json');
            schemaScript.setAttribute('id', 'schema-json-ld');
            document.head.appendChild(schemaScript);
          }
          schemaScript.innerHTML = spec.schemaJson;
        }
      }
      setLoading(false);
    }).catch(err => {
      console.error("Error loading speciality details:", err);
      setLoading(false);
    });
  }, [slug]);

  if (loading) return (
    <div style={{ paddingTop: '140px', textAlign: 'center' }}>
      <div style={{ fontSize: '48px', marginBottom: '16px' }}>⏳</div>
      <p style={{ color: 'var(--gray-400)' }}>Loading speciality details...</p>
    </div>
  );

  if (!speciality) return (
    <div style={{ paddingTop: '140px', textAlign: 'center' }}>
      <div style={{ fontSize: '48px', marginBottom: '16px' }}>❌</div>
      <h2 style={{ marginBottom: '16px' }}>Speciality Not Found</h2>
      <Link href="/specialities" className="btn btn-primary">← Back to Specialities</Link>
    </div>
  );

  const content = getSpecialityContent(slug);

  return (
    <>
      {/* ===== HERO HEADER ===== */}
      <section className="page-header" style={{ paddingBottom: '50px' }}>
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div className="breadcrumb">
            <Link href="/">Home</Link><span className="breadcrumb-sep">/</span>
            <Link href="/specialities">Specialities</Link><span className="breadcrumb-sep">/</span>
            <span>{speciality.name}</span>
          </div>
          <div style={{ fontSize: '64px', marginBottom: '16px' }}>{speciality.icon}</div>
          <h1>{speciality.name} at Vivek Hospital</h1>
          <p style={{ maxWidth: '700px', margin: '0 auto', marginTop: '12px', fontSize: '18px', opacity: 0.9 }}>
            {content.tagline}
          </p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', marginTop: '28px' }}>
            <Link href={`/book?speciality=${encodeURIComponent(speciality.name)}`} className="btn btn-white btn-lg">📅 Book Appointment</Link>
            <a href="tel:+911244141414" className="btn btn-outline btn-lg" style={{ borderColor: 'rgba(255,255,255,0.3)', color: 'white' }}>📞 Call Now</a>
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
            <h2 className="section-title">About {speciality.name} at Vivek Hospital</h2>
          </div>
          <div 
            style={{ fontSize: '15px', color: 'var(--gray-600)', lineHeight: 2 }}
            dangerouslySetInnerHTML={{ __html: speciality.description || content.overview.split('\n\n').map(p => `<p style="margin-bottom:20px">${p}</p>`).join('') }}
          />
        </div>
      </section>

      {/* ===== SECTION 2: WHY CHOOSE US ===== */}
      <section className="section section--alt">
        <div className="container">
          <div className="section-header">
            <div className="section-eyebrow">🏆 Why Choose Vivek Hospital</div>
            <h2 className="section-title">Why Choose Vivek Hospital for {speciality.name}?</h2>
            <p className="section-subtitle">Our department sets global benchmarks in clinical outcomes, patient safety, and advanced technology</p>
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

      {/* ===== SECTION 3: CONDITIONS WE TREAT ===== */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <div className="section-eyebrow">🩺 Conditions We Treat</div>
            <h2 className="section-title">Diseases & Conditions Treated in {speciality.name}</h2>
            <p className="section-subtitle">Our specialists treat the full spectrum of conditions — from common ailments to the most complex cases requiring advanced intervention</p>
          </div>
          <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '12px' }}>
            {content.conditions.map((cond, i) => (
              <div key={i} className="card" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ color: 'var(--accent)', fontSize: '18px', fontWeight: 700 }}>•</span>
                <span style={{ fontSize: '14px', fontWeight: 500, color: 'var(--gray-700)' }}>{cond}</span>
              </div>
            ))}
          </div>
          <div className="card card--accent" style={{ padding: '24px', marginTop: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
            <p style={{ fontSize: '15px', color: 'var(--gray-700)', fontWeight: 500 }}>
              <strong>Not sure about your condition?</strong> Our specialists can help with accurate diagnosis and treatment planning.
            </p>
            <Link href={`/book?speciality=${encodeURIComponent(speciality.name)}`} className="btn btn-primary">Get Expert Consultation →</Link>
          </div>
        </div>
      </section>

      {/* ===== SECTION 4: OUR TREATMENT APPROACH ===== */}
      <section className="section section--alt">
        <div className="container" style={{ maxWidth: '960px' }}>
          <div className="section-header" style={{ textAlign: 'left', marginLeft: 0, maxWidth: '100%' }}>
            <div className="section-eyebrow">💡 Our Approach</div>
            <h2 className="section-title">Our Treatment Approach to {speciality.name}</h2>
          </div>
          <div style={{ fontSize: '15px', color: 'var(--gray-600)', lineHeight: 2 }}>
            {content.approach.split('\n\n').map((para, i) => {
              // Render bold text
              const parts = para.split(/\*\*(.*?)\*\*/g);
              return (
                <p key={i} style={{ marginBottom: '20px' }}>
                  {parts.map((part, j) =>
                    j % 2 === 1 ? <strong key={j} style={{ color: 'var(--gray-800)' }}>{part}</strong> : part
                  )}
                </p>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== SECTION 5: ADVANCED TECHNOLOGY ===== */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <div className="section-eyebrow">🔬 Technology & Infrastructure</div>
            <h2 className="section-title">Advanced Technology in {speciality.name}</h2>
            <p className="section-subtitle">World-class diagnostic and treatment infrastructure enabling the best clinical outcomes</p>
          </div>
          <div className="grid-3 grid">
            {content.technology.map((tech, i) => (
              <div key={i} className="feature-card">
                <div className="feature-icon" style={{ background: `hsl(${i * 50 + 200}, 80%, 94%)` }}>
                  {['🔬', '🤖', '📡', '🖥️', '💻', '🏥'][i % 6]}
                </div>
                <h3>{tech.name}</h3>
                <p>{tech.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== SECTION 6: OUR SPECIALISTS ===== */}
      {doctors.length > 0 && (
        <section className="section section--alt">
          <div className="container">
            <div className="section-header">
              <div className="section-eyebrow">👨‍⚕️ Our Specialists</div>
              <h2 className="section-title">Expert Doctors in {speciality.name}</h2>
              <p className="section-subtitle">
                Our team of {doctors.length}+ renowned specialists brings decades of experience and global expertise to deliver exceptional patient outcomes
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
                  }}>{getInitials(doc.name)}</div>
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
            <div className="text-center" style={{ marginTop: '24px' }}>
              <Link href="/doctors" className="btn btn-outline">View All Doctors →</Link>
            </div>
          </div>
        </section>
      )}

      {/* ===== SECTION 7: TREATMENTS & PROCEDURES ===== */}
      {treatments.length > 0 && (
        <section className="section">
          <div className="container">
            <div className="section-header">
              <div className="section-eyebrow">💉 Treatments & Procedures</div>
              <h2 className="section-title">Treatments Available in {speciality.name}</h2>
              <p className="section-subtitle">Comprehensive range of medical and surgical treatments — from minimally invasive procedures to complex multi-stage interventions</p>
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
            <div className="text-center" style={{ marginTop: '24px' }}>
              <Link href="/treatments" className="btn btn-outline">View All Treatments →</Link>
            </div>
          </div>
        </section>
      )}

      {/* ===== SECTION 8: YOUR PATIENT JOURNEY ===== */}
      <section className="section section--alt">
        <div className="container" style={{ maxWidth: '900px' }}>
          <div className="section-header">
            <div className="section-eyebrow">🗺️ Patient Journey</div>
            <h2 className="section-title">What to Expect — Your Treatment Journey</h2>
            <p className="section-subtitle">A step-by-step guide to your care experience at Vivek Hospital</p>
          </div>
          {content.journey.split('\n\n').map((step, i) => {
            const parts = step.split(/\*\*(.*?)\*\*/g);
            const title = parts[1] || `Step ${i + 1}`;
            const body = parts.slice(2).join('');
            return (
              <div key={i} className="card" style={{ padding: '28px', marginBottom: '16px', display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
                <div style={{
                  width: '52px', height: '52px', borderRadius: 'var(--radius-full)',
                  background: 'var(--gradient-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '20px', fontWeight: 800, color: 'white', flexShrink: 0,
                }}>{i + 1}</div>
                <div>
                  <h3 style={{ fontSize: '17px', fontWeight: 700, color: 'var(--gray-900)', marginBottom: '8px' }}>{title}</h3>
                  <p style={{ fontSize: '14px', color: 'var(--gray-500)', lineHeight: 1.8 }}>{body}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ===== SECTION 9: HOSPITALS OFFERING THIS SPECIALITY ===== */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <div className="section-eyebrow">🏥 Hospitals</div>
            <h2 className="section-title">{speciality.name} Available at These Hospitals</h2>
          </div>
          <div className="grid-3 grid">
            {[
              { name: 'Gurugram', beds: '1600', phone: '+91-124-4141414' },
              { name: 'Lucknow', beds: '550', phone: '+91-522-4141414' },
              { name: 'Patna', beds: '400', phone: '+91-612-4141414' },
              { name: 'Indore', beds: '300', phone: '+91-731-4141414' },
              { name: 'Noida', beds: '350', phone: '+91-120-4141414' },
              { name: 'Ranchi', beds: '200', phone: '+91-651-4141414' },
            ].map((loc, i) => (
              <Link href={`/locations/${loc.name.toLowerCase()}`} key={i} className="card card--interactive" style={{ padding: '24px', display: 'flex', gap: '16px', alignItems: 'center' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-md)', background: 'var(--accent-glow)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', flexShrink: 0 }}>🏥</div>
                <div>
                  <h3 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--gray-900)' }}>Vivek Hospital, {loc.name}</h3>
                  <p style={{ fontSize: '13px', color: 'var(--gray-500)' }}>{loc.beds} Beds · {loc.phone}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ===== SECTION 10: FAQs ===== */}
      <section className="section section--alt">
        <div className="container" style={{ maxWidth: '860px' }}>
          <div className="section-header">
            <div className="section-eyebrow">❓ Frequently Asked Questions</div>
            <h2 className="section-title">FAQs About {speciality.name} at Vivek Hospital</h2>
            <p className="section-subtitle">Answers to the most common questions from our patients</p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {content.faqs.map((faq, i) => (
              <div key={i} className="faq-item" style={{ borderColor: openFaq === i ? 'var(--accent)' : undefined }}>
                <button
                  className="faq-trigger"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  style={{ color: openFaq === i ? 'var(--accent)' : undefined }}
                >
                  <span>{faq.q}</span>
                  <span style={{ fontSize: '20px', transition: 'transform 0.3s', transform: openFaq === i ? 'rotate(45deg)' : 'none' }}>+</span>
                </button>
                {openFaq === i && (
                  <div className="faq-content" style={{ animation: 'fadeIn 0.3s ease' }}>
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== SECTION 11: SECOND OPINION CTA ===== */}
      <section className="section">
        <div className="container" style={{ maxWidth: '900px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            <div className="card card--accent" style={{ padding: '32px' }}>
              <h3 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '12px', color: 'var(--gray-900)' }}>🩺 Get a Second Opinion</h3>
              <p style={{ fontSize: '14px', color: 'var(--gray-500)', lineHeight: 1.8, marginBottom: '20px' }}>
                Not sure about your diagnosis or treatment plan? Our senior specialists provide comprehensive second opinions — both in-person and via telemedicine — with detailed written reports and recommendations.
              </p>
              <Link href={`/book?speciality=${encodeURIComponent(speciality.name)}`} className="btn btn-primary" style={{ width: '100%' }}>Request Second Opinion →</Link>
            </div>
            <div className="card" style={{ padding: '32px', background: 'var(--accent-glow)' }}>
              <h3 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '12px', color: 'var(--accent-dark)' }}>🌍 International Patient?</h3>
              <p style={{ fontSize: '14px', color: 'var(--gray-600)', lineHeight: 1.8, marginBottom: '20px' }}>
                We serve patients from 50+ countries with end-to-end support — medical visa, airport pickup, language interpreters, accommodation, and a dedicated coordinator throughout your stay.
              </p>
              <Link href="/international-patients" className="btn btn-outline" style={{ width: '100%' }}>Learn About International Services →</Link>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FINAL CTA BANNER ===== */}
      <section className="cta-banner">
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <h2>Ready to Consult a {speciality.name} Specialist?</h2>
          <p style={{ maxWidth: '600px', margin: '0 auto 24px' }}>
            Book a consultation with India&apos;s top {speciality.name.toLowerCase()} specialists. Same-day appointments available. Video consultations also offered.
          </p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href={`/book?speciality=${encodeURIComponent(speciality.name)}`} className="btn btn-white btn-lg">📅 Book Appointment</Link>
            <a href="tel:+911244141414" className="btn btn-outline btn-lg" style={{ borderColor: 'rgba(255,255,255,0.3)', color: 'white' }}>📞 Call +91-124-4141414</a>
            <Link href="/doctors" className="btn btn-outline btn-lg" style={{ borderColor: 'rgba(255,255,255,0.3)', color: 'white' }}>👨‍⚕️ Find a Doctor</Link>
          </div>
        </div>
      </section>
    </>
  );
}

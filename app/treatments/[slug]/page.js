'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { getTreatmentContent } from '../../../lib/treatmentContent';

function getInitials(name) {
  return name.replace('Dr. ', '').split(' ').map(w => w[0]).join('').slice(0, 2);
}
function getAvatarColor(name) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return `hsl(${Math.abs(hash) % 360}, 55%, 45%)`;
}

export default function TreatmentDetailPage() {
  const { slug } = useParams();
  const [treatment, setTreatment] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openFaq, setOpenFaq] = useState(null);

  useEffect(() => {
    Promise.all([
      fetch(`/api/treatments/${slug}`).then(r => r.ok ? r.json() : null),
      fetch('/api/doctors').then(r => r.ok ? r.json() : []),
    ]).then(([treat, allDocs]) => {
      if (treat) {
        setTreatment(treat);
        const validDocs = Array.isArray(allDocs) ? allDocs : [];
        setDoctors(validDocs.filter(d => d.speciality === treat.speciality));

        // Dynamic client-side SEO update
        // Meta Title
        document.title = treat.metaTitle || `${treat.name} Treatment in India - Cost & Doctors | Vivek Hospital`;
        
        // Meta Description
        let metaDesc = document.querySelector('meta[name="description"]');
        if (!metaDesc) {
          metaDesc = document.createElement('meta');
          metaDesc.setAttribute('name', 'description');
          document.head.appendChild(metaDesc);
        }
        metaDesc.setAttribute('content', treat.metaDescription || `Access world-class ${treat.name} treatment at Vivek Hospital. View costs, success rates, and bypass specialists.`);

        // Meta Keywords
        let metaKeys = document.querySelector('meta[name="keywords"]');
        if (!metaKeys) {
          metaKeys = document.createElement('meta');
          metaKeys.setAttribute('name', 'keywords');
          document.head.appendChild(metaKeys);
        }
        metaKeys.setAttribute('content', treat.metaKeywords || `${treat.name}, cardiac sciences, surgery`);

        // Canonical URL
        let canonical = document.querySelector('link[rel="canonical"]');
        if (!canonical) {
          canonical = document.createElement('link');
          canonical.setAttribute('rel', 'canonical');
          document.head.appendChild(canonical);
        }
        canonical.setAttribute('href', treat.canonicalUrl || window.location.href);

        // Robots
        let robots = document.querySelector('meta[name="robots"]');
        if (!robots) {
          robots = document.createElement('meta');
          robots.setAttribute('name', 'robots');
          document.head.appendChild(robots);
        }
        robots.setAttribute('content', treat.robots || 'index, follow');

        // Open Graph (OG) Tags
        const ogTags = {
          'og:title': treat.ogTitle || treat.metaTitle || treat.name,
          'og:description': treat.ogDescription || treat.metaDescription || '',
          'og:image': treat.ogImage || treat.image || '',
          'og:type': 'website',
          'og:url': treat.canonicalUrl || window.location.href
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
        if (treat.schemaJson) {
          let schemaScript = document.querySelector('#schema-json-ld');
          if (!schemaScript) {
            schemaScript = document.createElement('script');
            schemaScript.setAttribute('type', 'application/ld+json');
            schemaScript.setAttribute('id', 'schema-json-ld');
            document.head.appendChild(schemaScript);
          }
          schemaScript.innerHTML = treat.schemaJson;
        }
      }
      setLoading(false);
    }).catch(err => {
      console.error("Error loading treatment details:", err);
      setLoading(false);
    });
  }, [slug]);

  if (loading) return (
    <div style={{ paddingTop: '140px', textAlign: 'center' }}>
      <div style={{ fontSize: '48px', marginBottom: '16px' }}>⏳</div>
      <p style={{ color: 'var(--gray-400)' }}>Loading treatment details...</p>
    </div>
  );

  if (!treatment) return (
    <div style={{ paddingTop: '140px', textAlign: 'center' }}>
      <div style={{ fontSize: '48px', marginBottom: '16px' }}>❌</div>
      <h2 style={{ marginBottom: '16px' }}>Treatment Not Found</h2>
      <Link href="/treatments" className="btn btn-primary">← Back to Treatments</Link>
    </div>
  );

  const content = getTreatmentContent(slug);
  const bookUrl = `/book?speciality=${encodeURIComponent(treatment.speciality)}`;

  return (
    <>
      {/* ===== HERO HEADER ===== */}
      <section className="page-header" style={{ paddingBottom: '60px' }}>
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div className="breadcrumb">
            <Link href="/">Home</Link><span className="breadcrumb-sep">/</span>
            <Link href="/treatments">Treatments</Link><span className="breadcrumb-sep">/</span>
            <span>{treatment.name}</span>
          </div>
          <Link href={`/specialities/${treatment.speciality.toLowerCase().replace(/ /g, '-')}`} className="badge" style={{ background: 'rgba(255,255,255,0.15)', color: 'white', border: '1px solid rgba(255,255,255,0.2)', marginBottom: '16px', display: 'inline-flex', fontSize: '14px', padding: '6px 16px' }}>
            {treatment.speciality} Department
          </Link>
          <h1 style={{ fontSize: '42px', marginBottom: '16px' }}>{treatment.name}</h1>
          <p style={{ maxWidth: '800px', margin: '0 auto', fontSize: '18px', opacity: 0.9, lineHeight: 1.6 }}>
            {treatment.description}
          </p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', marginTop: '32px' }}>
            <Link href={bookUrl} className="btn btn-white btn-lg">📅 Book Consultation</Link>
            <a href="tel:+911244141414" className="btn btn-outline btn-lg" style={{ borderColor: 'rgba(255,255,255,0.3)', color: 'white' }}>📞 Call Now</a>
          </div>
        </div>
      </section>

      {/* ===== TWO COLUMN LAYOUT ===== */}
      <section className="section">
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '40px' }}>
            
            {/* LEFT COLUMN: MAIN CONTENT */}
            <div>
              {/* Overview from DB */}
              <div className="card" style={{ padding: '32px', marginBottom: '24px' }}>
                <div className="section-eyebrow" style={{ marginBottom: '12px' }}>📋 About The Procedure</div>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '24px', fontWeight: 700, marginBottom: '20px', color: 'var(--gray-900)' }}>
                  Overview of {treatment.name}
                </h2>
                <div 
                  style={{ fontSize: '15px', color: 'var(--gray-600)', lineHeight: 1.8 }}
                  dangerouslySetInnerHTML={{ __html: treatment.overview }}
                />
              </div>

              {/* Rich Content: Procedure Details */}
              <div className="card" style={{ padding: '32px', marginBottom: '24px' }}>
                <div className="section-eyebrow" style={{ marginBottom: '12px' }}>🔬 Medical Excellence</div>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '24px', fontWeight: 700, marginBottom: '20px', color: 'var(--gray-900)' }}>
                  How the Procedure is Performed
                </h2>
                <div style={{ fontSize: '15px', color: 'var(--gray-600)', lineHeight: 1.8 }}>
                  {content.procedureDetails.split('\n\n').map((para, i) => {
                    const parts = para.split(/\*\*(.*?)\*\*/g);
                    return (
                      <p key={i} style={{ marginBottom: '16px' }}>
                        {parts.map((part, j) => j % 2 === 1 ? <strong key={j} style={{ color: 'var(--gray-800)' }}>{part}</strong> : part)}
                      </p>
                    );
                  })}
                </div>
              </div>

              {/* Symptoms & Causes (From DB) */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
                {treatment.symptoms && (
                  <div className="card" style={{ padding: '24px' }}>
                    <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '16px', color: 'var(--gray-900)' }}>⚠️ Common Symptoms</h3>
                    <ul style={{ listStyle: 'none', padding: 0 }}>
                      {treatment.symptoms.split(', ').map((item, j) => (
                        <li key={j} style={{ padding: '8px 0', borderBottom: '1px solid var(--gray-100)', fontSize: '14px', color: 'var(--gray-600)', display: 'flex', gap: '10px' }}>
                          <span style={{ color: 'var(--accent)' }}>•</span> <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {treatment.causes && (
                  <div className="card" style={{ padding: '24px' }}>
                    <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '16px', color: 'var(--gray-900)' }}>🔍 Root Causes</h3>
                    <ul style={{ listStyle: 'none', padding: 0 }}>
                      {treatment.causes.split(', ').map((item, j) => (
                        <li key={j} style={{ padding: '8px 0', borderBottom: '1px solid var(--gray-100)', fontSize: '14px', color: 'var(--gray-600)', display: 'flex', gap: '10px' }}>
                          <span style={{ color: 'var(--accent)' }}>•</span> <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Rich Content: Preparation & Recovery */}
              <div className="card" style={{ padding: '32px', marginBottom: '24px' }}>
                <div className="section-eyebrow" style={{ marginBottom: '12px' }}>🗺️ Patient Journey</div>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '24px', fontWeight: 700, marginBottom: '24px', color: 'var(--gray-900)' }}>
                  Preparation & Recovery
                </h2>
                
                <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--gray-800)', marginBottom: '12px' }}>Pre-Procedure Preparation</h3>
                <div style={{ fontSize: '15px', color: 'var(--gray-600)', lineHeight: 1.8, marginBottom: '24px' }}>
                  {content.preparation.split('\n').map((line, i) => {
                    const parts = line.split(/\*\*(.*?)\*\*/g);
                    return (
                      <div key={i} style={{ marginBottom: '8px', display: 'flex', gap: '8px' }}>
                        {parts.map((part, j) => j % 2 === 1 ? <strong key={j} style={{ color: 'var(--gray-800)' }}>{part}</strong> : part)}
                      </div>
                    );
                  })}
                </div>

                <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--gray-800)', marginBottom: '12px', borderTop: '1px solid var(--gray-100)', paddingTop: '24px' }}>Post-Procedure Recovery</h3>
                <div style={{ fontSize: '15px', color: 'var(--gray-600)', lineHeight: 1.8 }}>
                  {content.recovery.split('\n\n').map((para, i) => {
                    const parts = para.split(/\*\*(.*?)\*\*/g);
                    return (
                      <p key={i} style={{ marginBottom: '16px' }}>
                        {parts.map((part, j) => j % 2 === 1 ? <strong key={j} style={{ color: 'var(--gray-800)' }}>{part}</strong> : part)}
                      </p>
                    );
                  })}
                </div>
              </div>

              {/* Doctors Section */}
              {doctors.length > 0 && (
                <div style={{ marginTop: '48px', marginBottom: '48px' }}>
                  <div className="section-header" style={{ textAlign: 'left', marginLeft: 0 }}>
                    <div className="section-eyebrow">👨‍⚕️ Specialists</div>
                    <h2 className="section-title">Doctors for {treatment.name}</h2>
                    <p className="section-subtitle">Our renowned {treatment.speciality} specialists performing this procedure.</p>
                  </div>
                  <div className="grid" style={{ gridTemplateColumns: 'repeat(2, 1fr)' }}>
                    {doctors.slice(0, 4).map(doc => (
                      <div key={doc.id} className="card" style={{ display: 'flex', gap: '16px', padding: '16px' }}>
                        <div style={{
                          width: '64px', height: '64px', borderRadius: '12px', flexShrink: 0,
                          background: `linear-gradient(135deg, ${getAvatarColor(doc.name)}, ${getAvatarColor(doc.name + 'x')})`,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: '24px', fontWeight: 800, color: 'white', fontFamily: 'var(--font-display)',
                        }}>{getInitials(doc.name)}</div>
                        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                          <h4 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--gray-900)', marginBottom: '4px' }}>{doc.name}</h4>
                          <p style={{ fontSize: '12px', color: 'var(--gray-500)', marginBottom: '8px' }}>{doc.designation}</p>
                          <Link href={`/doctors/${doc.slug}`} className="btn btn-outline btn-sm" style={{ alignSelf: 'flex-start', padding: '4px 12px', fontSize: '12px' }}>View Profile</Link>
                        </div>
                      </div>
                    ))}
                  </div>
                  {doctors.length > 4 && (
                    <div style={{ marginTop: '16px' }}>
                      <Link href="/doctors" className="btn btn-ghost">View All {treatment.speciality} Doctors →</Link>
                    </div>
                  )}
                </div>
              )}

              {/* FAQs Section */}
              <div className="card" style={{ padding: '32px' }}>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '24px', fontWeight: 700, marginBottom: '24px', color: 'var(--gray-900)' }}>
                  Frequently Asked Questions
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {content.faqs.map((faq, i) => (
                    <div key={i} className="faq-item" style={{ borderColor: openFaq === i ? 'var(--accent)' : undefined }}>
                      <button className="faq-trigger" onClick={() => setOpenFaq(openFaq === i ? null : i)} style={{ color: openFaq === i ? 'var(--accent)' : undefined }}>
                        <span>{faq.q}</span>
                        <span style={{ fontSize: '20px', transition: 'transform 0.3s', transform: openFaq === i ? 'rotate(45deg)' : 'none' }}>+</span>
                      </button>
                      {openFaq === i && <div className="faq-content" style={{ animation: 'fadeIn 0.3s ease' }}>{faq.a}</div>}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: SIDEBAR */}
            <div>
              <div className="card card--accent" style={{ padding: '32px', marginBottom: '24px', position: 'sticky', top: '100px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '16px', color: 'var(--gray-900)' }}>📅 Book Consultation</h3>
                <p style={{ fontSize: '14px', color: 'var(--gray-500)', lineHeight: 1.7, marginBottom: '20px' }}>
                  Consult our {treatment.speciality} specialists for expert evaluation and a personalized treatment plan for {treatment.name}.
                </p>
                <Link href={bookUrl} className="btn btn-primary" style={{ width: '100%', marginBottom: '12px' }}>Book Appointment →</Link>
                <div style={{ textAlign: 'center', margin: '12px 0', color: 'var(--gray-400)', fontSize: '13px' }}>or</div>
                <a href="tel:+911244141414" className="btn btn-outline" style={{ width: '100%' }}>📞 Call +91-124-4141414</a>
              </div>

              <div className="card" style={{ padding: '24px', marginBottom: '24px' }}>
                <h4 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '16px' }}>🏥 Available At</h4>
                {['Gurugram', 'Lucknow', 'Noida', 'Patna', 'Indore'].map((loc, i) => (
                  <Link key={i} href={`/locations/${loc.toLowerCase()}`} style={{ display: 'block', padding: '10px 0', fontSize: '14px', color: 'var(--gray-600)', borderBottom: i < 4 ? '1px solid var(--gray-100)' : 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '18px' }}>🏥</span> Vivek Hospital, {loc}
                  </Link>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ===== CTA BANNER ===== */}
      <section className="cta-banner">
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <h2>Need an Expert Opinion on {treatment.name}?</h2>
          <p>Get a comprehensive second opinion from India&apos;s top {treatment.speciality.toLowerCase()} specialists.</p>
          <Link href={bookUrl} className="btn btn-white btn-lg">📅 Consult Now</Link>
        </div>
      </section>
    </>
  );
}

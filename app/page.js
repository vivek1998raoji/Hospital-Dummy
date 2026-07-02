import prisma from '@/lib/prisma';
import Link from 'next/link';



function getInitials(name) {
  return name.replace('Dr. ', '').split(' ').map(w => w[0]).join('').slice(0, 2);
}

function getAvatarColor(name) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return `hsl(${Math.abs(hash) % 360}, 55%, 45%)`;
}

// DYNAMIC SEO INTEGRATION FROM DATABASE Page MODEL (slug: 'home')
export async function generateMetadata() {
  try {
    const page = await prisma.page.findUnique({
      where: { slug: 'home' }
    });
    if (page) {
      return {
        title: page.metaTitle || "Marengo Asia Hospitals - India's Most Trusted Hospital Network",
        description: page.metaDescription || "India's leading super-speciality hospital network offering world-class care.",
        keywords: page.metaKeywords || "hospital, healthcare, cardiac care, bypass surgery"
      };
    }
  } catch (e) {
    // Fallback
  }
  return {
    title: "Marengo Asia Hospitals - India's Most Trusted Hospital Network",
    description: "Marengo Asia Hospitals is India's leading multi-super-speciality hospital network with 1600+ beds, 800+ doctors, and 45+ specialities across 6 locations.",
    keywords: "hospital, healthcare, cardiac surgery, neurosurgery, cancer treatment, organ transplant, India"
  };
}

export default async function Home() {
  const [specialities, doctors, locations, testimonials] = await Promise.all([
    prisma.speciality.findMany({ where: { featured: true }, take: 10 }),
    prisma.doctor.findMany({ where: { featured: true }, take: 8 }),
    prisma.location.findMany(),
    prisma.testimonial.findMany({ where: { featured: true }, take: 3 }),
  ]);

  const quickServices = [
    { icon: '👨‍⚕️', title: 'Find a Doctor', desc: 'Search our 800+ specialists', link: '/doctors' },
    { icon: '📅', title: 'Book Appointment', desc: 'Schedule your visit online', link: '/book' },
    { icon: '🩺', title: 'Health Checkup', desc: 'Preventive health packages', link: '/health-checkups' },
    { icon: '🚑', title: 'Emergency', desc: '24/7 trauma & critical care', link: '/patient-services' },
    { icon: '📋', title: 'Second Opinion', desc: 'Expert medical review', link: '/patient-services' },
    { icon: '💻', title: 'Telemedicine', desc: 'Video consult from home', link: '/patient-services' },
  ];

  return (
    <>
      {/* ===== HERO ===== */}
      <section className="hero" style={{ paddingBottom: '60px' }}>
        <div className="container">
          <div className="hero-content">
            <div className="section-eyebrow section-eyebrow--light" style={{ marginBottom: '20px' }}>
              🏆 India&apos;s #1 Multi-Super-Speciality Hospital Network
            </div>
            <h1>
              World-Class Healthcare,{' '}
              <span className="hero-accent">Personalized for You</span>
            </h1>
            <p>
              Experience clinical excellence backed by cutting-edge technology, compassionate care,
              and India&apos;s most trusted team of 800+ renowned doctors across 30+ specialities.
            </p>
            <div className="hero-actions">
              <Link href="/book" className="btn btn-primary btn-lg">📅 Book Appointment</Link>
              <Link href="/doctors" className="btn btn-white btn-lg">👨‍⚕️ Find a Doctor</Link>
            </div>
          </div>
          <div className="hero-stats">
            <div className="hero-stat">
              <div className="hero-stat-number">1600+</div>
              <div className="hero-stat-label">Hospital Beds</div>
            </div>
            <div className="hero-stat">
              <div className="hero-stat-number">800+</div>
              <div className="hero-stat-label">Expert Doctors</div>
            </div>
            <div className="hero-stat">
              <div className="hero-stat-number">30+</div>
              <div className="hero-stat-label">Specialities</div>
            </div>
            <div className="hero-stat">
              <div className="hero-stat-number">25+</div>
              <div className="hero-stat-label">Years Legacy</div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== QUICK SERVICES ===== */}
      <section style={{ marginTop: '-50px', position: 'relative', zIndex: 10 }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '16px' }}>
            {quickServices.map((s, i) => (
              <Link href={s.link} key={i} className="card card--interactive" style={{ textAlign: 'center', padding: '24px 16px' }}>
                <div style={{ fontSize: '32px', marginBottom: '10px' }}>{s.icon}</div>
                <h3 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--gray-900)', marginBottom: '4px' }}>{s.title}</h3>
                <p style={{ fontSize: '12px', color: 'var(--gray-500)' }}>{s.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FEATURED SPECIALITIES ===== */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <div className="section-eyebrow">🏅 Our Expertise</div>
            <h2 className="section-title">Centres of Clinical Excellence</h2>
            <p className="section-subtitle">
              Comprehensive care across 30+ super-specialities, powered by India&apos;s leading medical experts and advanced technology
            </p>
          </div>
          <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))' }}>
            {specialities.map((spec) => (
              <Link href={`/specialities/${spec.slug}`} key={spec.id} className="speciality-card">
                <div className="speciality-icon">{spec.icon}</div>
                <h3>{spec.name}</h3>
                <p style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {spec.description}
                </p>
              </Link>
            ))}
          </div>
          <div className="text-center" style={{ marginTop: '32px' }}>
            <Link href="/specialities" className="btn btn-outline">View All 30+ Specialities →</Link>
          </div>
        </div>
      </section>

      {/* ===== WHY CHOOSE US ===== */}
      <section className="section section--alt">
        <div className="container">
          <div className="section-header">
            <div className="section-eyebrow">💎 Why Choose Us</div>
            <h2 className="section-title">India&apos;s Most Trusted Hospital Network</h2>
            <p className="section-subtitle">Setting global benchmarks in clinical outcomes, patient safety, and compassionate care</p>
          </div>
          <div className="grid-4 grid">
            {[
              { icon: '🤖', title: 'Robotic Surgery', desc: '10,000+ robotic surgeries with the da Vinci Xi system across multiple specialities' },
              { icon: '🫀', title: 'Organ Transplant', desc: '3,500+ liver transplants — the largest program in the world with 95% success rate' },
              { icon: '🏆', title: 'Global Recognition', desc: 'Ranked among Newsweek\'s World\'s Best Hospitals and NABH & JCI accredited' },
              { icon: '🌍', title: 'International Care', desc: 'Serving patients from 50+ countries with dedicated international patient services' },
              { icon: '🔬', title: 'Research & Innovation', desc: '500+ clinical trials and cutting-edge research programs advancing medical science' },
              { icon: '👶', title: 'Neonatal Excellence', desc: '80-bed NICU saving premature babies as small as 500 grams with 92% survival' },
              { icon: '❤️', title: 'Heart Care Leaders', desc: '48,000+ open-heart surgeries and India\'s first robotic cardiac surgery program' },
              { icon: '🧠', title: 'Neuro Excellence', desc: 'CyberKnife radiosurgery, awake craniotomy, and 20,000+ brain surgeries performed' },
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

      {/* ===== FEATURED DOCTORS ===== */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <div className="section-eyebrow">👨‍⚕️ Meet Our Experts</div>
            <h2 className="section-title">India&apos;s Most Trusted Doctors</h2>
            <p className="section-subtitle">
              Our team of 800+ specialists brings decades of experience and global expertise to every patient interaction
            </p>
          </div>
          <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
            {doctors.map((doc) => (
              <Link href={`/doctors/${doc.slug}`} key={doc.id} className="doctor-card">
                <div style={{
                  height: '200px',
                  background: `linear-gradient(135deg, ${getAvatarColor(doc.name)}, ${getAvatarColor(doc.name + 'x')})`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '56px',
                  fontWeight: 800,
                  color: 'rgba(255,255,255,0.9)',
                  fontFamily: 'var(--font-display)',
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
                    <span className="badge badge--green">{doc.location}</span>
                    <span className="badge badge--purple">{doc.experience}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          <div className="text-center" style={{ marginTop: '32px' }}>
            <Link href="/doctors" className="btn btn-outline">View All 800+ Doctors →</Link>
          </div>
        </div>
      </section>

      {/* ===== OUR HOSPITALS ===== */}
      <section className="section section--alt">
        <div className="container">
          <div className="section-header">
            <div className="section-eyebrow">🏥 Our Network</div>
            <h2 className="section-title">Hospitals Across India</h2>
            <p className="section-subtitle">
              A growing network of super-speciality hospitals bringing world-class healthcare closer to you
            </p>
          </div>
          <div className="grid-3 grid">
            {locations.map((loc) => (
              <Link href={`/locations/${loc.slug}`} key={loc.id} className="card card--interactive" style={{ padding: '28px', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                {loc.image && (
                  <div style={{ width: '100%', height: '160px', overflow: 'hidden', borderRadius: 'var(--radius-md) var(--radius-md) 0 0', margin: '-28px -28px 16px -28px' }}>
                    <img src={loc.image} alt={loc.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                )}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                  {!loc.image && (
                    <div style={{
                      width: '52px', height: '52px', borderRadius: 'var(--radius-md)',
                      background: 'var(--accent-glow)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '24px'
                    }}>🏥</div>
                  )}
                  <div>
                    <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--gray-900)' }}>Marengo Asia Hospitals, {loc.name}</h3>
                    <span className="badge badge--accent" style={{ marginTop: '4px' }}>{loc.beds} Beds</span>
                  </div>
                </div>
                <p style={{ fontSize: '14px', color: 'var(--gray-500)', lineHeight: 1.6, marginBottom: '12px', flex: 1 }}>
                  {loc.address}
                </p>
                <p style={{ fontSize: '13px', color: 'var(--accent)', fontWeight: 600, marginTop: 'auto' }}>
                  📞 {loc.phone}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ===== STATS STRIP ===== */}
      <div className="stats-strip">
        <div className="container">
          <div className="stats-grid">
            {[
              {
                num: '1,00,000+',
                label: 'Patients Treated',
                color: 'rgba(56, 189, 248, 0.15)',
                stroke: '#38bdf8',
                icon: (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="stat-svg">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                )
              },
              {
                num: '50,000+',
                label: 'Surgeries Performed',
                color: 'rgba(16, 185, 129, 0.15)',
                stroke: '#10b981',
                icon: (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="stat-svg">
                    <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                  </svg>
                )
              },
              {
                num: '3,500+',
                label: 'Liver Transplants',
                color: 'rgba(245, 158, 11, 0.15)',
                stroke: '#f59e0b',
                icon: (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="stat-svg">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    <path d="M12 8v8" />
                    <path d="M8 12h8" />
                  </svg>
                )
              },
              {
                num: '25,000+',
                label: 'Heart Surgeries',
                color: 'rgba(239, 68, 68, 0.15)',
                stroke: '#ef4444',
                icon: (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="stat-svg">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                  </svg>
                )
              },
              {
                num: '10,000+',
                label: 'Robotic Surgeries',
                color: 'rgba(168, 85, 247, 0.15)',
                stroke: '#a855f7',
                icon: (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="stat-svg">
                    <rect x="3" y="11" width="18" height="10" rx="2" />
                    <circle cx="12" cy="5" r="2" />
                    <path d="M12 7v4" />
                    <line x1="8" y1="16" x2="8" y2="16.01" />
                    <line x1="16" y1="16" x2="16" y2="16.01" />
                  </svg>
                )
              },
              {
                num: '50+',
                label: 'Countries Served',
                color: 'rgba(6, 182, 212, 0.15)',
                stroke: '#06b6d4',
                icon: (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="stat-svg">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="2" y1="12" x2="22" y2="12" />
                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                  </svg>
                )
              }
            ].map((s, i) => (
              <div key={i} className="stat-item">
                <div className="stat-icon-wrapper" style={{ background: s.color, color: s.stroke, boxShadow: `0 8px 20px ${s.color}` }}>
                  {s.icon}
                </div>
                <div className="stat-number">{s.num}</div>
                <div className="stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ===== PATIENT TESTIMONIALS ===== */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <div className="section-eyebrow">💬 Patient Stories</div>
            <h2 className="section-title">Trusted by Millions</h2>
            <p className="section-subtitle">Real stories from real patients who found hope, healing, and world-class care at Marengo Asia Hospitals</p>
          </div>
          <div className="grid-3 grid">
            {testimonials.map((t) => (
              <div key={t.id} className="testimonial-card">
                <div className="testimonial-stars" style={{ marginBottom: '16px' }}>
                  {'★'.repeat(t.rating)}
                </div>
                <p style={{ fontSize: '14px', color: 'var(--gray-600)', lineHeight: 1.8, marginBottom: '20px', fontStyle: 'italic' }}>
                  &ldquo;{t.content}&rdquo;
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', borderTop: '1px solid var(--gray-100)', paddingTop: '16px' }}>
                  <div className="testimonial-avatar" style={{
                    background: `linear-gradient(135deg, ${getAvatarColor(t.patient)}, ${getAvatarColor(t.patient + 'z')})`,
                    fontSize: '16px',
                  }}>
                    {t.patient.split(' ').map(w => w[0]).join('')}
                  </div>
                  <div>
                    <p style={{ fontWeight: 700, fontSize: '14px', color: 'var(--gray-900)' }}>{t.patient}</p>
                    <p style={{ fontSize: '12px', color: 'var(--gray-400)' }}>{t.location}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center" style={{ marginTop: '32px' }}>
            <Link href="/patient-stories" className="btn btn-outline">Read More Patient Stories →</Link>
          </div>
        </div>
      </section>

      {/* ===== CTA BANNER ===== */}
      <section className="cta-banner">
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <h2>Your Health Journey Begins Here</h2>
          <p>
            Book a consultation with India&apos;s top specialists. Same-day appointments available
            across all our hospitals.
          </p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/book" className="btn btn-white btn-lg">📅 Book Appointment</Link>
            <a href="tel:+911244141414" className="btn btn-outline btn-lg" style={{ borderColor: 'rgba(255,255,255,0.3)', color: 'white' }}>
              📞 Call +91-124-4141414
            </a>
          </div>
        </div>
      </section>
    </>
  );
}

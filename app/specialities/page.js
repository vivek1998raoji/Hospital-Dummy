import prisma from '@/lib/prisma';
import Link from 'next/link';



export default async function SpecialitiesPage() {
  const specialities = await prisma.speciality.findMany({ orderBy: { featured: 'desc' } });
  const featured = specialities.filter(s => s.featured);
  const others = specialities.filter(s => !s.featured);

  return (
    <>
      <section className="page-header">
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div className="breadcrumb">
            <Link href="/">Home</Link><span className="breadcrumb-sep">/</span><span>Specialities</span>
          </div>
          <h1>Our Specialities</h1>
          <p>30+ super-specialities delivering world-class clinical outcomes powered by India&apos;s finest medical experts</p>
        </div>
      </section>

      {/* Featured Specialities */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <div className="section-eyebrow">⭐ Featured</div>
            <h2 className="section-title">Centres of Excellence</h2>
            <p className="section-subtitle">Our flagship specialities with India&apos;s best outcomes and global recognition</p>
          </div>
          <div className="grid-3 grid">
            {featured.map(spec => (
              <Link href={`/specialities/${spec.slug}`} key={spec.id} className="card card--interactive" style={{ padding: '32px', textAlign: 'center' }}>
                <div style={{
                  width: '80px', height: '80px', borderRadius: 'var(--radius-lg)',
                  background: 'var(--accent-glow)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '36px', margin: '0 auto 16px',
                }}>{spec.icon}</div>
                <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--gray-900)', marginBottom: '8px' }}>{spec.name}</h3>
                <p style={{ fontSize: '14px', color: 'var(--gray-500)', lineHeight: 1.7 }}>{spec.description}</p>
                <span className="btn btn-ghost btn-sm" style={{ marginTop: '12px' }}>Learn More →</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* All Specialities */}
      <section className="section section--alt">
        <div className="container">
          <div className="section-header">
            <div className="section-eyebrow">🏥 All Specialities</div>
            <h2 className="section-title">Complete Medical Expertise</h2>
          </div>
          <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))' }}>
            {others.map(spec => (
              <Link href={`/specialities/${spec.slug}`} key={spec.id} className="speciality-card">
                <div className="speciality-icon">{spec.icon}</div>
                <h3>{spec.name}</h3>
                <p style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{spec.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <div className="stats-strip">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-item"><div className="stat-number">30+</div><div className="stat-label">Specialities</div></div>
            <div className="stat-item"><div className="stat-number">800+</div><div className="stat-label">Doctors</div></div>
            <div className="stat-item"><div className="stat-number">6</div><div className="stat-label">Hospitals</div></div>
            <div className="stat-item"><div className="stat-number">1600+</div><div className="stat-label">Beds</div></div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <section className="cta-banner">
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <h2>Looking for a Specialist?</h2>
          <p>Book a consultation with India&apos;s top specialists across 30+ super-specialities</p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
            <Link href="/doctors" className="btn btn-white btn-lg">Find a Doctor</Link>
            <Link href="/book" className="btn btn-outline btn-lg" style={{ borderColor: 'rgba(255,255,255,0.3)', color: 'white' }}>Book Appointment</Link>
          </div>
        </div>
      </section>
    </>
  );
}

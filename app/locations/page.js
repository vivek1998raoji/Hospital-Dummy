import prisma from '@/lib/prisma';
import Link from 'next/link';



// DYNAMIC SEO INTEGRATION FROM DATABASE Page MODEL (slug: 'locations')
export async function generateMetadata() {
  try {
    const page = await prisma.page.findUnique({
      where: { slug: 'locations' }
    });
    if (page) {
      return {
        title: page.metaTitle || "Our Hospital Network - Marengo Asia Hospitals",
        description: page.metaDescription || "Find a Marengo Asia Hospitals near you. Over 6 multi-super-speciality branches across India.",
        keywords: page.metaKeywords || "hospital locations, medical branches, vivek hospital gurugram"
      };
    }
  } catch (e) {
    // Fallback
  }
  return {
    title: "Our Hospital Network - Marengo Asia Hospitals",
    description: "A growing network of super-speciality hospitals across India, bringing world-class healthcare closer to you.",
    keywords: "hospital, healthcare, cardiac surgery, neurosurgery, cancer treatment, organ transplant, India, Gurugram"
  };
}

export default async function LocationsPage() {
  const locations = await prisma.location.findMany();

  return (
    <>
      <section className="page-header">
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div className="breadcrumb"><Link href="/">Home</Link><span className="breadcrumb-sep">/</span><span>Our Hospitals</span></div>
          <h1>Our Hospital Network</h1>
          <p>A growing network of super-speciality hospitals across India, bringing world-class healthcare closer to you</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-header">
            <div className="section-eyebrow">🏥 {locations.length} Hospitals</div>
            <h2 className="section-title">Hospitals Across India</h2>
          </div>
          <div className="grid-3 grid">
            {locations.map(loc => (
              <Link href={`/locations/${loc.slug}`} key={loc.id} className="card card--interactive" style={{ padding: '32px', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                {loc.image && (
                  <div style={{ width: '100%', height: '180px', overflow: 'hidden', borderRadius: 'var(--radius-md) var(--radius-md) 0 0', margin: '-32px -32px 16px -32px' }}>
                    <img src={loc.image} alt={loc.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                )}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                  {!loc.image && (
                    <div style={{
                      width: '64px', height: '64px', borderRadius: 'var(--radius-lg)',
                      background: 'var(--accent-glow)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '28px',
                    }}>🏥</div>
                  )}
                  <div>
                    <h3 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--gray-900)' }}>
                      Marengo Asia Hospitals, {loc.name}
                    </h3>
                    <span className="badge badge--accent" style={{ marginTop: '4px' }}>{loc.beds} Beds</span>
                  </div>
                </div>
                
                <p style={{ fontSize: '14px', color: 'var(--gray-500)', lineHeight: 1.7, marginBottom: '12px' }}>{loc.address}</p>
                <p style={{ fontSize: '14px', color: 'var(--gray-500)', lineHeight: 1.7, marginBottom: '12px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', flex: 1 }}>{loc.description}</p>
                <div style={{ display: 'flex', gap: '8px', marginTop: 'auto', paddingTop: '12px' }}>
                  <span style={{ fontSize: '13px', color: 'var(--accent)', fontWeight: 600 }}>📞 {loc.phone}</span>
                </div>
                <span className="btn btn-ghost btn-sm" style={{ marginTop: '12px', padding: '4px 0' }}>View Details →</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <div className="stats-strip">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-item"><div className="stat-number">6</div><div className="stat-label">Hospitals</div></div>
            <div className="stat-item"><div className="stat-number">3,400+</div><div className="stat-label">Total Beds</div></div>
            <div className="stat-item"><div className="stat-number">5</div><div className="stat-label">States</div></div>
            <div className="stat-item"><div className="stat-number">800+</div><div className="stat-label">Doctors</div></div>
          </div>
        </div>
      </div>

      <section className="cta-banner">
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <h2>Find a Hospital Near You</h2>
          <p>Get world-class healthcare at any of our 6 super-speciality hospitals across India</p>
          <Link href="/book" className="btn btn-white btn-lg">📅 Book Appointment</Link>
        </div>
      </section>
    </>
  );
}

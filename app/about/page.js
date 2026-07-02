import prisma from '@/lib/prisma';
import Link from 'next/link';



// DYNAMIC SEO INTEGRATION FROM DATABASE Page MODEL (slug: 'about')
export async function generateMetadata() {
  try {
    const page = await prisma.page.findUnique({
      where: { slug: 'about' }
    });
    if (page) {
      return {
        title: page.metaTitle || "About Marengo Asia Hospitals - Transforming Lives Since 2000",
        description: page.metaDescription || "Learn about our clinical legacy, founders, leadership, and medical milestones.",
        keywords: page.metaKeywords || "about us, medical legacy, hospital history"
      };
    }
  } catch (e) {
    // Fallback
  }
  return {
    title: "About Marengo Asia Hospitals",
    description: "India's most trusted healthcare institution — transforming lives through clinical excellence since 2000",
    keywords: "about us, medical group, Dr Naresh Trehan, hospital history"
  };
}

export default async function AboutPage() {
  // Query dynamic page copy from database
  let dbPage = null;
  try {
    dbPage = await prisma.page.findUnique({
      where: { slug: 'about' }
    });
  } catch (e) {
    // Fallback
  }

  let content = {
    introTitle: "A Vision for World-Class Healthcare in India",
    introParagraph: "Founded in 2000 by Dr. Naresh Trehan, one of the world's most accomplished cardiovascular surgeons, Marengo Asia Hospitals was born from a singular vision: to create a healthcare institution in India that matches and exceeds the best hospitals in the world. What started as a single hospital in Gurugram has grown into India's most trusted multi-super-speciality hospital network spanning 6 cities with over 3,400 beds, 800+ doctors, and 30+ specialities."
  };

  if (dbPage && dbPage.content) {
    try {
      content = JSON.parse(dbPage.content);
    } catch (e) {
      // Fallback
    }
  }

  const leaders = [
    { name: 'Dr. Naresh Trehan', role: 'Chairman & Managing Director', icon: '👨‍⚕️', color: '#007dc6', bio: 'World-renowned cardiovascular surgeon and founder of Marengo Asia Hospitals. Padma Bhushan awardee with 48+ years of experience.' },
    { name: 'Mr. Rajiv Kumar', role: 'Chief Executive Officer', icon: '👔', color: '#6366f1', bio: 'Seasoned healthcare administrator with 25+ years of experience in hospital management and strategic growth.' },
    { name: 'Dr. Sanjay Sharma', role: 'Medical Director', icon: '🩺', color: '#10b981', bio: 'Leading physician overseeing clinical quality, patient safety, and medical governance across all hospital locations.' },
    { name: 'Ms. Priya Mehta', role: 'Chief Operating Officer', icon: '📊', color: '#f59e0b', bio: 'Experienced operations leader driving efficiency, technology adoption, and patient experience transformation.' },
  ];

  const awards = [
    { icon: '🏆', title: 'Newsweek World\'s Best', desc: 'Ranked among the World\'s Best Hospitals by Newsweek for 5 consecutive years' },
    { icon: '🏅', title: 'NABH Accredited', desc: 'National Accreditation Board for Hospitals — highest quality standards certification' },
    { icon: '🌟', title: 'JCI Accredited', desc: 'Joint Commission International — global gold standard in healthcare accreditation' },
    { icon: '🏥', title: 'NABL Certified Labs', desc: 'All diagnostic laboratories certified by National Accreditation Board for Testing' },
    { icon: '🤖', title: 'Robotic Surgery Pioneer', desc: 'India\'s first and largest robotic surgery program with 10,000+ procedures' },
    { icon: '🫀', title: 'World Record Transplants', desc: 'World\'s largest liver transplant program with 3,500+ successful transplants' },
  ];

  const milestones = [
    { year: '2000', event: 'Marengo Asia Hospitals founded in Gurugram with a vision to bring world-class healthcare to India' },
    { year: '2005', event: 'Completed 10,000th cardiac surgery. Launched India\'s first robotic surgery program.' },
    { year: '2010', event: 'Expanded to Lucknow. Crossed 1,000 liver transplants — a global milestone.' },
    { year: '2015', event: 'Opened Patna and Indore hospitals. Launched CyberKnife cancer treatment program.' },
    { year: '2020', event: 'Opened Noida super-speciality hospital. Led COVID-19 response in North India.' },
    { year: '2024', event: 'Crossed 3,500 liver transplants. Ranked in Newsweek\'s World\'s Best Hospitals for 5th year.' },
  ];

  return (
    <>
      <section className="page-header">
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div className="breadcrumb"><Link href="/">Home</Link><span className="breadcrumb-sep">/</span><span>About Us</span></div>
          <h1>About Marengo Asia Hospitals</h1>
          <p>India&apos;s most trusted healthcare institution — transforming lives through clinical excellence since 2000</p>
        </div>
      </section>

      {/* Our Story - Dynamic content from database Page model */}
      <section className="section">
        <div className="container" style={{ maxWidth: '900px' }}>
          <div className="section-header" style={{ textAlign: 'left', marginLeft: 0, maxWidth: '100%' }}>
            <div className="section-eyebrow">📖 Our Story</div>
            <h2 className="section-title">{content.introTitle}</h2>
          </div>
          <div style={{ fontSize: '15px', color: 'var(--gray-600)', lineHeight: 1.9 }}>
            {content.introParagraph.split('\n\n').map((para, i) => (
              <p key={i} style={{ marginBottom: '16px' }}>{para}</p>
            ))}
          </div>
        </div>
      </section>

      {/* Chairman's Message */}
      <section className="section section--alt">
        <div className="container" style={{ maxWidth: '900px' }}>
          <div className="card card--accent" style={{ padding: '40px' }}>
            <div className="section-eyebrow" style={{ marginBottom: '20px' }}>💬 Chairman&apos;s Message</div>
            <blockquote style={{ fontSize: '18px', fontFamily: 'var(--font-display)', color: 'var(--gray-800)', lineHeight: 1.7, fontStyle: 'italic', marginBottom: '24px' }}>
              &ldquo;Our vision was never just to build a hospital. It was to create an institution that would set new
              benchmarks in clinical outcomes, drive medical innovation, and most importantly, give hope to millions
              of patients who deserve world-class healthcare regardless of where they come from.&rdquo;
            </blockquote>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{
                width: '56px', height: '56px', borderRadius: 'var(--radius-full)',
                background: 'linear-gradient(135deg, #007dc6, #6366f1)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '22px', fontWeight: 800, color: 'white',
              }}>NT</div>
              <div>
                <p style={{ fontWeight: 700, color: 'var(--gray-900)' }}>Dr. Naresh Trehan</p>
                <p style={{ fontSize: '13px', color: 'var(--gray-500)' }}>Chairman & Managing Director, Marengo Asia Hospitals</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Leadership */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <div className="section-eyebrow">👥 Leadership</div>
            <h2 className="section-title">Our Leadership Team</h2>
            <p className="section-subtitle">Visionary leaders driving clinical excellence and healthcare innovation</p>
          </div>
          <div className="grid-4 grid">
            {leaders.map((leader, i) => (
              <div key={i} className="card" style={{ textAlign: 'center', padding: '32px' }}>
                <div style={{
                  width: '80px', height: '80px', borderRadius: 'var(--radius-full)',
                  background: `linear-gradient(135deg, ${leader.color}, ${leader.color}88)`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '32px', margin: '0 auto 16px',
                }}>{leader.icon}</div>
                <h3 style={{ fontSize: '17px', fontWeight: 700, color: 'var(--gray-900)', marginBottom: '4px' }}>{leader.name}</h3>
                <p style={{ fontSize: '13px', color: 'var(--accent)', fontWeight: 600, marginBottom: '12px' }}>{leader.role}</p>
                <p style={{ fontSize: '13px', color: 'var(--gray-500)', lineHeight: 1.7 }}>{leader.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Awards */}
      <section className="section section--alt">
        <div className="container">
          <div className="section-header">
            <div className="section-eyebrow">🏆 Recognition</div>
            <h2 className="section-title">Awards & Accreditations</h2>
          </div>
          <div className="grid-3 grid">
            {awards.map((award, i) => (
              <div key={i} className="feature-card">
                <div className="feature-icon">{award.icon}</div>
                <h3>{award.title}</h3>
                <p>{award.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Infrastructure Stats */}
      <div className="stats-strip">
        <div className="container">
          <div className="stats-grid">
            {[
              { num: '43', label: 'Acres Campus' }, { num: '3,400+', label: 'Hospital Beds' },
              { num: '45+', label: 'Operation Theatres' }, { num: '300+', label: 'ICU Beds' },
              { num: '800+', label: 'Doctors' }, { num: '10,000+', label: 'Staff' },
            ].map((s, i) => (
              <div key={i} className="stat-item"><div className="stat-number">{s.num}</div><div className="stat-label">{s.label}</div></div>
            ))}
          </div>
        </div>
      </div>

      {/* Milestones */}
      <section className="section">
        <div className="container" style={{ maxWidth: '800px' }}>
          <div className="section-header">
            <div className="section-eyebrow">📅 Our Journey</div>
            <h2 className="section-title">Key Milestones</h2>
          </div>
          {milestones.map((m, i) => (
            <div key={i} className="timeline-item">
              <div className="timeline-date">
                <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--accent)' }}>{m.year}</div>
              </div>
              <div>
                <p style={{ fontSize: '15px', color: 'var(--gray-600)', lineHeight: 1.7 }}>{m.event}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CSR */}
      <section className="section section--alt">
        <div className="container" style={{ maxWidth: '900px' }}>
          <div className="section-header">
            <div className="section-eyebrow">💚 CSR & Community</div>
            <h2 className="section-title">Giving Back to the Community</h2>
          </div>
          <div className="grid-3 grid">
            {[
              { icon: '❤️', title: 'Free Surgeries', desc: 'Over 10,000 free surgeries performed for underprivileged patients through our charitable arm.' },
              { icon: '🏥', title: 'Health Camps', desc: 'Regular health screening camps in rural areas, covering 500+ villages annually.' },
              { icon: '🎓', title: 'Medical Education', desc: 'Training the next generation through our medical college, nursing school, and research programs.' },
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
          <h2>Be Part of Our Mission</h2>
          <p>Join India&apos;s most trusted hospital network and help transform healthcare</p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
            <Link href="/careers" className="btn btn-white btn-lg">Explore Careers</Link>
            <Link href="/contact" className="btn btn-outline btn-lg" style={{ borderColor: 'rgba(255,255,255,0.3)', color: 'white' }}>Contact Us</Link>
          </div>
        </div>
      </section>
    </>
  );
}

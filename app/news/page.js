import Link from 'next/link';

export default function NewsPage() {
  const news = [
    { date: 'May 2024', title: 'Vivek Hospital Ranked in Newsweek\'s World\'s Best Hospitals 2024', excerpt: 'For the 5th consecutive year, Vivek Hospital has been recognized among the World\'s Best Hospitals by Newsweek magazine, the only Indian hospital to achieve this distinction.', category: 'Award' },
    { date: 'Apr 2024', title: 'Vivek Hospital Completes 3,500th Liver Transplant', excerpt: 'A historic milestone as Vivek Hospital\'s liver transplant team, led by Dr. A. S. Soin, completes their 3,500th liver transplant — the largest program globally.', category: 'Milestone' },
    { date: 'Mar 2024', title: 'Launch of AI-Powered Cancer Screening Program', excerpt: 'Vivek Hospital introduces artificial intelligence-based cancer screening that can detect early-stage cancers with 95% accuracy, reducing diagnosis time by 60%.', category: 'Innovation' },
    { date: 'Feb 2024', title: 'Robotic Surgery Program Crosses 10,000 Procedures', excerpt: 'India\'s first and largest robotic surgery program at Vivek Hospital achieves the landmark of 10,000 robotic-assisted surgeries across 8 specialities.', category: 'Milestone' },
    { date: 'Jan 2024', title: 'Free Heart Surgery Camp Benefits 500 Children', excerpt: 'In partnership with charitable foundations, Vivek Hospital conducted free heart surgeries for 500 children from underprivileged families across India.', category: 'CSR' },
    { date: 'Dec 2023', title: 'International Medical Conference on Organ Transplantation', excerpt: 'Vivek Hospital hosted the International Conference on Multi-Organ Transplantation, bringing together 300+ transplant surgeons from 25 countries.', category: 'Event' },
    { date: 'Nov 2023', title: 'Vivek Hospital Noida Celebrates 3rd Anniversary', excerpt: 'The Noida facility marks three successful years of operations with over 50,000 patients treated and 5,000 surgeries performed.', category: 'Milestone' },
    { date: 'Oct 2023', title: 'Launch of Comprehensive Stroke Program', excerpt: 'New 24/7 stroke response program with mechanical thrombectomy capability, achieving door-to-needle time under 30 minutes — best in India.', category: 'Innovation' },
  ];

  return (
    <>
      <section className="page-header">
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div className="breadcrumb"><Link href="/">Home</Link><span className="breadcrumb-sep">/</span><span>News & Events</span></div>
          <h1>News & Events</h1>
          <p>Stay updated with the latest news, achievements, and events from Vivek Hospital</p>
        </div>
      </section>

      <section className="section">
        <div className="container" style={{ maxWidth: '900px' }}>
          {news.map((item, i) => (
            <div key={i} className="card" style={{ padding: '28px', marginBottom: '16px', display: 'flex', gap: '24px', alignItems: 'flex-start' }}>
              <div style={{ minWidth: '80px', textAlign: 'center', flexShrink: 0 }}>
                <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--accent)', background: 'var(--accent-glow)', padding: '8px 12px', borderRadius: 'var(--radius-sm)' }}>
                  {item.date}
                </div>
              </div>
              <div>
                <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                  <span className="badge badge--accent">{item.category}</span>
                </div>
                <h3 style={{ fontSize: '17px', fontWeight: 700, color: 'var(--gray-900)', marginBottom: '8px', lineHeight: 1.4 }}>{item.title}</h3>
                <p style={{ fontSize: '14px', color: 'var(--gray-500)', lineHeight: 1.7 }}>{item.excerpt}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="cta-banner">
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <h2>Stay Connected</h2>
          <p>Follow us on social media for the latest updates and health tips</p>
          <Link href="/contact" className="btn btn-white btn-lg">📧 Subscribe to Newsletter</Link>
        </div>
      </section>
    </>
  );
}

'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function CareersPage() {
  const [careers, setCareers] = useState([]);
  const [deptFilter, setDeptFilter] = useState('');
  const [locFilter, setLocFilter] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/careers').then(r => r.json()).then(d => { setCareers(d); setLoading(false); });
  }, []);

  const departments = [...new Set(careers.map(c => c.department))].sort();
  const locations = [...new Set(careers.map(c => c.location))].sort();
  const filtered = careers.filter(c => (!deptFilter || c.department === deptFilter) && (!locFilter || c.location === locFilter));

  const values = [
    { icon: '🚀', title: 'Growth', desc: 'Continuous learning with access to global medical conferences, research opportunities, and leadership programs' },
    { icon: '💡', title: 'Innovation', desc: 'Work with cutting-edge technology including robotic surgery, AI diagnostics, and advanced medical equipment' },
    { icon: '❤️', title: 'Impact', desc: 'Touch millions of lives by being part of India\'s most trusted hospital network serving patients from 50+ countries' },
    { icon: '🤝', title: 'Culture', desc: 'A collaborative, inclusive environment that values teamwork, respect, and work-life balance for all team members' },
  ];

  return (
    <>
      <section className="page-header">
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div className="breadcrumb"><Link href="/">Home</Link><span className="breadcrumb-sep">/</span><span>Careers</span></div>
          <h1>Careers at Marengo Asia Hospitals</h1>
          <p>Join India&apos;s most trusted hospital network and make a difference in healthcare every day</p>
        </div>
      </section>

      {/* Why Join */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <div className="section-eyebrow">🌟 Why Join Us</div>
            <h2 className="section-title">Why Work at Marengo Asia Hospitals?</h2>
          </div>
          <div className="grid-4 grid">
            {values.map((v, i) => (
              <div key={i} className="feature-card">
                <div className="feature-icon">{v.icon}</div>
                <h3>{v.title}</h3>
                <p>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <div className="stats-strip">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-item"><div className="stat-number">10,000+</div><div className="stat-label">Employees</div></div>
            <div className="stat-item"><div className="stat-number">6</div><div className="stat-label">Locations</div></div>
            <div className="stat-item"><div className="stat-number">30+</div><div className="stat-label">Departments</div></div>
            <div className="stat-item"><div className="stat-number">800+</div><div className="stat-label">Doctors</div></div>
          </div>
        </div>
      </div>

      {/* Job Listings */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <div className="section-eyebrow">💼 Open Positions</div>
            <h2 className="section-title">Current Job Openings</h2>
          </div>

          {/* Filters */}
          <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' }}>
            <select className="form-select" style={{ width: '200px' }} value={deptFilter} onChange={e => setDeptFilter(e.target.value)}>
              <option value="">All Departments</option>
              {departments.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
            <select className="form-select" style={{ width: '160px' }} value={locFilter} onChange={e => setLocFilter(e.target.value)}>
              <option value="">All Locations</option>
              {locations.map(l => <option key={l} value={l}>{l}</option>)}
            </select>
            {(deptFilter || locFilter) && (
              <button className="btn btn-outline btn-sm" onClick={() => { setDeptFilter(''); setLocFilter(''); }}>Clear</button>
            )}
          </div>

          {loading ? <p>Loading...</p> : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {filtered.map(job => (
                <div key={job.id} className="card" style={{ padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontSize: '17px', fontWeight: 700, color: 'var(--gray-900)', marginBottom: '6px' }}>{job.title}</h3>
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '8px' }}>
                      <span className="badge badge--blue">{job.department}</span>
                      <span className="badge badge--green">{job.location}</span>
                      <span className="badge badge--purple">{job.type}</span>
                      <span className="badge badge--gray">{job.experience}</span>
                    </div>
                    <p style={{ fontSize: '13px', color: 'var(--gray-500)', lineHeight: 1.7 }}>{job.description}</p>
                  </div>
                  <button className="btn btn-primary btn-sm" onClick={() => alert(`Application for "${job.title}" submitted! We will contact you soon.`)}>
                    Apply Now →
                  </button>
                </div>
              ))}
              {filtered.length === 0 && <div className="text-center" style={{ padding: '40px' }}><p style={{ color: 'var(--gray-400)' }}>No openings match your filters. Try different criteria.</p></div>}
            </div>
          )}
        </div>
      </section>

      <section className="cta-banner">
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <h2>Don&apos;t See the Right Role?</h2>
          <p>Send us your resume and we&apos;ll reach out when a matching position opens</p>
          <Link href="/contact" className="btn btn-white btn-lg">📧 Contact HR</Link>
        </div>
      </section>
    </>
  );
}

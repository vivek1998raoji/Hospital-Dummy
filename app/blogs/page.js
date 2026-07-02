'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function BlogsPage() {
  const [blogs, setBlogs] = useState([]);
  const [filter, setFilter] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/blogs').then(r => r.json()).then(d => { setBlogs(d); setLoading(false); });
  }, []);

  const categories = [...new Set(blogs.map(b => b.category))].sort();
  const filtered = filter ? blogs.filter(b => b.category === filter) : blogs;
  const featured = blogs.find(b => b.featured);

  return (
    <>
      <section className="page-header">
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div className="breadcrumb"><Link href="/">Home</Link><span className="breadcrumb-sep">/</span><span>Health Library</span></div>
          <h1>Health Library</h1>
          <p>Expert health articles, tips, and medical insights from India&apos;s top doctors</p>
        </div>
      </section>

      {/* Featured Blog */}
      {featured && !filter && (
        <section style={{ marginTop: '-30px', position: 'relative', zIndex: 10 }}>
          <div className="container">
            <Link href={`/blogs/${featured.slug}`} className="card card--interactive card--elevated" style={{ padding: '40px', display: 'flex', gap: '32px', alignItems: 'center' }}>
              <div style={{ width: '120px', height: '120px', borderRadius: 'var(--radius-lg)', background: 'var(--gradient-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '48px', flexShrink: 0 }}>📝</div>
              <div>
                <span className="badge badge--accent" style={{ marginBottom: '8px' }}>⭐ Featured</span>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '24px', fontWeight: 700, color: 'var(--gray-900)', marginBottom: '8px' }}>{featured.title}</h2>
                <p style={{ fontSize: '14px', color: 'var(--gray-500)', lineHeight: 1.7, marginBottom: '8px' }}>{featured.excerpt}</p>
                <p style={{ fontSize: '13px', color: 'var(--gray-400)' }}>By {featured.author} · {featured.category}</p>
              </div>
            </Link>
          </div>
        </section>
      )}

      {/* Category Filter */}
      <section className="section" style={{ paddingBottom: '0' }}>
        <div className="container">
          <div className="filter-bar">
            <button className={`btn btn-sm ${!filter ? 'btn-primary' : 'btn-outline'}`} onClick={() => setFilter('')}>All</button>
            {categories.map(c => (
              <button key={c} className={`btn btn-sm ${filter === c ? 'btn-primary' : 'btn-outline'}`} onClick={() => setFilter(c)}>{c}</button>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Grid */}
      <section className="section" style={{ paddingTop: '24px' }}>
        <div className="container">
          {loading ? <div className="text-center" style={{ padding: '60px' }}><p style={{ color: 'var(--gray-400)' }}>Loading articles...</p></div> : (
            <div className="grid-3 grid">
              {filtered.map(blog => (
                <Link href={`/blogs/${blog.slug}`} key={blog.id} className="card card--interactive" style={{ padding: '0', overflow: 'hidden' }}>
                  <div style={{ height: '160px', background: `linear-gradient(135deg, hsl(${blog.title.length * 17 % 360}, 50%, 50%), hsl(${blog.title.length * 37 % 360}, 50%, 60%))`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '40px' }}>📰</div>
                  <div style={{ padding: '24px' }}>
                    <span className="badge badge--blue" style={{ marginBottom: '10px' }}>{blog.category}</span>
                    <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--gray-900)', marginBottom: '8px', lineHeight: 1.4 }}>{blog.title}</h3>
                    <p style={{ fontSize: '13px', color: 'var(--gray-500)', lineHeight: 1.7, marginBottom: '12px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{blog.excerpt}</p>
                    <p style={{ fontSize: '12px', color: 'var(--gray-400)' }}>By {blog.author}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="cta-banner">
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <h2>Have a Health Question?</h2>
          <p>Consult our specialists for personalized medical advice</p>
          <Link href="/book" className="btn btn-white btn-lg">📅 Book Consultation</Link>
        </div>
      </section>
    </>
  );
}

'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function BlogDetailPage() {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/blogs/${slug}`)
      .then(r => r.ok ? r.json() : null)
      .then(d => {
        setBlog(d);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error loading blog:", err);
        setLoading(false);
      });
  }, [slug]);

  if (loading) return <div style={{ paddingTop: '140px', textAlign: 'center' }}><p>Loading...</p></div>;
  if (!blog) return <div style={{ paddingTop: '140px', textAlign: 'center' }}><h2>Article not found</h2><Link href="/blogs" className="btn btn-primary" style={{ marginTop: '16px' }}>← Back to Health Library</Link></div>;

  return (
    <>
      <section className="page-header">
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div className="breadcrumb">
            <Link href="/">Home</Link><span className="breadcrumb-sep">/</span>
            <Link href="/blogs">Health Library</Link><span className="breadcrumb-sep">/</span>
            <span>{blog.title}</span>
          </div>
          <span className="badge" style={{ background: 'rgba(255,255,255,0.15)', color: 'white', border: '1px solid rgba(255,255,255,0.2)', marginBottom: '12px', display: 'inline-flex' }}>{blog.category}</span>
          <h1 style={{ maxWidth: '700px', margin: '0 auto' }}>{blog.title}</h1>
          <p style={{ marginTop: '16px' }}>By <strong>{blog.author}</strong></p>
        </div>
      </section>

      <section className="section">
        <div className="container" style={{ maxWidth: '760px' }}>
          <div className="card" style={{ padding: '48px' }}>
            <p style={{ fontSize: '18px', color: 'var(--gray-700)', lineHeight: 1.8, fontStyle: 'italic', marginBottom: '24px', borderLeft: '4px solid var(--accent)', paddingLeft: '20px' }}>
              {blog.excerpt}
            </p>
            <div style={{ fontSize: '16px', color: 'var(--gray-600)', lineHeight: 2 }}>
              {blog.content.split('. ').reduce((acc, sentence, i) => {
                if (i > 0 && i % 3 === 0) {
                  acc.push(<br key={`br-${i}`} />, <br key={`br2-${i}`} />);
                }
                acc.push(sentence + '. ');
                return acc;
              }, [])}
            </div>
          </div>

          {/* Share */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginTop: '32px' }}>
            <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--gray-500)', paddingTop: '8px' }}>Share:</span>
            {['Facebook', 'Twitter', 'LinkedIn', 'WhatsApp'].map((s, i) => (
              <button key={i} className="btn btn-outline btn-sm">{s}</button>
            ))}
          </div>
        </div>
      </section>

      <section className="cta-banner">
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <h2>Need Medical Advice?</h2>
          <p>Consult our specialists for personalized guidance on your health concerns</p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
            <Link href="/book" className="btn btn-white btn-lg">📅 Book Consultation</Link>
            <Link href="/blogs" className="btn btn-outline btn-lg" style={{ borderColor: 'rgba(255,255,255,0.3)', color: 'white' }}>More Articles</Link>
          </div>
        </div>
      </section>
    </>
  );
}

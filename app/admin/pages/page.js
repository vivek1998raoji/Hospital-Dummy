'use client';
import { useState, useEffect } from 'react';
import RichTextEditor from '@/components/RichTextEditor';

export default function AdminPagesPage() {
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [showSeo, setShowSeo] = useState(true);

  const fetchPages = () => {
    setLoading(true);
    fetch('/api/admin/pages').then(r => r.json()).then(data => {
      setPages(data);
      setLoading(false);
    });
  };

  useEffect(() => { fetchPages(); }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    const method = editing.id ? 'PUT' : 'POST';
    const url = editing.id ? `/api/admin/pages/${editing.id}` : '/api/admin/pages';
    
    if (!editing.slug) {
      editing.slug = editing.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    }

    try {
      await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editing),
      });
      setEditing(null);
      fetchPages();
    } catch (err) {
      alert('Failed to save page');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this page?')) return;
    try {
      await fetch(`/api/admin/pages/${id}`, { method: 'DELETE' });
      fetchPages();
    } catch (err) {
      alert('Failed to delete page');
    }
  };

  if (editing) {
    let contentObj = {};
    try {
      contentObj = JSON.parse(editing.content || '{}');
    } catch (e) {
      contentObj = {};
    }

    const handleContentChange = (key, val) => {
      const updated = { ...contentObj, [key]: val };
      setEditing({ ...editing, content: JSON.stringify(updated) });
    };

    return (
      <>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: 800 }}>Edit Page: {editing.title}</h1>
          <button onClick={() => setEditing(null)} className="btn btn-outline">Cancel</button>
        </div>
        
        <form className="card" style={{ padding: '32px' }} onSubmit={handleSave}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            <div className="form-group">
              <label className="form-label">Page Title (Internal Reference) *</label>
              <input className="form-input" required value={editing.title || ''} onChange={e => setEditing({...editing, title: e.target.value})} placeholder="About Us" />
            </div>
            <div className="form-group">
              <label className="form-label">Slug (URL Route) *</label>
              <input className="form-input" required value={editing.slug || ''} onChange={e => setEditing({...editing, slug: e.target.value})} placeholder="about" disabled={['home', 'about', 'contact', 'careers', 'international-patients'].includes(editing.slug)} />
              <span style={{ fontSize: '11px', color: 'var(--gray-400)' }}>Standard core page slugs are locked.</span>
            </div>

            {/* Dynamic Content Editor Section */}
            <div className="form-group" style={{ gridColumn: '1 / -1', borderTop: '1px solid var(--gray-100)', paddingTop: '24px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '8px', color: 'var(--gray-900)' }}>📄 Editable Page Content Elements</h3>
              <p style={{ fontSize: '13px', color: 'var(--gray-500)', marginBottom: '20px' }}>Modify the dynamic text copy displayed on the frontend of this page.</p>
              
              <div style={{ display: 'grid', gap: '20px' }}>
                {Object.keys(contentObj).length === 0 ? (
                  <p style={{ fontStyle: 'italic', color: 'var(--gray-400)', fontSize: '14px' }}>No dynamic content blocks registered for this page. Add fields or use raw JSON.</p>
                ) : (
                  Object.keys(contentObj).map(key => {
                    const label = key
                      .replace(/([A-Z])/g, ' $1')
                      .replace(/^./, str => str.toUpperCase());
                    const isLongText = contentObj[key].length > 60 || key.toLowerCase().includes('paragraph') || key.toLowerCase().includes('sub') || key.toLowerCase().includes('text') || key.toLowerCase().includes('desc');
                    return (
                      <div className="form-group" key={key}>
                        <label className="form-label" style={{ fontWeight: 600 }}>{label}</label>
                        {isLongText ? (
                          <RichTextEditor value={contentObj[key]} onChange={val => handleContentChange(key, val)} />
                        ) : (
                          <input className="form-input" value={contentObj[key]} onChange={e => handleContentChange(key, e.target.value)} />
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* SEO Panel */}
            <div className="form-group" style={{ gridColumn: '1 / -1', borderTop: '1px solid var(--gray-100)', paddingTop: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--gray-900)' }}>🔍 Advanced On-Page Search Engine Optimization (SEO)</h3>
                <button type="button" onClick={() => setShowSeo(!showSeo)} className="btn btn-ghost btn-sm">{showSeo ? 'Hide Panel' : 'Show Panel'}</button>
              </div>
              
              {showSeo && (
                <div className="card" style={{ padding: '28px', background: 'var(--gray-50)', display: 'grid', gap: '20px', border: '1px solid var(--gray-200)' }}>
                  
                  {/* Basic SEO */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                      <label className="form-label">SEO Meta Title</label>
                      <input className="form-input" value={editing.metaTitle || ''} onChange={e => setEditing({...editing, metaTitle: e.target.value})} placeholder="Title visible in browser tab and search engines" />
                    </div>
                    <div className="form-group">
                      <label className="form-label">SEO Meta Keywords</label>
                      <input className="form-input" value={editing.metaKeywords || ''} onChange={e => setEditing({...editing, metaKeywords: e.target.value})} placeholder="comma, separated, keywords" />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Canonical URL</label>
                      <input className="form-input" value={editing.canonicalUrl || ''} onChange={e => setEditing({...editing, canonicalUrl: e.target.value})} placeholder="https://vivekhospital.com/your-page-slug" />
                    </div>
                    <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                      <label className="form-label">SEO Meta Description</label>
                      <textarea className="form-input" rows="2" value={editing.metaDescription || ''} onChange={e => setEditing({...editing, metaDescription: e.target.value})} placeholder="Summarize the page content to capture organic search traffic" />
                    </div>
                  </div>

                  {/* Open Graph (OG) Social Tags */}
                  <div style={{ borderTop: '1px dashed var(--gray-300)', paddingTop: '20px' }}>
                    <h4 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--gray-700)', marginBottom: '12px' }}>🌐 Social Sharing (Open Graph Tags)</h4>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                      <div className="form-group">
                        <label className="form-label">OG Title</label>
                        <input className="form-input" value={editing.ogTitle || ''} onChange={e => setEditing({...editing, ogTitle: e.target.value})} placeholder="Facebook / Twitter Share Title" />
                      </div>
                      <div className="form-group">
                        <label className="form-label">OG Image URL</label>
                        <input className="form-input" value={editing.ogImage || ''} onChange={e => setEditing({...editing, ogImage: e.target.value})} placeholder="Link to preview image (1200x630px)" />
                      </div>
                      <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                        <label className="form-label">OG Description</label>
                        <textarea className="form-input" rows="2" value={editing.ogDescription || ''} onChange={e => setEditing({...editing, ogDescription: e.target.value})} placeholder="Facebook / Twitter Share Description" />
                      </div>
                    </div>
                  </div>

                  {/* Technical & Schema Tags */}
                  <div style={{ borderTop: '1px dashed var(--gray-300)', paddingTop: '20px', display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '16px' }}>
                    <div className="form-group">
                      <label className="form-label">Structured Data Schema (JSON-LD)</label>
                      <textarea className="form-input" rows="5" value={editing.schemaJson || ''} onChange={e => setEditing({...editing, schemaJson: e.target.value})} placeholder='{"@context": "https://schema.org", "@type": "MedicalOrganization", ...}' style={{ fontFamily: 'monospace', fontSize: '12px' }} />
                      <span style={{ fontSize: '11px', color: 'var(--gray-400)' }}>Provide clean JSON-LD for rich snippet results.</span>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Search Indexing (Robots Tag)</label>
                      <select className="form-select" value={editing.robots || 'index, follow'} onChange={e => setEditing({...editing, robots: e.target.value})}>
                        <option value="index, follow">Index, Follow (Default)</option>
                        <option value="noindex, follow">Noindex, Follow (Hide from search, trace links)</option>
                        <option value="index, nofollow">Index, Nofollow (Show in search, ignore links)</option>
                        <option value="noindex, nofollow">Noindex, Nofollow (Completely private)</option>
                      </select>
                      <span style={{ fontSize: '11px', color: 'var(--gray-400)', display: 'block', marginTop: '6px' }}>Instruct crawl bots on how to handle indexing this page.</span>
                    </div>
                  </div>

                </div>
              )}
            </div>
          </div>
          <div style={{ marginTop: '32px', display: 'flex', gap: '16px' }}>
            <button type="submit" className="btn btn-primary btn-lg">Save Page</button>
          </div>
        </form>
      </>
    );
  }

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '32px', fontWeight: 800, color: 'var(--gray-900)' }}>Manage Static & Other Pages</h1>
          <p style={{ color: 'var(--gray-500)' }}>Modify content copy and customize SEO parameters for standard pages</p>
        </div>
        <button onClick={() => setEditing({ content: '{}' })} className="btn btn-primary">+ Create Custom Page</button>
      </div>

      <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead style={{ background: 'var(--gray-50)' }}>
            <tr>
              <th style={{ padding: '16px 24px', color: 'var(--gray-600)', fontWeight: 600, fontSize: '13px', textTransform: 'uppercase' }}>Page</th>
              <th style={{ padding: '16px 24px', color: 'var(--gray-600)', fontWeight: 600, fontSize: '13px', textTransform: 'uppercase' }}>Route Slug</th>
              <th style={{ padding: '16px 24px', color: 'var(--gray-600)', fontWeight: 600, fontSize: '13px', textTransform: 'uppercase' }}>SEO Title</th>
              <th style={{ padding: '16px 24px', color: 'var(--gray-600)', fontWeight: 600, fontSize: '13px', textTransform: 'uppercase', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="4" style={{ padding: '40px', textAlign: 'center' }}>Loading...</td></tr>
            ) : pages.map(page => (
              <tr key={page.id} style={{ borderTop: '1px solid var(--gray-100)' }}>
                <td style={{ padding: '16px 24px' }}>
                  <div style={{ fontWeight: 600, color: 'var(--gray-900)' }}>{page.title}</div>
                </td>
                <td style={{ padding: '16px 24px' }}>
                  <code style={{ background: 'var(--gray-100)', padding: '4px 8px', borderRadius: 'var(--radius-sm)', fontSize: '13px', color: 'var(--gray-700)' }}>
                    {page.slug === 'home' ? '/' : `/${page.slug}`}
                  </code>
                </td>
                <td style={{ padding: '16px 24px', color: 'var(--gray-700)', fontSize: '14px' }}>
                  {page.metaTitle || <span style={{ color: 'var(--gray-400)', fontStyle: 'italic' }}>Not Configured</span>}
                </td>
                <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                  <button onClick={() => setEditing(page)} className="btn btn-ghost btn-sm" style={{ marginRight: '8px' }}>Edit Content & SEO</button>
                  {!['home', 'about', 'contact', 'careers', 'international-patients'].includes(page.slug) && (
                    <button onClick={() => handleDelete(page.id)} className="btn btn-ghost btn-sm" style={{ color: 'var(--error)' }}>Delete</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

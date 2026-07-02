'use client';
import { useState, useEffect } from 'react';
import RichTextEditor from '@/components/RichTextEditor';

export default function AdminSpecialitiesPage() {
  const [specialities, setSpecialities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [showSeo, setShowSeo] = useState(false);

  const fetchSpecialities = () => {
    setLoading(true);
    fetch('/api/specialities').then(r => r.json()).then(data => {
      setSpecialities(data);
      setLoading(false);
    });
  };

  useEffect(() => { fetchSpecialities(); }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    const method = editing.id ? 'PUT' : 'POST';
    const url = editing.id ? `/api/admin/specialities/${editing.id}` : '/api/admin/specialities';
    
    if (!editing.slug) {
      editing.slug = editing.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    }

    try {
      await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editing),
      });
      setEditing(null);
      fetchSpecialities();
    } catch (err) {
      alert('Failed to save');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this speciality?')) return;
    try {
      await fetch(`/api/admin/specialities/${id}`, { method: 'DELETE' });
      fetchSpecialities();
    } catch (err) {
      alert('Failed to delete');
    }
  };

  if (editing) {
    return (
      <>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: 800 }}>{editing.id ? 'Edit Speciality' : 'Add New Speciality'}</h1>
          <button onClick={() => setEditing(null)} className="btn btn-outline">Cancel</button>
        </div>
        
        <form className="card" style={{ padding: '32px' }} onSubmit={handleSave}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            <div className="form-group">
              <label className="form-label">Name *</label>
              <input className="form-input" required value={editing.name || ''} onChange={e => setEditing({...editing, name: e.target.value})} placeholder="Cardiac Sciences" />
            </div>
            <div className="form-group">
              <label className="form-label">Slug (URL)</label>
              <input className="form-input" value={editing.slug || ''} onChange={e => setEditing({...editing, slug: e.target.value})} placeholder="cardiac-sciences" />
            </div>
            <div className="form-group">
              <label className="form-label">Icon (Emoji) *</label>
              <input className="form-input" required value={editing.icon || ''} onChange={e => setEditing({...editing, icon: e.target.value})} placeholder="🫀" />
            </div>
            <div className="form-group">
              <label className="form-label">Image URL</label>
              <input className="form-input" value={editing.image || ''} onChange={e => setEditing({...editing, image: e.target.value})} placeholder="/images/speciality.jpg" />
            </div>
            <div className="form-group">
              <label className="form-label">Image Alt Text (SEO Accessibility)</label>
              <input className="form-input" value={editing.imageAlt || ''} onChange={e => setEditing({...editing, imageAlt: e.target.value})} placeholder="Cardiology Department medical team at Vivek Hospital" />
            </div>
            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label className="form-label">Centre Description</label>
              <RichTextEditor value={editing.description || ''} onChange={val => setEditing({...editing, description: val})} />
            </div>

            {/* Collapsible SEO Controls */}
            <div className="form-group" style={{ gridColumn: '1 / -1', borderTop: '1px solid var(--gray-100)', paddingTop: '24px' }}>
              <button type="button" onClick={() => setShowSeo(!showSeo)} className="btn btn-outline btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span>🔍</span> {showSeo ? 'Hide Advanced SEO Settings' : 'Configure Advanced On-Page SEO (OG Tags, Canonical, JSON-LD Schema)'}
              </button>
              
              {showSeo && (
                <div className="card" style={{ marginTop: '16px', padding: '28px', background: 'var(--gray-50)', display: 'grid', gap: '20px', border: '1px solid var(--gray-200)' }}>
                  
                  {/* Basic SEO */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                      <label className="form-label">SEO Meta Title</label>
                      <input className="form-input" value={editing.metaTitle || ''} onChange={e => setEditing({...editing, metaTitle: e.target.value})} placeholder="Best Cardiac Sciences Hospital in India | Vivek Hospital" />
                    </div>
                    <div className="form-group">
                      <label className="form-label">SEO Meta Keywords</label>
                      <input className="form-input" value={editing.metaKeywords || ''} onChange={e => setEditing({...editing, metaKeywords: e.target.value})} placeholder="cardiology department, bypass surgery, cardiac treatment" />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Canonical URL</label>
                      <input className="form-input" value={editing.canonicalUrl || ''} onChange={e => setEditing({...editing, canonicalUrl: e.target.value})} placeholder="https://vivekhospital.com/specialities/cardiac-sciences" />
                    </div>
                    <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                      <label className="form-label">SEO Meta Description</label>
                      <textarea className="form-input" rows="2" value={editing.metaDescription || ''} onChange={e => setEditing({...editing, metaDescription: e.target.value})} placeholder="Vivek Hospital is India's leading cardiac science centre with world-class facilities and top bypass specialists." />
                    </div>
                  </div>

                  {/* Open Graph (OG) Social Tags */}
                  <div style={{ borderTop: '1px dashed var(--gray-300)', paddingTop: '20px' }}>
                    <h4 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--gray-700)', marginBottom: '12px' }}>🌐 Social Sharing (Open Graph Tags)</h4>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                      <div className="form-group">
                        <label className="form-label">OG Title</label>
                        <input className="form-input" value={editing.ogTitle || ''} onChange={e => setEditing({...editing, ogTitle: e.target.value})} placeholder="Cardiology Department Social Share Title" />
                      </div>
                      <div className="form-group">
                        <label className="form-label">OG Image URL</label>
                        <input className="form-input" value={editing.ogImage || ''} onChange={e => setEditing({...editing, ogImage: e.target.value})} placeholder="Link to sharing card image" />
                      </div>
                      <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                        <label className="form-label">OG Description</label>
                        <textarea className="form-input" rows="2" value={editing.ogDescription || ''} onChange={e => setEditing({...editing, ogDescription: e.target.value})} placeholder="Social share description" />
                      </div>
                    </div>
                  </div>

                  {/* Technical & Schema Tags */}
                  <div style={{ borderTop: '1px dashed var(--gray-300)', paddingTop: '20px', display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '16px' }}>
                    <div className="form-group">
                      <label className="form-label">Structured Data Schema (JSON-LD)</label>
                      <textarea className="form-input" rows="5" value={editing.schemaJson || ''} onChange={e => setEditing({...editing, schemaJson: e.target.value})} placeholder='{"@context": "https://schema.org", "@type": "MedicalBusiness", ...}' style={{ fontFamily: 'monospace', fontSize: '12px' }} />
                      <span style={{ fontSize: '11px', color: 'var(--gray-400)' }}>Provide custom JSON-LD for rich snippets.</span>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Search Indexing (Robots Tag)</label>
                      <select className="form-select" value={editing.robots || 'index, follow'} onChange={e => setEditing({...editing, robots: e.target.value})}>
                        <option value="index, follow">Index, Follow (Default)</option>
                        <option value="noindex, follow">Noindex, Follow</option>
                        <option value="index, nofollow">Index, Nofollow</option>
                        <option value="noindex, nofollow">Noindex, Nofollow</option>
                      </select>
                    </div>
                  </div>

                </div>
              )}
            </div>
          </div>
          <div style={{ marginTop: '32px', display: 'flex', gap: '16px' }}>
            <button type="submit" className="btn btn-primary btn-lg">Save Speciality</button>
          </div>
        </form>
      </>
    );
  }

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '32px', fontWeight: 800, color: 'var(--gray-900)' }}>Manage Specialities</h1>
          <p style={{ color: 'var(--gray-500)' }}>{specialities.length} Specialities total</p>
        </div>
        <button onClick={() => setEditing({})} className="btn btn-primary">+ Add Speciality</button>
      </div>

      <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead style={{ background: 'var(--gray-50)' }}>
            <tr>
              <th style={{ padding: '16px 24px', color: 'var(--gray-600)', fontWeight: 600, fontSize: '13px', textTransform: 'uppercase' }}>Speciality</th>
              <th style={{ padding: '16px 24px', color: 'var(--gray-600)', fontWeight: 600, fontSize: '13px', textTransform: 'uppercase' }}>Description</th>
              <th style={{ padding: '16px 24px', color: 'var(--gray-600)', fontWeight: 600, fontSize: '13px', textTransform: 'uppercase', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="3" style={{ padding: '40px', textAlign: 'center' }}>Loading...</td></tr>
            ) : specialities.map(spec => (
              <tr key={spec.id} style={{ borderTop: '1px solid var(--gray-100)' }}>
                <td style={{ padding: '16px 24px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ fontSize: '24px' }}>{spec.icon}</div>
                    <div style={{ fontWeight: 600, color: 'var(--gray-900)' }}>{spec.name}</div>
                  </div>
                </td>
                <td style={{ padding: '16px 24px', color: 'var(--gray-700)' }}>
                  {spec.description.length > 60 ? `${spec.description.slice(0, 60)}...` : spec.description}
                </td>
                <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                  <button onClick={() => setEditing(spec)} className="btn btn-ghost btn-sm" style={{ marginRight: '8px' }}>Edit</button>
                  <button onClick={() => handleDelete(spec.id)} className="btn btn-ghost btn-sm" style={{ color: 'var(--error)' }}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

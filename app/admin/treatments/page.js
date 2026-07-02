'use client';
import { useState, useEffect } from 'react';
import RichTextEditor from '@/components/RichTextEditor';

export default function AdminTreatmentsPage() {
  const [treatments, setTreatments] = useState([]);
  const [specialities, setSpecialities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [showSeo, setShowSeo] = useState(false);

  const fetchData = () => {
    setLoading(true);
    Promise.all([
      fetch('/api/treatments').then(r => r.json()),
      fetch('/api/specialities').then(r => r.json())
    ]).then(([treats, specs]) => {
      setTreatments(treats);
      setSpecialities(specs);
      setLoading(false);
    });
  };

  useEffect(() => { fetchData(); }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    const method = editing.id ? 'PUT' : 'POST';
    const url = editing.id ? `/api/admin/treatments/${editing.id}` : '/api/admin/treatments';
    
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
      fetchData();
    } catch (err) {
      alert('Failed to save');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this treatment?')) return;
    try {
      await fetch(`/api/admin/treatments/${id}`, { method: 'DELETE' });
      fetchData();
    } catch (err) {
      alert('Failed to delete');
    }
  };

  if (editing) {
    return (
      <>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: 800 }}>{editing.id ? 'Edit Treatment' : 'Add New Treatment'}</h1>
          <button onClick={() => setEditing(null)} className="btn btn-outline">Cancel</button>
        </div>
        
        <form className="card" style={{ padding: '32px' }} onSubmit={handleSave}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            <div className="form-group">
              <label className="form-label">Treatment Name *</label>
              <input className="form-input" required value={editing.name || ''} onChange={e => setEditing({...editing, name: e.target.value})} placeholder="CABG" />
            </div>
            <div className="form-group">
              <label className="form-label">Slug (URL)</label>
              <input className="form-input" value={editing.slug || ''} onChange={e => setEditing({...editing, slug: e.target.value})} placeholder="cabg" />
            </div>
            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label className="form-label">Speciality (Department) *</label>
              <select className="form-select" required value={editing.speciality || ''} onChange={e => setEditing({...editing, speciality: e.target.value})}>
                <option value="">Select Speciality</option>
                {specialities.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
              </select>
            </div>
            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label className="form-label">Short Description</label>
              <textarea className="form-input" rows="2" value={editing.description || ''} onChange={e => setEditing({...editing, description: e.target.value})}></textarea>
            </div>
            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label className="form-label">Treatment Overview (Full Article)</label>
              <RichTextEditor value={editing.overview || ''} onChange={val => setEditing({...editing, overview: val})} />
            </div>
            <div className="form-group">
              <label className="form-label">Symptoms (Comma Separated)</label>
              <textarea className="form-input" rows="3" value={editing.symptoms || ''} onChange={e => setEditing({...editing, symptoms: e.target.value})}></textarea>
            </div>
            <div className="form-group">
              <label className="form-label">Causes (Comma Separated)</label>
              <textarea className="form-input" rows="3" value={editing.causes || ''} onChange={e => setEditing({...editing, causes: e.target.value})}></textarea>
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
                      <input className="form-input" value={editing.metaTitle || ''} onChange={e => setEditing({...editing, metaTitle: e.target.value})} placeholder="CABG Bypass Surgery in India | Marengo Asia Hospitals" />
                    </div>
                    <div className="form-group">
                      <label className="form-label">SEO Meta Keywords</label>
                      <input className="form-input" value={editing.metaKeywords || ''} onChange={e => setEditing({...editing, metaKeywords: e.target.value})} placeholder="bypass surgery, heart surgery india, bypass cost" />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Canonical URL</label>
                      <input className="form-input" value={editing.canonicalUrl || ''} onChange={e => setEditing({...editing, canonicalUrl: e.target.value})} placeholder="https://marengoasiahospitals.com/treatments/cabg" />
                    </div>
                    <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                      <label className="form-label">SEO Meta Description</label>
                      <textarea className="form-input" rows="2" value={editing.metaDescription || ''} onChange={e => setEditing({...editing, metaDescription: e.target.value})} placeholder="Learn about Coronary Artery Bypass Grafting (CABG) at Marengo Asia Hospitals. Access experienced bypass surgeons, pricing packages, and advanced recovery systems." />
                    </div>
                  </div>

                  {/* Open Graph (OG) Social Tags */}
                  <div style={{ borderTop: '1px dashed var(--gray-300)', paddingTop: '20px' }}>
                    <h4 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--gray-700)', marginBottom: '12px' }}>🌐 Social Sharing (Open Graph Tags)</h4>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                      <div className="form-group">
                        <label className="form-label">OG Title</label>
                        <input className="form-input" value={editing.ogTitle || ''} onChange={e => setEditing({...editing, ogTitle: e.target.value})} placeholder="CABG Treatment Social Share Title" />
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
                      <textarea className="form-input" rows="5" value={editing.schemaJson || ''} onChange={e => setEditing({...editing, schemaJson: e.target.value})} placeholder='{"@context": "https://schema.org", "@type": "MedicalProcedure", ...}' style={{ fontFamily: 'monospace', fontSize: '12px' }} />
                      <span style={{ fontSize: '11px', color: 'var(--gray-400)' }}>Provide custom JSON-LD for rich Procedure snippet results.</span>
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
            <button type="submit" className="btn btn-primary btn-lg">Save Treatment</button>
          </div>
        </form>
      </>
    );
  }

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '32px', fontWeight: 800, color: 'var(--gray-900)' }}>Manage Treatments</h1>
          <p style={{ color: 'var(--gray-500)' }}>{treatments.length} Treatments total</p>
        </div>
        <button onClick={() => setEditing({})} className="btn btn-primary">+ Add Treatment</button>
      </div>

      <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead style={{ background: 'var(--gray-50)' }}>
            <tr>
              <th style={{ padding: '16px 24px', color: 'var(--gray-600)', fontWeight: 600, fontSize: '13px', textTransform: 'uppercase' }}>Treatment</th>
              <th style={{ padding: '16px 24px', color: 'var(--gray-600)', fontWeight: 600, fontSize: '13px', textTransform: 'uppercase' }}>Speciality</th>
              <th style={{ padding: '16px 24px', color: 'var(--gray-600)', fontWeight: 600, fontSize: '13px', textTransform: 'uppercase', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="3" style={{ padding: '40px', textAlign: 'center' }}>Loading...</td></tr>
            ) : treatments.map(treat => (
              <tr key={treat.id} style={{ borderTop: '1px solid var(--gray-100)' }}>
                <td style={{ padding: '16px 24px' }}>
                  <div style={{ fontWeight: 600, color: 'var(--gray-900)' }}>{treat.name}</div>
                </td>
                <td style={{ padding: '16px 24px', color: 'var(--gray-700)' }}>
                  <span className="badge badge--blue">{treat.speciality}</span>
                </td>
                <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                  <button onClick={() => setEditing(treat)} className="btn btn-ghost btn-sm" style={{ marginRight: '8px' }}>Edit</button>
                  <button onClick={() => handleDelete(treat.id)} className="btn btn-ghost btn-sm" style={{ color: 'var(--error)' }}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

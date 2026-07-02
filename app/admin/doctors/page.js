'use client';
import { useState, useEffect } from 'react';
import RichTextEditor from '@/components/RichTextEditor';

function getInitials(name) { return name.replace('Dr. ', '').split(' ').map(w => w[0]).join('').slice(0, 2); }
function getColor(name) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return `hsl(${Math.abs(hash) % 360}, 55%, 45%)`;
}

export default function AdminDoctorsPage() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [showSeo, setShowSeo] = useState(false);

  const fetchDoctors = () => {
    setLoading(true);
    fetch('/api/doctors').then(r => r.json()).then(data => {
      setDoctors(data);
      setLoading(false);
    });
  };

  useEffect(() => { fetchDoctors(); }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    const method = editing.id ? 'PUT' : 'POST';
    const url = editing.id ? `/api/admin/doctors/${editing.id}` : '/api/admin/doctors';
    
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
      fetchDoctors();
    } catch (err) {
      alert('Failed to save');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this doctor?')) return;
    try {
      await fetch(`/api/admin/doctors/${id}`, { method: 'DELETE' });
      fetchDoctors();
    } catch (err) {
      alert('Failed to delete');
    }
  };

  if (editing) {
    return (
      <>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: 800 }}>{editing.id ? 'Edit Doctor' : 'Add New Doctor'}</h1>
          <button onClick={() => setEditing(null)} className="btn btn-outline">Cancel</button>
        </div>
        
        <form className="card" style={{ padding: '32px' }} onSubmit={handleSave}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            <div className="form-group">
              <label className="form-label">Name *</label>
              <input className="form-input" required value={editing.name || ''} onChange={e => setEditing({...editing, name: e.target.value})} placeholder="Dr. John Doe" />
            </div>
            <div className="form-group">
              <label className="form-label">Slug (URL)</label>
              <input className="form-input" value={editing.slug || ''} onChange={e => setEditing({...editing, slug: e.target.value})} placeholder="dr-john-doe" />
            </div>
            <div className="form-group">
              <label className="form-label">Speciality *</label>
              <input className="form-input" required value={editing.speciality || ''} onChange={e => setEditing({...editing, speciality: e.target.value})} placeholder="Cardiac Sciences" />
            </div>
            <div className="form-group">
              <label className="form-label">Designation *</label>
              <input className="form-input" required value={editing.designation || ''} onChange={e => setEditing({...editing, designation: e.target.value})} placeholder="Chairman & HOD" />
            </div>
            <div className="form-group">
              <label className="form-label">Experience *</label>
              <input className="form-input" required value={editing.experience || ''} onChange={e => setEditing({...editing, experience: e.target.value})} placeholder="15 Years" />
            </div>
            <div className="form-group">
              <label className="form-label">Location *</label>
              <input className="form-input" required value={editing.location || ''} onChange={e => setEditing({...editing, location: e.target.value})} placeholder="Gurugram" />
            </div>
            <div className="form-group">
              <label className="form-label">Doctor Photo Image URL</label>
              <input className="form-input" value={editing.imageUrl || ''} onChange={e => setEditing({...editing, imageUrl: e.target.value})} placeholder="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=400&q=80" />
            </div>
            <div className="form-group">
              <label className="form-label">Image Alt Text (SEO Accessibility)</label>
              <input className="form-input" value={editing.imageAlt || ''} onChange={e => setEditing({...editing, imageAlt: e.target.value})} placeholder="Dr. John Doe - Cardiac Surgeon | Marengo Asia Hospitals" />
            </div>
            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label className="form-label">Qualifications</label>
              <input className="form-input" value={editing.qualification || ''} onChange={e => setEditing({...editing, qualification: e.target.value})} placeholder="MBBS, MD, MS" />
            </div>
            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label className="form-label">About Biography</label>
              <RichTextEditor value={editing.about || ''} onChange={val => setEditing({...editing, about: val})} />
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
                      <input className="form-input" value={editing.metaTitle || ''} onChange={e => setEditing({...editing, metaTitle: e.target.value})} placeholder="Dr. John Doe - Cardiac Surgeon in Gurugram | Marengo Asia Hospitals" />
                    </div>
                    <div className="form-group">
                      <label className="form-label">SEO Meta Keywords</label>
                      <input className="form-input" value={editing.metaKeywords || ''} onChange={e => setEditing({...editing, metaKeywords: e.target.value})} placeholder="Dr John Doe, cardiac surgeon, bypass surgery" />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Canonical URL</label>
                      <input className="form-input" value={editing.canonicalUrl || ''} onChange={e => setEditing({...editing, canonicalUrl: e.target.value})} placeholder="https://marengoasiahospitals.com/doctors/dr-john-doe" />
                    </div>
                    <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                      <label className="form-label">SEO Meta Description</label>
                      <textarea className="form-input" rows="2" value={editing.metaDescription || ''} onChange={e => setEditing({...editing, metaDescription: e.target.value})} placeholder="Book appointment with Dr. John Doe, leading Cardiac Surgeon. Over 15 years experience, pioneering modular transplants." />
                    </div>
                  </div>

                  {/* Open Graph (OG) Social Tags */}
                  <div style={{ borderTop: '1px dashed var(--gray-300)', paddingTop: '20px' }}>
                    <h4 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--gray-700)', marginBottom: '12px' }}>🌐 Social Sharing (Open Graph Tags)</h4>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                      <div className="form-group">
                        <label className="form-label">OG Title</label>
                        <input className="form-input" value={editing.ogTitle || ''} onChange={e => setEditing({...editing, ogTitle: e.target.value})} placeholder="Dr. John Doe - Cardiac Expert Share Title" />
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
                      <textarea className="form-input" rows="5" value={editing.schemaJson || ''} onChange={e => setEditing({...editing, schemaJson: e.target.value})} placeholder='{"@context": "https://schema.org", "@type": "Physician", ...}' style={{ fontFamily: 'monospace', fontSize: '12px' }} />
                      <span style={{ fontSize: '11px', color: 'var(--gray-400)' }}>Provide custom JSON-LD for rich Physician snippet results.</span>
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
            <button type="submit" className="btn btn-primary btn-lg">Save Doctor</button>
          </div>
        </form>
      </>
    );
  }

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '32px', fontWeight: 800, color: 'var(--gray-900)' }}>Manage Doctors</h1>
          <p style={{ color: 'var(--gray-500)' }}>{doctors.length} Doctors total</p>
        </div>
        <button onClick={() => setEditing({})} className="btn btn-primary">+ Add Doctor</button>
      </div>

      <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead style={{ background: 'var(--gray-50)' }}>
            <tr>
              <th style={{ padding: '16px 24px', color: 'var(--gray-600)', fontWeight: 600, fontSize: '13px', textTransform: 'uppercase' }}>Doctor</th>
              <th style={{ padding: '16px 24px', color: 'var(--gray-600)', fontWeight: 600, fontSize: '13px', textTransform: 'uppercase' }}>Speciality</th>
              <th style={{ padding: '16px 24px', color: 'var(--gray-600)', fontWeight: 600, fontSize: '13px', textTransform: 'uppercase' }}>Location</th>
              <th style={{ padding: '16px 24px', color: 'var(--gray-600)', fontWeight: 600, fontSize: '13px', textTransform: 'uppercase', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="4" style={{ padding: '40px', textAlign: 'center' }}>Loading...</td></tr>
            ) : doctors.map(doc => (
              <tr key={doc.id} style={{ borderTop: '1px solid var(--gray-100)' }}>
                <td style={{ padding: '16px 24px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    {doc.imageUrl ? (
                      <img src={doc.imageUrl} alt={doc.name} style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '50%' }} />
                    ) : (
                      <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: getColor(doc.name), color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                        {getInitials(doc.name)}
                      </div>
                    )}
                    <div>
                      <div style={{ fontWeight: 600, color: 'var(--gray-900)' }}>{doc.name}</div>
                      <div style={{ fontSize: '12px', color: 'var(--gray-500)' }}>{doc.designation}</div>
                    </div>
                  </div>
                </td>
                <td style={{ padding: '16px 24px', color: 'var(--gray-700)' }}>{doc.speciality}</td>
                <td style={{ padding: '16px 24px', color: 'var(--gray-700)' }}>{doc.location}</td>
                <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                  <button onClick={() => setEditing(doc)} className="btn btn-ghost btn-sm" style={{ marginRight: '8px' }}>Edit</button>
                  <button onClick={() => handleDelete(doc.id)} className="btn btn-ghost btn-sm" style={{ color: 'var(--error)' }}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

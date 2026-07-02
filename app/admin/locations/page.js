'use client';
import { useState, useEffect } from 'react';
import RichTextEditor from '@/components/RichTextEditor';

export default function AdminLocationsPage() {
  const [locations, setLocations] = useState([]);
  const [specialities, setSpecialities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [showSeo, setShowSeo] = useState(false);

  const fetchData = () => {
    setLoading(true);
    Promise.all([
      fetch('/api/locations').then(r => r.json()),
      fetch('/api/specialities').then(r => r.json()),
    ]).then(([locs, specs]) => {
      setLocations(locs);
      setSpecialities(specs);
      setLoading(false);
    });
  };

  useEffect(() => { fetchData(); }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    const method = editing.id ? 'PUT' : 'POST';
    const url = editing.id ? `/api/admin/locations/${editing.id}` : '/api/admin/locations';
    
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
    if (!confirm('Are you sure you want to delete this location?')) return;
    try {
      await fetch(`/api/admin/locations/${id}`, { method: 'DELETE' });
      fetchData();
    } catch (err) {
      alert('Failed to delete');
    }
  };

  const handleSpecialityToggle = (specName) => {
    const currentList = editing.specialities ? editing.specialities.split(',').map(s => s.trim()).filter(Boolean) : [];
    let newList;
    if (currentList.includes(specName)) {
      newList = currentList.filter(s => s !== specName);
    } else {
      newList = [...currentList, specName];
    }
    setEditing({ ...editing, specialities: newList.join(',') });
  };

  if (editing) {
    const selectedSpecs = editing.specialities ? editing.specialities.split(',').map(s => s.trim()).filter(Boolean) : [];

    return (
      <>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: 800 }}>{editing.id ? 'Edit Location' : 'Add New Location'}</h1>
          <button onClick={() => setEditing(null)} className="btn btn-outline">Cancel</button>
        </div>
        
        <form className="card" style={{ padding: '32px' }} onSubmit={handleSave}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            <div className="form-group">
              <label className="form-label">Hospital Name *</label>
              <input className="form-input" required value={editing.name || ''} onChange={e => setEditing({...editing, name: e.target.value})} placeholder="Noida" />
            </div>
            <div className="form-group">
              <label className="form-label">Slug (URL)</label>
              <input className="form-input" value={editing.slug || ''} onChange={e => setEditing({...editing, slug: e.target.value})} placeholder="noida" />
            </div>
            <div className="form-group">
              <label className="form-label">Phone *</label>
              <input className="form-input" required value={editing.phone || ''} onChange={e => setEditing({...editing, phone: e.target.value})} placeholder="+91-120-4141414" />
            </div>
            <div className="form-group">
              <label className="form-label">Beds *</label>
              <input className="form-input" required value={editing.beds || ''} onChange={e => setEditing({...editing, beds: e.target.value})} placeholder="350" />
            </div>
            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label className="form-label">Address *</label>
              <input className="form-input" required value={editing.address || ''} onChange={e => setEditing({...editing, address: e.target.value})} placeholder="Sector 62, Noida" />
            </div>
            <div className="form-group">
              <label className="form-label">Hospital Building Image URL</label>
              <input className="form-input" value={editing.image || ''} onChange={e => setEditing({...editing, image: e.target.value})} placeholder="https://images.unsplash.com/photo-1586773860418-d3b3da966367?auto=format&fit=crop&w=800&q=80" />
            </div>
            <div className="form-group">
              <label className="form-label">Building Image Alt Text (SEO Accessibility)</label>
              <input className="form-input" value={editing.imageAlt || ''} onChange={e => setEditing({...editing, imageAlt: e.target.value})} placeholder="Vivek Hospital Gurugram Building Front Facade" />
            </div>
            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label className="form-label">Hospital Branch Description</label>
              <RichTextEditor value={editing.description || ''} onChange={val => setEditing({...editing, description: val})} />
            </div>

            {/* Specialities checklist mapping */}
            <div className="form-group" style={{ gridColumn: '1 / -1', borderTop: '1px solid var(--gray-100)', paddingTop: '24px' }}>
              <label className="form-label" style={{ fontWeight: 700, marginBottom: '4px' }}>🏥 Specialities Available at this Branch</label>
              <p style={{ fontSize: '13px', color: 'var(--gray-500)', marginBottom: '16px' }}>Select which departments are active in this hospital building.</p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '12px' }}>
                {specialities.map(spec => {
                  const isChecked = selectedSpecs.includes(spec.name);
                  return (
                    <label key={spec.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px', border: '1px solid var(--gray-200)', borderRadius: 'var(--radius-md)', cursor: 'pointer', background: isChecked ? 'var(--accent-glow)' : 'transparent', borderColor: isChecked ? 'var(--accent)' : 'var(--gray-200)' }}>
                      <input type="checkbox" checked={isChecked} onChange={() => handleSpecialityToggle(spec.name)} style={{ width: '16px', height: '16px', accentColor: 'var(--accent)' }} />
                      <span style={{ fontSize: '14px', fontWeight: 500, color: 'var(--gray-800)' }}>{spec.icon} {spec.name}</span>
                    </label>
                  );
                })}
              </div>
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
                      <input className="form-input" value={editing.metaTitle || ''} onChange={e => setEditing({...editing, metaTitle: e.target.value})} placeholder="Best Multi-Speciality Hospital in Noida | Vivek Hospital" />
                    </div>
                    <div className="form-group">
                      <label className="form-label">SEO Meta Keywords</label>
                      <input className="form-input" value={editing.metaKeywords || ''} onChange={e => setEditing({...editing, metaKeywords: e.target.value})} placeholder="hospital in noida, heart care noida, best doctor" />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Canonical URL</label>
                      <input className="form-input" value={editing.canonicalUrl || ''} onChange={e => setEditing({...editing, canonicalUrl: e.target.value})} placeholder="https://vivekhospital.com/locations/noida" />
                    </div>
                    <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                      <label className="form-label">SEO Meta Description</label>
                      <textarea className="form-input" rows="2" value={editing.metaDescription || ''} onChange={e => setEditing({...editing, metaDescription: e.target.value})} placeholder="Consult Noida's top specialists at Vivek Hospital. Featuring state-of-the-art modular OTs, 350 beds, and certified medical packages." />
                    </div>
                  </div>

                  {/* Open Graph (OG) Social Tags */}
                  <div style={{ borderTop: '1px dashed var(--gray-300)', paddingTop: '20px' }}>
                    <h4 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--gray-700)', marginBottom: '12px' }}>🌐 Social Sharing (Open Graph Tags)</h4>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                      <div className="form-group">
                        <label className="form-label">OG Title</label>
                        <input className="form-input" value={editing.ogTitle || ''} onChange={e => setEditing({...editing, ogTitle: e.target.value})} placeholder="Vivek Hospital Noida Branch Sharing Title" />
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
                      <textarea className="form-input" rows="5" value={editing.schemaJson || ''} onChange={e => setEditing({...editing, schemaJson: e.target.value})} placeholder='{"@context": "https://schema.org", "@type": "Hospital", ...}' style={{ fontFamily: 'monospace', fontSize: '12px' }} />
                      <span style={{ fontSize: '11px', color: 'var(--gray-400)' }}>Provide custom JSON-LD for rich Hospital snippet results.</span>
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
            <button type="submit" className="btn btn-primary btn-lg">Save Location</button>
          </div>
        </form>
      </>
    );
  }

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '32px', fontWeight: 800, color: 'var(--gray-900)' }}>Manage Hospitals / Locations</h1>
          <p style={{ color: 'var(--gray-500)' }}>{locations.length} Locations total</p>
        </div>
        <button onClick={() => setEditing({ specialities: '' })} className="btn btn-primary">+ Add Location</button>
      </div>

      <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead style={{ background: 'var(--gray-50)' }}>
            <tr>
              <th style={{ padding: '16px 24px', color: 'var(--gray-600)', fontWeight: 600, fontSize: '13px', textTransform: 'uppercase' }}>Hospital Location</th>
              <th style={{ padding: '16px 24px', color: 'var(--gray-600)', fontWeight: 600, fontSize: '13px', textTransform: 'uppercase' }}>Phone</th>
              <th style={{ padding: '16px 24px', color: 'var(--gray-600)', fontWeight: 600, fontSize: '13px', textTransform: 'uppercase' }}>Beds</th>
              <th style={{ padding: '16px 24px', color: 'var(--gray-600)', fontWeight: 600, fontSize: '13px', textTransform: 'uppercase', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="4" style={{ padding: '40px', textAlign: 'center' }}>Loading...</td></tr>
            ) : locations.map(loc => (
              <tr key={loc.id} style={{ borderTop: '1px solid var(--gray-100)' }}>
                <td style={{ padding: '16px 24px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    {loc.image ? (
                      <img src={loc.image} alt={loc.name} style={{ width: '60px', height: '40px', objectFit: 'cover', borderRadius: 'var(--radius-sm)' }} />
                    ) : (
                      <div style={{ width: '60px', height: '40px', background: 'var(--accent-glow)', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>🏥</div>
                    )}
                    <div>
                      <div style={{ fontWeight: 600, color: 'var(--gray-900)' }}>{loc.name}</div>
                      <div style={{ fontSize: '12px', color: 'var(--gray-500)' }}>{loc.address}</div>
                    </div>
                  </div>
                </td>
                <td style={{ padding: '16px 24px', color: 'var(--gray-700)' }}>{loc.phone}</td>
                <td style={{ padding: '16px 24px', color: 'var(--gray-700)' }}>{loc.beds}</td>
                <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                  <button onClick={() => setEditing(loc)} className="btn btn-ghost btn-sm" style={{ marginRight: '8px' }}>Edit</button>
                  <button onClick={() => handleDelete(loc.id)} className="btn btn-ghost btn-sm" style={{ color: 'var(--error)' }}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

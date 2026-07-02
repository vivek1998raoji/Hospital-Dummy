'use client';
import { useState, useEffect } from 'react';

export default function AdminAppointmentsPage() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAppointments = () => {
    setLoading(true);
    fetch('/api/appointments').then(r => r.json()).then(data => {
      setAppointments(data);
      setLoading(false);
    });
  };

  useEffect(() => { fetchAppointments(); }, []);

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this appointment?')) return;
    try {
      await fetch(`/api/admin/appointments/${id}`, { method: 'DELETE' });
      fetchAppointments();
    } catch (err) {
      alert('Failed to delete');
    }
  };

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '32px', fontWeight: 800, color: 'var(--gray-900)' }}>Manage Appointments</h1>
          <p style={{ color: 'var(--gray-500)' }}>{appointments.length} Total Appointments</p>
        </div>
      </div>

      <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead style={{ background: 'var(--gray-50)' }}>
            <tr>
              <th style={{ padding: '16px 24px', color: 'var(--gray-600)', fontWeight: 600, fontSize: '13px', textTransform: 'uppercase' }}>Patient Info</th>
              <th style={{ padding: '16px 24px', color: 'var(--gray-600)', fontWeight: 600, fontSize: '13px', textTransform: 'uppercase' }}>Requested Date/Time</th>
              <th style={{ padding: '16px 24px', color: 'var(--gray-600)', fontWeight: 600, fontSize: '13px', textTransform: 'uppercase' }}>Department/Doctor</th>
              <th style={{ padding: '16px 24px', color: 'var(--gray-600)', fontWeight: 600, fontSize: '13px', textTransform: 'uppercase' }}>Status</th>
              <th style={{ padding: '16px 24px', color: 'var(--gray-600)', fontWeight: 600, fontSize: '13px', textTransform: 'uppercase', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="5" style={{ padding: '40px', textAlign: 'center' }}>Loading...</td></tr>
            ) : appointments.map(appt => (
              <tr key={appt.id} style={{ borderTop: '1px solid var(--gray-100)' }}>
                <td style={{ padding: '16px 24px' }}>
                  <div style={{ fontWeight: 600, color: 'var(--gray-900)' }}>{appt.name}</div>
                  <div style={{ fontSize: '12px', color: 'var(--gray-500)' }}>{appt.phone}</div>
                  <div style={{ fontSize: '12px', color: 'var(--gray-500)' }}>{appt.email}</div>
                </td>
                <td style={{ padding: '16px 24px', color: 'var(--gray-700)' }}>
                  <div>{appt.date}</div>
                  <div style={{ fontSize: '12px', color: 'var(--gray-500)' }}>{appt.time}</div>
                </td>
                <td style={{ padding: '16px 24px', color: 'var(--gray-700)' }}>
                  <div>{appt.speciality || 'General'}</div>
                  {appt.doctor && <div style={{ fontSize: '12px', color: 'var(--gray-500)' }}>Doc Slug: {appt.doctor}</div>}
                  <div style={{ fontSize: '12px', color: 'var(--accent)' }}>Loc: {appt.hospital}</div>
                </td>
                <td style={{ padding: '16px 24px' }}>
                  <span className="badge badge--green">{appt.status}</span>
                </td>
                <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                  <button onClick={() => handleDelete(appt.id)} className="btn btn-ghost btn-sm" style={{ color: 'var(--error)' }}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

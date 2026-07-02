import prisma from '@/lib/prisma';
import Link from 'next/link';


export const revalidate = 0; // Ensure fresh data on load

export default async function AdminDashboard() {
  const [docCount, specCount, treatCount, apptCount, recentAppts] = await Promise.all([
    prisma.doctor.count(),
    prisma.speciality.count(),
    prisma.treatment.count(),
    prisma.appointment.count(),
    prisma.appointment.findMany({ orderBy: { createdAt: 'desc' }, take: 5 }),
  ]);

  const stats = [
    { label: 'Total Doctors', value: docCount, icon: '👨‍⚕️', color: 'var(--accent)', link: '/admin/doctors' },
    { label: 'Total Appointments', value: apptCount, icon: '📅', color: '#10b981', link: '/admin/appointments' },
    { label: 'Specialities', value: specCount, icon: '❤️', color: '#f59e0b', link: '/admin/specialities' },
    { label: 'Treatments', value: treatCount, icon: '💉', color: '#8b5cf6', link: '/admin/treatments' },
  ];

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '32px', fontWeight: 800, color: 'var(--gray-900)', marginBottom: '8px' }}>Dashboard</h1>
          <p style={{ color: 'var(--gray-500)' }}>Welcome to the Vivek Hospital Admin Panel</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px', marginBottom: '40px' }}>
        {stats.map((s, i) => (
          <div key={i} className="card card--elevated" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: `${s.color}20`, color: s.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px' }}>
              {s.icon}
            </div>
            <div>
              <p style={{ fontSize: '13px', color: 'var(--gray-500)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>{s.label}</p>
              <p style={{ fontSize: '28px', fontWeight: 800, color: 'var(--gray-900)', lineHeight: 1 }}>{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="card" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--gray-900)' }}>Recent Appointments</h2>
          <Link href="/admin/appointments" className="btn btn-ghost btn-sm">View All →</Link>
        </div>
        
        {recentAppts.length === 0 ? (
          <p style={{ color: 'var(--gray-500)', textAlign: 'center', padding: '20px' }}>No appointments yet.</p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--gray-100)' }}>
                  <th style={{ padding: '12px 16px', color: 'var(--gray-500)', fontWeight: 600, fontSize: '13px' }}>Patient Name</th>
                  <th style={{ padding: '12px 16px', color: 'var(--gray-500)', fontWeight: 600, fontSize: '13px' }}>Contact</th>
                  <th style={{ padding: '12px 16px', color: 'var(--gray-500)', fontWeight: 600, fontSize: '13px' }}>Speciality</th>
                  <th style={{ padding: '12px 16px', color: 'var(--gray-500)', fontWeight: 600, fontSize: '13px' }}>Date</th>
                  <th style={{ padding: '12px 16px', color: 'var(--gray-500)', fontWeight: 600, fontSize: '13px' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentAppts.map(appt => (
                  <tr key={appt.id} style={{ borderBottom: '1px solid var(--gray-100)' }}>
                    <td style={{ padding: '16px', fontWeight: 600, color: 'var(--gray-800)' }}>{appt.name}</td>
                    <td style={{ padding: '16px', color: 'var(--gray-600)', fontSize: '14px' }}>
                      {appt.phone}<br/><span style={{ fontSize: '12px', color: 'var(--gray-400)' }}>{appt.email}</span>
                    </td>
                    <td style={{ padding: '16px', color: 'var(--gray-600)', fontSize: '14px' }}>{appt.speciality}</td>
                    <td style={{ padding: '16px', color: 'var(--gray-600)', fontSize: '14px' }}>{appt.date}</td>
                    <td style={{ padding: '16px' }}>
                      <span className="badge badge--green" style={{ fontSize: '12px' }}>{appt.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}

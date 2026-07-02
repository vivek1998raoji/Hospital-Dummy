'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function AdminLayout({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const auth = localStorage.getItem('adminAuth');
      if (auth === 'true') setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    if (pin === '1234') { // Simple PIN for testing purposes
      localStorage.setItem('adminAuth', 'true');
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('Invalid PIN. Hint: it is 1234');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminAuth');
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--gray-50)' }}>
        <div className="card" style={{ padding: '40px', width: '100%', maxWidth: '400px', textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔒</div>
          <h1 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '8px' }}>Admin Login</h1>
          <p style={{ color: 'var(--gray-500)', marginBottom: '24px' }}>Enter your secure PIN to access the backend</p>
          <form onSubmit={handleLogin}>
            <input 
              type="password" 
              className="form-input" 
              placeholder="Enter PIN" 
              value={pin}
              onChange={e => setPin(e.target.value)}
              autoFocus
              style={{ textAlign: 'center', fontSize: '24px', letterSpacing: '4px', marginBottom: '16px' }}
            />
            {error && <p style={{ color: 'var(--error)', fontSize: '14px', marginBottom: '16px' }}>{error}</p>}
            <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }}>Login</button>
          </form>
          <div style={{ marginTop: '24px' }}>
            <Link href="/" className="btn btn-ghost btn-sm">← Back to Website</Link>
          </div>
        </div>
      </div>
    );
  }

  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: '📊' },
    { name: 'Appointments', path: '/admin/appointments', icon: '📅' },
    { name: 'Hospitals', path: '/admin/locations', icon: '🏥' },
    { name: 'Doctors', path: '/admin/doctors', icon: '👨‍⚕️' },
    { name: 'Specialities', path: '/admin/specialities', icon: '❤️' },
    { name: 'Treatments', path: '/admin/treatments', icon: '💉' },
    { name: 'Other Pages', path: '/admin/pages', icon: '📄' },
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--gray-50)' }}>
      {/* Sidebar */}
      <aside style={{ width: '260px', background: 'white', borderRight: '1px solid var(--gray-200)', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '24px', borderBottom: '1px solid var(--gray-200)' }}>
          <Link href="/" style={{ fontSize: '18px', fontWeight: 800, color: 'var(--accent)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>🏥</span> Admin Panel
          </Link>
        </div>
        <nav style={{ padding: '16px 12px', flex: 1 }}>
          {navItems.map(item => {
            const isActive = pathname === item.path || (item.path !== '/admin' && pathname.startsWith(item.path));
            return (
              <Link 
                key={item.path} 
                href={item.path}
                style={{
                  display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px',
                  borderRadius: 'var(--radius-md)', textDecoration: 'none', fontWeight: 600,
                  fontSize: '15px', marginBottom: '4px',
                  background: isActive ? 'var(--accent-glow)' : 'transparent',
                  color: isActive ? 'var(--accent)' : 'var(--gray-700)',
                  transition: 'background 0.2s',
                }}
              >
                <span style={{ fontSize: '20px' }}>{item.icon}</span> {item.name}
              </Link>
            );
          })}
        </nav>
        <div style={{ padding: '24px', borderTop: '1px solid var(--gray-200)' }}>
          <button onClick={handleLogout} className="btn btn-outline" style={{ width: '100%', borderColor: 'var(--error)', color: 'var(--error)' }}>
            Logout 🔒
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main style={{ flex: 1, padding: '40px', overflowY: 'auto' }}>
        {children}
      </main>
    </div>
  );
}

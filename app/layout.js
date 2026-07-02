import './globals.css';
import Navbar from '../components/Navbar';
import Link from 'next/link';

export const metadata = {
  title: 'Marengo Asia Hospitals - India\'s Most Trusted Hospital Network',
  description: 'Marengo Asia Hospitals is India\'s leading multi-super-speciality hospital network with 1600+ beds, 800+ doctors, and 45+ specialities across 6 locations. World-class healthcare in cardiac sciences, neurosciences, oncology, organ transplant, and more.',
  keywords: 'hospital, healthcare, cardiac surgery, neurosurgery, cancer treatment, organ transplant, India, Gurugram',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main>{children}</main>

        {/* Footer */}
        <footer className="footer">
          <div className="container">
            <div className="footer-grid">
              <div>
                <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '24px' }}>🏥</span> Marengo Asia Hospitals
                </h4>
                <p style={{ marginBottom: '20px' }}>
                  India&apos;s most trusted hospital network delivering world-class healthcare since 2000.
                  Our mission is to provide accessible, affordable, and high-quality medical care through
                  clinical excellence and cutting-edge technology.
                </p>
                <div className="footer-social">
                  <a href="#" aria-label="Facebook">f</a>
                  <a href="#" aria-label="Twitter">𝕏</a>
                  <a href="#" aria-label="LinkedIn">in</a>
                  <a href="#" aria-label="YouTube">▶</a>
                  <a href="#" aria-label="Instagram">📷</a>
                </div>
              </div>
              <div>
                <h4>Quick Links</h4>
                <ul className="footer-links">
                  <li><Link href="/about">About Us</Link></li>
                  <li><Link href="/doctors">Our Doctors</Link></li>
                  <li><Link href="/specialities">Specialities</Link></li>
                  <li><Link href="/treatments">Treatments</Link></li>
                  <li><Link href="/health-checkups">Health Checkups</Link></li>
                  <li><Link href="/locations">Our Hospitals</Link></li>
                  <li><Link href="/blogs">Health Library</Link></li>
                  <li><Link href="/careers">Careers</Link></li>
                </ul>
              </div>
              <div>
                <h4>Patient Care</h4>
                <ul className="footer-links">
                  <li><Link href="/book">Book Appointment</Link></li>
                  <li><Link href="/patient-services">Patient Services</Link></li>
                  <li><Link href="/international-patients">International Patients</Link></li>
                  <li><Link href="/patient-stories">Patient Stories</Link></li>
                  <li><Link href="/health-checkups">Health Packages</Link></li>
                  <li><Link href="/news">News & Events</Link></li>
                  <li><Link href="/contact">Contact Us</Link></li>
                </ul>
              </div>
              <div>
                <h4>Contact Info</h4>
                <ul className="footer-links">
                  <li style={{ marginBottom: '16px' }}>
                    <strong style={{ color: 'rgba(255,255,255,0.8)' }}>Marengo Asia Hospitals, Gurugram</strong><br />
                    CH Baktawar Singh Rd, Sector 38,<br />
                    Gurugram, Haryana 122001
                  </li>
                  <li>
                    📞 <a href="tel:+911244141414" style={{ color: 'var(--accent-light)' }}>+91-124-4141414</a>
                  </li>
                  <li>
                    📧 <a href="mailto:info@marengoasiahospitals.com" style={{ color: 'var(--accent-light)' }}>info@marengoasiahospitals.com</a>
                  </li>
                  <li style={{ marginTop: '16px' }}>
                    <strong style={{ color: 'rgba(255,255,255,0.8)' }}>Emergency (24/7)</strong><br />
                    🚑 <a href="tel:+911244242424" style={{ color: '#ef4444', fontWeight: 700 }}>+91-124-4242424</a>
                  </li>
                </ul>
              </div>
            </div>
            <div className="footer-bottom">
              <p>© {new Date().getFullYear()} Marengo Asia Hospitals. All rights reserved.</p>
              <div style={{ display: 'flex', gap: '24px' }}>
                <Link href="/privacy-policy">Privacy Policy</Link>
                <Link href="/terms">Terms & Conditions</Link>
                <Link href="/refund-policy">Refund Policy</Link>
              </div>
            </div>
          </div>
        </footer>

        {/* SOS Floating Buttons */}
        <div className="sos-float">
          <a href="tel:+911244242424" className="sos-btn sos-btn--emergency">
            🚨 Emergency
          </a>
          <a href="https://wa.me/911244141414" className="sos-btn sos-btn--whatsapp" target="_blank" rel="noopener noreferrer">
            💬
          </a>
        </div>
      </body>
    </html>
  );
}

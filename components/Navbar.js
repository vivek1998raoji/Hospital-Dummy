'use client';
import { useState } from 'react';
import Link from 'next/link';

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const closeMobile = () => setMobileOpen(false);

  return (
    <nav className="navbar">
      <div className="container">
        <Link href="/" className="navbar-brand" onClick={closeMobile}>
          <span className="brand-icon">🏥</span>
          Vivek Hospital
        </Link>

        <button className="menu-toggle" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Toggle menu">
          <span></span><span></span><span></span>
        </button>

        <div className={`navbar-nav-wrap ${mobileOpen ? 'is-open' : ''}`}>
          <ul className="navbar-nav">
            {/* Specialities */}
            <li className="nav-item has-dropdown">
              <Link href="/specialities" className="nav-link dropdown-trigger">
                Specialities
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </Link>
              <ul className="dropdown-menu">
                <li><Link href="/specialities/cardiac-sciences" onClick={closeMobile}><span className="dropdown-icon">❤️</span> Cardiac Sciences</Link></li>
                <li><Link href="/specialities/neurosciences" onClick={closeMobile}><span className="dropdown-icon">🧠</span> Neurosciences</Link></li>
                <li><Link href="/specialities/oncology" onClick={closeMobile}><span className="dropdown-icon">🎗️</span> Cancer Care</Link></li>
                <li><Link href="/specialities/orthopaedics" onClick={closeMobile}><span className="dropdown-icon">🦴</span> Orthopaedics</Link></li>
                <li><Link href="/specialities/gastroenterology" onClick={closeMobile}><span className="dropdown-icon">🫁</span> Gastroenterology</Link></li>
                <li><Link href="/specialities/nephrology" onClick={closeMobile}><span className="dropdown-icon">🫘</span> Kidney & Urology</Link></li>
                <li><Link href="/specialities/liver-transplant" onClick={closeMobile}><span className="dropdown-icon">🫀</span> Liver Transplant</Link></li>
                <li><Link href="/specialities" onClick={closeMobile}><span className="dropdown-icon">➡️</span> <strong>View All</strong></Link></li>
              </ul>
            </li>

            {/* Doctors */}
            <li className="nav-item">
              <Link href="/doctors" className="nav-link" onClick={closeMobile}>Doctors</Link>
            </li>

            {/* Hospitals */}
            <li className="nav-item has-dropdown">
              <Link href="/locations" className="nav-link dropdown-trigger">
                Hospitals
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </Link>
              <ul className="dropdown-menu">
                <li><Link href="/locations/gurugram" onClick={closeMobile}><span className="dropdown-icon">🏙️</span> Gurugram</Link></li>
                <li><Link href="/locations/lucknow" onClick={closeMobile}><span className="dropdown-icon">🕌</span> Lucknow</Link></li>
                <li><Link href="/locations/patna" onClick={closeMobile}><span className="dropdown-icon">🏛️</span> Patna</Link></li>
                <li><Link href="/locations/indore" onClick={closeMobile}><span className="dropdown-icon">🌆</span> Indore</Link></li>
                <li><Link href="/locations/noida" onClick={closeMobile}><span className="dropdown-icon">🌃</span> Noida</Link></li>
                <li><Link href="/locations/ranchi" onClick={closeMobile}><span className="dropdown-icon">🏞️</span> Ranchi</Link></li>
                <li><Link href="/locations" onClick={closeMobile}><span className="dropdown-icon">➡️</span> <strong>All Hospitals</strong></Link></li>
              </ul>
            </li>

            {/* Patient Care */}
            <li className="nav-item has-dropdown">
              <Link href="/patient-services" className="nav-link dropdown-trigger">
                Patient Care
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </Link>
              <ul className="dropdown-menu">
                <li><Link href="/treatments" onClick={closeMobile}><span className="dropdown-icon">💉</span> Treatments</Link></li>
                <li><Link href="/health-checkups" onClick={closeMobile}><span className="dropdown-icon">🩺</span> Health Checkups</Link></li>
                <li><Link href="/patient-services" onClick={closeMobile}><span className="dropdown-icon">🛎️</span> Patient Services</Link></li>
                <li><Link href="/international-patients" onClick={closeMobile}><span className="dropdown-icon">🌍</span> International Patients</Link></li>
                <li><Link href="/patient-stories" onClick={closeMobile}><span className="dropdown-icon">💬</span> Patient Stories</Link></li>
                <li><Link href="/blogs" onClick={closeMobile}><span className="dropdown-icon">📝</span> Health Library</Link></li>
              </ul>
            </li>

            {/* About */}
            <li className="nav-item has-dropdown">
              <Link href="/about" className="nav-link dropdown-trigger">
                About
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </Link>
              <ul className="dropdown-menu">
                <li><Link href="/about" onClick={closeMobile}><span className="dropdown-icon">ℹ️</span> About Us</Link></li>
                <li><Link href="/news" onClick={closeMobile}><span className="dropdown-icon">📰</span> News & Events</Link></li>
                <li><Link href="/careers" onClick={closeMobile}><span className="dropdown-icon">💼</span> Careers</Link></li>
                <li><Link href="/contact" onClick={closeMobile}><span className="dropdown-icon">📞</span> Contact Us</Link></li>
              </ul>
            </li>

            <li className="nav-item nav-cta">
              <Link href="/book" className="btn btn-primary btn-sm" onClick={closeMobile}>
                Book Appointment
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

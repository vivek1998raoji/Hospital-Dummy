import Link from 'next/link';

export default function TermsPage() {
  const sections = [
    { title: 'Acceptance of Terms', content: 'By accessing and using the Vivek Hospital website and services, you agree to be bound by these Terms and Conditions. If you do not agree with any part of these terms, please do not use our services. We reserve the right to modify these terms at any time, and your continued use constitutes acceptance of any changes.' },
    { title: 'Our Services', content: 'Vivek Hospital provides multi-super-speciality healthcare services including but not limited to outpatient consultations, inpatient care, surgical procedures, diagnostic services, preventive health checkups, telemedicine consultations, and emergency care. All medical services are provided by qualified and licensed medical professionals.' },
    { title: 'User Responsibilities', content: 'You agree to provide accurate and complete personal and medical information, follow medical advice and treatment plans prescribed by our doctors, make timely payments for services rendered, treat all hospital staff with respect and courtesy, comply with hospital rules and visiting hours, and inform us of any changes in your health condition or medications.' },
    { title: 'Appointment Policy', content: 'Appointments can be booked online, by phone, or in person. We recommend arriving 15 minutes before your scheduled appointment. Cancellations should be made at least 4 hours in advance. Repeated no-shows may result in restrictions on future online bookings. Emergency cases are always prioritized regardless of appointment status.' },
    { title: 'Medical Disclaimer', content: 'The information provided on our website is for general informational purposes only and should not be considered medical advice. Always consult a qualified healthcare provider for diagnosis and treatment. Individual results may vary. We do not guarantee specific medical outcomes. Emergency situations should be addressed by calling emergency services immediately.' },
    { title: 'Payment & Billing', content: 'Payment is due at the time of service unless covered by insurance. We accept cash, cards, UPI, net banking, and insurance. Estimates provided are approximate and may change based on actual treatment. Insurance claims are processed as per the terms of your insurance policy. Any disputes regarding billing should be raised within 30 days of the service date.' },
    { title: 'Limitation of Liability', content: 'While we strive to provide the highest quality healthcare, Vivek Hospital shall not be liable for outcomes beyond our reasonable control, delays caused by external factors, third-party service failures, or information provided by patients that is incomplete or inaccurate. Our liability is limited to the fees paid for the specific service in question.' },
    { title: 'Intellectual Property', content: 'All content on this website, including text, images, logos, and design, is the property of Vivek Hospital and protected by intellectual property laws. You may not reproduce, distribute, or use any content without our written permission.' },
    { title: 'Governing Law', content: 'These terms are governed by the laws of India. Any disputes arising from these terms or our services shall be subject to the exclusive jurisdiction of the courts in Gurugram, Haryana, India.' },
  ];

  return (
    <>
      <section className="page-header">
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div className="breadcrumb"><Link href="/">Home</Link><span className="breadcrumb-sep">/</span><span>Terms & Conditions</span></div>
          <h1>Terms & Conditions</h1>
          <p>Please read these terms carefully before using our services</p>
        </div>
      </section>
      <section className="section">
        <div className="container" style={{ maxWidth: '800px' }}>
          <p style={{ fontSize: '14px', color: 'var(--gray-400)', marginBottom: '32px' }}>Last updated: January 2024</p>
          {sections.map((sec, i) => (
            <div key={i} style={{ marginBottom: '32px' }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '20px', fontWeight: 700, color: 'var(--gray-900)', marginBottom: '12px' }}>
                {i + 1}. {sec.title}
              </h2>
              <p style={{ fontSize: '15px', color: 'var(--gray-600)', lineHeight: 1.8 }}>{sec.content}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

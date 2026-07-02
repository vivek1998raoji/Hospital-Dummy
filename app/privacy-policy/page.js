import Link from 'next/link';

export default function PrivacyPolicyPage() {
  const sections = [
    { title: 'Information We Collect', content: 'We collect information that you provide directly to us, including personal identification information (name, email, phone number), medical history and health records, appointment and billing information, insurance details, and usage data when you interact with our website. We may also collect information from healthcare providers involved in your care.' },
    { title: 'How We Use Your Information', content: 'Your information is used to provide and improve our healthcare services, schedule and manage appointments, process payments and insurance claims, communicate about your care and follow-up, send health tips and hospital updates (with your consent), comply with legal and regulatory requirements, and improve our website and services.' },
    { title: 'Data Security', content: 'We implement industry-standard security measures to protect your personal and medical information. This includes encryption of data in transit and at rest, secure access controls and authentication, regular security audits and penetration testing, staff training on data protection, and compliance with healthcare data protection regulations.' },
    { title: 'Cookies & Tracking', content: 'Our website uses cookies and similar technologies to enhance your browsing experience. Essential cookies are required for website functionality. Analytics cookies help us understand usage patterns. You can manage cookie preferences through your browser settings. We do not sell your browsing data to third parties.' },
    { title: 'Third-Party Sharing', content: 'We do not sell your personal information. We may share your data with healthcare providers involved in your treatment, insurance companies for claims processing, laboratory and diagnostic partners, regulatory authorities as required by law, and technology partners who help operate our services (under strict data protection agreements).' },
    { title: 'Your Rights', content: 'You have the right to access your personal and medical records, request correction of inaccurate information, request deletion of your data (subject to legal retention requirements), opt out of marketing communications, withdraw consent for data processing, and file a complaint with relevant data protection authorities.' },
    { title: 'Data Retention', content: 'Medical records are retained as per applicable healthcare regulations (minimum 3 years after last treatment). Financial records are maintained as required by tax and accounting regulations. Marketing and communication preferences are retained until you opt out. Website usage data is retained for 2 years.' },
    { title: 'Contact Us', content: 'For any privacy-related queries or requests, please contact our Data Protection Officer at privacy@vivekhospital.com or call +91-124-4141414. You can also write to: Data Protection Officer, Vivek Hospital, Sector 38, Gurugram, Haryana 122001.' },
  ];

  return (
    <>
      <section className="page-header">
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div className="breadcrumb"><Link href="/">Home</Link><span className="breadcrumb-sep">/</span><span>Privacy Policy</span></div>
          <h1>Privacy Policy</h1>
          <p>How we collect, use, and protect your personal information</p>
        </div>
      </section>
      <section className="section">
        <div className="container" style={{ maxWidth: '800px' }}>
          <p style={{ fontSize: '14px', color: 'var(--gray-400)', marginBottom: '32px' }}>Last updated: January 2024</p>
          <p style={{ fontSize: '15px', color: 'var(--gray-600)', lineHeight: 1.8, marginBottom: '32px' }}>
            Vivek Hospital (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) is committed to protecting your privacy.
            This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our hospital,
            use our website, or interact with our services.
          </p>
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

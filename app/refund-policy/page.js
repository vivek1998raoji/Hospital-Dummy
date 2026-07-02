import Link from 'next/link';

export default function RefundPolicyPage() {
  const sections = [
    { title: 'Appointment Cancellation', content: 'Appointments can be cancelled up to 4 hours before the scheduled time for a full refund of any advance payment. Cancellations made less than 4 hours before the appointment may be subject to a cancellation fee of ₹200. No-shows without prior cancellation will not be eligible for refunds. Emergency cancellations due to medical emergencies will be considered on a case-by-case basis.' },
    { title: 'Refund for Prepaid Services', content: 'If you have prepaid for health checkup packages, diagnostic tests, or other services and wish to cancel, a full refund will be processed if the cancellation is made before the service date. Partial refunds may be available if some tests have already been conducted. Custom health packages may have different refund terms as specified at the time of booking.' },
    { title: 'Refund Process', content: 'Refund requests can be submitted at the billing counter, via email to billing@marengoasiahospitals.com, or by calling +91-124-4141414. Please provide your patient ID, receipt number, and reason for refund. All refund requests are reviewed within 3 business days. Approved refunds are processed through the original payment method.' },
    { title: 'Timeline', content: 'Credit/Debit Card refunds: 5-7 business days. UPI refunds: 2-3 business days. Net Banking refunds: 5-10 business days. Cash refunds: Same day (at billing counter during working hours). Insurance claim reversals: As per insurance company timelines, typically 15-30 days.' },
    { title: 'Non-Refundable Services', content: 'The following services are non-refundable once rendered: completed consultations, administered medications and injections, completed diagnostic tests and imaging, surgical procedures, emergency services, and telemedicine consultations once the video call has commenced.' },
    { title: 'Exceptions', content: 'Refunds outside the standard policy may be considered in cases of hospital errors or service failures, medical emergencies preventing attendance, government-mandated lockdowns or restrictions, and natural disasters or force majeure events. Such cases will be reviewed by our patient services team.' },
    { title: 'Disputes', content: 'If you are unsatisfied with a refund decision, you may escalate the matter to the Patient Relations Manager by emailing patientrelations@marengoasiahospitals.com. All disputes will be resolved within 15 business days. For further escalation, please contact the hospital administration at admin@marengoasiahospitals.com.' },
  ];

  return (
    <>
      <section className="page-header">
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div className="breadcrumb"><Link href="/">Home</Link><span className="breadcrumb-sep">/</span><span>Refund Policy</span></div>
          <h1>Refund & Cancellation Policy</h1>
          <p>Our policies for appointment cancellations and service refunds</p>
        </div>
      </section>
      <section className="section">
        <div className="container" style={{ maxWidth: '800px' }}>
          <p style={{ fontSize: '14px', color: 'var(--gray-400)', marginBottom: '32px' }}>Last updated: January 2024</p>
          <div className="card card--accent" style={{ padding: '24px', marginBottom: '32px' }}>
            <p style={{ fontSize: '15px', color: 'var(--gray-700)', lineHeight: 1.7 }}>
              <strong>Quick Summary:</strong> Cancel appointments 4+ hours in advance for a full refund.
              Refunds are processed within 2-10 business days depending on payment method.
              Contact billing@marengoasiahospitals.com for refund requests.
            </p>
          </div>
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

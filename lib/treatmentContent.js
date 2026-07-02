export function getTreatmentContent(slug) {
  // Generic rich content structure that applies to most treatments if specific one isn't defined
  const defaultContent = {
    overview: `Our multidisciplinary team of experts provides comprehensive care utilizing the latest medical protocols and advanced surgical techniques. We understand that undergoing any medical procedure can be stressful, which is why our approach centers on patient comfort, safety, and optimal clinical outcomes.

At Vivek Hospital, this procedure is performed in our state-of-the-art operation theaters equipped with cutting-edge technology. Our surgeons and medical specialists have decades of collective experience, ensuring that every patient receives world-class treatment tailored to their specific medical condition.

From the initial consultation through post-operative recovery, our dedicated care teams monitor every aspect of your health journey. We adhere strictly to international clinical protocols to minimize risks and accelerate recovery times.`,
    preparation: `• **Medical Evaluation:** A thorough pre-operative assessment including blood tests, imaging (MRI, CT scans, X-rays), and cardiac evaluation.
• **Medication Review:** Adjusting or stopping certain medications like blood thinners days before the procedure.
• **Fasting:** Typically, you will be asked to fast for 8-12 hours prior to the surgery.
• **Lifestyle Changes:** Quitting smoking and alcohol consumption several weeks prior to improve healing.
• **Consultation:** Detailed discussion with your surgeon and anesthetist regarding the procedure and anesthesia type.`,
    procedureDetails: `The procedure is performed under appropriate anesthesia (general, spinal, or local) depending on the complexity of the case. Our specialists use minimally invasive techniques whenever possible, which involve smaller incisions, less tissue damage, and significantly reduced recovery times compared to traditional open surgeries.

During the intervention, real-time imaging and advanced robotic or computer-assisted navigation systems may be utilized to ensure maximum precision. The entire process is continuously monitored by an expert team of anesthetists and intensivists to guarantee patient safety at every moment.`,
    recovery: `**Immediate Recovery:** Immediately following the procedure, you will be monitored in our specialized Post-Anesthesia Care Unit (PACU) or Intensive Care Unit (ICU) until stable.
    
**Hospital Stay:** Depending on the procedure, hospital stay ranges from a few hours (day-care) to several days. Our nursing staff will assist with pain management and early mobilization.

**Rehabilitation:** Physiotherapy and rehabilitation often begin within 24 hours of surgery to prevent complications and restore mobility.

**Long-term Care:** Detailed discharge summaries, medication schedules, and follow-up appointment timelines are provided. Our care coordinators remain available for post-discharge queries.`,
    risks: `While Vivek Hospital maintains infection rates far below global averages, all medical procedures carry some inherent risks. Potential complications may include infection at the surgical site, bleeding, adverse reactions to anesthesia, or blood clots. Our comprehensive pre-operative screening and strict adherence to international safety protocols are designed specifically to mitigate these risks.`,
    faqs: [
      { q: "How long is the typical hospital stay?", a: "Hospital stay varies by procedure, typically ranging from 24 hours to 5-7 days for major surgeries. Your doctor will provide a specific timeline during consultation." },
      { q: "Will insurance cover this treatment?", a: "Most major health insurance policies cover our standard procedures. Our dedicated TPA desk will assist you with pre-authorization and cashless claims." },
      { q: "When can I resume normal activities?", a: "Recovery times vary. Light activities can often be resumed within a few weeks, while strenuous activities may take 6-12 weeks. Your surgeon will provide specific guidelines." },
      { q: "Are minimally invasive options available?", a: "Yes, Vivek Hospital pioneers in minimally invasive and robotic surgeries, which are offered whenever clinically appropriate for your specific case." },
      { q: "How do I manage pain after discharge?", a: "You will be prescribed a customized pain management plan including medications. Our team will guide you on their proper usage before discharge." }
    ]
  };

  const specificContent = {
    'cabg': {
      overview: `Coronary Artery Bypass Grafting (CABG), commonly known as heart bypass surgery, is a critical surgical procedure performed to improve blood flow to the heart. It is recommended for patients suffering from severe coronary artery disease (CAD), where plaque buildup has narrowed or blocked the arteries supplying oxygen-rich blood to the heart muscle.

At the Vivek Hospital Heart Institute, our cardiothoracic surgeons are pioneers in both traditional and minimally invasive bypass surgeries. We specialize in Beating Heart Surgery (Off-Pump CABG), which eliminates the need for a heart-lung machine, significantly reducing surgical risks and post-operative complications.

With a success rate of over 99%, our cardiac surgical team performs hundreds of bypass surgeries annually. Our multidisciplinary approach involves cardiologists, cardiac surgeons, specialized anesthetists, and cardiac rehabilitation experts working together to ensure the best possible long-term outcomes for our patients.`,
      preparation: `• **Extensive Cardiac Evaluation:** Includes Angiography, Echocardiogram, ECG, and Stress Tests to map the exact locations of blockages.
• **Blood Tests:** Comprehensive metabolic panel, complete blood count, and coagulation profiles.
• **Medication Adjustments:** Blood-thinning medications (like Aspirin or Clopidogrel) may need to be paused a week prior.
• **Pre-op Physiotherapy:** Learning breathing exercises (using a spirometer) to prevent lung infections post-surgery.
• **Fasting:** Complete fasting (no food or water) starting from midnight before the surgery date.`,
      procedureDetails: `During CABG, a healthy blood vessel (graft) is taken from another part of the body—usually the leg (saphenous vein), arm (radial artery), or chest (internal mammary artery). The surgeon attaches one end of this graft above the blockage and the other end below it, effectively creating a new pathway (bypass) for blood to reach the heart muscle.

At Vivek Hospital, the majority of bypass procedures are performed using the **Total Arterial Revascularization** technique and **Off-Pump (Beating Heart)** methodology. By keeping the heart beating during surgery and using arterial grafts (which last longer than vein grafts), patients experience better long-term survival, fewer neurocognitive issues, and a reduced need for repeat surgeries in the future.`,
      recovery: `**ICU Stay:** Patients typically spend 1 to 2 days in the Cardiac Intensive Care Unit (CTVS ICU) for continuous hemodynamic monitoring. Breathing tubes are usually removed within 4-6 hours post-surgery.
      
**Ward Transfer:** Once stable, patients are moved to a specialized cardiac recovery ward for an additional 4 to 5 days.

**Cardiac Rehabilitation:** Our dedicated physiotherapy team begins gentle mobilization within 24 hours. A structured 12-week Cardiac Rehabilitation program is initiated to help patients regain strength safely.

**At-Home Recovery:** Complete sternal (chest bone) healing takes about 6-8 weeks. Patients can usually return to desk work in 4-6 weeks, and resume normal active lifestyles in 3 months.`,
    }
  };

  return specificContent[slug] || defaultContent;
}

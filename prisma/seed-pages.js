const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const pages = [
    {
      slug: 'home',
      title: 'Home Page',
      metaTitle: "Vivek Hospital - India's Most Trusted Hospital Network",
      metaDescription: "Vivek Hospital is India's leading multi-super-speciality hospital network with 1600+ beds, 800+ doctors, and 45+ specialities across 6 locations. World-class healthcare.",
      metaKeywords: 'hospital, healthcare, cardiac surgery, neurosurgery, cancer treatment, organ transplant, India',
      content: JSON.stringify({
        heroTitle: "India's Most Trusted Super-Speciality Hospital",
        heroSubtitle: "Bringing world-class clinical excellence and compassionate care to over 6 cities across India",
        emergencyPhone: "+91-124-4242424"
      })
    },
    {
      slug: 'about',
      title: 'About Us',
      metaTitle: 'About Vivek Hospital - Transforming Lives Since 2000',
      metaDescription: "Founded by Dr. Naresh Trehan in 2000, Vivek Hospital has grown into India's most trusted hospital network. Learn about our story, leaders, awards and milestones.",
      metaKeywords: 'about us, medical group, Dr Naresh Trehan, hospital history',
      content: JSON.stringify({
        introTitle: "A Vision for World-Class Healthcare in India",
        introParagraph: "Founded in 2000 by Dr. Naresh Trehan, one of the world's most accomplished cardiovascular surgeons, Vivek Hospital was born from a singular vision: to create a healthcare institution in India that matches and exceeds the best hospitals in the world."
      })
    },
    {
      slug: 'contact',
      title: 'Contact Us',
      metaTitle: 'Contact Vivek Hospital - Helpdesk, Numbers & Addresses',
      metaDescription: 'Get in touch with Vivek Hospital branches in Gurugram, Noida, Lucknow, Patna, Indore, Ranchi. Book an appointment or call our emergency line.',
      metaKeywords: 'contact, hospital address, customer support, phone number',
      content: JSON.stringify({
        email: 'info@vivekhospital.com',
        phone: '+91-124-4141414',
        emergencyPhone: '+91-124-4242424'
      })
    },
    {
      slug: 'careers',
      title: 'Careers',
      metaTitle: 'Careers at Vivek Hospital - Join Our Expert Medical Team',
      metaDescription: "Explore career opportunities, medical jobs, and administrative roles at India's leading healthcare network. Apply online today.",
      metaKeywords: 'jobs, medical careers, doctor hiring, nurse jobs',
      content: JSON.stringify({
        headline: "Shape the Future of Healthcare",
        subheading: "Join our team of dedicated healthcare professionals, innovators, and world-class specialists making a difference every day."
      })
    },
    {
      slug: 'international-patients',
      title: 'International Patients',
      metaTitle: 'International Patient Services - Vivek Hospital India',
      metaDescription: 'We provide dedicated medical tourism support including visa assistance, airport transfers, language translators, and customized care plans.',
      metaKeywords: 'medical tourism, international patients, health travel, treatment in India',
      content: JSON.stringify({
        headline: "World-Class Medical Care in India",
        subheading: "A dedicated department ensuring a seamless, comfortable, and personalized clinical journey for international patients and their families."
      })
    }
  ];

  for (const page of pages) {
    await prisma.page.upsert({
      where: { slug: page.slug },
      update: {},
      create: page
    });
  }

  console.log('Pages successfully seeded!');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

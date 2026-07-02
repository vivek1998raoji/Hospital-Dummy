import fs from 'fs';
import path from 'path';

const ROOT = process.cwd();
const seedPath = path.join(ROOT, 'prisma', 'seed.js');
let seed = fs.readFileSync(seedPath, 'utf8');

// --- existing speciality names (so doctor.speciality matches a real Speciality) ---
const specNames = [...seed.matchAll(/name:\s*'([^']+)'/g)]
  .map(m => m[1]);
const specBlock = seed.slice(seed.indexOf('const specialities = ['), seed.indexOf('for (const spec of specialities)'));
const existingSpecs = [...specBlock.matchAll(/name:\s*'([^']+)'/g)].map(m => m[1]);
const specSet = new Set(existingSpecs);
function mapSpec(s) {
  const t = (s || '').toLowerCase();
  const rules = [
    [/cardiac|cardio/, 'Cardiac Sciences'],
    [/neurosurg|neurolog|neurosci|spine/, 'Neurosciences'],
    [/oncolog|cancer|haemat|hemat/, 'Cancer Care / Oncology'],
    [/orthopaed|orthoped|joint/, 'Orthopaedics & Joint Replacement'],
    [/liver transplant|biliary|hepatolog/, 'Liver Transplant & Hepatology'],
    [/gastro|\bgi\b/, 'Gastroenterology & GI Surgery'],
    [/nephro|urolog|renal|kidney/, 'Kidney & Urology'],
    [/pulmo|respiratory|lung/, 'Pulmonology & Lung Transplant'],
    [/endocrin|diabet/, 'Endocrinology & Diabetes'],
    [/rheumat/, 'Rheumatology'],
    [/dermat|skin|cosmet/, 'Dermatology'],
    [/ent|otolar|ear nose|throat/, 'ENT (Ear, Nose & Throat)'],
    [/ophthal|eye/, 'Ophthalmology'],
    [/obstet|gynae|gynec|foetal|fetal|genetics/, 'Obstetrics & Gynaecology'],
    [/paediatr|pediatr|neonat|child/, 'Paediatrics & Neonatology'],
    [/psychiatr|psycholog|mental/, 'Psychiatry & Behavioural Sciences'],
    [/robotic/, 'Robotic Surgery'],
    [/radiolog|imaging|nuclear/, 'Radiology & Imaging'],
    [/emergency|trauma|critical/, 'Emergency & Trauma'],
    [/plastic|reconstruct|aesthetic|burn/, 'Plastic & Reconstructive Surgery'],
    [/dental/, 'Dental Sciences'],
    [/physiotherap|rehab/, 'Physiotherapy & Rehabilitation'],
    [/vascular/, 'Vascular Surgery'],
  ];
  for (const [re, name] of rules) if (re.test(t) && specSet.has(name)) return name;
  // fall back: keep first existing speciality that appears in the string, else generic
  return 'General Medicine';
}

// --- locations (real Marengo hospitals; descriptions written fresh, not copied) ---
const cityToLocation = {
  Gurugram: 'Marengo Asia Hospitals, Gurugram',
  Faridabad: 'Marengo Asia Hospitals, Faridabad',
  Ahmedabad: 'Marengo CIMS Hospital, Ahmedabad',
  Bhuj: 'Marengo KK Patel Super Speciality Hospital, Bhuj',
};
const locations = [
  { name: 'Marengo Asia Hospitals, Gurugram', slug: 'gurugram', address: 'Golf Course Ext Rd, Sushant Lok II, Sector 56, Gurugram, Haryana 122011', phone: '1800-309-4444', beds: '200', description: 'A multi-super-speciality tertiary care hospital in Gurugram offering advanced cardiac sciences, neurosciences, oncology, orthopaedics and organ transplant programs.', image: 'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?auto=format&fit=crop&w=800&q=80', mapUrl: '', specialities: 'Cardiac Sciences, Neurosciences, Cancer Care / Oncology, Orthopaedics & Joint Replacement' },
  { name: 'Marengo Asia Hospitals, Faridabad', slug: 'faridabad', address: 'Plot No. 1, HUDA Staff Colony, Sector 16, Faridabad, Haryana 121002', phone: '1800-309-2222', beds: '200', description: 'A NABH-accredited multi-speciality hospital serving Faridabad and the wider NCR with comprehensive cardiac, ortho, renal and critical care services.', image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=80', mapUrl: '', specialities: 'Cardiac Sciences, Orthopaedics & Joint Replacement, Kidney & Urology, Dermatology' },
  { name: 'Marengo CIMS Hospital, Ahmedabad', slug: 'ahmedabad', address: 'Off Science City Rd, Sola, Ahmedabad, Gujarat 380060', phone: '1800-309-2222', beds: '350', description: 'A leading quaternary care hospital in Ahmedabad known for heart, liver and kidney transplants, advanced oncology and comprehensive critical care.', image: 'https://images.unsplash.com/photo-1512678080530-7760d81faba6?auto=format&fit=crop&w=800&q=80', mapUrl: '', specialities: 'Cardiac Sciences, Liver Transplant & Hepatology, Cancer Care / Oncology, Radiology & Imaging' },
  { name: 'Marengo KK Patel Super Speciality Hospital, Bhuj', slug: 'bhuj', address: 'Bhuj, Gujarat 370001', phone: '1800-309-2222', beds: '100', description: 'A super-speciality hospital bringing advanced tertiary care to Bhuj and the Kutch region across multiple medical and surgical disciplines.', image: 'https://images.unsplash.com/photo-1586773860418-d3b3da966367?auto=format&fit=crop&w=800&q=80', mapUrl: '', specialities: 'Cardiac Sciences, Orthopaedics & Joint Replacement, General Medicine' },
];

// --- doctors from the selected + downloaded set ---
const selected = JSON.parse(fs.readFileSync(path.join(ROOT, 'scripts', 'selected-doctors.json'), 'utf8'));
const perCityFeatured = {};
const doctors = selected.map(d => {
  const speciality = mapSpec(d.speciality);
  const locationName = cityToLocation[d.location] || d.location;
  perCityFeatured[d.location] = (perCityFeatured[d.location] || 0) + 1;
  const featured = perCityFeatured[d.location] <= 2; // 2 featured per city
  return {
    name: d.name,
    slug: d.slug,
    speciality,
    location: locationName,
    experience: d.experience || '',
    qualification: '',
    designation: d.designation || '',
    imageUrl: d.imageUrl || '',
    about: `${d.designation ? d.designation + '. ' : ''}${d.speciality} specialist at ${locationName}.`,
    languages: 'English, Hindi',
    featured,
  };
});

function serializeArray(arr) {
  return '[\n' + arr.map(o => '    ' + JSON.stringify(o)).join(',\n') + ',\n  ]';
}

// Replace locations array
seed = seed.replace(/const locations = \[[\s\S]*?\];\n/, 'const locations = ' + serializeArray(locations) + ';\n');
// Replace doctors array
seed = seed.replace(/const doctors = \[[\s\S]*?\];\n/, 'const doctors = ' + serializeArray(doctors) + ';\n');

fs.writeFileSync(seedPath, seed);
const specCounts = {};
doctors.forEach(d => specCounts[d.speciality] = (specCounts[d.speciality] || 0) + 1);
console.log(`Wrote ${locations.length} locations and ${doctors.length} doctors into prisma/seed.js`);
console.log('Speciality distribution:', specCounts);
console.log('Doctors with photos:', doctors.filter(d => d.imageUrl).length);

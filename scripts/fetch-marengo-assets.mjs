import fs from 'fs';
import path from 'path';

const ROOT = process.cwd();
const SRC = 'C:/Users/MAH005126/Downloads/marengo-doctors.json';
const DOC_DIR = path.join(ROOT, 'public', 'doctors');
fs.mkdirSync(DOC_DIR, { recursive: true });

const all = JSON.parse(fs.readFileSync(SRC, 'utf8'));
const byCity = {};
for (const d of all) (byCity[d.location] = byCity[d.location] || []).push(d);

// Balanced selection across the four hospital cities, diversified by speciality
const targets = { Gurugram: 12, Faridabad: 9, Ahmedabad: 12, Bhuj: 3 };
const selected = [];
for (const [city, n] of Object.entries(targets)) {
  const arr = byCity[city] || [];
  const seen = new Set();
  const pick = [];
  for (const d of arr) { if (pick.length >= n) break; if (!seen.has(d.speciality)) { seen.add(d.speciality); pick.push(d); } }
  for (const d of arr) { if (pick.length >= n) break; if (!pick.includes(d)) pick.push(d); }
  selected.push(...pick);
}

function extFromUrl(u) {
  const m = u.split('?')[0].match(/\.([a-zA-Z]{3,4})$/);
  return m ? m[1].toLowerCase().replace('jpeg', 'jpg') : 'jpg';
}

const out = [];
let ok = 0, fail = 0;
for (const d of selected) {
  const ext = extFromUrl(d.imageUrl);
  const file = `${d.slug}.${ext}`;
  try {
    const res = await fetch(d.imageUrl, { headers: { 'User-Agent': 'Mozilla/5.0' } });
    if (!res.ok) throw new Error('HTTP ' + res.status);
    const buf = Buffer.from(await res.arrayBuffer());
    fs.writeFileSync(path.join(DOC_DIR, file), buf);
    ok++;
    out.push({ ...d, imageUrl: `/doctors/${file}` });
  } catch (e) {
    fail++;
    console.error('FAIL', d.slug, e.message);
    // keep the doctor but with no local image (will fall back to initials)
    out.push({ ...d, imageUrl: '' });
  }
}

fs.writeFileSync(path.join(ROOT, 'scripts', 'selected-doctors.json'), JSON.stringify(out, null, 2));
console.log(`Selected ${selected.length} doctors. Images downloaded ok=${ok} fail=${fail}.`);
console.log('By city:', Object.fromEntries(Object.entries(targets)));

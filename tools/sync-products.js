/* =====================================================
   D&G TECH & LOAD — product sync
   Turns the store system export (DandG-store-data.json from Google Drive)
   into the PUBLIC product list the website reads: docs/assets/products.json

     npm run sync -- path/to/DandG-store-data.json

   SECURITY: the export also contains PINs, cash/G-Cash balances, unit costs,
   sales and expenses. Only the allow-listed fields below (name, selling price,
   stock) are ever written to the website. Never commit or publish the export.
   ===================================================== */
const fs = require('fs');
const path = require('path');

const src = process.argv[2] || path.join(__dirname, '..', 'data', 'DandG-store-data.json');
const OUT = path.join(__dirname, '..', 'docs', 'assets', 'products.json');
const PHOTO_DIR = path.join(__dirname, '..', 'docs', 'assets', 'products');

// Inventory entries that are store supplies or services, not products for sale.
const EXCLUDE = [/^plastic bag$/i, /^sim registration$/i, /^repair\b/i];

// First match wins — order matters (e.g. "CASE SMART 20" is a case, not a SIM).
const CATEGORIES = [
  ['Cases & Screen Protectors', /\bcase\b|tempered|protector/i],
  ['SIM & Load', /simcard|\bsim\b|dito wifi/i],
  ['Memory & Storage', /memory card|sandisk|card reader|\busb \d+gb/i],
  ['Audio', /headset|earphone|earbud|speaker|b-bts|\btws\b/i],
  ['Power Banks', /p-bank|power ?bank/i],
  ['Batteries', /^battery\b/i],
  ['Phones & Tablets', /cellphone|\btab\b|desktop phone/i],
  ['Computer Accessories', /mouse|keyboard/i],
  ['Wearables', /bracelet|watch/i],
  ['Accessories', /holder|selfie|tripod|ring light|stand\b|usb light/i],
  ['Chargers & Cables', /charger|cable|\bulo\b|adaptor|adapter|\bcar\b|\d+n1\b|otg|hdmi|aux|v-?power|wire protector|12v/i]
];
// Display order on the website (also the order of the filter buttons).
const ORDER = ['Phones & Tablets', 'Chargers & Cables', 'Audio', 'Power Banks', 'Cases & Screen Protectors', 'SIM & Load',
  'Memory & Storage', 'Wearables', 'Computer Accessories', 'Batteries', 'Accessories'];
const categoryOf = (name) => (CATEGORIES.find(([, re]) => re.test(name)) || ['Accessories'])[0];

// Optional product photos: put docs/assets/products/<slug>.webp|jpg|png
// (slug = lower-case name, non-letters → "-", e.g. "ali-charger-tc.webp").
const slug = (name) => name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const photos = fs.existsSync(PHOTO_DIR) ? new Set(fs.readdirSync(PHOTO_DIR)) : new Set();
const photoFor = (name) => ['webp', 'jpg', 'jpeg', 'png'].map((ext) => `${slug(name)}.${ext}`).find((f) => photos.has(f));

const raw = JSON.parse(fs.readFileSync(src, 'utf8'));
const inventory = (raw.data || raw).inventory;
if (!Array.isArray(inventory)) throw new Error('No "inventory" list found in ' + src);

const products = inventory
  .filter((i) => i && i.name && Number(i.price) > 0 && !EXCLUDE.some((re) => re.test(i.name.trim())))
  .map((i) => {
    const name = i.name.replace(/\s+/g, ' ').trim();
    const item = {
      name,
      category: categoryOf(name),
      price: Number(i.price),
      stock: Math.max(0, Number(i.remaining ?? i.stock) || 0)
    };
    const photo = photoFor(name);
    if (photo) item.image = photo;
    return item;
  })
  .sort((a, b) => ORDER.indexOf(a.category) - ORDER.indexOf(b.category) || (b.stock > 0) - (a.stock > 0) || a.name.localeCompare(b.name));

const out = { updated: new Date().toISOString(), count: products.length, products };
fs.writeFileSync(OUT, JSON.stringify(out, null, 1) + '\n');

const byCat = products.reduce((m, p) => ((m[p.category] = (m[p.category] || 0) + 1), m), {});
console.log(`Wrote ${products.length} products to docs/assets/products.json (${inventory.length - products.length} supplies/services skipped)`);
console.log(Object.entries(byCat).map(([c, n]) => `  ${c}: ${n}`).join('\n'));

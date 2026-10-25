"""
D&G TECH & LOAD — product photo helper

1. Put product photos in the  photos-inbox/  folder (any size, JPG/PNG/WEBP).
   Name each file after the product, e.g.  "ALI CHARGER TC.jpg"  or  "ali-charger-tc.jpg"
   (case, spaces and dashes don't matter). Open photo-checklist.html to see the exact
   name for every product, with a copy button.
2. Run:   npm run photos        (or: python tools/add_photos.py)

For each photo that matches a product, this crops it square, resizes it to 800 px,
saves it as  docs/assets/products/<name>.webp , moves the original to
photos-inbox/done/ , and updates docs/assets/products.json so the website shows it.
Photos it can't match are left in the inbox with suggestions.

Options:  --dry-run   show what would happen without changing anything
Requires: Python 3 + Pillow  (pip install pillow)
"""
import difflib
import html
import json
import re
import shutil
import sys
from pathlib import Path

try:
    from PIL import Image, ImageOps
except ImportError:
    sys.exit('Pillow is not installed. Run:  pip install pillow')
try:  # iPhone HEIC photos (optional)
    from pillow_heif import register_heif_opener
    register_heif_opener()
    HEIC = True
except ImportError:
    HEIC = False

ROOT = Path(__file__).resolve().parent.parent
INBOX = ROOT / 'photos-inbox'
DONE = INBOX / 'done'
PHOTOS = ROOT / 'docs' / 'assets' / 'products'
CATALOG = ROOT / 'docs' / 'assets' / 'products.json'
CHECKLIST = ROOT / 'photo-checklist.html'

SIZE = 800          # output is SIZE x SIZE
QUALITY = 80        # WebP quality
AUTO_MATCH = 0.92   # fuzzy-match score needed to accept a photo without an exact name match
EXTS = {'.jpg', '.jpeg', '.png', '.webp'} | ({'.heic', '.heif'} if HEIC else set())

CATEGORY_ART = {
    'Phones & Tablets': 'phones', 'SIM & Load': 'sim', 'Chargers & Cables': 'chargers', 'Audio': 'audio',
    'Power Banks': 'powerbanks', 'Batteries': 'batteries', 'Cases & Screen Protectors': 'cases',
    'Memory & Storage': 'storage', 'Computer Accessories': 'computer', 'Wearables': 'wearables', 'Accessories': 'accessories'
}


def slug(name):
    """Same rule as tools/sync-products.js."""
    return re.sub(r'[^a-z0-9]+', '-', name.lower()).strip('-')


def norm(text):
    return ' '.join(re.sub(r'[^a-z0-9]+', ' ', text.lower()).split())


def find_photo(name):
    for ext in ('webp', 'jpg', 'jpeg', 'png'):
        f = PHOTOS / f'{slug(name)}.{ext}'
        if f.exists():
            return f.name
    return None


def match(stem, products):
    """Return (product, score, suggestions)."""
    key = norm(stem)
    exact = [p for p in products if norm(p['name']) == key or slug(p['name']) == slug(stem)]
    if len(exact) == 1:
        return exact[0], 1.0, []
    scored = sorted(((difflib.SequenceMatcher(None, key, norm(p['name'])).ratio(), p) for p in products),
                    key=lambda t: t[0], reverse=True)
    best_score, best = scored[0]
    runner_up = scored[1][0] if len(scored) > 1 else 0
    suggestions = [p['name'] for _, p in scored[:3]]
    if best_score >= AUTO_MATCH and best_score - runner_up >= 0.04:
        return best, best_score, suggestions
    return None, best_score, suggestions


def process(src, dest):
    with Image.open(src) as im:
        im = ImageOps.exif_transpose(im).convert('RGB')
        side = min(im.size)
        left, top = (im.width - side) // 2, (im.height - side) // 2
        im = im.crop((left, top, left + side, top + side)).resize((SIZE, SIZE), Image.LANCZOS)
        im.save(dest, 'WEBP', quality=QUALITY, method=6)


def write_checklist(products):
    have = sum(1 for p in products if p.get('image'))
    rows = []
    for p in products:
        img = f"docs/assets/products/{p['image']}" if p.get('image') else f"docs/assets/categories/{CATEGORY_ART.get(p['category'], 'accessories')}.svg"
        fname = slug(p['name']) + '.jpg'
        rows.append(f'''<div class="item {'done' if p.get('image') else 'missing'}">
  <img src="{html.escape(img)}" alt="" loading="lazy">
  <div><strong>{html.escape(p['name'])}</strong><small>{html.escape(p['category'])} · {p['stock']} in stock</small>
  <span class="status">{'✓ Photo added' if p.get('image') else 'Needs photo — name it:'}</span>
  {'' if p.get('image') else f'<code>{html.escape(fname)}</code><button onclick="navigator.clipboard.writeText(\'{html.escape(fname)}\');this.textContent=\'Copied!\'">Copy</button>'}</div>
</div>''')
    CHECKLIST.write_text(f'''<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Product Photo Checklist</title>
<style>
:root{{color-scheme:dark}} body{{margin:0;font:15px system-ui,sans-serif;background:#050914;color:#fff;padding:20px}}
h1{{margin:0 0 4px}} p{{color:#A9B8CC;margin:0 0 14px}} .bar{{display:flex;gap:8px;margin-bottom:16px;flex-wrap:wrap}}
.bar button{{background:#0C1C30;color:#fff;border:1px solid #1d3a63;border-radius:8px;padding:8px 14px;cursor:pointer}}
.bar button.on{{background:#087CFF;border-color:#087CFF}} .meter{{height:10px;background:#0C1C30;border-radius:5px;overflow:hidden;margin-bottom:16px}}
.meter i{{display:block;height:100%;background:#FF9810;width:{have * 100 / max(len(products), 1):.1f}%}}
.grid{{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:10px}}
.item{{display:flex;gap:12px;background:#0C1C30;border:1px solid #1d3a63;border-radius:12px;padding:10px;align-items:center}}
.item img{{width:72px;height:72px;border-radius:8px;object-fit:cover;background:#0a1a33;flex-shrink:0}}
.item small{{display:block;color:#A9B8CC;font-size:12px;margin:2px 0 6px}} .status{{font-size:12px;color:#FF9810;display:block}}
.done .status{{color:#25D366}} code{{background:#050914;padding:2px 6px;border-radius:4px;font-size:12px}}
.item button{{margin-left:6px;font-size:12px;background:#087CFF;color:#fff;border:0;border-radius:6px;padding:3px 8px;cursor:pointer}}
body.only-missing .done{{display:none}}
</style></head><body class="only-missing">
<h1>Product Photo Checklist</h1>
<p>{have} of {len(products)} products have a photo. Save photos in <code>photos-inbox/</code> using the names below, then run <code>npm run photos</code>. (.png and .webp work too.)</p>
<div class="meter"><i></i></div>
<div class="bar"><button class="on" onclick="document.body.classList.add('only-missing');this.classList.add('on');this.nextElementSibling.classList.remove('on')">Needs photo ({len(products) - have})</button><button onclick="document.body.classList.remove('only-missing');this.classList.add('on');this.previousElementSibling.classList.remove('on')">All products ({len(products)})</button></div>
<div class="grid">
{chr(10).join(rows)}
</div></body></html>
''', encoding='utf8')


def main():
    if hasattr(sys.stdout, 'reconfigure'):
        sys.stdout.reconfigure(encoding='utf-8')  # ✓/✗ on Windows consoles
    dry = '--dry-run' in sys.argv
    if not CATALOG.exists():
        sys.exit('docs/assets/products.json not found — run  npm run sync -- <export.json>  first.')
    catalog = json.loads(CATALOG.read_text(encoding='utf8'))
    products = catalog['products']
    INBOX.mkdir(exist_ok=True)
    PHOTOS.mkdir(parents=True, exist_ok=True)

    files = sorted(f for f in INBOX.iterdir() if f.is_file() and f.suffix.lower() in EXTS)
    skipped = sorted(f.name for f in INBOX.iterdir() if f.is_file() and f.suffix.lower() in {'.heic', '.heif'} and not HEIC)
    added, unmatched = [], []
    for f in files:
        product, score, suggestions = match(f.stem, products)
        if not product:
            unmatched.append((f.name, suggestions))
            continue
        dest = PHOTOS / f"{slug(product['name'])}.webp"
        added.append((f.name, product['name'], score, dest.exists()))
        if not dry:
            process(f, dest)
            DONE.mkdir(exist_ok=True)
            shutil.move(str(f), str(DONE / f.name))

    # keep products.json in step with the photos folder
    if not dry:
        for p in products:
            photo = find_photo(p['name'])
            if photo:
                p['image'] = photo
            else:
                p.pop('image', None)
        CATALOG.write_text(json.dumps(catalog, ensure_ascii=False, indent=1) + '\n', encoding='utf8')
    write_checklist(products if not dry else [dict(p, image=p.get('image')) for p in products])

    print(('[dry run] ' if dry else '') + f'{len(added)} photo(s) matched, {len(unmatched)} not matched.')
    for name, prod, score, replaced in added:
        note = ' (replaced existing photo)' if replaced else ''
        fuzzy = '' if score == 1.0 else f'  [closest match, {score:.0%}]'
        print(f'  ✓ {name}  →  {prod}{fuzzy}{note}')
    for name, sugg in unmatched:
        print(f'  ✗ {name}  — rename it to the product name. Closest: {" | ".join(sugg)}')
    for name in skipped:
        print(f'  ! {name}  — HEIC not supported. Run "pip install pillow-heif", or set the camera to "Most Compatible" (JPG).')
    have = sum(1 for p in products if p.get('image'))
    print(f'{have}/{len(products)} products now have photos. Checklist: {CHECKLIST.name}')


if __name__ == '__main__':
    main()

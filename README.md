# D&G Tech & Load — Website

Responsive, multi-page website for **D&G Tech & Load** (2nd Floor, Uwell Building, Hunan, Buenavista, Bohol).
Plain HTML + CSS + vanilla JavaScript. No framework, no runtime dependencies.

Live (GitHub Pages, served from `docs/`): https://darskeeworks-services.github.io/dgtechandload.com/

## Pages
| Page | File | What it does |
|---|---|---|
| Home | `docs/index.html` | Hero, service shortcuts, live featured products, brands, active promos, store info |
| Services | `docs/services.html` | 8 service cards, each with a prefilled Messenger inquiry |
| Products | `docs/products.html` | Catalog from `docs/assets/products.json`: search, category filters, stock status, Details + Inquire |
| Promos | `docs/promos.html` | Promos from `docs/assets/promos/promos.json`; expired ones hide automatically |
| About | `docs/about.html` | Story, mission, verified services, location |
| Contact | `docs/contact.html` | Store info, call / Messenger / directions, validated form → Messenger, map |
| FAQ | `docs/faq.html` | Accessible accordion |
| Partners | `docs/partners.html` | Sponsors, affiliations, sponsored ads, affiliate picks (from `docs/assets/partners.json`) + "advertise with us" |
| Admin (unlisted) | `docs/admin-jtbzunc98ngd.html` | Edit promos, sponsors, affiliations, sponsored ads, affiliate links and product photos |

## Project layout
- `tools/sync-products.js` — turns the store system export into the public product list (`docs/assets/products.json`)
- `tools/build-pages.js` — **page builder.** The shared layout (head/SEO, header, footer, mobile nav, icon sprite) and each page body are defined here once.
- `docs/*.html` — generated output. **Don't hand-edit**; edit `tools/build-pages.js` and rebuild.
- `docs/styles.css` — design system (colors, components, responsive rules)
- `docs/script.js` — shared behaviour: nav, services, FAQ, product catalog, promo loader, contact form. Contact details live in `CONFIG` at the top.
- `docs/promos.js` — Promos page
- `docs/assets/` — images (see below)
- `server.js` — tiny local preview server

## Build & preview
```bash
npm run sync -- data/DandG-store-data.json   # refresh products from the store export
npm run photos       # add product photos from photos-inbox/
npm run build        # regenerate docs/*.html from tools/build-pages.js
npm start            # preview at http://localhost:3000  (PORT=3001 npm start to change port)
```
Node 18+ is the only requirement.

## Deploy (GitHub Pages)
GitHub Pages publishes the `docs/` folder of `main`. After `npm run build`, commit and push the changes in `docs/`.
All links are relative, so the site works under the `/dgtechandload.com/` sub-path.
If you connect a custom domain later, add `docs/CNAME` and update `SITE` at the top of `tools/build-pages.js` (used for canonical URLs, social previews and SEO data), then rebuild.

A backup of the previous live version is tagged `backup/pre-redesign` (`git checkout backup/pre-redesign`).

## Admin page (easiest way to update)
Open **https://darskeeworks-services.github.io/dgtechandload.com/admin-jtbzunc98ngd.html** (bookmark it; it isn't linked anywhere and asks search engines not to index it).

- It edits the live site by committing to GitHub; changes go live about a minute after "Save & publish". Works on a phone.
- **Security:** the page holds no secrets, and the repository is public, so the address is *not* the protection — your **GitHub token** is. Create a fine-grained token (GitHub → Settings → Developer settings → Fine-grained tokens) for resource owner *DarskeeWorks-Services*, only the *dgtechandload.com* repository, permission **Contents: Read and write**, with an expiry. Paste it into the admin page; it stays in that browser only (tick "Remember" only on your own device). If it leaks, delete it on GitHub.
- Tabs: **Promos**, **Sponsors**, **Affiliations**, **Sponsored ads** (paid placements, labelled "Sponsored", one rotated per page, auto-hide after their end date), **Affiliate links** (shown with a commission notice), **Product photos** (take/choose a photo; it's cropped, resized and published).
- Empty sections are hidden on the website, so nothing appears until you add something real.
- ⚠️ The admin commits directly to GitHub, so **run `git pull` before working locally** (before `npm run sync`, `npm run photos` or `npm run build`), otherwise you may overwrite admin changes or lose product photos.

## Updating content
- **Products / stock / prices** — come from the store system export `DandG-store-data.json` (Google Drive):
  1. Download the latest `DandG-store-data.json` from Drive into a `data/` folder in this project (git-ignored).
  2. `npm run sync -- data/DandG-store-data.json` → writes `docs/assets/products.json`
  3. Commit and push `docs/assets/products.json`. The Products page shows the "Stock as of" date.

  ⚠️ The export contains PINs, cash/G-Cash balances, unit costs, sales and expenses. **Never commit it, never make the Drive file public, and never link it from the site.** The sync script copies only name, selling price and stock. Items named `PLASTIC BAG`, `SIM REGISTRATION` and `REPAIR …` are skipped (supplies/services); categories are assigned by name rules in `tools/sync-products.js`.
- **Product photos** — real photos of your own stock:
  1. Open `photo-checklist.html` (created by the command below) to see which products need a photo and the exact file name for each (Copy button).
  2. Save photos into `photos-inbox/` named after the product — e.g. `ali-charger-tc.jpg` or `ALI CHARGER TC.jpg` (case/spaces don't matter; small typos are tolerated).
  3. `npm run photos` (needs Python 3 + `pip install pillow`; add `pip install pillow-heif` for iPhone HEIC photos). Each matched photo is cropped square, resized to 800 px WebP into `docs/assets/products/`, and `products.json` is updated. Unmatched photos stay in the inbox with suggestions. `npm run photos -- --dry-run` previews.
  4. Commit and push `docs/assets/products/` and `docs/assets/products.json`.

  Products without a photo show a generic illustration for their category (`docs/assets/categories/`), labelled "Photo coming soon" in the details view. Don't use photos copied from online shops — they're the sellers' copyright.
- **Promos** — edit `docs/assets/promos/promos.json` (instructions inside). Optional `validFrom` / `validUntil` dates hide a promo outside its dates. The 2 newest active promos also show on the home page.
- **FAQ answers / service descriptions** — `faqs` and `services` arrays in `docs/script.js`.
- **Phone, Messenger, WhatsApp, Shopee, directions** — `CONFIG` in `docs/script.js` *and* the constants at the top of `tools/build-pages.js`.

## Assets
| File | Source |
|---|---|
| `assets/dg-logo.png`, `dg-logo.webp` | Official logo, cropped from the owner's store banner |
| `assets/dg-mark.webp` / `.png` | "D and G" logo mark (header/footer), cropped from the banner |
| `assets/favicon.png`, `apple-touch-icon.png` | Built from the logo mark |
| `assets/store-identity.webp` | Official store banner |
| `assets/og-image.jpg` | 1200×630 crop of the banner for social sharing |
| `assets/categories/*.svg` | **Illustrations** — generic per-category images shown until a real photo exists |
| `assets/products/*.webp` | Real product photos added with `npm run photos` |
| `assets/hero-devices.svg` | **Illustration** (generic devices) — not a photo of real stock |
| `assets/promos/promo-sample-1.svg` | Sample promo graphic |

### Missing — needs the owner
- **Original logo file** (transparent PNG/SVG). The current logo is a crop from the banner, so it has a background.
- **Real store photos** (storefront, interior) → would go in `assets/store-photo.webp`. Until then the banner is shown.
- **Hero image** (`hero-tech-load.webp`). The hero currently uses an illustration.
- **Product photos** of your actual stock — see "Updating content" above (`npm run photos`).
- **Real promos** — the 3 entries in `promos.json` are samples (`promo-sample-2.jpg` / `-3.jpg` don't exist yet).
- **Facts to confirm before adding:** accepted payment methods, warranty period, Messenger page username (`m.me/dandgtechandload`), TikTok/other social links.

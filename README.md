# D&G Tech & Load — Website

A futuristic, mobile-first single-page site for **D&G Tech & Load** (Buenavista, Bohol).
Pure HTML + CSS + vanilla JS. No backend, no build step — deploy the folder as-is.

## Files
- `index.html` — markup, SEO meta, Open Graph/Twitter cards, Schema.org LocalBusiness
- `styles.css` — neon-tech design system, fully responsive
- `script.js` — catalog (search/filter/modal), scroll reveal, counters, FAQ, form → Messenger

## ⚙️ Before going live — edit these
1. **Contact details** — top of `script.js`, the `CONFIG` object:
   ```js
   phone: '+639067571561',   // real tap-to-call number
   messenger: 'https://www.facebook.com/dandgtechandload',
   whatsapp: '639937338509', // digits only, country code, no +
   ```
2. **Products** — edit the `products` array in `script.js`.
3. **Google Map** — in `index.html`, replace the `<iframe src="…">` with your exact
   place embed (Google Maps → Share → Embed a map). Same for the "Get Directions" link.
4. **Social / SEO** — update `og:url`, canonical URL, `sameAs` Facebook link, and the
   phone in the Schema.org block in `index.html`.
5. **Business hours** — update both the Schema.org `openingHoursSpecification` and the
   text in the Map info card.
6. **Images** — emoji are used as lightweight placeholders. Swap for real product photos
   and add `assets/og-image.jpg` (1200×630) for social sharing.

## 🚀 Deploy
- **Netlify:** drag-and-drop this folder onto app.netlify.com, or connect the repo.
- **Vercel:** `vercel` in this folder (Framework Preset: *Other*), or import the repo.
- **Any static host:** upload the three files.

No environment variables, database, or server required.
"# dandg.com" 

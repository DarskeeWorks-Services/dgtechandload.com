/* =====================================================
   D&G TECH & LOAD — page builder
   Shared layout (head, header, footer, mobile nav, icon sprite)
   is defined once here and written into each static page in docs/.

   Run after editing:  npm run build
   Output is plain HTML — GitHub Pages serves docs/ as-is.
   ===================================================== */
const fs = require('fs');
const path = require('path');

const OUT = path.join(__dirname, '..', 'docs');

/* ---------- verified business details ---------- */
const SITE = 'https://darskeeworks-services.github.io/dgtechandload.com/'; // change if a custom domain is connected
const PHONE = '+639067571561';
const PHONE_LABEL = '+63 906 757 1561';
const MSGR = 'https://m.me/dandgtechandload';
const FB = 'https://www.facebook.com/dandgtechandload';
const SHOPEE = 'https://collshp.com/dgtechandload?view=storefront';
const DIRECTIONS = 'https://www.google.com/maps/dir/?api=1&amp;destination=10.086154720188826,124.11904679300929';
const ADDRESS_HTML = '2nd Floor, Uwell Building,<br>Hunan, Buenavista, Bohol';

/* ---------- icon sprite (inline SVG, 24px grid) ---------- */
const ICONS = {
  phone: '<rect x="6" y="2" width="12" height="20" rx="2.5"/><path d="M11 18h2"/>',
  screen: '<rect x="6" y="2" width="12" height="20" rx="2.5"/><path d="M9 6.5l3 3.5-2 2 4 4.5"/>',
  battery: '<rect x="7" y="4" width="10" height="17" rx="2"/><path d="M10 2h4"/><path d="M12.6 8 10.2 12.6h3.6L11.4 17"/>',
  unlock: '<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 7.6-1.7"/><path d="M12 15v2"/>',
  update: '<circle cx="12" cy="12" r="2.6"/><path d="M20 12a8 8 0 0 1-14.3 4.9"/><path d="M4 12a8 8 0 0 1 14.3-4.9"/><path d="M18.5 3v4.2h-4.2"/><path d="M5.5 21v-4.2h4.2"/>',
  tools: '<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/><path d="m3 5 2-2 4 4-2 2z"/><path d="m8.5 8.5 11 11"/>',
  peso: '<rect x="6" y="2" width="12" height="20" rx="2.5"/><path d="M10.2 16V8h2.4a2 2 0 0 1 0 4h-2.4"/><path d="M9 10h6"/>',
  plug: '<path d="M9 2v5M15 2v5"/><path d="M6 7h12v4a6 6 0 0 1-12 0z"/><path d="M12 17v5"/>',
  sim: '<path d="M8 2h7l4 4v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5a3 3 0 0 1 3-3z"/><rect x="8.5" y="11" width="7" height="7" rx="1"/><path d="M12 11v7M8.5 14.5h7"/>',
  headphones: '<path d="M4 15v-3a8 8 0 0 1 16 0v3"/><rect x="3" y="14" width="4.5" height="7" rx="1.5"/><rect x="16.5" y="14" width="4.5" height="7" rx="1.5"/>',
  watch: '<rect x="6" y="6" width="12" height="12" rx="3"/><path d="M9 6l1-4h4l1 4M9 18l1 4h4l1-4"/><path d="M12 9.5V12l1.5 1"/>',
  shield: '<path d="M12 2.5 4.5 5.5v6c0 4.6 3.2 8.3 7.5 10 4.3-1.7 7.5-5.4 7.5-10v-6z"/><path d="m8.8 12 2.2 2.2 4.2-4.4"/>',
  tag: '<path d="M3 12V4a1 1 0 0 1 1-1h8l9 9-9 9z"/><circle cx="7.5" cy="7.5" r="1.5"/>',
  wrench: '<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>',
  pin: '<path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  calendar: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>',
  call: '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/>',
  messenger: '<path fill="currentColor" stroke="none" d="M12 2C6.4 2 2 6.1 2 11.6c0 2.9 1.2 5.4 3.1 7.1V22l2.9-1.6c1.2.3 2.5.5 3.9.5 5.6 0 10-4.1 10-9.6S17.6 2 12 2zm1 12.9-2.5-2.7-5 2.7 5.5-5.8 2.6 2.7 4.9-2.7-5.5 5.8z"/>',
  facebook: '<path fill="currentColor" stroke="none" d="M14 8h3V4h-3c-2.8 0-4.5 1.8-4.5 4.6V11H7v4h2.5v7h4v-7h3l.5-4h-3.5V9c0-.6.4-1 1-1z"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
  arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  directions: '<path d="M3 11 21 3l-8 18-2-8z"/>',
  home: '<path d="M3 11 12 3l9 8"/><path d="M5 10v10h5v-6h4v6h5V10"/>',
  grid: '<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>',
  bag: '<path d="M5 8h14l-1 13H6z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/>',
  shopee: '<path d="M4.5 7.5h15l-1.2 13.5H5.7z"/><path d="M8.5 7.5V6.5a3.5 3.5 0 0 1 7 0v1"/><path d="M14.2 11.3c-.5-.6-1.3-.9-2.2-.9-1.2 0-2 .6-2 1.5 0 2 4.3 1.2 4.3 3.4 0 1-.9 1.7-2.3 1.7-1 0-1.9-.4-2.4-1"/>',
  megaphone: '<path d="M3 11v2a1 1 0 0 0 1 1h3l6 4V6L7 10H4a1 1 0 0 0-1 1z"/><path d="M17 8.5a5 5 0 0 1 0 7"/><path d="M7 14l1 6h2.5"/>',
  more: '<circle cx="5" cy="12" r="1.3"/><circle cx="12" cy="12" r="1.3"/><circle cx="19" cy="12" r="1.3"/>',
  heart: '<path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/>',
  star: '<path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z"/>',
  store: '<path d="M4 9.5 5.5 4h13L20 9.5"/><path d="M4 9.5a2.7 2.7 0 0 0 5.3 0 2.7 2.7 0 0 0 5.4 0 2.7 2.7 0 0 0 5.3 0"/><path d="M5 12v8h14v-8"/><path d="M10 20v-5h4v5"/>',
  chevron: '<path d="m6 9 6 6 6-6"/>',
  chat: '<path d="M21 12a8.5 8.5 0 0 1-12.6 7.4L3 21l1.6-5.2A8.5 8.5 0 1 1 21 12z"/>',
  bolt: '<path d="M13 2 4 14h7l-1 8 9-12h-7z"/>',
  send: '<path d="M22 2 11 13"/><path d="M22 2 15 22l-4-9-9-4z"/>',
  close: '<path d="M6 6l12 12M18 6 6 18"/>',
  target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.2"/>',
  check: '<path d="m5 12.5 4.5 4.5L19 7.5"/>',
  info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.5h.01"/>'
};
const sprite = '<svg xmlns="http://www.w3.org/2000/svg" style="display:none" aria-hidden="true">\n' +
  Object.entries(ICONS).map(([k, v]) => `    <symbol id="i-${k}" viewBox="0 0 24 24">${v}</symbol>`).join('\n') + '\n  </svg>';
const ic = (n) => `<svg class="ic" aria-hidden="true"><use href="#i-${n}"/></svg>`;

/* ---------- shared components ---------- */
const NAV = [
  ['home', 'index.html', 'Home'],
  ['services', 'services.html', 'Services'],
  ['products', 'products.html', 'Products'],
  ['promos', 'promos.html', 'Promos'],
  ['about', 'about.html', 'About'],
  ['contact', 'contact.html', 'Contact'],
  ['faq', 'faq.html', 'FAQ']
];

// Official logo mark (cropped from the owner's store identity banner) + store name
const brand = (cls = '') => `<a href="index.html" class="brand ${cls}" aria-label="D and G Tech &amp; Load — home">
        <img class="brand__logo" src="assets/dg-mark.webp" alt="" width="360" height="188">
        <span class="brand__text"><strong>TECH <span class="amp">&amp;</span> LOAD</strong><small>Your One Stop Tech Solution!</small></span>
      </a>`;

const header = (page) => `<header class="header" id="header">
    <nav class="nav container" aria-label="Main">
      ${brand()}
      <div class="nav__menu" id="navMenu">
        <ul class="nav__links">
${NAV.map(([id, href, label]) => `          <li><a href="${href}"${id === page ? ' class="active" aria-current="page"' : ''}>${label}</a></li>`).join('\n')}
        </ul>
        <a class="btn btn--blue btn--sm" href="${MSGR}" data-messenger target="_blank" rel="noopener">${ic('messenger')} Messenger</a>
      </div>
      <button class="nav__toggle" id="navToggle" aria-label="Open menu" aria-expanded="false" aria-controls="navMenu">
        <span></span><span></span><span></span>
      </button>
    </nav>
  </header>`;

const footer = (page) => `<footer class="footer">
    <div class="container">
      <div class="footer__inner">
        ${brand('brand--footer')}
        <nav class="footer__links" aria-label="Footer">
${NAV.map(([id, href, label]) => `          <a href="${href}"${id === page ? ' class="active"' : ''}>${label}</a>`).join('\n')}
        </nav>
        <div class="socials">
          <a href="${FB}" target="_blank" rel="noopener" aria-label="D and G Tech &amp; Load on Facebook">${ic('facebook')}</a>
          <a href="${MSGR}" data-messenger target="_blank" rel="noopener" aria-label="Message us on Messenger">${ic('messenger')}</a>
          <a class="socials__shopee" href="${SHOPEE}" data-shopee target="_blank" rel="noopener" aria-label="Shop D and G Tech &amp; Load on Shopee">${ic('shopee')}</a>
          <a href="tel:${PHONE}" aria-label="Call ${PHONE_LABEL}">${ic('call')}</a>
        </div>
      </div>
      <div class="footer__bar">
        <span>© <span data-year>2026</span> D&amp;G Tech &amp; Load · 2nd Floor, Uwell Building, Hunan, Buenavista, Bohol</span>
        <span>Phones • Repair • Accessories • E-Load</span>
      </div>
    </div>
  </footer>`;

const bottomNav = (page) => {
  const items = [['home', 'index.html', 'home', 'Home'], ['services', 'services.html', 'grid', 'Services'],
    ['products', 'products.html', 'bag', 'Products'], ['promos', 'promos.html', 'megaphone', 'Promos']];
  return `<nav class="bottom-nav" aria-label="Quick mobile navigation">
${items.map(([id, href, i, label]) => `    <a href="${href}"${id === page ? ' class="active" aria-current="page"' : ''}>${ic(i)}${label}</a>`).join('\n')}
    <button type="button" data-menu-toggle aria-controls="navMenu" aria-expanded="false"${['about', 'contact', 'faq'].includes(page) ? ' class="active"' : ''}>${ic('more')}More</button>
  </nav>`;
};

const productModal = `<div class="modal" id="productModal" hidden>
    <div class="modal__backdrop" data-close></div>
    <div class="modal__card" role="dialog" aria-modal="true" aria-labelledby="modalName">
      <button class="modal__close" data-close aria-label="Close">${ic('close')}</button>
      <div class="modal__media" id="modalImage"></div>
      <div class="modal__body">
        <span class="modal__cat" id="modalCat"></span>
        <h3 id="modalName"></h3>
        <p class="modal__price" id="modalPrice"></p>
        <p class="modal__desc" id="modalDesc"></p>
        <div class="modal__actions">
          <a class="btn btn--blue" id="modalMsgr" target="_blank" rel="noopener">${ic('messenger')} Messenger</a>
          <a class="btn btn--wa" id="modalWa" target="_blank" rel="noopener">${ic('chat')} WhatsApp</a>
          <a class="btn btn--ghost" id="modalCall" href="tel:${PHONE}">${ic('call')} Call</a>
          <a class="btn btn--shopee modal__shopee" href="${SHOPEE}" data-shopee target="_blank" rel="noopener">${ic('shopee')} Order on Shopee</a>
        </div>
      </div>
    </div>
  </div>`;

const BRANDS = [['Apple', 'apple'], ['SAMSUNG', 'samsung'], ['vivo', 'vivo'], ['oppo', 'oppo'],
  ['realme', 'realme'], ['mi', 'mi'], ['TECNO', 'tecno'], ['Infinix', 'infinix']];
const brandsRow = `<ul class="brands-row" aria-label="Brands we carry">
${BRANDS.map(([n, c]) => `          <li class="brand-tile brand-tile--${c}">${n}</li>`).join('\n')}
        </ul>`;

// "Order on Shopee" call-to-action (home + products pages)
const shopeeBanner = `<a class="shopee-banner reveal" href="${SHOPEE}" data-shopee target="_blank" rel="noopener">
          <span class="shopee-banner__icon">${ic('shopee')}</span>
          <span class="shopee-banner__text"><strong>Prefer to order online?</strong> Shop our store on Shopee — delivered to your door.</span>
          <span class="btn btn--shopee btn--sm">Shop on Shopee ${ic('arrow')}</span>
        </a>`;

const storeInfo = `<ul class="info-list">
            <li>${ic('pin')}<div>${ADDRESS_HTML}</div></li>
            <li>${ic('clock')}<div>Mon–Sat: 8:00 AM – 7:00 PM<small>Sun: 9:00 AM – 6:00 PM</small></div></li>
            <li>${ic('call')}<div><a href="tel:${PHONE}">${PHONE_LABEL}</a></div></li>
            <li>${ic('shopee')}<div>Order online: <a href="${SHOPEE}" data-shopee target="_blank" rel="noopener">our Shopee store</a></div></li>
          </ul>`;
const storeButtons = `<div class="btn-row">
            <a class="btn btn--orange" href="${DIRECTIONS}" data-directions target="_blank" rel="noopener">${ic('directions')} Get Directions</a>
            <a class="btn btn--blue" href="${MSGR}" data-messenger target="_blank" rel="noopener">${ic('messenger')} Message Us</a>
          </div>`;

const identityImg = (cls = '') => `<img${cls ? ` class="${cls}"` : ''} src="assets/store-identity.webp" alt="D and G Tech &amp; Load store banner: phones, accessories, repair, unlock, G-Cash and E-Load. Visit us at 2nd Floor, Uwell Building, Hunan, Buenavista, Bohol." loading="lazy" width="1448" height="1086">`;

const pageHead = (title, sub, narrow) => `
    <section class="page-head">
      <div class="container${narrow ? ' container--narrow' : ''}">
        <h1>${title}</h1>
        <p>${sub}</p>
      </div>
    </section>`;

/* ================= PAGE BODIES ================= */
const PAGES = {};

PAGES.home = {
  file: 'index.html',
  title: 'D&amp;G Tech &amp; Load — Phone Repair, Accessories, G-Cash &amp; E-Load | Buenavista, Bohol',
  desc: 'D&amp;G Tech &amp; Load in Buenavista, Bohol — your one-stop tech solution. Phone repair, screen &amp; battery replacement, unlocking, accessories, G-Cash and E-Load.',
  canonical: '',
  modal: productModal,
  main: `
    <!-- HERO -->
    <section class="hero" id="home">
      <div class="container">
        <div class="hero__card">
          <div class="hero__content">
            <h1 class="hero__title">Your Tech<br>Problems, <span class="script">Solved.</span></h1>
            <p class="tagline">Phones <i>•</i> Accessories <i>•</i> Repair <i>•</i> Unlock <i>•</i> <span class="nowrap">G-Cash &amp; E-Load</span></p>
            <p class="hero__lede">Phone repair, screen and battery replacement, unlocking, accessories, E-Load and G-Cash — all in one store in Buenavista, Bohol.</p>
            <div class="hero__cta">
              <a class="btn btn--orange" href="${MSGR}" data-messenger target="_blank" rel="noopener">${ic('messenger')} Message Us on Messenger</a>
              <a class="btn btn--outline" href="${DIRECTIONS}" data-directions target="_blank" rel="noopener">${ic('directions')} Get Directions</a>
            </div>
            <p class="hero__addr">${ic('pin')} 2nd Floor, Uwell Building, Hunan, Buenavista, Bohol</p>
          </div>
          <div class="hero__visual">
            <img src="assets/hero-devices.svg" alt="Illustration of smartphones, wireless earbuds and a smartwatch" width="640" height="520">
          </div>
        </div>
        <nav class="service-strip" id="serviceStrip" aria-label="Our services"><!-- injected by script.js --></nav>
      </div>
    </section>

    <!-- FEATURED PRODUCTS (live stock) -->
    <section class="section section--light" id="products">
      <div class="container">
        <div class="section-head">
          <div>
            <h2 class="section-title">Our Products</h2>
            <p class="section-sub">Phones, accessories and more — in stock at our store.</p>
          </div>
          <a class="link-more" href="products.html">View All Products ${ic('arrow')}</a>
        </div>
        <div class="home-products" id="homeProducts"><!-- injected by script.js --></div>
        ${shopeeBanner}
      </div>
    </section>

    <!-- BRANDS -->
    <section class="section section--tight">
      <div class="container">
        <h2 class="section-title" style="margin-bottom:20px">Brands We Carry</h2>
        ${brandsRow}
      </div>
    </section>

    <!-- PROMOS (from assets/promos/promos.json; hidden when there are no active promos) -->
    <section class="section section--tight" id="homePromos" hidden>
      <div class="container">
        <div class="section-head">
          <div>
            <h2 class="section-title">Latest Promos</h2>
            <p class="section-sub">Current offers from our store.</p>
          </div>
          <a class="link-more" href="promos.html">View All Promos ${ic('arrow')}</a>
        </div>
        <div class="home-promos" id="homePromoList"></div>
      </div>
    </section>

    <!-- WHY CHOOSE -->
    <section class="section section--tight">
      <div class="container">
        <h2 class="section-title" style="margin-bottom:24px">Why Choose D&amp;G Tech &amp; Load?</h2>
        <div class="why-row">
          <div class="why-item reveal"><span class="why-item__icon">${ic('store')}</span><div><h3>One-Stop Shop</h3><p>Phones, repairs, accessories and load in one place.</p></div></div>
          <div class="why-item reveal"><span class="why-item__icon">${ic('messenger')}</span><div><h3>Easy to Reach</h3><p>Message us anytime for quotes and stock checks.</p></div></div>
          <div class="why-item reveal"><span class="why-item__icon">${ic('wrench')}</span><div><h3>Repairs In-Store</h3><p>Screens, batteries, unlocking and software.</p></div></div>
          <div class="why-item reveal"><span class="why-item__icon">${ic('pin')}</span><div><h3>Convenient Location</h3><p>Uwell Building, Hunan, Buenavista.</p></div></div>
        </div>
      </div>
    </section>

    <!-- SLOGAN + VISIT BAR (store identity) -->
    <section class="section section--tight">
      <div class="container">
        <p class="slogan">Your One Stop <span>Tech</span> Solution!</p>
        <a class="visit-bar reveal" href="${DIRECTIONS}" data-directions target="_blank" rel="noopener" aria-label="Get directions to 2nd Floor, Uwell Building, Hunan, Buenavista, Bohol">
          ${ic('pin')}
          <span><small>Visit us at:</small>2nd Floor, Uwell Building, Hunan, Buenavista Bohol</span>
        </a>
      </div>
    </section>

    <!-- STORE INFO -->
    <section class="section section--light">
      <div class="container">
        <div class="panel panel--light store-card">
          <div class="store-card__photo">
            ${identityImg()}
          </div>
          <div>
            <h2>Visit Our Store</h2>
            ${storeInfo}
            ${storeButtons}
          </div>
        </div>
      </div>
    </section>`
};

PAGES.services = {
  file: 'services.html',
  title: 'Our Services — Phone Repair, Unlocking, G-Cash &amp; E-Load | D&amp;G Tech &amp; Load',
  desc: 'Phone repair, screen and battery replacement, unlocking, software updates, E-Load, G-Cash, SIM and accessories at D&amp;G Tech &amp; Load, Buenavista, Bohol.',
  canonical: 'services.html',
  main: pageHead('Our Services', 'Complete tech and digital solutions for your everyday needs. Tap “Inquire” to message us about any service.') + `
    <section class="section" style="padding-top:0">
      <div class="container">
        <div class="services-grid" id="servicesGrid"><!-- injected by script.js --></div>

        <div class="cta-banner reveal">
          <div class="cta-banner__text">
            <h2>Need a service? Message us on Messenger for a quick quote.</h2>
            <div class="btn-row" style="max-width:420px">
              <a class="btn btn--orange" href="${MSGR}" data-messenger target="_blank" rel="noopener">${ic('messenger')} Message Us</a>
              <a class="btn btn--ghost" href="tel:${PHONE}">${ic('call')} Call Us</a>
            </div>
          </div>
          <div class="cta-banner__art"><img src="assets/hero-devices.svg" alt="" loading="lazy" width="640" height="520"></div>
        </div>
      </div>
    </section>`
};

PAGES.products = {
  file: 'products.html',
  title: 'Products — Phones, Accessories &amp; SIM | D&amp;G Tech &amp; Load',
  desc: 'Browse live stock of phones, chargers, earbuds, cases and SIM cards at D&amp;G Tech &amp; Load, Buenavista, Bohol. Message us to reserve.',
  canonical: 'products.html',
  modal: productModal,
  main: `
    <section class="page-head">
      <div class="container">
        <h1>Our Products</h1>
        <p>Prices and stock from our store inventory.</p>
        <p class="catalog-updated" id="catalogUpdated"></p>
        <div style="margin-top:18px">${shopeeBanner}</div>
        <div style="margin-top:20px">${brandsRow}</div>
      </div>
    </section>
    <section class="section" style="padding-top:0">
      <div class="container">
        <div class="catalog-controls">
          <div class="search-box">
            <label class="sr-only" for="productSearch">Search products</label>
            <input type="search" id="productSearch" placeholder="Search products…" autocomplete="off" />
            ${ic('search')}
          </div>
          <div class="filter-chips" id="filterChips" role="group" aria-label="Filter by category"><!-- injected by script.js --></div>
        </div>
        <p class="sr-only" id="catalogStatus" role="status" aria-live="polite"></p>
        <div class="products-grid" id="productsGrid"><!-- injected by script.js --></div>
        <div class="catalog-empty" id="catalogEmpty" hidden>
          <p id="catalogEmptyText">No products match your search.</p>
          <a class="btn btn--blue btn--sm" href="${MSGR}" data-messenger target="_blank" rel="noopener">${ic('messenger')} Ask us on Messenger</a>
        </div>
      </div>
    </section>`
};

PAGES.promos = {
  file: 'promos.html',
  title: 'Promos &amp; Updates — D&amp;G Tech &amp; Load | Buenavista, Bohol',
  desc: 'Latest promos, store news and updates from D&amp;G Tech &amp; Load in Buenavista, Bohol.',
  canonical: 'promos.html',
  scripts: ['promos.js'],
  modal: `<div class="modal" id="promoModal" hidden>
    <div class="modal__backdrop" data-close></div>
    <div class="modal__card" role="dialog" aria-modal="true" aria-labelledby="pmTitle">
      <button class="modal__close" data-close aria-label="Close">${ic('close')}</button>
      <div class="modal__media" id="pmMedia"></div>
      <div class="modal__body">
        <span class="modal__cat" id="pmType"></span>
        <h3 id="pmTitle"></h3>
        <p class="promo-date" id="pmDate"></p>
        <p class="modal__desc" id="pmText"></p>
        <div class="modal__actions">
          <a class="btn btn--orange" id="pmCta" target="_blank" rel="noopener"></a>
          <a class="btn btn--ghost" href="products.html">View Products</a>
        </div>
      </div>
    </div>
  </div>`,
  main: pageHead('Latest Promos', 'Current offers and news from our store. Tap any post for full details.') + `
    <section class="section" style="padding-top:0">
      <div class="container">
        <div class="catalog-controls">
          <div class="filter-chips" id="promoFilters" role="group" aria-label="Filter promos"><!-- injected by promos.js --></div>
        </div>
        <div class="promos-grid" id="promosGrid"><!-- injected by promos.js --></div>
        <div class="catalog-empty" id="promosEmpty" hidden>
          <p id="promosEmptyText"></p>
          <a class="btn btn--blue btn--sm" href="${MSGR}" data-messenger target="_blank" rel="noopener">${ic('messenger')} Ask about current deals</a>
        </div>
      </div>
    </section>`
};

PAGES.about = {
  file: 'about.html',
  title: 'About Us — D&amp;G Tech &amp; Load | Buenavista, Bohol',
  desc: 'D&amp;G Tech &amp; Load is a local tech store in Buenavista, Bohol offering phone repair, accessories, E-Load and G-Cash services.',
  canonical: 'about.html',
  main: pageHead('About D&amp;G Tech &amp; Load', 'Your local tech partner in Buenavista, Bohol.') + `
    <section class="section" style="padding-top:0">
      <div class="container">
        <div class="panel panel--light story reveal">
          <div>
            <h2>Our Story</h2>
            <p>D&amp;G Tech &amp; Load started with a simple goal: to provide reliable, affordable and convenient tech solutions for our community.</p>
            <p>From phone repairs to accessories and digital services like E-Load and G-Cash, we bring everyday tech needs together under one roof — on the 2nd floor of the Uwell Building in Hunan, Buenavista.</p>
            <div class="values">
              <div class="value">${ic('shield')}<h3>Reliable Service</h3></div>
              <div class="value">${ic('star')}<h3>Quality Products</h3></div>
              <div class="value">${ic('heart')}<h3>Customer First</h3></div>
              <div class="value">${ic('store')}<h3>Local Business</h3></div>
            </div>
          </div>
          <div class="story__photo story__photo--identity">
            ${identityImg()}
          </div>
        </div>

        <div class="about-grid">
          <div class="panel about-card reveal">
            <h2>${ic('target')} Our Mission</h2>
            <p>To make phone repair, gadgets and digital services simple and accessible for everyone in Buenavista — with honest advice and friendly, convenient service in one place.</p>
          </div>
          <div class="panel about-card reveal">
            <h2>${ic('grid')} What We Offer</h2>
            <ul class="check-list" id="aboutServices"><!-- injected by script.js --></ul>
          </div>
          <div class="panel about-card reveal">
            <h2>${ic('pin')} Find Us</h2>
            ${storeInfo}
            ${storeButtons}
          </div>
        </div>
      </div>
    </section>`
};

PAGES.contact = {
  file: 'contact.html',
  title: 'Contact &amp; Location — D&amp;G Tech &amp; Load | Buenavista, Bohol',
  desc: 'Visit D&amp;G Tech &amp; Load at 2nd Floor, Uwell Building, Hunan, Buenavista, Bohol. Call, message us on Messenger, or get directions.',
  canonical: 'contact.html',
  main: pageHead('Get in Touch', 'Visit, call, or send us a message — we’re happy to help.') + `
    <section class="section" style="padding-top:0">
      <div class="container">
        <div class="contact-grid">
          <div class="panel panel--light reveal">
            <h2>Store Information</h2>
            ${storeInfo}
            ${storeButtons}
            <a class="btn btn--ghost-dark btn--block" style="margin-top:10px" href="tel:${PHONE}">${ic('call')} Call ${PHONE_LABEL}</a>
          </div>

          <div class="panel panel--light reveal">
            <h2>Send Us a Message</h2>
            <p class="form-info">${ic('info')}<span>This form opens <strong>Messenger</strong> with your message filled in, ready to send. Nothing is stored or sent by this website itself.</span></p>
            <form class="contact-form" id="contactForm" novalidate>
              <div class="field-row">
                <div class="field">
                  <label for="cName">Your Name</label>
                  <input type="text" id="cName" name="name" required autocomplete="name" aria-describedby="cName-err" />
                  <span class="field-err" id="cName-err"></span>
                </div>
                <div class="field">
                  <label for="cPhone">Phone Number</label>
                  <input type="tel" id="cPhone" name="phone" required autocomplete="tel" pattern="[0-9+\\s-]{7,}" aria-describedby="cPhone-err" />
                  <span class="field-err" id="cPhone-err"></span>
                </div>
              </div>
              <div class="field">
                <label for="cService">Service Needed</label>
                <select id="cService" name="service" required aria-describedby="cService-err">
                  <option value="" disabled selected>Select a service…</option>
                  <option>Phone Purchase</option>
                  <option>Phone Repair</option>
                  <option>Screen Replacement</option>
                  <option>Battery Replacement</option>
                  <option>Phone Unlocking</option>
                  <option>Software Update</option>
                  <option>E-Load / G-Cash</option>
                  <option>SIM &amp; Load</option>
                  <option>Accessories</option>
                  <option>Other</option>
                </select>
                <span class="field-err" id="cService-err"></span>
              </div>
              <div class="field">
                <label for="cMessage">Your Message</label>
                <textarea id="cMessage" name="message" rows="4" required aria-describedby="cMessage-err"></textarea>
                <span class="field-err" id="cMessage-err"></span>
              </div>
              <label class="consent">
                <input type="checkbox" id="cConsent" name="consent" required />
                <span>I consent to D&amp;G Tech &amp; Load using my submitted information solely to respond to my inquiry in accordance with applicable privacy regulations.</span>
              </label>
              <button type="submit" class="btn btn--blue btn--block">${ic('send')} Continue in Messenger</button>
              <p class="form-note" id="formNote" role="status" aria-live="polite"></p>
            </form>
          </div>
        </div>

        <div class="map-frame reveal">
          <iframe
            title="Map showing D&amp;G Tech &amp; Load in Buenavista, Bohol"
            src="https://www.openstreetmap.org/export/embed.html?bbox=124.11304679300929%2C10.082154720188826%2C124.12504679300929%2C10.090154720188826&amp;layer=mapnik&amp;marker=10.086154720188826%2C124.11904679300929"
            loading="lazy"
            referrerpolicy="no-referrer-when-downgrade"
            allowfullscreen></iframe>
        </div>
      </div>
    </section>`
};

PAGES.faq = {
  file: 'faq.html',
  title: 'FAQ — D&amp;G Tech &amp; Load | Buenavista, Bohol',
  desc: 'Answers to common questions about services, repairs, store hours, location, products and how to contact D&amp;G Tech &amp; Load.',
  canonical: 'faq.html',
  main: pageHead('Frequently Asked Questions', 'Find answers to the most common questions.', true) + `
    <section class="section" style="padding-top:0">
      <div class="container container--narrow">
        <div class="faq" id="faqList"><!-- injected by script.js --></div>
        <div class="faq-more">
          <p>Still have a question?</p>
          <a class="btn btn--blue" href="${MSGR}" data-messenger target="_blank" rel="noopener">${ic('messenger')} Ask us on Messenger</a>
        </div>
      </div>
    </section>`
};

/* ---------- local SEO (home page only) ---------- */
const schema = `<script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "ElectronicsStore",
    "name": "D&G Tech & Load",
    "image": "${SITE}assets/og-image.jpg",
    "logo": "${SITE}assets/dg-logo.png",
    "description": "Technology retail store, mobile phone repair center and digital services provider in Buenavista, Bohol.",
    "slogan": "Your One Stop Tech Solution!",
    "@id": "${SITE}",
    "url": "${SITE}",
    "telephone": "+63-906-757-1561",
    "priceRange": "₱₱",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "2nd Floor, Uwell Building, Hunan",
      "addressLocality": "Buenavista",
      "addressRegion": "Bohol",
      "postalCode": "6333",
      "addressCountry": "PH"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "10.086154720188826",
      "longitude": "124.11904679300929"
    },
    "openingHoursSpecification": [{
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],
      "opens": "08:00",
      "closes": "19:00"
    },{
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": "Sunday",
      "opens": "09:00",
      "closes": "18:00"
    }],
    "sameAs": [
      "${FB}",
      "${SHOPEE}"
    ]
  }
  </script>`;

function page(id, p) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="theme-color" content="#050914" />

  <title>${p.title}</title>
  <meta name="description" content="${p.desc}" />
  <meta name="author" content="D&amp;G Tech &amp; Load" />
  <link rel="canonical" href="${SITE}${p.canonical}" />

  <meta property="og:type" content="${id === 'home' ? 'business.business' : 'website'}" />
  <meta property="og:title" content="${p.title}" />
  <meta property="og:description" content="${p.desc}" />
  <meta property="og:image" content="${SITE}assets/og-image.jpg" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:url" content="${SITE}${p.canonical}" />
  <meta property="og:locale" content="en_PH" />
  <meta property="og:site_name" content="D&amp;G Tech &amp; Load" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:image" content="${SITE}assets/og-image.jpg" />

  <link rel="icon" type="image/png" href="assets/favicon.png" />
  <link rel="apple-touch-icon" href="assets/apple-touch-icon.png" />

  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@600;700;800&family=Inter:wght@400;500;600;700&family=Kaushan+Script&family=Oswald:wght@500;600;700&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="styles.css" />
${id === 'home' ? '\n  ' + schema + '\n' : ''}</head>

<body data-page="${id}">
  <a class="skip-link" href="#main">Skip to main content</a>
  ${sprite}
  <div class="bg-circuit" aria-hidden="true"></div>

  ${header(id)}

  <main id="main" tabindex="-1">${p.main}
  </main>

  ${footer(id)}

  ${bottomNav(id)}
${p.modal ? '\n  ' + p.modal + '\n' : ''}
  <script src="script.js"></script>
${(p.scripts || []).map((s) => `  <script src="${s}"></script>\n`).join('')}</body>
</html>
`;
}

for (const [id, p] of Object.entries(PAGES)) {
  fs.writeFileSync(path.join(OUT, p.file), page(id, p));
  console.log('built docs/' + p.file);
}

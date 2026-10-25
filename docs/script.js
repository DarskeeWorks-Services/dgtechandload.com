/* =====================================================
   D&G TECH & LOAD — Shared site script (no dependencies)
   Loaded on every page; each feature only runs when its
   container exists on the current page.
   ===================================================== */
(function () {
  'use strict';

  /* -------- CONTACT CONFIG (edit these) -------- */
  const CONFIG = {
    phone: '+639067571561',          // tap-to-call number
    messenger: 'https://m.me/dandgtechandload',
    whatsapp: '639937338509',        // digits only, country code, no +
    shopee: 'https://collshp.com/dgtechandload?view=storefront', // online store
    directions: 'https://www.google.com/maps/dir/?api=1&destination=10.086154720188826,124.11904679300929',
    businessName: 'D and G-Tech & Load'
  };

  const msgrText = (text) => `${CONFIG.messenger}?text=${encodeURIComponent(text)}`;
  const msgrInquiry = (item) => msgrText(`Hi ${CONFIG.businessName}, I am interested in ${item}.`);
  const waInquiry = (item) =>
    `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(`Hi ${CONFIG.businessName}, I am interested in ${item}.`)}`;

  /* =====================================================
     DATA
     ===================================================== */
  // order, names and colors follow the store identity banner
  const services = [
    { icon: 'tools',   hue: '#1e8bff', name: 'Phone Repair',         desc: 'Diagnosis and repair for common phone problems, from minor issues to bigger fixes.' },
    { icon: 'unlock',  hue: '#ff8a00', name: 'Phone Unlocking',      desc: 'Network and account unlocking for supported models — we check compatibility first.' },
    { icon: 'screen',  hue: '#a64dff', name: 'Screen Replacement',   desc: 'Cracked or faulty display? We replace screens for many popular models.' },
    { icon: 'battery', hue: '#22c55e', name: 'Battery Replacement',  desc: 'Phone draining fast? Get a battery replacement to restore everyday use.' },
    { icon: 'update',  hue: '#ff3344', name: 'Software Update',      desc: 'OS updates, reflashing and software troubleshooting.' },
    { icon: 'peso',    hue: '#1e9bff', name: 'E-Load & G-Cash',      desc: 'E-Load for all networks, plus G-Cash cash-in and cash-out.' },
    { icon: 'sim',     hue: '#ffb000', name: 'SIM & Load Available', desc: 'SIM cards and mobile load available, plus help with SIM registration.' },
    { icon: 'plug',    hue: '#b44dff', name: 'Accessories & More',   desc: 'Cases, tempered glass, chargers, cables, earbuds and more.' }
  ];

  // Answers reflect information the store has published; add payment
  // options or policies here only once the owner confirms them.
  const faqs = [
    { q: 'What services do you offer?', a: 'Phone repair, screen and battery replacement, phone unlocking, software updates, E-Load, G-Cash cash-in and cash-out, SIM cards and load, and phone accessories. See the Services page for details.' },
    { q: 'What are your store hours and where are you located?', a: 'We are open Monday to Saturday, 8:00 AM – 7:00 PM, and Sunday, 9:00 AM – 6:00 PM. You can find us on the 2nd Floor, Uwell Building, Hunan, Buenavista, Bohol — use the Get Directions button for the map.' },
    { q: 'Can you repair my phone?', a: 'We repair many common issues such as broken screens, worn-out batteries and software problems. Bring your phone in or message us your phone model and the problem, and we will tell you if we can fix it.' },
    { q: 'How much does a repair cost?', a: 'It depends on your phone model and the part needed. Message us your model and the issue on Messenger and we will give you an estimate before any work is done.' },
    { q: 'How long does a typical repair take?', a: 'Many common repairs like screen or battery replacement can be done the same day. More complex issues can take longer — we will give you a timeline when we check your phone.' },
    { q: 'Do your repairs come with a warranty?', a: 'Yes, our repairs include a service warranty. Keep your receipt, and ask us about the warranty period for your specific repair when you drop off your phone.' },
    { q: 'How do I know if a product is in stock?', a: 'The Products page shows stock from our store inventory, updated regularly. Stock moves fast, so message us to confirm before you visit — if an item is out of stock or not listed, we will check for you.' },
    { q: 'Which phone brands do you carry?', a: 'We carry Apple, Samsung, vivo, OPPO, realme, Xiaomi (Mi), TECNO and Infinix. Available models change — check the Products page or message us.' },
    { q: 'How can I contact you?', a: 'Message us on Messenger, call +63 906 757 1561, or visit the store during opening hours. The Contact page has all the options.' },
    { q: 'Can I order online?', a: 'Yes — you can order from our Shopee store (link in the footer and on the Products page). You can also message us on Messenger to reserve an item and pick it up in-store.' }
  ];

  /* -------- PRODUCT CATALOG --------
     Read from assets/products.json, generated from the store system export by
     `npm run sync` (tools/sync-products.js). That file only holds public fields:
     name, category, selling price, stock and an optional photo filename. */
  const CATALOG_URL = 'assets/products.json';
  let products = [];
  let catalogUpdated = null;

  const CATEGORY_ICONS = {
    'Phones & Tablets': 'phone', 'SIM & Load': 'sim', 'Chargers & Cables': 'bolt', 'Audio': 'headphones',
    'Power Banks': 'battery', 'Batteries': 'battery', 'Cases & Screen Protectors': 'shield',
    'Memory & Storage': 'sim', 'Computer Accessories': 'grid', 'Wearables': 'watch', 'Accessories': 'bag'
  };
  // Generic illustration per category, shown until a real product photo is added.
  const CATEGORY_ART = {
    'Phones & Tablets': 'phones', 'SIM & Load': 'sim', 'Chargers & Cables': 'chargers', 'Audio': 'audio',
    'Power Banks': 'powerbanks', 'Batteries': 'batteries', 'Cases & Screen Protectors': 'cases',
    'Memory & Storage': 'storage', 'Computer Accessories': 'computer', 'Wearables': 'wearables', 'Accessories': 'accessories'
  };
  // Photo if there is one, otherwise the category illustration (decorative, so empty alt).
  function productMedia(p, cls, alt) {
    if (p.img) return `<img class="${cls}" src="${esc(p.img)}" alt="${alt ? esc(p.name) : ''}" loading="lazy" onerror="this.src='${esc(p.art)}';this.classList.add('is-illus');this.alt=''">`;
    return `<img class="${cls} is-illus" src="${esc(p.art)}" alt="" loading="lazy">`;
  }
  const peso = (v) => '₱' + Number(v).toLocaleString('en-PH');
  // Optional photo: a filename in assets/products/ (or a full URL).
  const resolveImg = (image) => (!image ? null : /^https?:\/\//i.test(image) ? image : `assets/products/${encodeURIComponent(image)}`);

  /* =====================================================
     HELPERS
     ===================================================== */
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const icon = (name) => `<svg class="ic" aria-hidden="true"><use href="#i-${name}"/></svg>`;

  /* =====================================================
     SERVICES — icon strip (home), cards (services), list (about)
     ===================================================== */
  function renderServices() {
    const strip = $('#serviceStrip');
    if (strip) {
      strip.innerHTML = services.map((s) => `
        <a href="services.html" style="--hue:${s.hue}">
          <span class="icon-tile">${icon(s.icon)}</span>
          <span class="strip-label">${esc(s.name)}</span>
        </a>`).join('');
    }
    const grid = $('#servicesGrid');
    if (grid) {
      grid.innerHTML = services.map((s, i) => `
        <article class="service-card reveal" style="--hue:${s.hue};transition-delay:${(i % 4) * 60}ms">
          <span class="icon-tile icon-tile--lg">${icon(s.icon)}</span>
          <div>
            <h2>${esc(s.name)}</h2>
            <p>${esc(s.desc)}</p>
            <a class="link-more" href="${esc(msgrInquiry(s.name))}" target="_blank" rel="noopener" aria-label="Inquire about ${esc(s.name)} on Messenger">Inquire ${icon('arrow')}</a>
          </div>
        </article>`).join('');
    }
    const list = $('#aboutServices');
    if (list) list.innerHTML = services.map((s) => `<li>${icon('check')} ${esc(s.name)}</li>`).join('');
  }

  /* =====================================================
     FAQ (accessible accordion)
     ===================================================== */
  function renderFaq() {
    const list = $('#faqList');
    if (!list) return;
    list.innerHTML = faqs.map((f, i) => `
      <div class="faq-item reveal">
        <h2 class="faq-item__h">
          <button class="faq-item__q" id="faq-q${i}" aria-expanded="false" aria-controls="faq-a${i}">
            <span>${esc(f.q)}</span><span class="faq-item__icon">${icon('chevron')}</span>
          </button>
        </h2>
        <div class="faq-item__a" id="faq-a${i}" role="region" aria-labelledby="faq-q${i}" hidden><p>${esc(f.a)}</p></div>
      </div>`).join('');

    $$('.faq-item__q', list).forEach((btn) => {
      btn.addEventListener('click', () => {
        const item = btn.closest('.faq-item');
        const answer = $('.faq-item__a', item);
        const isOpen = item.classList.toggle('open');
        btn.setAttribute('aria-expanded', isOpen);
        if (isOpen) {
          answer.hidden = false;
          answer.style.maxHeight = answer.scrollHeight + 'px';
        } else {
          answer.style.maxHeight = 0;
          setTimeout(() => { if (!item.classList.contains('open')) answer.hidden = true; }, 350);
        }
      });
    });
  }

  /* =====================================================
     PRODUCT CATALOG (products page: search + filter; home: preview)
     ===================================================== */
  let activeCat = 'All';
  let searchTerm = '';

  function renderFilters() {
    const chips = $('#filterChips');
    if (!chips) return;
    const cats = ['All', ...new Set(products.map((p) => p.category))];
    chips.innerHTML = cats.map((c) =>
      `<button class="chip ${c === activeCat ? 'active' : ''}" data-cat="${esc(c)}" aria-pressed="${c === activeCat}">${esc(c)}</button>`).join('');
    $$('.chip', chips).forEach((chip) => {
      chip.addEventListener('click', () => { activeCat = chip.dataset.cat; renderFilters(); renderProducts(false); });
    });
  }

  function stockBadge(remaining) {
    if (remaining <= 0) return '<span class="stock stock--out">Out of stock</span>';
    if (remaining <= 3) return `<span class="stock stock--low">Only ${remaining} left</span>`;
    return `<span class="stock stock--in">In stock (${remaining})</span>`;
  }

  function renderProducts(animate = true) {
    const grid = $('#productsGrid');
    if (!grid) return;
    const list = products.filter((p) => {
      const matchCat = activeCat === 'All' || p.category === activeCat;
      const matchSearch = p.name.toLowerCase().includes(searchTerm) || p.category.toLowerCase().includes(searchTerm);
      return matchCat && matchSearch;
    });

    const empty = $('#catalogEmpty');
    empty.hidden = list.length !== 0 || products.length === 0;
    if (!list.length && products.length) {
      $('#catalogEmptyText').textContent = searchTerm
        ? `No products match “${searchTerm}”. Try another word, or message us — we may be able to get it for you.`
        : 'No products in this category right now. Message us and we will check for you.';
    }
    $('#catalogStatus').textContent = `${list.length} product${list.length === 1 ? '' : 's'} shown`;

    grid.innerHTML = list.map((p) => {
      const idx = products.indexOf(p);
      return `
        <article class="product-card reveal${p.remaining <= 0 ? ' product-card--out' : ''}">
          <div class="product-card__media">
            ${productMedia(p, 'product-card__img', true)}
            <span class="product-card__cat">${esc(p.category)}</span>
          </div>
          <div class="product-card__body">
            <h2 class="product-card__name">${esc(p.name)}</h2>
            <p class="product-card__price">${esc(p.price)}</p>
            ${stockBadge(p.remaining)}
            <div class="product-card__actions">
              <button type="button" class="btn btn--blue btn--sm" data-idx="${idx}">Details</button>
              <a class="btn btn--ghost btn--sm" href="${esc(msgrInquiry(p.name))}" target="_blank" rel="noopener" aria-label="Inquire about ${esc(p.name)} on Messenger">${icon('messenger')} Inquire</a>
            </div>
          </div>
        </article>`;
    }).join('');

    $$('button[data-idx]', grid).forEach((b) => b.addEventListener('click', () => openModal(products[+b.dataset.idx], b)));
    // On background refreshes, show cards immediately (no re-fade flicker).
    if (!animate) $$('.product-card', grid).forEach((c) => c.classList.add('in'));
    else revealObserve();
  }

  // Home page: a short preview — in-stock items with photos first.
  function renderHomeProducts() {
    const wrap = $('#homeProducts');
    if (!wrap) return;
    const picks = products
      .filter((p) => p.remaining > 0)
      .sort((a, b) => (b.img ? 1 : 0) - (a.img ? 1 : 0))
      .slice(0, 5);
    if (!picks.length) { wrap.innerHTML = '<p class="catalog-empty">New stock is on the way — message us to check availability.</p>'; return; }
    wrap.innerHTML = picks.map((p) => `
      <button type="button" class="mini-card" data-idx="${products.indexOf(p)}" aria-label="View ${esc(p.name)}, ${esc(p.price)}">
        <span class="mini-card__media">
          ${productMedia(p, 'mini-card__img', false)}
        </span>
        <span class="mini-card__body">
          <span class="mini-card__name">${esc(p.name)}</span>
          <span class="mini-card__price">${esc(p.price)}</span>
        </span>
      </button>`).join('');
    $$('.mini-card', wrap).forEach((b) => b.addEventListener('click', () => openModal(products[+b.dataset.idx], b)));
  }

  /* Modal */
  const modal = $('#productModal');
  let openName = null;   // track the product shown, so refreshes can update its stock
  let lastFocus = null;  // return focus to the opener on close
  function fillModalStock(p) {
    $('#modalDesc').innerHTML = p.remaining > 0
      ? `Available now — <strong>${p.remaining} in stock</strong> at the store. Message us to reserve.`
      : 'Currently <strong>out of stock</strong> — message us to check when it will be back.';
  }
  function openModal(p, opener) {
    if (!p || !modal) return;
    openName = p.name;
    lastFocus = opener || document.activeElement;
    $('#modalImage').innerHTML = productMedia(p, 'modal__img', true) +
      (p.img ? '' : '<span class="media-note">Photo coming soon</span>');
    $('#modalCat').textContent = p.category;
    $('#modalName').textContent = p.name;
    $('#modalPrice').textContent = p.price;
    fillModalStock(p);
    $('#modalMsgr').href = msgrInquiry(p.name);
    $('#modalWa').href = waInquiry(p.name);
    $('#modalCall').href = 'tel:' + CONFIG.phone;
    modal.hidden = false;
    document.body.style.overflow = 'hidden';
    $('.modal__close', modal).focus();
  }
  function closeModal() {
    modal.hidden = true; openName = null; document.body.style.overflow = '';
    if (lastFocus) lastFocus.focus();
  }
  if (modal) {
    modal.addEventListener('click', (e) => { if (e.target.closest('[data-close]')) closeModal(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !modal.hidden) closeModal(); });
  }

  /* CATALOG — fetch assets/products.json */
  async function fetchProducts() {
    // cache-buster so a fresh deploy shows new stock right away
    const res = await fetch(`${CATALOG_URL}?cb=${Date.now()}`);
    if (!res.ok) throw new Error(`catalog ${res.status}`);
    const data = await res.json();
    catalogUpdated = data.updated || null;
    return (data.products || []).map((r) => ({
      name: r.name,
      price: peso(r.price),
      remaining: Math.max(0, Number(r.stock) || 0),
      category: r.category || 'Accessories',
      icon: CATEGORY_ICONS[r.category] || 'bag',
      art: `assets/categories/${CATEGORY_ART[r.category] || 'accessories'}.svg`,
      img: resolveImg(r.image)
    }));
  }

  function showCatalogDate() {
    const el = $('#catalogUpdated');
    const t = catalogUpdated && new Date(catalogUpdated);
    if (!el || !t || isNaN(t)) return;
    el.textContent = `Stock as of ${t.toLocaleDateString('en-PH', { month: 'long', day: 'numeric', year: 'numeric' })} — message us to confirm availability.`;
  }

  async function loadCatalog(isRefresh) {
    try {
      const next = await fetchProducts();
      if (!next.length) throw new Error('empty');
      products = next;
      renderFilters();
      renderProducts(!isRefresh);
      showCatalogDate();
      if (!isRefresh) renderHomeProducts();
      // keep an open modal's stock in sync with the latest record
      if (openName) {
        const p = products.find((x) => x.name === openName);
        if (p) { $('#modalPrice').textContent = p.price; fillModalStock(p); }
      }
    } catch (err) {
      if (!products.length) {
        const msg = 'We couldn’t load the product list right now. Please try again later, or message us to ask about stock.';
        if ($('#productsGrid')) {
          $('#productsGrid').innerHTML = '';
          $('#catalogEmpty').hidden = false;
          $('#catalogEmptyText').textContent = msg;
        }
        if ($('#homeProducts')) $('#homeProducts').innerHTML = `<p class="catalog-empty">${msg}</p>`;
      }
      // on a background refresh failure, silently keep the current list
    }
  }

  function startCatalog() {
    const grid = $('#productsGrid');
    const home = $('#homeProducts');
    if (!grid && !home) return;
    const loading = '<p class="catalog-loading">Loading products…</p>';
    if (grid) grid.innerHTML = loading;
    if (home) home.innerHTML = loading;
    loadCatalog(false);
    if (grid) {
      // pick up a newly published product list when the visitor returns to the tab
      document.addEventListener('visibilitychange', () => { if (!document.hidden) loadCatalog(true); });
      const search = $('#productSearch');
      search.addEventListener('input', () => { searchTerm = search.value.trim().toLowerCase(); renderProducts(false); });
    }
  }

  /* =====================================================
     PROMOS — shared loader (assets/promos/promos.json)
     Optional per-promo dates: "validFrom" / "validUntil" (YYYY-MM-DD).
     Promos outside their dates are hidden automatically.
     ===================================================== */
  const PROMO_TYPES = {
    product: { label: 'Product Promo', cls: 'promo-tag--product', icon: 'tag' },
    store:   { label: 'Store Promo',   cls: 'promo-tag--store',   icon: 'store' },
    news:    { label: 'News & Update', cls: 'promo-tag--news',    icon: 'megaphone' }
  };
  const promoImg = (image) => (!image ? null : /^https?:\/\//i.test(image) ? image : `assets/promos/${image}`);
  const fmtDate = (d) => {
    const t = new Date(d + 'T00:00:00');
    return isNaN(t) ? '' : t.toLocaleDateString('en-PH', { year: 'numeric', month: 'long', day: 'numeric' });
  };
  function isActive(p, today) {
    if (p.validFrom && p.validFrom > today) return false;
    if (p.validUntil && p.validUntil < today) return false;
    return true;
  }
  const todayStr = () => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  };
  async function loadPromos() {
    const res = await fetch('assets/promos/promos.json?cb=' + Date.now());
    if (!res.ok) throw new Error(res.status);
    const data = await res.json();
    const today = todayStr();
    return (data.promos || [])
      .filter((p) => p && p.title && isActive(p, today))
      .sort((a, b) => String(b.date).localeCompare(String(a.date)));
  }
  function promoValidity(p) {
    if (p.validUntil) return `Valid until ${fmtDate(p.validUntil)}`;
    return fmtDate(p.date);
  }

  async function renderHomePromos() {
    const section = $('#homePromos');
    if (!section) return;
    let promos = [];
    try { promos = await loadPromos(); } catch (e) { return; } // keep hidden on failure
    if (!promos.length) return;
    $('#homePromoList').innerHTML = promos.slice(0, 2).map((p) => {
      const t = PROMO_TYPES[p.type] || PROMO_TYPES.news;
      const src = promoImg(p.image);
      return `
        <a class="home-promo" href="promos.html">
          <span class="home-promo__media">${icon(t.icon)}${src ? `<img src="${esc(src)}" alt="" loading="lazy" onerror="this.remove()">` : ''}</span>
          <span class="home-promo__body">
            <span class="promo-date">${esc(promoValidity(p))}</span>
            <span class="home-promo__title">${esc(p.title)}</span>
            <span class="promo-card__more">View details ${icon('arrow')}</span>
          </span>
        </a>`;
    }).join('');
    section.hidden = false;
  }

  /* =====================================================
     PARTNERS — sponsors, affiliations, sponsored ads, affiliate links
     (assets/partners.json, managed from the admin page). Every slot is a
     [data-partners] element inside hidden [data-partners-wrap] containers,
     revealed only when there is something real to show.
     ===================================================== */
  const partnerImg = (f) => (!f ? null : /^https?:\/\//i.test(f) ? f : `assets/partners/${f}`);
  const safeUrl = (u) => (/^https?:\/\//i.test(u || '') ? u : null);
  async function loadPartners() {
    const res = await fetch('assets/partners.json?cb=' + Date.now());
    if (!res.ok) throw new Error(res.status);
    const d = await res.json();
    const today = todayStr();
    const active = (list) => (list || []).filter((x) => x && (x.name || x.title) && isActive(x, today));
    return { sponsors: active(d.sponsors), affiliations: active(d.affiliations), ads: active(d.ads), affiliates: active(d.affiliates) };
  }
  function partnerLogo(x, rel) {
    const img = partnerImg(x.logo);
    const inner = img ? `<img src="${esc(img)}" alt="${esc(x.name)}" loading="lazy">` : `<span>${esc(x.name)}</span>`;
    const note = x.note ? `<small>${esc(x.note)}</small>` : '';
    const url = safeUrl(x.url);
    return url
      ? `<a class="partner-logo" href="${esc(url)}" target="_blank" rel="${rel}" title="${esc(x.name)}">${inner}${note}</a>`
      : `<div class="partner-logo" title="${esc(x.name)}">${inner}${note}</div>`;
  }
  function adCard(a) {
    const img = partnerImg(a.image);
    const url = safeUrl(a.url);
    const body = `<span class="ad-label">Sponsored</span>
      ${img ? `<span class="ad-card__media"><img src="${esc(img)}" alt="" loading="lazy"></span>` : ''}
      <span class="ad-card__body"><strong>${esc(a.title)}</strong>${a.text ? `<span>${esc(a.text)}</span>` : ''}${a.advertiser ? `<small>by ${esc(a.advertiser)}</small>` : ''}</span>`;
    return url ? `<a class="ad-card" href="${esc(url)}" target="_blank" rel="sponsored noopener">${body}</a>` : `<div class="ad-card">${body}</div>`;
  }
  function affiliateCard(a) {
    const img = partnerImg(a.image);
    const url = safeUrl(a.url);
    if (!url) return '';
    return `<a class="aff-card" href="${esc(url)}" target="_blank" rel="sponsored noopener">
      <span class="aff-card__media">${img ? `<img src="${esc(img)}" alt="" loading="lazy">` : icon('bag')}</span>
      <span class="aff-card__body"><strong>${esc(a.title)}</strong>${a.text ? `<span>${esc(a.text)}</span>` : ''}
        <span class="btn btn--orange btn--sm">${a.network ? `Shop on ${esc(a.network)}` : 'Shop now'} ${icon('arrow')}</span></span>
    </a>`;
  }
  async function renderPartners() {
    const slots = $$('[data-partners]');
    if (!slots.length) return;
    let p;
    try { p = await loadPartners(); } catch (e) { return; } // sections stay hidden
    slots.forEach((el) => {
      const kind = el.dataset.partners;
      let html = '';
      if (kind === 'sponsors') html = p.sponsors.map((x) => partnerLogo(x, 'sponsored noopener')).join('');
      else if (kind === 'affiliations') html = p.affiliations.map((x) => partnerLogo(x, 'noopener')).join('');
      else if (kind === 'affiliates') html = p.affiliates.map(affiliateCard).join('');
      else if (kind === 'ads') html = p.ads.map(adCard).join('');
      else if (kind.startsWith('ad-')) { // one sponsored placement, rotated per visit
        const place = kind.slice(3);
        const pool = p.ads.filter((a) => !a.placement || a.placement === 'all' || a.placement === place);
        if (pool.length) html = adCard(pool[Math.floor(Math.random() * pool.length)]);
      }
      if (!html) return;
      el.innerHTML = html;
      for (let w = el.closest('[data-partners-wrap]'); w; w = w.parentElement && w.parentElement.closest('[data-partners-wrap]')) w.hidden = false;
    });
    const none = $('#partnersEmpty');
    if (none) none.hidden = !!(p.sponsors.length || p.affiliations.length || p.ads.length || p.affiliates.length);
  }

  /* =====================================================
     NAV — scroll state, mobile menu (hamburger + "More")
     ===================================================== */
  function bindNav() {
    const header = $('#header');
    window.addEventListener('scroll', () => header.classList.toggle('scrolled', window.scrollY > 10), { passive: true });

    const menu = $('#navMenu');
    const toggles = [$('#navToggle'), ...$$('[data-menu-toggle]')];
    const setOpen = (open) => {
      menu.classList.toggle('open', open);
      toggles.forEach((t) => t.setAttribute('aria-expanded', open));
      $('#navToggle').setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    };
    toggles.forEach((t) => t.addEventListener('click', () => setOpen(!menu.classList.contains('open'))));
    $$('a', menu).forEach((a) => a.addEventListener('click', () => setOpen(false)));
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && menu.classList.contains('open')) { setOpen(false); $('#navToggle').focus(); }
    });
  }

  /* =====================================================
     SCROLL REVEAL
     ===================================================== */
  let revealObserver;
  function revealObserve() {
    if (!('IntersectionObserver' in window)) { $$('.reveal').forEach((el) => el.classList.add('in')); return; }
    if (!revealObserver) {
      revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) { entry.target.classList.add('in'); revealObserver.unobserve(entry.target); }
        });
      }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    }
    $$('.reveal:not(.in)').forEach((el) => revealObserver.observe(el));
  }

  /* =====================================================
     CONTACT FORM → Messenger handoff (no backend)
     ===================================================== */
  function bindForm() {
    const form = $('#contactForm');
    if (!form) return;
    const note = $('#formNote');
    const messages = {
      name: 'Please enter your name.',
      phone: 'Please enter a valid phone number (at least 7 digits).',
      service: 'Please choose a service.',
      message: 'Please write a short message.'
    };
    const check = (el) => {
      const err = $('#' + el.id + '-err');
      if (!err) return el.validity.valid;
      const ok = el.validity.valid;
      err.textContent = ok ? '' : messages[el.name];
      el.setAttribute('aria-invalid', String(!ok));
      return ok;
    };
    $$('input, select, textarea', form).forEach((el) => el.addEventListener('blur', () => { if (el.value) check(el); }));

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const fields = $$('input:not([type=checkbox]), select, textarea', form);
      const allOk = fields.map(check).every(Boolean);
      const consent = $('#cConsent');
      if (!allOk || !consent.checked) {
        note.textContent = !allOk ? 'Please fix the highlighted fields.' : 'Please tick the consent box to continue.';
        note.className = 'form-note err';
        (fields.find((f) => !f.validity.valid) || consent).focus();
        return;
      }
      const data = new FormData(form);
      const text =
        `Hi ${CONFIG.businessName}! 👋\n\n` +
        `Name: ${data.get('name')}\n` +
        `Phone: ${data.get('phone')}\n` +
        `Service: ${data.get('service')}\n` +
        `Message: ${data.get('message')}`;
      // The form is kept filled in, so nothing is lost if a popup blocker stops the new tab.
      window.open(msgrText(text), '_blank', 'noopener');
      note.innerHTML = 'Messenger should open in a new tab — press <strong>Send</strong> there to deliver your message. ' +
        `If it didn’t open, <a href="${esc(msgrText(text))}" target="_blank" rel="noopener">tap here</a> or call us.`;
      note.className = 'form-note ok';
    });
  }

  /* =====================================================
     APPLY CONFIG TO STATIC LINKS
     ===================================================== */
  function applyConfigLinks() {
    $$('a[href^="tel:"]').forEach((a) => { a.href = 'tel:' + CONFIG.phone; });
    $$('[data-messenger]').forEach((a) => { a.href = CONFIG.messenger; });
    $$('[data-directions]').forEach((a) => { a.href = CONFIG.directions; });
    $$('[data-shopee]').forEach((a) => { a.href = CONFIG.shopee; });
    $$('[data-year]').forEach((el) => { el.textContent = new Date().getFullYear(); });
  }

  /* shared API for page scripts (e.g. promos.js) */
  window.DG = { CONFIG, $, $$, esc, icon, revealObserve, loadPromos, promoImg, promoValidity, PROMO_TYPES, msgrText };

  /* =====================================================
     INIT
     ===================================================== */
  function init() {
    bindNav();
    applyConfigLinks();
    renderServices();
    renderFaq();
    startCatalog(); // loads products from assets/products.json
    renderHomePromos();
    renderPartners();
    bindForm();
    revealObserve();
  }

  document.readyState === 'loading'
    ? document.addEventListener('DOMContentLoaded', init)
    : init();
})();

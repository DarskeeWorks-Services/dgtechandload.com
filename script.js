/* =====================================================
   D&G TECH & LOAD — Vanilla JS (no dependencies)
   ===================================================== */
(function () {
  'use strict';

  /* -------- CONTACT CONFIG (edit these) -------- */
  const CONFIG = {
    phone: '+639067571561',          // tap-to-call number
    messenger: 'https://www.facebook.com/dandgtechandload',
    whatsapp: '639937338509',        // digits only, country code, no +
    businessName: 'D and G-Tech & Load'
  };

  const msgrInquiry = (item) =>
    `${CONFIG.messenger}?text=${encodeURIComponent(`Hi ${CONFIG.businessName}, I am interested in ${item}.`)}`;
  const waInquiry = (item) =>
    `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(`Hi ${CONFIG.businessName}, I am interested in ${item}.`)}`;

  /* =====================================================
     DATA
     ===================================================== */
  const services = [
    { icon: '📱', name: 'Mobile Phone Sales', desc: 'Brand-new smartphones from top global brands.' },
    { icon: '🔧', name: 'Smartphone Repair', desc: 'Expert diagnosis and fix for all phone issues.' },
    { icon: '📺', name: 'Screen Replacement', desc: 'Cracked display? Same-day glass & LCD swaps.' },
    { icon: '🔋', name: 'Battery Replacement', desc: 'Restore full battery life with genuine cells.' },
    { icon: '🔓', name: 'Phone Unlocking', desc: 'Network & account unlocking, done safely.' },
    { icon: '💾', name: 'Software & Flashing', desc: 'OS updates, reflashing and software fixes.' },
    { icon: '⚡', name: 'E-Load Services', desc: 'All networks — instant top-up, anytime.' },
    { icon: '💳', name: 'GCash Cash-In / Out', desc: 'Fast, reliable GCash cash-in and cash-out.' },
    { icon: '📝', name: 'SIM Registration', desc: 'Friendly help registering your SIM card.' },
    { icon: '🎒', name: 'Gadget Accessories', desc: 'Cases, glass protectors, holders & more.' },
    { icon: '🔌', name: 'Chargers & Cables', desc: 'Durable fast-charge cables and adapters.' },
    { icon: '🎧', name: 'Earbuds & Smartwatch', desc: 'Wireless audio and smart wearables.' }
  ];

  const products = [
    { name: 'iPhone 13', price: '₱28,999', category: 'Phones', icon: '📱', desc: '6.1" Super Retina XDR, A15 Bionic, dual-camera. Genuine unit with warranty.' },
    { name: 'Samsung Galaxy A55', price: '₱22,499', category: 'Phones', icon: '📱', desc: '5G, 120Hz AMOLED, 50MP OIS camera. Sealed brand-new.' },
    { name: 'Xiaomi Redmi Note 13', price: '₱9,999', category: 'Phones', icon: '📱', desc: '108MP camera, big battery, smooth performance for the price.' },
    { name: 'Realme C67', price: '₱8,499', category: 'Phones', icon: '📱', desc: 'Sleek design, 5000mAh battery, fast charging.' },
    { name: 'AirPods Pro (2nd Gen)', price: '₱2,999', category: 'Accessories', icon: '🎧', desc: 'Active noise cancellation, USB-C, immersive sound.' },
    { name: '20,000mAh Power Bank', price: '₱899', category: 'Accessories', icon: '🔋', desc: 'Fast-charge dual-port power bank for travel and daily use.' },
    { name: 'Smartwatch GT5', price: '₱1,499', category: 'Accessories', icon: '⌚', desc: 'Heart-rate, SpO2, calls and notifications on your wrist.' },
    { name: '65W Fast Charger Set', price: '₱649', category: 'Accessories', icon: '🔌', desc: 'Super-fast adapter with braided USB-C cable.' },
    { name: 'Wireless Earbuds Lite', price: '₱599', category: 'Accessories', icon: '🎧', desc: 'Crisp sound, long battery, comfortable fit.' },
    { name: 'Tempered Glass Protector', price: '₱149', category: 'Accessories', icon: '🛡️', desc: '9H hardness screen protection. Fits most models.' }
  ];

  const whyChoose = [
    { icon: '🎓', title: 'Certified Technicians', desc: 'Trained pros who know every brand inside out.' },
    { icon: '💰', title: 'Affordable Pricing', desc: 'Honest, competitive rates with no surprises.' },
    { icon: '✅', title: 'Genuine Parts', desc: 'Only authentic components for lasting repairs.' },
    { icon: '⚡', title: 'Fast Repairs', desc: 'Most fixes done same-day while you wait.' },
    { icon: '🏪', title: 'Trusted Local Store', desc: 'Your neighborhood tech hub in Buenavista.' },
    { icon: '😊', title: 'Friendly Support', desc: 'Warm, patient service for every customer.' }
  ];

  const brands = ['Apple', 'Samsung', 'Vivo', 'Oppo', 'Realme', 'Xiaomi', 'Tecno', 'Infinix'];

  const testimonials = [
    { stars: 5, text: 'Fixed my cracked iPhone screen in under an hour. Looks brand new and price was very fair!', name: 'Maria Santos', role: 'Buenavista' },
    { stars: 5, text: 'Best place for GCash and load in town. Always quick and reliable. Highly recommend D&G.', name: 'Jomar Reyes', role: 'Local Customer' },
    { stars: 5, text: 'Bought a Infinix Smart20 here and got great accessories too. Staff are super helpful and friendly.', name: 'Ana Lopez', role: 'Verified Buyer' },
    { stars: 5, text: 'Unlocked my phone and replaced the battery same day. Genuine parts, honest service. Salamat!', name: 'Kevin Dela Cruz', role: 'Buenavista' }
  ];

  const faqs = [
    { q: 'How long does a typical repair take?', a: 'Most common repairs like screen or battery replacement are completed the same day — often within 1–2 hours. More complex issues may take 1–3 days; we always give you a clear timeline upfront.' },
    { q: 'Do your repairs come with a warranty?', a: 'Yes. All repairs and replacement parts include a service warranty. Just keep your receipt and bring the device back if any issue arises within the warranty period.' },
    { q: 'What GCash services do you offer?', a: 'We handle GCash Cash-In and Cash-Out, plus E-Load for all networks and SIM registration assistance. Just drop by or message us anytime during store hours.' },
    { q: 'Can you unlock my phone?', a: 'Absolutely. We offer safe network and account unlocking for most models and brands. Bring your device in and we will check compatibility and quote you on the spot.' },
    { q: 'Which phone brands do you carry?', a: 'We carry Apple, Samsung, Vivo, Oppo, Realme, Xiaomi, Tecno and Infinix — genuine units and parts. If you need a specific model, message us and we will check stock.' },
    { q: 'Where exactly are you located?', a: 'We are on the 2nd Floor of the Uwell Building, Hunan, Buenavista, Bohol. Use the Get Directions button on this page to navigate straight to us.' }
  ];

  /* =====================================================
     RENDER HELPERS
     ===================================================== */
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  /* Services */
  function renderServices() {
    $('#servicesGrid').innerHTML = services.map((s, i) => `
      <article class="service-card reveal" style="transition-delay:${(i % 4) * 60}ms">
        <div class="service-card__icon">${s.icon}</div>
        <h3>${esc(s.name)}</h3>
        <p>${esc(s.desc)}</p>
      </article>`).join('');
  }

  /* Brands */
  function renderBrands() {
    $('#brandsGrid').innerHTML = brands.map((b, i) => `
      <div class="brand-tile reveal" style="transition-delay:${(i % 4) * 60}ms"><span>${esc(b)}</span></div>`).join('');
  }

  /* Why */
  function renderWhy() {
    $('#whyGrid').innerHTML = whyChoose.map((w, i) => `
      <article class="why-card reveal" style="transition-delay:${(i % 3) * 70}ms">
        <div class="why-card__icon">${w.icon}</div>
        <div><h3>${esc(w.title)}</h3><p>${esc(w.desc)}</p></div>
      </article>`).join('');
  }

  /* Testimonials */
  function renderTestimonials() {
    $('#testimonialsGrid').innerHTML = testimonials.map((t, i) => `
      <article class="testimonial reveal" style="transition-delay:${(i % 3) * 70}ms">
        <div class="testimonial__stars">${'★'.repeat(t.stars)}</div>
        <p class="testimonial__text">“${esc(t.text)}”</p>
        <div class="testimonial__author">
          <div class="testimonial__avatar">${esc(t.name.charAt(0))}</div>
          <div><div class="testimonial__name">${esc(t.name)}</div><div class="testimonial__role">${esc(t.role)}</div></div>
        </div>
      </article>`).join('');
  }

  /* FAQ */
  function renderFaq() {
    $('#faqList').innerHTML = faqs.map((f) => `
      <div class="faq-item reveal">
        <button class="faq-item__q" aria-expanded="false">
          <span>${esc(f.q)}</span><span class="faq-item__icon">+</span>
        </button>
        <div class="faq-item__a"><p>${esc(f.a)}</p></div>
      </div>`).join('');

    $$('.faq-item__q').forEach((btn) => {
      btn.addEventListener('click', () => {
        const item = btn.closest('.faq-item');
        const answer = $('.faq-item__a', item);
        const isOpen = item.classList.toggle('open');
        btn.setAttribute('aria-expanded', isOpen);
        answer.style.maxHeight = isOpen ? answer.scrollHeight + 'px' : 0;
      });
    });
  }

  /* =====================================================
     PRODUCT CATALOG (search + filter + modal)
     ===================================================== */
  let activeCat = 'All';
  let searchTerm = '';

  function renderFilters() {
    const cats = ['All', ...new Set(products.map((p) => p.category))];
    $('#filterChips').innerHTML = cats.map((c) =>
      `<button class="chip ${c === activeCat ? 'active' : ''}" data-cat="${esc(c)}">${esc(c)}</button>`).join('');
    $$('#filterChips .chip').forEach((chip) => {
      chip.addEventListener('click', () => { activeCat = chip.dataset.cat; renderFilters(); renderProducts(); });
    });
  }

  function renderProducts() {
    const list = products.filter((p) => {
      const matchCat = activeCat === 'All' || p.category === activeCat;
      const matchSearch = p.name.toLowerCase().includes(searchTerm) || p.category.toLowerCase().includes(searchTerm);
      return matchCat && matchSearch;
    });

    $('#catalogEmpty').hidden = list.length !== 0;
    $('#productsGrid').innerHTML = list.map((p) => {
      const idx = products.indexOf(p);
      return `
        <article class="product-card reveal" data-idx="${idx}" tabindex="0" role="button" aria-label="View ${esc(p.name)}">
          <div class="product-card__media">${p.icon}<span class="product-card__cat">${esc(p.category)}</span></div>
          <div class="product-card__body">
            <h3 class="product-card__name">${esc(p.name)}</h3>
            <p class="product-card__price">${esc(p.price)}</p>
            <p class="product-card__hint">Tap to view &amp; inquire →</p>
          </div>
        </article>`;
    }).join('');

    $$('#productsGrid .product-card').forEach((card) => {
      const open = () => openModal(products[+card.dataset.idx]);
      card.addEventListener('click', open);
      card.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); } });
    });
    revealObserve();
  }

  /* Modal */
  const modal = $('#productModal');
  function openModal(p) {
    $('#modalImage').textContent = p.icon;
    $('#modalCat').textContent = p.category;
    $('#modalName').textContent = p.name;
    $('#modalPrice').textContent = p.price;
    $('#modalDesc').textContent = p.desc || '';
    $('#modalMsgr').href = msgrInquiry(p.name);
    $('#modalWa').href = waInquiry(p.name);
    $('#modalCall').href = 'tel:' + CONFIG.phone;
    modal.hidden = false;
    document.body.style.overflow = 'hidden';
  }
  function closeModal() { modal.hidden = true; document.body.style.overflow = ''; }
  modal.addEventListener('click', (e) => { if (e.target.hasAttribute('data-close')) closeModal(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !modal.hidden) closeModal(); });

  /* =====================================================
     NAV — scroll state, mobile toggle, smooth links
     ===================================================== */
  const header = $('#header');
  window.addEventListener('scroll', () => header.classList.toggle('scrolled', window.scrollY > 20), { passive: true });

  const navToggle = $('#navToggle');
  const navLinks = $('#navLinks');
  navToggle.addEventListener('click', () => {
    const open = navLinks.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', open);
  });
  $$('#navLinks a').forEach((a) => a.addEventListener('click', () => {
    navLinks.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  }));

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
     COUNTER ANIMATION
     ===================================================== */
  function animateCounters() {
    const nums = $$('.stat__num');
    if (!('IntersectionObserver' in window)) { nums.forEach((n) => n.textContent = n.dataset.count); return; }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = +el.dataset.count;
        const dur = 1600; const start = performance.now();
        const tick = (now) => {
          const prog = Math.min((now - start) / dur, 1);
          const eased = 1 - Math.pow(1 - prog, 3);
          el.textContent = Math.floor(eased * target).toLocaleString();
          if (prog < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
        io.unobserve(el);
      });
    }, { threshold: 0.5 });
    nums.forEach((n) => io.observe(n));
  }

  /* =====================================================
     SERVICE CARD CURSOR GLOW
     ===================================================== */
  function bindCardGlow() {
    document.addEventListener('mousemove', (e) => {
      const card = e.target.closest('.service-card');
      if (!card) return;
      const r = card.getBoundingClientRect();
      card.style.setProperty('--mx', ((e.clientX - r.left) / r.width * 100) + '%');
      card.style.setProperty('--my', ((e.clientY - r.top) / r.height * 100) + '%');
    }, { passive: true });
  }

  /* =====================================================
     CONTACT FORM → Messenger handoff
     ===================================================== */
  function bindForm() {
    const form = $('#contactForm');
    const note = $('#formNote');
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!form.checkValidity()) {
        note.textContent = 'Please complete all required fields and the consent box.';
        note.className = 'form-note err';
        form.reportValidity();
        return;
      }
      const data = new FormData(form);
      const text =
        `Hi ${CONFIG.businessName}! 👋%0A%0A` +
        `Name: ${encodeURIComponent(data.get('name'))}%0A` +
        `Phone: ${encodeURIComponent(data.get('phone'))}%0A` +
        `Service: ${encodeURIComponent(data.get('service'))}%0A` +
        `Message: ${encodeURIComponent(data.get('message'))}`;
      note.textContent = 'Opening Messenger… if it does not open, message us directly.';
      note.className = 'form-note ok';
      window.open(`${CONFIG.messenger}?text=${text}`, '_blank', 'noopener');
      form.reset();
    });
  }

  /* =====================================================
     APPLY CONFIG TO STATIC LINKS
     ===================================================== */
  function applyConfigLinks() {
    $$('a[href^="tel:"]').forEach((a) => { a.href = 'tel:' + CONFIG.phone; });
    $('#year').textContent = new Date().getFullYear();
  }

  /* =====================================================
     INIT
     ===================================================== */
  function init() {
    renderServices();
    renderBrands();
    renderWhy();
    renderTestimonials();
    renderFaq();
    renderFilters();
    renderProducts();

    const search = $('#productSearch');
    search.addEventListener('input', () => { searchTerm = search.value.trim().toLowerCase(); renderProducts(); });

    applyConfigLinks();
    bindForm();
    bindCardGlow();
    animateCounters();
    revealObserve();
  }

  document.readyState === 'loading'
    ? document.addEventListener('DOMContentLoaded', init)
    : init();
})();

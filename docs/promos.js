/* =====================================================
   D&G TECH & LOAD — Promos & Updates page
   Loads promos from assets/promos/promos.json (asset-driven).
   ===================================================== */
(function () {
  'use strict';

  const CONFIG = {
    phone: '+639067571561',
    messenger: 'https://www.facebook.com/dandgtechandload',
    directions: 'https://www.google.com/maps/dir/?api=1&destination=10.086154720188826,124.11904679300929'
  };

  const TYPES = {
    product: { label: 'Product Promo', cls: 'promo-tag--product', icon: '🏷️' },
    store:   { label: 'Store Promo',   cls: 'promo-tag--store',   icon: '🛍️' },
    news:    { label: 'News & Update', cls: 'promo-tag--news',    icon: '📰' }
  };
  const FILTERS = { all: 'All', product: 'Product Promos', store: 'Store Promos', news: 'News & Updates' };

  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (m) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]));

  let promos = [];
  let activeType = 'all';

  /* ---- image path: filename in assets/promos/ or a full URL ---- */
  function imgSrc(image) {
    if (!image) return null;
    return /^https?:\/\//i.test(image) ? image : `assets/promos/${image}`;
  }
  function fmtDate(d) {
    const t = new Date(d);
    return isNaN(t) ? '' : t.toLocaleDateString('en-PH', { year: 'numeric', month: 'long', day: 'numeric' });
  }
  function ctaHref(type) {
    return type === 'store' ? CONFIG.directions : CONFIG.messenger;
  }

  /* ---- render ---- */
  function renderFilters() {
    const present = new Set(promos.map((p) => p.type));
    const keys = ['all', ...Object.keys(FILTERS).filter((k) => k !== 'all' && present.has(k))];
    $('#promoFilters').innerHTML = keys.map((k) =>
      `<button class="chip ${k === activeType ? 'active' : ''}" data-type="${k}">${esc(FILTERS[k])}</button>`).join('');
    $$('#promoFilters .chip').forEach((chip) => chip.addEventListener('click', () => {
      activeType = chip.dataset.type; renderFilters(); renderPromos();
    }));
  }

  function renderPromos() {
    const list = promos.filter((p) => activeType === 'all' || p.type === activeType);
    $('#promosGrid').innerHTML = list.map((p, i) => {
      const t = TYPES[p.type] || TYPES.news;
      const src = imgSrc(p.image);
      return `
        <article class="promo-card reveal" data-idx="${promos.indexOf(p)}" tabindex="0" role="button" aria-label="View ${esc(p.title)}" style="transition-delay:${(i % 3) * 70}ms">
          <div class="promo-card__media">
            <span class="promo-card__ph">${t.icon}</span>
            ${src ? `<img class="promo-card__img" src="${esc(src)}" alt="${esc(p.title)}" loading="lazy" onerror="this.remove()">` : ''}
            <span class="promo-tag ${t.cls}">${t.icon} ${esc(t.label)}</span>
          </div>
          <div class="promo-card__body">
            <p class="promo-date">${esc(fmtDate(p.date))}</p>
            <h3 class="promo-card__title">${esc(p.title)}</h3>
            <p class="promo-card__text">${esc(p.text || '')}</p>
            <span class="promo-card__more">View details →</span>
          </div>
        </article>`;
    }).join('');

    const empty = $('#promosEmpty');
    empty.hidden = list.length !== 0;
    if (!list.length) empty.textContent = promos.length ? 'No posts in this category yet.' : 'No promos posted yet — check back soon!';

    $$('#promosGrid .promo-card').forEach((card) => {
      const open = () => openModal(promos[+card.dataset.idx]);
      card.addEventListener('click', open);
      card.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); } });
    });
    revealObserve();
  }

  /* ---- lightbox ---- */
  const modal = $('#promoModal');
  function openModal(p) {
    if (!p) return;
    const t = TYPES[p.type] || TYPES.news;
    const src = imgSrc(p.image);
    $('#pmMedia').innerHTML = `<span class="modal__icon">${t.icon}</span>` +
      (src ? `<img class="modal__img" src="${esc(src)}" alt="${esc(p.title)}" onerror="this.remove()">` : '');
    $('#pmType').textContent = t.label;
    $('#pmTitle').textContent = p.title;
    $('#pmDate').textContent = fmtDate(p.date);
    $('#pmText').textContent = p.text || '';
    const cta = $('#pmCta');
    cta.textContent = p.cta || 'Message us';
    cta.href = ctaHref(p.type);
    modal.hidden = false;
    document.body.style.overflow = 'hidden';
  }
  function closeModal() { modal.hidden = true; document.body.style.overflow = ''; }
  modal.addEventListener('click', (e) => { if (e.target.hasAttribute('data-close')) closeModal(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !modal.hidden) closeModal(); });

  /* ---- shared UI: header, nav, reveal ---- */
  const header = $('#header');
  window.addEventListener('scroll', () => header.classList.toggle('scrolled', window.scrollY > 20), { passive: true });

  const navToggle = $('#navToggle');
  const navLinks = $('#navLinks');
  navToggle.addEventListener('click', () => {
    const open = navLinks.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', open);
  });
  $$('#navLinks a').forEach((a) => a.addEventListener('click', () => {
    navLinks.classList.remove('open'); navToggle.setAttribute('aria-expanded', 'false');
  }));

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

  /* ---- init ---- */
  async function init() {
    $('#year').textContent = new Date().getFullYear();
    revealObserve();
    try {
      const res = await fetch('assets/promos/promos.json?cb=' + Date.now());
      if (!res.ok) throw new Error(res.status);
      const data = await res.json();
      promos = (data.promos || []).slice().sort((a, b) => new Date(b.date) - new Date(a.date));
    } catch (err) {
      promos = [];
    }
    renderFilters();
    renderPromos();
  }

  document.readyState === 'loading'
    ? document.addEventListener('DOMContentLoaded', init)
    : init();
})();

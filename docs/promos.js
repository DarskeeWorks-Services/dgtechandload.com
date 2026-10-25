/* =====================================================
   D&G TECH & LOAD — Promos page
   Loads promos from assets/promos/promos.json (asset-driven).
   Requires script.js (shared nav, icons, promo loader) loaded first.
   ===================================================== */
(function () {
  'use strict';

  const { CONFIG, $, $$, esc, icon, revealObserve, loadPromos, promoImg, promoValidity, PROMO_TYPES: TYPES, msgrText } = window.DG;

  const FILTERS = { all: 'All', product: 'Product Promos', store: 'Store Promos', news: 'News & Updates' };

  let promos = [];
  let activeType = 'all';

  function ctaHref(p) {
    return p.type === 'store' ? CONFIG.directions : msgrText(`Hi! I'm asking about your promo: ${p.title}`);
  }

  /* ---- render ---- */
  function renderFilters() {
    const present = new Set(promos.map((p) => p.type));
    const keys = ['all', ...Object.keys(FILTERS).filter((k) => k !== 'all' && present.has(k))];
    $('#promoFilters').innerHTML = keys.length > 2 ? keys.map((k) =>
      `<button class="chip ${k === activeType ? 'active' : ''}" data-type="${k}" aria-pressed="${k === activeType}">${esc(FILTERS[k])}</button>`).join('') : '';
    $$('#promoFilters .chip').forEach((chip) => chip.addEventListener('click', () => {
      activeType = chip.dataset.type; renderFilters(); renderPromos();
    }));
  }

  function renderPromos() {
    const list = promos.filter((p) => activeType === 'all' || p.type === activeType);
    $('#promosGrid').innerHTML = list.map((p, i) => {
      const t = TYPES[p.type] || TYPES.news;
      const src = promoImg(p.image);
      const idx = promos.indexOf(p);
      return `
        <article class="promo-card reveal" style="transition-delay:${(i % 3) * 70}ms">
          <button type="button" class="promo-card__open" data-idx="${idx}" aria-label="View details: ${esc(p.title)}">
            <span class="promo-card__media">
              ${icon(t.icon)}
              ${src ? `<img class="promo-card__img" src="${esc(src)}" alt="" loading="lazy" onerror="this.remove()">` : ''}
              <span class="promo-tag ${t.cls}">${icon(t.icon)} ${esc(t.label)}</span>
            </span>
          </button>
          <div class="promo-card__body">
            <p class="promo-date">${icon('calendar')} ${esc(promoValidity(p))}</p>
            <h2 class="promo-card__title">${esc(p.title)}</h2>
            <p class="promo-card__text">${esc(p.text || '')}</p>
            <div class="promo-card__actions">
              <button type="button" class="btn btn--ghost btn--sm" data-idx="${idx}">Details</button>
              <a class="btn btn--orange btn--sm" href="${esc(ctaHref(p))}" target="_blank" rel="noopener">${esc(p.cta || 'Message us')}</a>
            </div>
          </div>
        </article>`;
    }).join('');

    const empty = $('#promosEmpty');
    empty.hidden = list.length !== 0;
    if (!list.length) $('#promosEmptyText').textContent = promos.length ? 'No posts in this category yet.' : 'No promos are running right now — check back soon, or message us to ask about current deals.';

    $$('#promosGrid [data-idx]').forEach((b) => b.addEventListener('click', () => openModal(promos[+b.dataset.idx], b)));
    revealObserve();
  }

  /* ---- lightbox ---- */
  const modal = $('#promoModal');
  let lastFocus = null;
  function openModal(p, opener) {
    if (!p) return;
    lastFocus = opener;
    const t = TYPES[p.type] || TYPES.news;
    const src = promoImg(p.image);
    $('#pmMedia').innerHTML = `<span class="modal__icon">${icon(t.icon)}</span>` +
      (src ? `<img class="modal__img" src="${esc(src)}" alt="${esc(p.title)}" onerror="this.remove()">` : '');
    $('#pmType').textContent = t.label;
    $('#pmTitle').textContent = p.title;
    $('#pmDate').textContent = promoValidity(p);
    $('#pmText').textContent = p.text || '';
    const cta = $('#pmCta');
    cta.textContent = p.cta || 'Message us';
    cta.href = ctaHref(p);
    modal.hidden = false;
    document.body.style.overflow = 'hidden';
    $('.modal__close', modal).focus();
  }
  function closeModal() { modal.hidden = true; document.body.style.overflow = ''; if (lastFocus) lastFocus.focus(); }
  modal.addEventListener('click', (e) => { if (e.target.closest('[data-close]')) closeModal(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !modal.hidden) closeModal(); });

  /* ---- init ---- */
  async function init() {
    try { promos = await loadPromos(); } catch (err) { promos = []; }
    renderFilters();
    renderPromos();
  }

  document.readyState === 'loading'
    ? document.addEventListener('DOMContentLoaded', init)
    : init();
})();

/* ─────────────────────────────────────────────────────────
   Seemantham Invitation — App Script
   • Smooth scroll between sections
   • Intersection Observer fade-in animations
   • Flowers & leaves falling animation
───────────────────────────────────────────────────────── */

(function () {
  'use strict';

  /* ── Intersection Observer for fade-up elements ── */
  function initFadeObserver() {
    var els = document.querySelectorAll('.hero-card');
    els.forEach(function (el) {
      el.classList.add('fade-up');
    });

    if (!('IntersectionObserver' in window)) {
      els.forEach(function (el) { el.classList.add('visible'); });
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    els.forEach(function (el) { observer.observe(el); });
  }

  /* ── Staggered animation delays for details card rows ── */
  function initStaggerDelays() {
    var rows = document.querySelectorAll('.detail-row');
    rows.forEach(function (row, i) {
      row.style.transitionDelay = (i * 0.12) + 's';
    });
    var divs = document.querySelectorAll('.gold-divider');
    divs.forEach(function (d, i) {
      d.style.transitionDelay = (i * 0.08) + 's';
    });
  }

  /* ── Flowers & Leaves Falling Animation ── */
  function initPetals() {
    var container = document.getElementById('petals-container');
    if (!container) return;

    var types = [
      { cls: 'rose',     w: 14, h: 12 },
      { cls: 'rose',     w: 18, h: 15 },
      { cls: 'marigold', w: 13, h: 11 },
      { cls: 'marigold', w: 16, h: 14 },
      { cls: 'jasmine',  w: 8,  h: 8  },
      { cls: 'jasmine',  w: 10, h: 10 },
      { cls: 'leaf',     w: 18, h: 24 },
      { cls: 'leaf',     w: 14, h: 20 }
    ];

    var totalPetals = 36;

    for (var i = 0; i < totalPetals; i++) {
      (function (idx) {
        var type = types[idx % types.length];
        var petal = document.createElement('div');
        petal.className = 'petal ' + type.cls;
        petal.style.width  = type.w + 'px';
        petal.style.height = type.h + 'px';

        var delay    = (Math.random() * 18).toFixed(2);
        var duration = (7 + Math.random() * 10).toFixed(2);
        var leftPct  = (Math.random() * 100).toFixed(2);
        var rotateOffset = Math.floor(Math.random() * 60) - 30;

        petal.style.left              = leftPct + '%';
        petal.style.animationDuration = duration + 's';
        petal.style.animationDelay    = delay + 's';
        /* Use a CSS custom property so keyframes can incorporate the tilt offset */
        petal.style.setProperty('--rotate-offset', rotateOffset + 'deg');

        container.appendChild(petal);
      })(i);
    }
  }

  /* ── Init ── */
  document.addEventListener('DOMContentLoaded', function () {
    initFadeObserver();
    initStaggerDelays();
    initPetals();
  });

})();

/* ============================================================
   SCALYEX — COUNTER.JS
   Count-up animation when stats enter viewport
   ─────────────────────────────────────────────────────────────
   HOW TO EDIT:
   - Add data-count="50" to any .count-num element
   - Add data-suffix="+" or data-prefix="₹" for symbols
   - DURATION: animation duration in ms (default 2000)
   ============================================================ */

(function () {
  'use strict';

  const DURATION = 2000; // ms
  const SESSION_KEY = 'scalyex-counters-done';
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ─── Easing function (ease-out cubic) ─── */
  function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  /* ─── Animate a single counter ─── */
  function animateCounter(el) {
    const target  = parseFloat(el.dataset.count) || 0;
    const suffix  = el.dataset.suffix  || '';
    const prefix  = el.dataset.prefix  || '';
    const decimal = el.dataset.decimal || 0; // decimal places
    const start   = performance.now();

    function update(now) {
      const elapsed  = now - start;
      const progress = Math.min(elapsed / DURATION, 1);
      const eased    = easeOutCubic(progress);
      const current  = target * eased;

      el.textContent = prefix + current.toFixed(decimal) + suffix;

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        el.textContent = prefix + target.toFixed(decimal) + suffix;
      }
    }

    requestAnimationFrame(update);
  }

  /* ─── Init ─── */
  document.addEventListener('DOMContentLoaded', function () {
    const counters = document.querySelectorAll('.count-num[data-count]');
    if (!counters.length) return;

    // If reduced motion, just set final values
    if (prefersReduced) {
      counters.forEach(function (el) {
        const target = parseFloat(el.dataset.count) || 0;
        const suffix = el.dataset.suffix || '';
        const prefix = el.dataset.prefix || '';
        const decimal = el.dataset.decimal || 0;
        el.textContent = prefix + target.toFixed(decimal) + suffix;
      });
      return;
    }

    // Trigger once per session
    const alreadyRun = sessionStorage.getItem(SESSION_KEY);

    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(function (el) {
      if (alreadyRun) {
        // Just set final value if already animated this session
        const target  = parseFloat(el.dataset.count) || 0;
        const suffix  = el.dataset.suffix  || '';
        const prefix  = el.dataset.prefix  || '';
        const decimal = el.dataset.decimal || 0;
        el.textContent = prefix + target.toFixed(decimal) + suffix;
      } else {
        // Set to "0" initially
        const suffix = el.dataset.suffix || '';
        const prefix = el.dataset.prefix || '';
        el.textContent = prefix + '0' + suffix;
        observer.observe(el);
      }
    });

    // Mark as done for this session
    if (!alreadyRun) {
      sessionStorage.setItem(SESSION_KEY, 'true');
    }
  });

})();

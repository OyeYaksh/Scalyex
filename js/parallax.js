/* ============================================================
   SCALYEX — PARALLAX.JS
   Mouse Parallax · Scroll Parallax
   ─────────────────────────────────────────────────────────────
   HOW TO EDIT:
   - MOUSE_STRENGTH: intensity of mouse-based parallax (default 20)
   - SCROLL_STRENGTH: scroll layer speed multiplier (default 0.3)
   - Disabled below MOBILE_BREAKPOINT px
   ============================================================ */

(function () {
  'use strict';

  const MOUSE_STRENGTH     = 20;   // max px movement on mouse move
  const SCROLL_STRENGTH    = 0.25; // fraction of scrollY for parallax
  const MOBILE_BREAKPOINT  = 768;  // px — disabled below this width

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ─────────────────────────────────────────
     1. MOUSE PARALLAX
     Elements: .mouse-float[data-depth="0.5"]
     depth attribute controls how far they move
  ───────────────────────────────────────── */
  function initMouseParallax() {
    if (prefersReduced || window.innerWidth < MOBILE_BREAKPOINT) return;

    const floats = document.querySelectorAll('.mouse-float');
    if (!floats.length) return;

    let targetX = 0, targetY = 0;
    let currentX = 0, currentY = 0;
    let rafId = null;

    document.addEventListener('mousemove', function (e) {
      // Normalize to -1 … +1 from screen center
      targetX = (e.clientX / window.innerWidth  - 0.5) * 2;
      targetY = (e.clientY / window.innerHeight - 0.5) * 2;
    }, { passive: true });

    function animate() {
      // Smooth lerp
      currentX += (targetX - currentX) * 0.08;
      currentY += (targetY - currentY) * 0.08;

      floats.forEach(function (el) {
        const depth = parseFloat(el.dataset.depth) || 0.5;
        const moveX = currentX * MOUSE_STRENGTH * depth;
        const moveY = currentY * MOUSE_STRENGTH * depth;
        el.style.transform = 'translate(' + moveX + 'px, ' + moveY + 'px)';
      });

      rafId = requestAnimationFrame(animate);
    }

    animate();

    // Pause when tab is hidden
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) {
        cancelAnimationFrame(rafId);
      } else {
        animate();
      }
    });
  }

  /* ─────────────────────────────────────────
     2. SCROLL PARALLAX
     Elements: .parallax-layer[data-speed="0.5"]
     speed attribute: 0 = pinned, 1 = full scroll
  ───────────────────────────────────────── */
  function initScrollParallax() {
    if (prefersReduced || window.innerWidth < MOBILE_BREAKPOINT) return;

    const layers = document.querySelectorAll('.parallax-layer');
    if (!layers.length) return;

    function onScroll() {
      const scrollY = window.scrollY;
      layers.forEach(function (el) {
        const speed = parseFloat(el.dataset.speed) || SCROLL_STRENGTH;
        el.style.transform = 'translateY(' + (scrollY * speed) + 'px)';
      });
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // init position
  }

  /* ─── Init ─── */
  document.addEventListener('DOMContentLoaded', function () {
    initMouseParallax();
    initScrollParallax();
  });

  // Re-check on resize
  window.addEventListener('resize', function () {
    if (window.innerWidth < MOBILE_BREAKPOINT) {
      // Reset transforms on mobile
      document.querySelectorAll('.mouse-float, .parallax-layer').forEach(function (el) {
        el.style.transform = '';
      });
    }
  }, { passive: true });

})();

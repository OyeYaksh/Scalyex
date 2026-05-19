/* ============================================================
   SCALYEX — ANIMATIONS.JS
   Scroll-triggered Reveals · Text Split · Nav effects
   ─────────────────────────────────────────────────────────────
   HOW TO EDIT:
   - THRESHOLD: how much of element must be visible before trigger
   - TEXT_SPLIT_SELECTOR: which elements get word-split animation
   ============================================================ */

(function () {
  'use strict';

  const THRESHOLD = 0.15; // 15% visible before triggering

  /* ─── Respect prefers-reduced-motion ─── */
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ─────────────────────────────────────────
     1. SCROLL REVEAL (IntersectionObserver)
  ───────────────────────────────────────── */
  function initScrollReveals() {
    if (prefersReduced) {
      // Just make everything visible immediately
      document.querySelectorAll('.reveal').forEach(function (el) {
        el.classList.add('is-visible');
      });
      return;
    }

    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target); // Trigger only once
        }
      });
    }, { threshold: THRESHOLD });

    document.querySelectorAll('.reveal').forEach(function (el) {
      observer.observe(el);
    });
  }

  /* ─────────────────────────────────────────
     2. TEXT SPLIT ANIMATION
     Wraps each word in .word > .word-inner
  ───────────────────────────────────────── */
  function initTextSplit() {
    const TEXT_SPLIT_SELECTOR = '[data-split]';

    document.querySelectorAll(TEXT_SPLIT_SELECTOR).forEach(function (el) {
      if (prefersReduced) {
        el.classList.add('is-visible');
        return;
      }

      const text    = el.textContent;
      const words   = text.split(' ');
      el.innerHTML  = words.map(function (word) {
        return '<span class="word"><span class="word-inner">' + word + '</span></span>';
      }).join(' ');

      // Observe
      const observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.1 });

      observer.observe(el);
    });
  }

  /* ─────────────────────────────────────────
     3. NAV: scroll state + hamburger
  ───────────────────────────────────────── */
  function initNav() {
    const nav       = document.querySelector('.nav');
    const hamburger = document.querySelector('.nav__hamburger');
    const mobileMenu = document.querySelector('.nav__mobile');

    if (!nav) return;

    // Scroll → nav becomes solid
    window.addEventListener('scroll', function () {
      if (window.scrollY > 20) {
        nav.classList.add('scrolled');
      } else {
        nav.classList.remove('scrolled');
      }
    }, { passive: true });

    // Hamburger toggle
    if (hamburger && mobileMenu) {
      hamburger.addEventListener('click', function () {
        hamburger.classList.toggle('open');
        mobileMenu.classList.toggle('open');
        hamburger.setAttribute('aria-expanded', mobileMenu.classList.contains('open'));
      });

      // Close mobile menu on link click
      mobileMenu.querySelectorAll('a').forEach(function (link) {
        link.addEventListener('click', function () {
          hamburger.classList.remove('open');
          mobileMenu.classList.remove('open');
        });
      });
    }

    // Highlight active nav link
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav__links a, .nav__mobile a').forEach(function (link) {
      const href = link.getAttribute('href');
      if (href === currentPath || (currentPath === '' && href === 'index.html')) {
        link.classList.add('active');
      }
    });
  }

  /* ─────────────────────────────────────────
     4. SCROLL PROGRESS BAR
  ───────────────────────────────────────── */
  function initProgressBar() {
    const bar = document.querySelector('.progress-bar');
    if (!bar) return;

    window.addEventListener('scroll', function () {
      const total  = document.documentElement.scrollHeight - window.innerHeight;
      const progress = total > 0 ? (window.scrollY / total) * 100 : 0;
      bar.style.width = progress + '%';
    }, { passive: true });
  }

  /* ─────────────────────────────────────────
     5. FAQ ACCORDION
  ───────────────────────────────────────── */
  function initFAQ() {
    document.querySelectorAll('.faq-item__question').forEach(function (btn) {
      btn.addEventListener('click', function () {
        const item = btn.closest('.faq-item');
        const isOpen = item.classList.contains('open');

        // Close all others (optional — remove if you want multi-open)
        document.querySelectorAll('.faq-item.open').forEach(function (openItem) {
          if (openItem !== item) openItem.classList.remove('open');
        });

        item.classList.toggle('open', !isOpen);
        btn.setAttribute('aria-expanded', !isOpen);
      });
    });
  }

  /* ─────────────────────────────────────────
     6. WIPE REVEALS
  ───────────────────────────────────────── */
  function initWipeReveals() {
    if (prefersReduced) {
      document.querySelectorAll('.wipe-reveal').forEach(function (el) {
        el.classList.add('is-visible');
      });
      return;
    }

    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.wipe-reveal').forEach(function (el) {
      observer.observe(el);
    });
  }

  /* ─────────────────────────────────────────
     INIT ALL
  ───────────────────────────────────────── */
  document.addEventListener('DOMContentLoaded', function () {
    initScrollReveals();
    initTextSplit();
    initNav();
    initProgressBar();
    initFAQ();
    initWipeReveals();
  });

})();

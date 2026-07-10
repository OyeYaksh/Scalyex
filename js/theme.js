/* ============================================================
   SCALYEX — THEME.JS
   Dark / Light Mode Toggle
   ─────────────────────────────────────────────────────────────
   HOW TO EDIT:
   - Default theme: change DEFAULT_THEME below
   - Storage key: change STORAGE_KEY if needed
   ============================================================ */

(function () {
  const STORAGE_KEY   = 'scalyex-theme';
  const DEFAULT_THEME = 'light'; // 'light' | 'dark'

  // ─ Read saved preference, then system preference, then default ─
  function getInitialTheme() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return saved;
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) return 'dark';
    return DEFAULT_THEME;
  }

  // ─ Apply theme instantly (called before paint to avoid flash) ─
  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(STORAGE_KEY, theme);
  }

  // Apply immediately on script load
  applyTheme(getInitialTheme());

  // ─ Set up toggle buttons after DOM is ready ─
  document.addEventListener('DOMContentLoaded', function () {
    const toggleBtns = document.querySelectorAll('.theme-toggle');

    // ─ Switch logo images when theme changes ─
    function updateLogos(theme) {
      // Nav logo (light bg → light logo, dark bg → dark logo)
      document.querySelectorAll('.nav__logo-img').forEach(function (img) {
        img.src = theme === 'dark' ? 'assets/logo-dark.png' : 'assets/logo-light.png';
      });
      // Footer logo always stays dark (footer bg is always dark)
      // No change needed for .footer__logo-img
    }

    // Set correct logos on load
    updateLogos(getInitialTheme());

    toggleBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        const current = document.documentElement.getAttribute('data-theme');
        const next    = current === 'dark' ? 'light' : 'dark';

        // Smooth transition
        document.body.classList.add('theme-transitioning');
        applyTheme(next);
        updateLogos(next);
        setTimeout(function () {
          document.body.classList.remove('theme-transitioning');
        }, 400);

        btn.setAttribute('aria-label', next === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
      });

      // Set initial aria-label
      const current = document.documentElement.getAttribute('data-theme');
      btn.setAttribute('aria-label', current === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
    });

    // ─ Listen for system preference changes ─
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function (e) {
      if (!localStorage.getItem(STORAGE_KEY)) {
        const next = e.matches ? 'dark' : 'light';
        applyTheme(next);
        updateLogos(next);
      }
    });
  });
})();

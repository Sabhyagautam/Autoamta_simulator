/**
 * layout.js
 * Injects the shared Navbar and Footer into every page.
 * Also handles theme toggle and mobile nav.
 */

(function () {
  // ── Theme ────────────────────────────────────────────────────
  const THEME_KEY = 'automata-lab-theme';

  function getTheme() {
    const stored = localStorage.getItem(THEME_KEY);
    if (stored) return stored;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    const btn = document.getElementById('theme-toggle');
    if (btn) btn.textContent = theme === 'dark' ? '☀️' : '🌙';
  }

  function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme') || 'light';
    const next = current === 'dark' ? 'light' : 'dark';
    localStorage.setItem(THEME_KEY, next);
    applyTheme(next);
  }

  // Apply theme immediately to avoid flash
  applyTheme(getTheme());

  // ── Determine current page for active nav link ───────────────
  function getCurrentPage() {
    const path = window.location.pathname.split('/').pop() || 'index.html';
    return path;
  }

  function navLink(href, label, current) {
    const active = current === href ? ' active' : '';
    return `<li><a href="${href}" class="${active}">${label}</a></li>`;
  }

  // ── Inject Navbar ────────────────────────────────────────────
  function injectNavbar() {
    const current = getCurrentPage();
    const navbar = document.createElement('nav');
    navbar.className = 'navbar';
    navbar.setAttribute('role', 'navigation');
    navbar.setAttribute('aria-label', 'Main navigation');
    navbar.innerHTML = `
      <div class="container">
        <div class="navbar-inner">
          <a href="index.html" class="navbar-logo" aria-label="Automata Lab home">
            <div class="navbar-logo-icon" aria-hidden="true">AL</div>
            <span>Automata Lab</span>
          </a>
          <ul class="navbar-links" id="nav-links" role="menubar">
            ${navLink('index.html',     'Home',       current)}
            ${navLink('dashboard.html', 'Dashboard',  current)}
            ${navLink('simulator.html', 'Simulator',  current)}
            ${navLink('learning.html',  'Learn',      current)}
            ${navLink('about.html',     'About',      current)}
          </ul>
          <div class="navbar-actions">
            <button class="theme-toggle" id="theme-toggle" aria-label="Toggle dark/light theme" title="Toggle theme">🌙</button>
            <button class="nav-toggle" id="nav-toggle" aria-label="Open menu" aria-expanded="false">☰</button>
          </div>
        </div>
      </div>
    `;
    document.body.prepend(navbar);

    // Theme toggle event
    document.getElementById('theme-toggle').addEventListener('click', toggleTheme);
    // Apply correct icon after injection
    applyTheme(getTheme());

    // Mobile nav
    const navToggle = document.getElementById('nav-toggle');
    const navLinks  = document.getElementById('nav-links');
    navToggle.addEventListener('click', () => {
      const open = navLinks.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', open);
    });
  }

  // ── Inject Footer ────────────────────────────────────────────
  function injectFooter() {
    const footer = document.createElement('footer');
    footer.innerHTML = `
      <div class="container">
        <div class="footer-inner">
          <div>
            <div class="footer-logo">Automata Lab</div>
            <div class="footer-info">CSET302 — Automata Theory and Computability</div>
          </div>
          <nav class="footer-links" aria-label="Footer navigation">
            <a href="index.html">Home</a>
            <a href="dashboard.html">Dashboard</a>
            <a href="simulator.html">Simulator</a>
            <a href="learning.html">Learn</a>
            <a href="about.html">About</a>
          </nav>
        </div>
      </div>
    `;
    document.body.appendChild(footer);
  }

  // Run after DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => { injectNavbar(); injectFooter(); });
  } else {
    injectNavbar();
    injectFooter();
  }
})();

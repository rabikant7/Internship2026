/* ============================================
   navbar.js — Reusable navigation bar component.
   Every page has an empty <div id="navbar"></div>
   and this script fills it in, so we don't repeat
   the same HTML on 10 different pages.
   ============================================ */

function renderNavbar() {
  const mount = document.getElementById("navbar");
  if (!mount) return;

  mount.innerHTML = `
    <nav class="navbar">
      <div class="container">
        <a href="index.html" class="nav-brand">🎨 PortfolioBuilder</a>

        <ul class="nav-links" id="navLinks">
          <li><a href="index.html" data-page="index.html">Home</a></li>
          <li><a href="gallery.html" data-page="gallery.html">Gallery</a></li>
          <li><a href="dashboard.html" data-page="dashboard.html">Dashboard</a></li>
          <li><a href="about.html" data-page="about.html">About</a></li>
          <li><a href="contact.html" data-page="contact.html">Contact</a></li>
          <li><a href="login.html" id="navAuthLink">Login</a></li>
        </ul>

        <div style="display:flex; align-items:center; gap:10px;">
          <button class="theme-toggle" id="themeToggle" aria-label="Toggle dark mode">🌙</button>
          <button class="nav-toggle" id="navToggle" aria-label="Open menu">☰</button>
        </div>
      </div>
    </nav>
  `;

  // Re-run the shared setup now that the navbar actually exists in the DOM
  initTheme();
  initMobileNav();
  initNavbarAuthState();
  highlightActiveNav();
}

document.addEventListener("DOMContentLoaded", renderNavbar);

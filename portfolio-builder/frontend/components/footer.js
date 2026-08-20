/* ============================================
   footer.js — Reusable footer component.
   ============================================ */

function renderFooter() {
  const mount = document.getElementById("footer");
  if (!mount) return;

  const year = new Date().getFullYear();

  mount.innerHTML = `
    <footer class="footer">
      <div class="container">
        <div class="footer-brand">🎨 PortfolioBuilder</div>
        <div class="footer-links">
          <a href="about.html">About</a>
          <a href="contact.html">Contact</a>
          <a href="gallery.html">Gallery</a>
        </div>
        <div class="footer-copy">© ${year} PortfolioBuilder. Built for students learning full-stack development.</div>
      </div>
    </footer>
  `;
}

document.addEventListener("DOMContentLoaded", renderFooter);

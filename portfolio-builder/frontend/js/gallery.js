/* ============================================
   gallery.js — Loads public portfolios and supports
   searching + filtering by profession.
   ============================================ */

let debounceTimer = null;

document.addEventListener("DOMContentLoaded", () => {
  loadGallery();

  document.getElementById("searchInput").addEventListener("input", () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(loadGallery, 350); // avoid firing a request on every keystroke
  });

  document.getElementById("professionFilter").addEventListener("change", loadGallery);
});

async function loadGallery() {
  const grid = document.getElementById("galleryGrid");
  grid.innerHTML = `<div class="spinner" style="grid-column: 1/-1;"></div>`;

  const search = document.getElementById("searchInput").value.trim();
  const profession = document.getElementById("professionFilter").value;

  const params = new URLSearchParams();
  if (search) params.set("search", search);
  if (profession) params.set("profession", profession);

  try {
    const portfolios = await api.getGallery(`?${params.toString()}`);

    if (!portfolios.length) {
      grid.innerHTML = `<div class="empty-state">No public portfolios found. Be the first to publish yours!</div>`;
      return;
    }

    grid.innerHTML = portfolios
      .map(
        (p) => `
        <div class="card gallery-card" onclick="window.location.href='public-portfolio.html?slug=${p.slug}'">
          <img src="${p.profileImage || "https://via.placeholder.com/76"}" alt="${p.fullName || "Portfolio"}" />
          <h3>${p.fullName || "Untitled"}</h3>
          <p>${p.title || "No title yet"}</p>
          <span class="like-btn">❤️ ${p.likes || 0}</span>
        </div>`
      )
      .join("");
  } catch (error) {
    grid.innerHTML = `<div class="empty-state">Could not load the gallery right now.</div>`;
  }
}

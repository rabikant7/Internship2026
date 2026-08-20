/* ============================================
   public-portfolio.js — Loads and displays a public
   portfolio by its share-link slug. No login required.
   ============================================ */

let publicPortfolio = null;

document.addEventListener("DOMContentLoaded", async () => {
  const params = new URLSearchParams(window.location.search);
  const slug = params.get("slug");
  const container = document.getElementById("publicPortfolioContainer");

  if (!slug) {
    container.innerHTML = `<p style="text-align:center; color:var(--color-text-muted);">No portfolio specified.</p>`;
    return;
  }

  try {
    publicPortfolio = await api.getPublicPortfolio(slug);
    container.innerHTML = renderPortfolioHTML(publicPortfolio);
    document.getElementById("likeCount").textContent = publicPortfolio.likes || 0;
    document.title = `${publicPortfolio.fullName || "Portfolio"} — PortfolioBuilder`;
  } catch (error) {
    container.innerHTML = `<p style="text-align:center; color:var(--color-text-muted);">${escapeHtml(error.message)}</p>`;
  }

  document.getElementById("likeBtn").addEventListener("click", async () => {
    try {
      const res = await api.likePortfolio(slug);
      document.getElementById("likeCount").textContent = res.likes;
      showToast("Thanks for the like!", "success");
    } catch (error) {
      showToast(error.message, "error");
    }
  });
});

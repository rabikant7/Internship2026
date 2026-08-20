/* ============================================
   preview.js — Loads the user's portfolio and shows
   the full live preview, plus publish / share / PDF actions.
   ============================================ */

let currentPortfolio = null;

document.addEventListener("DOMContentLoaded", async () => {
  if (!requireAuth()) return;

  try {
    currentPortfolio = await api.getMyPortfolio();
    renderPreview();
    updatePublishButton();
  } catch (error) {
    document.getElementById("portfolioPreviewContainer").innerHTML = `
      <p style="text-align:center; color:var(--color-text-muted);">
        You haven't created a portfolio yet. Head to the editor to get started.
      </p>`;
  }

  document.getElementById("editBtn").addEventListener("click", () => (window.location.href = "editor.html"));
  document.getElementById("downloadPdfBtn").addEventListener("click", () => window.print());
  document.getElementById("shareBtn").addEventListener("click", toggleShareBox);
  document.getElementById("copyLinkBtn").addEventListener("click", copyShareLink);
  document.getElementById("publishBtn").addEventListener("click", togglePublish);
});

function renderPreview() {
  document.getElementById("portfolioPreviewContainer").innerHTML = renderPortfolioHTML(currentPortfolio);
}

function updatePublishButton() {
  const btn = document.getElementById("publishBtn");
  btn.textContent = currentPortfolio.isPublic ? "🔒 Make Private" : "🌐 Publish Portfolio";
}

async function togglePublish() {
  try {
    const formData = new FormData();
    formData.append("isPublic", !currentPortfolio.isPublic);

    const res = await api.updatePortfolio(currentPortfolio._id, formData);
    currentPortfolio = res.portfolio;
    updatePublishButton();
    showToast(currentPortfolio.isPublic ? "Your portfolio is now public!" : "Your portfolio is now private.", "success");
  } catch (error) {
    showToast(error.message, "error");
  }
}

function toggleShareBox() {
  if (!currentPortfolio.isPublic) {
    showToast("Publish your portfolio first to get a shareable link.", "error");
    return;
  }
  const box = document.getElementById("shareLinkBox");
  const input = document.getElementById("shareLinkInput");
  const link = `${window.location.origin}/pages/public-portfolio.html?slug=${currentPortfolio.slug}`;
  input.value = link;
  box.style.display = box.style.display === "none" ? "flex" : "none";
}

function copyShareLink() {
  const input = document.getElementById("shareLinkInput");
  input.select();
  navigator.clipboard.writeText(input.value).then(() => showToast("Link copied to clipboard!", "success"));
}

/* ============================================
   my-portfolio.js — Shows a quick summary card of the
   logged-in user's saved portfolio, and lets them delete it.
   ============================================ */

let myPortfolioData = null;

document.addEventListener("DOMContentLoaded", async () => {
  if (!requireAuth()) return;

  const container = document.getElementById("myPortfolioSummary");

  try {
    myPortfolioData = await api.getMyPortfolio();

    container.innerHTML = `
      <div class="card fade-in" style="display:flex; gap:20px; align-items:center; flex-wrap:wrap;">
        <img src="${myPortfolioData.profileImage || "https://via.placeholder.com/80"}"
             alt="Profile" style="width:80px; height:80px; border-radius:50%; object-fit:cover; border:2px solid var(--color-border);" />
        <div style="flex:1; min-width:200px;">
          <h3>${myPortfolioData.fullName || "Unnamed Portfolio"}</h3>
          <p style="color:var(--color-text-muted);">${myPortfolioData.title || "No title added yet"}</p>
          <p style="margin-top:8px; font-size:0.85rem; color:var(--color-text-muted);">
            Status: <strong>${myPortfolioData.isPublic ? "Public 🌐" : "Private 🔒"}</strong>
            &nbsp;·&nbsp; Template: <strong>${myPortfolioData.template}</strong>
          </p>
        </div>
      </div>

      <div class="dashboard-grid" style="padding-top:24px;">
        <div class="card stat-box"><div class="stat-num">${(myPortfolioData.skills || []).length}</div><div class="stat-label">Skills</div></div>
        <div class="card stat-box"><div class="stat-num">${(myPortfolioData.projects || []).length}</div><div class="stat-label">Projects</div></div>
        <div class="card stat-box"><div class="stat-num">${(myPortfolioData.experience || []).length}</div><div class="stat-label">Experience</div></div>
        <div class="card stat-box"><div class="stat-num">${(myPortfolioData.education || []).length}</div><div class="stat-label">Education</div></div>
        <div class="card stat-box"><div class="stat-num">${(myPortfolioData.certificates || []).length}</div><div class="stat-label">Certificates</div></div>
      </div>
    `;
  } catch (error) {
    container.innerHTML = `
      <div class="card" style="text-align:center; padding:50px 20px;">
        <p style="color:var(--color-text-muted); margin-bottom:16px;">You haven't created a portfolio yet.</p>
        <a href="editor.html" class="btn btn-primary">Create Your Portfolio</a>
      </div>`;
    document.getElementById("deletePortfolioBtn").style.display = "none";
  }

  document.getElementById("deletePortfolioBtn").addEventListener("click", async () => {
    if (!myPortfolioData) return;
    const confirmed = confirm("Are you sure you want to delete your portfolio? This cannot be undone.");
    if (!confirmed) return;

    try {
      await api.deletePortfolio(myPortfolioData._id);
      showToast("Portfolio deleted.", "success");
      setTimeout(() => (window.location.href = "dashboard.html"), 800);
    } catch (error) {
      showToast(error.message, "error");
    }
  });
});

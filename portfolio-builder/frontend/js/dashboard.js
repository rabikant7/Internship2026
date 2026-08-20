/* ============================================
   dashboard.js — Loads the logged-in user's info
   and a quick summary of their portfolio.
   ============================================ */

document.addEventListener("DOMContentLoaded", async () => {
  if (!requireAuth()) return;

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const welcomeMessage = document.getElementById("welcomeMessage");
  if (welcomeMessage && user.name) {
    welcomeMessage.textContent = `Welcome back, ${user.name}! 👋`;
  }

  const logoutCard = document.getElementById("logoutCard");
  if (logoutCard) logoutCard.addEventListener("click", logout);

  const createOrEditCard = document.getElementById("createOrEditCard");
  const editCardTitle = document.getElementById("editCardTitle");
  const editCardText = document.getElementById("editCardText");

  try {
    const portfolio = await api.getMyPortfolio();

    // Portfolio already exists — send them to the editor to update it
    if (createOrEditCard) {
      createOrEditCard.addEventListener("click", () => (window.location.href = "editor.html"));
    }
    if (editCardTitle) editCardTitle.textContent = "Continue Editing";
    if (editCardText) editCardText.textContent = "Pick up where you left off";

    document.getElementById("statSkills").textContent = (portfolio.skills || []).length;
    document.getElementById("statProjects").textContent = (portfolio.projects || []).length;
    document.getElementById("statStatus").textContent = portfolio.isPublic ? "Public" : "Private";
  } catch (error) {
    // No portfolio yet — clicking the card creates one, then opens the editor
    if (createOrEditCard) {
      createOrEditCard.addEventListener("click", async () => {
        try {
          await api.createPortfolio({ fullName: user.name || "" });
          window.location.href = "editor.html";
        } catch (err) {
          showToast(err.message, "error");
        }
      });
    }
  }
});

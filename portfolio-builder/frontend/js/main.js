/* ============================================
   main.js — Shared behavior loaded on every page:
   - Toast notifications
   - Light/Dark theme toggle
   - Mobile nav toggle
   - Login/logout state in the navbar
   - Simple auth guard for protected pages
   ============================================ */

/* ---------- Toast notifications ---------- */
function showToast(message, type = "success") {
  let container = document.querySelector(".toast-container");
  if (!container) {
    container = document.createElement("div");
    container.className = "toast-container";
    document.body.appendChild(container);
  }

  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.textContent = message;
  container.appendChild(toast);

  setTimeout(() => toast.remove(), 3500);
}

/* ---------- Theme (Light/Dark mode) ---------- */
function initTheme() {
  const savedTheme = localStorage.getItem("theme") || "light";
  document.documentElement.setAttribute("data-theme", savedTheme);

  const toggleBtn = document.getElementById("themeToggle");
  if (!toggleBtn) return;

  updateThemeIcon(savedTheme);

  toggleBtn.addEventListener("click", () => {
    const current = document.documentElement.getAttribute("data-theme");
    const next = current === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
    updateThemeIcon(next);
  });
}

function updateThemeIcon(theme) {
  const toggleBtn = document.getElementById("themeToggle");
  if (toggleBtn) toggleBtn.textContent = theme === "dark" ? "☀️" : "🌙";
}

/* ---------- Mobile nav ---------- */
function initMobileNav() {
  const navToggle = document.getElementById("navToggle");
  const navLinks = document.getElementById("navLinks");
  if (!navToggle || !navLinks) return;

  navToggle.addEventListener("click", () => navLinks.classList.toggle("open"));
}

/* ---------- Navbar login state ---------- */
function initNavbarAuthState() {
  const token = localStorage.getItem("token");
  const authLink = document.getElementById("navAuthLink");
  if (!authLink) return;

  if (token) {
    authLink.textContent = "Logout";
    authLink.href = "#";
    authLink.addEventListener("click", (e) => {
      e.preventDefault();
      logout();
    });
  } else {
    authLink.textContent = "Login";
    authLink.href = "login.html";
  }
}

function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  showToast("You have been logged out.", "success");
  setTimeout(() => (window.location.href = "login.html"), 600);
}

/* ---------- Auth guard for protected pages ----------
   Call requireAuth() at the top of pages like dashboard/editor/preview.
*/
function requireAuth() {
  const token = localStorage.getItem("token");
  if (!token) {
    window.location.href = "login.html";
    return false;
  }
  return true;
}

/* ---------- Highlight the active nav link ---------- */
function highlightActiveNav() {
  const current = window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav-links a[data-page]").forEach((link) => {
    if (link.getAttribute("data-page") === current) {
      link.classList.add("active");
    }
  });
}

/* ---------- Run shared setup on every page ---------- */
document.addEventListener("DOMContentLoaded", () => {
  initTheme();
  initMobileNav();
  initNavbarAuthState();
  highlightActiveNav();
});

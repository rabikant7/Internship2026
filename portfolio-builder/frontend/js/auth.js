/* ============================================
   auth.js — Handles the Register and Login forms.
   Includes simple client-side validation.
   ============================================ */

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function setFieldError(id, message) {
  const el = document.getElementById(id);
  if (el) el.textContent = message || "";
}

/* ---------- Register form ---------- */
const registerForm = document.getElementById("registerForm");
if (registerForm) {
  registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    // Reset previous errors
    ["nameError", "emailError", "passwordError", "confirmPasswordError"].forEach((id) => setFieldError(id, ""));

    let hasError = false;
    if (!name) { setFieldError("nameError", "Name is required."); hasError = true; }
    if (!email || !isValidEmail(email)) { setFieldError("emailError", "Please enter a valid email."); hasError = true; }
    if (!password || password.length < 6) { setFieldError("passwordError", "Password must be at least 6 characters."); hasError = true; }
    if (password !== confirmPassword) { setFieldError("confirmPasswordError", "Passwords do not match."); hasError = true; }

    if (hasError) return;

    const btn = document.getElementById("registerBtn");
    btn.disabled = true;
    btn.textContent = "Creating account...";

    try {
      const data = await api.register({ name, email, password });
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      showToast("Account created! Redirecting to your dashboard...", "success");
      setTimeout(() => (window.location.href = "dashboard.html"), 800);
    } catch (error) {
      showToast(error.message, "error");
      btn.disabled = false;
      btn.textContent = "Create Account";
    }
  });
}

/* ---------- Login form ---------- */
const loginForm = document.getElementById("loginForm");
if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    setFieldError("emailError", "");
    setFieldError("passwordError", "");

    let hasError = false;
    if (!email || !isValidEmail(email)) { setFieldError("emailError", "Please enter a valid email."); hasError = true; }
    if (!password) { setFieldError("passwordError", "Password is required."); hasError = true; }
    if (hasError) return;

    const btn = document.getElementById("loginBtn");
    btn.disabled = true;
    btn.textContent = "Logging in...";

    try {
      const data = await api.login({ email, password });
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      showToast("Welcome back!", "success");
      setTimeout(() => (window.location.href = "dashboard.html"), 600);
    } catch (error) {
      showToast(error.message, "error");
      btn.disabled = false;
      btn.textContent = "Log In";
    }
  });
}

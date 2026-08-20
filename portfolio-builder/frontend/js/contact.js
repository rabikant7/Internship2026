/* ============================================
   contact.js — Simple client-side validation for the
   contact form. This demo project has no email backend,
   so we just show a success toast once validation passes.
   ============================================ */

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("contactForm");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = document.getElementById("contactName").value.trim();
    const email = document.getElementById("contactEmail").value.trim();
    const message = document.getElementById("contactMessage").value.trim();

    ["contactNameError", "contactEmailError", "contactMessageError"].forEach((id) => {
      document.getElementById(id).textContent = "";
    });

    let hasError = false;
    if (!name) { document.getElementById("contactNameError").textContent = "Name is required."; hasError = true; }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      document.getElementById("contactEmailError").textContent = "Please enter a valid email.";
      hasError = true;
    }
    if (!message || message.length < 10) {
      document.getElementById("contactMessageError").textContent = "Message should be at least 10 characters.";
      hasError = true;
    }
    if (hasError) return;

    showToast("Thanks for reaching out! We'll get back to you soon.", "success");
    form.reset();
  });
});

/* ============================================
   editor.js — Powers the Portfolio Builder (Editor) page:
   tabs, add/edit/delete for each section, drag-and-drop
   section ordering, image upload preview, live preview,
   and saving everything to the backend.
   ============================================ */

let portfolio = null;          // holds the current portfolio data
let selectedImageFile = null;  // holds a newly chosen profile photo, if any

const SECTION_LABELS = {
  about: "About / Header",
  skills: "Skills",
  projects: "Projects",
  experience: "Experience",
  education: "Education",
  certificates: "Certificates",
  contact: "Contact",
};

document.addEventListener("DOMContentLoaded", async () => {
  if (!requireAuth()) return;

  await loadPortfolio();
  initTabs();
  initAboutForm();
  initSkills();
  initProjects();
  initExperience();
  initEducation();
  initCertificates();
  initSectionOrder();
  initTemplateSwitcher();
  updatePreview();
});

/* ---------- Load / create portfolio ---------- */
async function loadPortfolio() {
  try {
    portfolio = await api.getMyPortfolio();
  } catch (error) {
    // No portfolio yet for this user — create an empty one automatically
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const res = await api.createPortfolio({ fullName: user.name || "" });
      portfolio = res.portfolio;
    } catch (err) {
      showToast(err.message, "error");
      return;
    }
  }
  fillAboutForm();
  renderSkills();
  renderProjects();
  renderExperience();
  renderEducation();
  renderCertificates();
  renderSectionOrderList();
  setActiveTemplateChip(portfolio.template || "modern");
}

/* ---------- Save helper: sends the current portfolio state to the backend ---------- */
async function savePortfolio(extraToast = "Saved!") {
  const formData = new FormData();

  formData.append("fullName", portfolio.fullName || "");
  formData.append("title", portfolio.title || "");
  formData.append("bio", portfolio.bio || "");
  formData.append("email", portfolio.email || "");
  formData.append("phone", portfolio.phone || "");
  formData.append("location", portfolio.location || "");
  formData.append("skills", JSON.stringify(portfolio.skills || []));
  formData.append("projects", JSON.stringify(portfolio.projects || []));
  formData.append("experience", JSON.stringify(portfolio.experience || []));
  formData.append("education", JSON.stringify(portfolio.education || []));
  formData.append("certificates", JSON.stringify(portfolio.certificates || []));
  formData.append("sectionOrder", JSON.stringify(portfolio.sectionOrder || []));
  formData.append("template", portfolio.template || "modern");

  if (selectedImageFile) {
    formData.append("profileImage", selectedImageFile);
  }

  try {
    const res = await api.updatePortfolio(portfolio._id, formData);
    portfolio = res.portfolio;
    selectedImageFile = null;
    showToast(extraToast, "success");
    updatePreview();
  } catch (error) {
    showToast(error.message, "error");
  }
}

/* ---------- Tabs ---------- */
function initTabs() {
  const tabs = document.querySelectorAll(".editor-tab");
  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");

      document.querySelectorAll(".editor-section").forEach((s) => s.classList.remove("active"));
      document.getElementById(`section-${tab.dataset.tab}`).classList.add("active");
    });
  });
}

/* ---------- About section ---------- */
function fillAboutForm() {
  document.getElementById("fullName").value = portfolio.fullName || "";
  document.getElementById("title").value = portfolio.title || "";
  document.getElementById("bio").value = portfolio.bio || "";
  document.getElementById("email").value = portfolio.email || "";
  document.getElementById("phone").value = portfolio.phone || "";
  document.getElementById("location").value = portfolio.location || "";
  document.getElementById("profileImagePreview").src = portfolio.profileImage || "https://via.placeholder.com/64";
}

function initAboutForm() {
  const imageInput = document.getElementById("profileImageInput");
  imageInput.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      document.getElementById("imageError").textContent = "Please choose an image file.";
      return;
    }
    document.getElementById("imageError").textContent = "";
    selectedImageFile = file;

    // Show an instant local preview before saving
    const reader = new FileReader();
    reader.onload = (ev) => {
      document.getElementById("profileImagePreview").src = ev.target.result;
      updatePreview(ev.target.result); // temporarily preview with the new image
    };
    reader.readAsDataURL(file);
  });

  document.getElementById("saveAboutBtn").addEventListener("click", async () => {
    portfolio.fullName = document.getElementById("fullName").value.trim();
    portfolio.title = document.getElementById("title").value.trim();
    portfolio.bio = document.getElementById("bio").value.trim();
    portfolio.email = document.getElementById("email").value.trim();
    portfolio.phone = document.getElementById("phone").value.trim();
    portfolio.location = document.getElementById("location").value.trim();
    await savePortfolio("About section saved!");
  });
}

/* ---------- Skills ---------- */
function renderSkills() {
  const container = document.getElementById("skillsList");
  container.innerHTML = (portfolio.skills || [])
    .map(
      (skill, index) => `
      <span class="skill-tag">
        ${escapeHtml(skill)}
        <button type="button" data-index="${index}" class="remove-skill-btn" aria-label="Remove skill">✕</button>
      </span>`
    )
    .join("");

  container.querySelectorAll(".remove-skill-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      portfolio.skills.splice(Number(btn.dataset.index), 1);
      renderSkills();
      updatePreview();
    });
  });
}

function initSkills() {
  const input = document.getElementById("skillInput");
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const value = input.value.trim();
      if (!value) return;
      if (!portfolio.skills) portfolio.skills = [];
      portfolio.skills.push(value);
      input.value = "";
      renderSkills();
      updatePreview();
    }
  });

  document.getElementById("saveSkillsBtn").addEventListener("click", () => savePortfolio("Skills saved!"));
}

/* ---------- Projects ---------- */
function renderProjects() {
  const container = document.getElementById("projectsList");
  container.innerHTML = (portfolio.projects || [])
    .map(
      (proj, index) => `
      <div class="list-item">
        <div class="list-item-text">
          <strong>${escapeHtml(proj.title)}</strong>
          <span>${escapeHtml(proj.description || "")}</span>
        </div>
        <div class="list-item-actions">
          <button type="button" class="icon-btn danger remove-project-btn" data-index="${index}" title="Delete">🗑️</button>
        </div>
      </div>`
    )
    .join("") || `<p style="color:var(--color-text-muted); font-size:0.85rem;">No projects added yet.</p>`;

  container.querySelectorAll(".remove-project-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      portfolio.projects.splice(Number(btn.dataset.index), 1);
      renderProjects();
      savePortfolio("Project removed.");
    });
  });
}

function initProjects() {
  document.getElementById("addProjectBtn").addEventListener("click", () => {
    const title = document.getElementById("projectTitle").value.trim();
    const description = document.getElementById("projectDescription").value.trim();
    const link = document.getElementById("projectLink").value.trim();

    if (!title) {
      showToast("Please give your project a title.", "error");
      return;
    }

    if (!portfolio.projects) portfolio.projects = [];
    portfolio.projects.push({ title, description, link });

    document.getElementById("projectTitle").value = "";
    document.getElementById("projectDescription").value = "";
    document.getElementById("projectLink").value = "";

    renderProjects();
    savePortfolio("Project added!");
  });
}

/* ---------- Experience ---------- */
function renderExperience() {
  const container = document.getElementById("experienceList");
  container.innerHTML = (portfolio.experience || [])
    .map(
      (exp, index) => `
      <div class="list-item">
        <div class="list-item-text">
          <strong>${escapeHtml(exp.role)} — ${escapeHtml(exp.company)}</strong>
          <span>${escapeHtml(exp.duration || "")}</span>
        </div>
        <div class="list-item-actions">
          <button type="button" class="icon-btn danger remove-exp-btn" data-index="${index}" title="Delete">🗑️</button>
        </div>
      </div>`
    )
    .join("") || `<p style="color:var(--color-text-muted); font-size:0.85rem;">No experience added yet.</p>`;

  container.querySelectorAll(".remove-exp-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      portfolio.experience.splice(Number(btn.dataset.index), 1);
      renderExperience();
      savePortfolio("Experience removed.");
    });
  });
}

function initExperience() {
  document.getElementById("addExpBtn").addEventListener("click", () => {
    const company = document.getElementById("expCompany").value.trim();
    const role = document.getElementById("expRole").value.trim();
    const duration = document.getElementById("expDuration").value.trim();
    const description = document.getElementById("expDescription").value.trim();

    if (!company || !role) {
      showToast("Please fill in the company and role.", "error");
      return;
    }

    if (!portfolio.experience) portfolio.experience = [];
    portfolio.experience.push({ company, role, duration, description });

    document.getElementById("expCompany").value = "";
    document.getElementById("expRole").value = "";
    document.getElementById("expDuration").value = "";
    document.getElementById("expDescription").value = "";

    renderExperience();
    savePortfolio("Experience added!");
  });
}

/* ---------- Education ---------- */
function renderEducation() {
  const container = document.getElementById("educationList");
  container.innerHTML = (portfolio.education || [])
    .map(
      (edu, index) => `
      <div class="list-item">
        <div class="list-item-text">
          <strong>${escapeHtml(edu.degree)}</strong>
          <span>${escapeHtml(edu.school || "")} · ${escapeHtml(edu.year || "")}</span>
        </div>
        <div class="list-item-actions">
          <button type="button" class="icon-btn danger remove-edu-btn" data-index="${index}" title="Delete">🗑️</button>
        </div>
      </div>`
    )
    .join("") || `<p style="color:var(--color-text-muted); font-size:0.85rem;">No education added yet.</p>`;

  container.querySelectorAll(".remove-edu-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      portfolio.education.splice(Number(btn.dataset.index), 1);
      renderEducation();
      savePortfolio("Education removed.");
    });
  });
}

function initEducation() {
  document.getElementById("addEduBtn").addEventListener("click", () => {
    const school = document.getElementById("eduSchool").value.trim();
    const degree = document.getElementById("eduDegree").value.trim();
    const year = document.getElementById("eduYear").value.trim();

    if (!school || !degree) {
      showToast("Please fill in the school and degree.", "error");
      return;
    }

    if (!portfolio.education) portfolio.education = [];
    portfolio.education.push({ school, degree, year });

    document.getElementById("eduSchool").value = "";
    document.getElementById("eduDegree").value = "";
    document.getElementById("eduYear").value = "";

    renderEducation();
    savePortfolio("Education added!");
  });
}

/* ---------- Certificates ---------- */
function renderCertificates() {
  const container = document.getElementById("certificatesList");
  container.innerHTML = (portfolio.certificates || [])
    .map(
      (cert, index) => `
      <div class="list-item">
        <div class="list-item-text">
          <strong>${escapeHtml(cert.title)}</strong>
          <span>${escapeHtml(cert.issuer || "")} · ${escapeHtml(cert.year || "")}</span>
        </div>
        <div class="list-item-actions">
          <button type="button" class="icon-btn danger remove-cert-btn" data-index="${index}" title="Delete">🗑️</button>
        </div>
      </div>`
    )
    .join("") || `<p style="color:var(--color-text-muted); font-size:0.85rem;">No certificates added yet.</p>`;

  container.querySelectorAll(".remove-cert-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      portfolio.certificates.splice(Number(btn.dataset.index), 1);
      renderCertificates();
      savePortfolio("Certificate removed.");
    });
  });
}

function initCertificates() {
  document.getElementById("addCertBtn").addEventListener("click", () => {
    const title = document.getElementById("certTitle").value.trim();
    const issuer = document.getElementById("certIssuer").value.trim();
    const year = document.getElementById("certYear").value.trim();

    if (!title) {
      showToast("Please give the certificate a title.", "error");
      return;
    }

    if (!portfolio.certificates) portfolio.certificates = [];
    portfolio.certificates.push({ title, issuer, year });

    document.getElementById("certTitle").value = "";
    document.getElementById("certIssuer").value = "";
    document.getElementById("certYear").value = "";

    renderCertificates();
    savePortfolio("Certificate added!");
  });
}

/* ---------- Drag-and-drop section reordering ---------- */
function renderSectionOrderList() {
  const list = document.getElementById("sectionOrderList");
  const order = portfolio.sectionOrder && portfolio.sectionOrder.length
    ? portfolio.sectionOrder
    : ["about", "skills", "projects", "experience", "education", "certificates", "contact"];

  list.innerHTML = order
    .map(
      (key) => `
      <div class="draggable-item" draggable="true" data-key="${key}">
        <span class="drag-handle">⠿</span> ${SECTION_LABELS[key] || key}
      </div>`
    )
    .join("");

  let draggedEl = null;

  list.querySelectorAll(".draggable-item").forEach((item) => {
    item.addEventListener("dragstart", () => {
      draggedEl = item;
      item.classList.add("dragging");
    });
    item.addEventListener("dragend", () => {
      item.classList.remove("dragging");
      draggedEl = null;
      // Save the new order to our in-memory portfolio object
      portfolio.sectionOrder = Array.from(list.querySelectorAll(".draggable-item")).map((el) => el.dataset.key);
      updatePreview();
    });
    item.addEventListener("dragover", (e) => {
      e.preventDefault();
      const afterElement = getDragAfterElement(list, e.clientY);
      if (!draggedEl) return;
      if (afterElement == null) {
        list.appendChild(draggedEl);
      } else {
        list.insertBefore(draggedEl, afterElement);
      }
    });
  });
}

function getDragAfterElement(container, y) {
  const items = [...container.querySelectorAll(".draggable-item:not(.dragging)")];
  return items.reduce(
    (closest, child) => {
      const box = child.getBoundingClientRect();
      const offset = y - box.top - box.height / 2;
      if (offset < 0 && offset > closest.offset) {
        return { offset, element: child };
      }
      return closest;
    },
    { offset: Number.NEGATIVE_INFINITY, element: null }
  ).element;
}

function initSectionOrder() {
  document.getElementById("saveOrderBtn").addEventListener("click", () => savePortfolio("Section order saved!"));
}

/* ---------- Template switcher ---------- */
function setActiveTemplateChip(template) {
  document.querySelectorAll(".template-chip").forEach((chip) => {
    chip.classList.toggle("active", chip.dataset.template === template);
  });
}

function initTemplateSwitcher() {
  document.querySelectorAll(".template-chip").forEach((chip) => {
    chip.addEventListener("click", () => {
      portfolio.template = chip.dataset.template;
      setActiveTemplateChip(portfolio.template);
      updatePreview();
      savePortfolio("Template updated!");
    });
  });
}

/* ---------- Live preview ---------- */
function updatePreview(tempImageOverride) {
  if (!portfolio) return;
  const previewData = tempImageOverride ? { ...portfolio, profileImage: tempImageOverride } : portfolio;
  document.getElementById("previewFrame").innerHTML = renderPortfolioHTML(previewData);
}

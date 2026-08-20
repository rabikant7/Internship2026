/* ============================================
   portfolio-render.js — Turns a portfolio data object
   into HTML. Shared by the editor's live preview,
   the full preview page, and the public gallery view.
   ============================================ */

function escapeHtml(str = "") {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

// Each renderer returns an HTML string for one section, or "" if empty
const sectionRenderers = {
  about: (p) => `
    <div class="p-header">
      <img src="${p.profileImage ? p.profileImage : 'https://via.placeholder.com/110'}" alt="${escapeHtml(p.fullName)}" />
      <h1>${escapeHtml(p.fullName) || "Your Name"}</h1>
      <div class="p-title">${escapeHtml(p.title) || "Your Professional Title"}</div>
      ${p.bio ? `<p class="p-bio">${escapeHtml(p.bio)}</p>` : ""}
      <div class="p-contact">
        ${p.email ? `<span>✉️ ${escapeHtml(p.email)}</span>` : ""}
        ${p.phone ? `<span>📞 ${escapeHtml(p.phone)}</span>` : ""}
        ${p.location ? `<span>📍 ${escapeHtml(p.location)}</span>` : ""}
      </div>
    </div>
  `,

  skills: (p) => {
    if (!p.skills || p.skills.length === 0) return "";
    return `
      <div class="p-section">
        <h2>Skills</h2>
        <div class="p-skills">
          ${p.skills.map((s) => `<span>${escapeHtml(s)}</span>`).join("")}
        </div>
      </div>
    `;
  },

  projects: (p) => {
    if (!p.projects || p.projects.length === 0) return "";
    return `
      <div class="p-section">
        <h2>Projects</h2>
        ${p.projects
          .map(
            (proj) => `
          <div class="p-project">
            <h4>${escapeHtml(proj.title)}</h4>
            ${proj.description ? `<p>${escapeHtml(proj.description)}</p>` : ""}
            ${proj.link ? `<a href="${escapeHtml(proj.link)}" target="_blank" rel="noopener">View Project →</a>` : ""}
          </div>`
          )
          .join("")}
      </div>
    `;
  },

  experience: (p) => {
    if (!p.experience || p.experience.length === 0) return "";
    return `
      <div class="p-section">
        <h2>Experience</h2>
        ${p.experience
          .map(
            (exp) => `
          <div class="p-exp">
            <h4>${escapeHtml(exp.role)} — ${escapeHtml(exp.company)}</h4>
            <div class="meta">${escapeHtml(exp.duration)}</div>
            ${exp.description ? `<p>${escapeHtml(exp.description)}</p>` : ""}
          </div>`
          )
          .join("")}
      </div>
    `;
  },

  education: (p) => {
    if (!p.education || p.education.length === 0) return "";
    return `
      <div class="p-section">
        <h2>Education</h2>
        ${p.education
          .map(
            (edu) => `
          <div class="p-edu">
            <h4>${escapeHtml(edu.degree)}</h4>
            <div class="meta">${escapeHtml(edu.school)} · ${escapeHtml(edu.year)}</div>
          </div>`
          )
          .join("")}
      </div>
    `;
  },

  certificates: (p) => {
    if (!p.certificates || p.certificates.length === 0) return "";
    return `
      <div class="p-section">
        <h2>Certificates</h2>
        ${p.certificates
          .map(
            (cert) => `
          <div class="p-cert">
            <h4>${escapeHtml(cert.title)}</h4>
            <div class="meta">${escapeHtml(cert.issuer)} · ${escapeHtml(cert.year)}</div>
          </div>`
          )
          .join("")}
      </div>
    `;
  },

  contact: (p) => {
    if (!p.email && !p.phone) return "";
    return `
      <div class="p-section">
        <h2>Get In Touch</h2>
        <p style="color:var(--color-text-muted); font-size:0.92rem;">
          ${p.email ? `Email: ${escapeHtml(p.email)}<br/>` : ""}
          ${p.phone ? `Phone: ${escapeHtml(p.phone)}` : ""}
        </p>
      </div>
    `;
  },
};

/**
 * Renders a full portfolio into an HTML string, following the
 * user's chosen section order and template.
 */
function renderPortfolioHTML(portfolio) {
  const order = portfolio.sectionOrder && portfolio.sectionOrder.length
    ? portfolio.sectionOrder
    : ["about", "skills", "projects", "experience", "education", "certificates", "contact"];

  // "about" (the header) always renders first, outside the ordered list
  const aboutHtml = sectionRenderers.about(portfolio);

  const bodyHtml = order
    .filter((key) => key !== "about")
    .map((key) => (sectionRenderers[key] ? sectionRenderers[key](portfolio) : ""))
    .join("");

  const template = portfolio.template || "modern";

  return `
    <div class="portfolio-render template-${template}">
      ${aboutHtml}
      ${bodyHtml}
    </div>
  `;
}

/* ============================================
   api.js — Small helper for talking to our backend.
   Every other JS file uses these functions instead
   of writing fetch() calls everywhere.
   ============================================ */

// Because server.js also serves this frontend folder, the API and the
// pages live on the same origin — so a relative path just works.
// (If you run the frontend from a different server/port, change this
// to something like "http://localhost:5000/api")
const API_BASE = "/api";

/**
 * Generic request helper.
 * @param {string} path - e.g. "/auth/login"
 * @param {object} options - fetch options (method, body, isFormData)
 */
async function apiRequest(path, { method = "GET", body = null, isFormData = false } = {}) {
  const headers = {};
  const token = localStorage.getItem("token");
  if (token) headers["Authorization"] = `Bearer ${token}`;

  if (!isFormData && body) {
    headers["Content-Type"] = "application/json";
  }

  const response = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: isFormData ? body : body ? JSON.stringify(body) : undefined,
  });

  let data = null;
  try {
    data = await response.json();
  } catch (e) {
    // response had no JSON body — that's fine for some endpoints
  }

  if (!response.ok) {
    const message = (data && data.message) || "Something went wrong. Please try again.";
    throw new Error(message);
  }

  return data;
}

const api = {
  register: (payload) => apiRequest("/auth/register", { method: "POST", body: payload }),
  login: (payload) => apiRequest("/auth/login", { method: "POST", body: payload }),

  getProfile: () => apiRequest("/profile"),
  updateProfile: (formData) => apiRequest("/profile", { method: "PUT", body: formData, isFormData: true }),

  createPortfolio: (payload) => apiRequest("/portfolio", { method: "POST", body: payload }),
  getMyPortfolio: () => apiRequest("/portfolio"),
  getPublicPortfolio: (slug) => apiRequest(`/portfolio/public/${slug}`),
  updatePortfolio: (id, formData) => apiRequest(`/portfolio/${id}`, { method: "PUT", body: formData, isFormData: true }),
  deletePortfolio: (id) => apiRequest(`/portfolio/${id}`, { method: "DELETE" }),

  getGallery: (params = "") => apiRequest(`/gallery${params}`),
  likePortfolio: (slug) => apiRequest(`/gallery/${slug}/like`, { method: "PUT" }),
};

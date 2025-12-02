// src/services/api.js

// ⚠️ CAMBIA ESTO POR TU URL REAL DE RENDER
const API_URL = "https://otamanga-production.up.railway.app/api";

const apiFetch = async (endpoint, options = {}) => {
  const defaultHeaders = {
    "Content-Type": "application/json",
    "Accept": "application/json",
  };

  const config = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
    credentials: "include", 
  };

  try {
    const response = await fetch(`${API_URL}${endpoint}`, config);

    if (response.status === 401) {
      console.warn("Sesión no autorizada o expirada");
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Error ${response.status}`);
    }

    if (response.status === 204) return null;

    return await response.json();
  } catch (error) {
    console.error(`Error en API (${endpoint}):`, error);
    throw error;
  }
};

/* --- SERVICIOS --- */

export const authService = {
  // Login existente
  loginAdmin: (creds) => apiFetch("/Auth/admin/login", { method: "POST", body: JSON.stringify(creds) }),
  
  // NUEVO: Registro de Admin
  registerAdmin: (data) => apiFetch("/Auth/admin/register", { method: "POST", body: JSON.stringify(data) }),
  
  logout: () => apiFetch("/Auth/logout", { method: "POST" }),
  checkAuth: () => apiFetch("/Auth/check-auth"),
};

export const mangaService = {
  getAll: () => apiFetch("/Mangas"),
  getById: (id) => apiFetch(`/Mangas/${id}`),
  getByCategory: (catId) => apiFetch(`/Mangas/category/${catId}`),
  create: (data) => apiFetch("/Mangas", { method: "POST", body: JSON.stringify(data) }),
  update: (id, data) => apiFetch(`/Mangas/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  exportExcel: () => window.open(`${API_URL}/Mangas/export`, '_blank')
};

export const authorService = {
  getAll: () => apiFetch("/Authors"),
  getById: (id) => apiFetch(`/Authors/${id}`),
  create: (data) => apiFetch("/Authors", { method: "POST", body: JSON.stringify(data) }),
  update: (id, data) => apiFetch(`/Authors/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  delete: (id) => apiFetch(`/Authors/${id}`, { method: "DELETE" }),
};

export const categoryService = {
  getAll: () => apiFetch("/Category"),
  getById: (id) => apiFetch(`/Category/${id}`),
  create: (data) => apiFetch("/Category", { method: "POST", body: JSON.stringify(data) }),
  update: (id, data) => apiFetch(`/Category/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  delete: (id) => apiFetch(`/Category/${id}`, { method: "DELETE" }),
};

export const orderService = {
  create: (orderData) => apiFetch("/Orders", { method: "POST", body: JSON.stringify(orderData) }),
  getMyOrders: () => apiFetch("/Orders"),
  getAllAdmin: () => apiFetch("/admin/orders"),
};

export const metricService = {
  registerClick: (data) => apiFetch("/Metrics/click", { method: "POST", body: JSON.stringify(data) }),
  getTop: () => apiFetch("/Metrics/top"),
  getRanking: () => apiFetch("/Metrics/category-ranking"),
};

export const recommendationService = {
  get: () => apiFetch("/Recommendations"),
};

const api = {
  auth: authService,
  mangas: mangaService,
  authors: authorService,
  categories: categoryService,
  orders: orderService,
  metrics: metricService,
  recommendations: recommendationService
};

export default api;
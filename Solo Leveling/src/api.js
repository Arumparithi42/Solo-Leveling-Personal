// Base URL of the Express backend. Override with a .env file
// (VITE_API_URL=http://localhost:5000/api) if the backend runs elsewhere.
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// Thin wrapper around fetch that adds the base URL, JSON headers, and
// consistent error handling. Every component calls this instead of using
// fetch directly.
async function request(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  let data = null;
  try {
    data = await res.json();
  } catch {
    // Some endpoints (rare) may not return a body — that's fine.
  }

  if (!res.ok) {
    const message = (data && data.message) || `Request failed with status ${res.status}`;
    throw new Error(message);
  }

  return data;
}

export const api = {
  // ---- User ----
  getUser: () => request("/user"),

  // ---- Quests ----
  toggleDaily: (missionId) => request(`/daily/${missionId}`, { method: "PUT" }),
  toggleBonus: (missionId) => request(`/bonus/${missionId}`, { method: "PUT" }),
  toggleWeekly: (missionId) => request(`/weekly/${missionId}`, { method: "PUT" }),

  // ---- Todo ----
  getTodos: () => request("/todo"),
  createTodo: (title, description) =>
    request("/todo", { method: "POST", body: JSON.stringify({ title, description }) }),
  updateTodo: (id, title, description) =>
    request(`/todo/${id}`, { method: "PUT", body: JSON.stringify({ title, description }) }),
  deleteTodo: (id) => request(`/todo/${id}`, { method: "DELETE" }),
  toggleTodo: (id) => request(`/todo/toggle/${id}`, { method: "PUT" }),

  // ---- Penalty ----
  getPenalty: () => request("/penalty"),
  compensate: (description) =>
    request("/compensate", { method: "POST", body: JSON.stringify({ description }) }),
};

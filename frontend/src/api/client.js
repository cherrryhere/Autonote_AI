// Thin fetch wrapper around the Express backend.
// During dev, /api is proxied to http://localhost:3001 (see vite.config.js).

const BASE = '/api'

// Holds the current session token in memory so every request can attach it.
// AuthContext is the single writer — it keeps this in sync with localStorage.
let authToken = null
export function setAuthToken(token) {
  authToken = token
}

function authHeaders(extra = {}) {
  return authToken ? { ...extra, Authorization: `Bearer ${authToken}` } : extra
}

async function handle(res) {
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }))
    const error = new Error(err.error || `HTTP ${res.status}`)
    error.status = res.status
    throw error
  }
  return res.json()
}

export const authApi = {
  signup: async ({ name, email, password }) => {
    const res = await fetch(`${BASE}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    })
    return handle(res)
  },

  login: async ({ email, password }) => {
    const res = await fetch(`${BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })
    return handle(res)
  },

  me: async () => {
    const res = await fetch(`${BASE}/auth/me`, { headers: authHeaders() })
    return handle(res)
  },
}

export const api = {
  // POST multipart upload — returns { id, status, step }
  uploadLecture: async ({ file, title, subject, semester }) => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('title', title)
    formData.append('subject', subject)
    formData.append('semester', semester)
    const res = await fetch(`${BASE}/lectures`, {
      method: 'POST',
      headers: authHeaders(),
      body: formData,
    })
    return handle(res)
  },

  // POST a YouTube URL — returns { id, status, step }
  uploadLectureFromUrl: async ({ url, title, subject, semester }) => {
    const res = await fetch(`${BASE}/lectures/url`, {
      method: 'POST',
      headers: authHeaders({ 'Content-Type': 'application/json' }),
      body: JSON.stringify({ url, title, subject, semester }),
    })
    return handle(res)
  },

  // Optional: peek at YouTube metadata before submitting
  fetchYouTubeInfo: async (url) => {
    const res = await fetch(`${BASE}/lectures/url-info?url=${encodeURIComponent(url)}`, {
      headers: authHeaders(),
    })
    return handle(res)
  },

  getStatus: async (id) => {
    const res = await fetch(`${BASE}/lectures/${id}/status`, { headers: authHeaders() })
    return handle(res)
  },

  getLecture: async (id) => {
    const res = await fetch(`${BASE}/lectures/${id}`, { headers: authHeaders() })
    return handle(res)
  },

  listLectures: async () => {
    const res = await fetch(`${BASE}/lectures`, { headers: authHeaders() })
    const data = await handle(res)
    return data.lectures || []
  },

  getStats: async () => {
    const res = await fetch(`${BASE}/stats`, { headers: authHeaders() })
    return handle(res)
  },

  health: async () => {
    try {
      const res = await fetch(`${BASE}/health`)
      return res.ok
    } catch { return false }
  },
}

// Local helpers — remember the most recently processed lecture id across pages
const KEY = 'autonote.currentLectureId'
export const currentLectureId = {
  get:   () => localStorage.getItem(KEY),
  set:   (id) => localStorage.setItem(KEY, id),
  clear: () => localStorage.removeItem(KEY),
}

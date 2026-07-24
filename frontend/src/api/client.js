// Thin fetch wrapper around the Express backend.
// During dev, /api is proxied to http://localhost:3001 (see vite.config.js).

const BASE = '/api'

async function handle(res) {
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }))
    throw new Error(err.error || `HTTP ${res.status}`)
  }
  return res.json()
}

export const api = {
  // POST multipart upload — returns { id, status, step }
  uploadLecture: async ({ file, title, subject, semester }) => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('title', title)
    formData.append('subject', subject)
    formData.append('semester', semester)
    const res = await fetch(`${BASE}/lectures`, { method: 'POST', body: formData })
    return handle(res)
  },

  // POST a YouTube URL — returns { id, status, step }
  uploadLectureFromUrl: async ({ url, title, subject, semester }) => {
    const res = await fetch(`${BASE}/lectures/url`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url, title, subject, semester }),
    })
    return handle(res)
  },

  // Optional: peek at YouTube metadata before submitting
  fetchYouTubeInfo: async (url) => {
    const res = await fetch(`${BASE}/lectures/url-info?url=${encodeURIComponent(url)}`)
    return handle(res)
  },

  getStatus: async (id) => {
    const res = await fetch(`${BASE}/lectures/${id}/status`)
    return handle(res)
  },

  getLecture: async (id) => {
    const res = await fetch(`${BASE}/lectures/${id}`)
    return handle(res)
  },

  listLectures: async () => {
    const res = await fetch(`${BASE}/lectures`)
    const data = await handle(res)
    return data.lectures || []
  },

  getStats: async () => {
    const res = await fetch(`${BASE}/stats`)
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

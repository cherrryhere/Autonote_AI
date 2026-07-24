// Tiny in-memory store for lectures + jobs.
// State is lost on restart — fine for dev/demos. Swap for SQLite later.

const lectures = new Map() // id -> lecture record

export const STEPS = [
  'upload',          // 0 — file received by server
  'transcribe',      // 1 — Gemini speech-to-text
  'summarise',       // 2 — short + detailed summary + takeaways
  'notes',           // 3 — topic-wise notes
  'flashcards_quiz', // 4 — flashcards + MCQ quiz
]

export function createLecture({ id, title, subject, semester, filename, mimeType, size, sourceUrl }) {
  const record = {
    id,
    title,
    subject,
    semester,
    filename,
    mimeType,
    size,
    sourceUrl: sourceUrl || null,
    date: new Date().toISOString().slice(0, 10),
    duration: '—',
    status: 'processing',   // 'processing' | 'completed' | 'failed'
    step: 0,                // index into STEPS
    error: null,
    transcript: null,
    summary: null,
    notes: null,
    flashcards: null,
    quiz: null,
    createdAt: Date.now(),
  }
  lectures.set(id, record)
  return record
}

export function getLecture(id) {
  return lectures.get(id) || null
}

export function updateLecture(id, patch) {
  const cur = lectures.get(id)
  if (!cur) return null
  Object.assign(cur, patch)
  return cur
}

export function listLectures() {
  return Array.from(lectures.values()).sort((a, b) => b.createdAt - a.createdAt)
}

export function getStats() {
  const all = Array.from(lectures.values())
  const completed = all.filter((l) => l.status === 'completed')
  return {
    totalLectures:     all.length,
    notesGenerated:    completed.reduce((n, l) => n + (l.notes?.length || 0), 0),
    flashcardsCreated: completed.reduce((n, l) => n + (l.flashcards?.length || 0), 0),
    quizzesGenerated:  completed.length, // one quiz per processed lecture
  }
}

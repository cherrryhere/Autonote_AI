// Lecture + job store, backed by Postgres so records survive restarts/redeploys.

import { pool } from '../db.js'

export const STEPS = [
  'upload',          // 0 — file received by server
  'transcribe',      // 1 — Gemini speech-to-text
  'summarise',       // 2 — short + detailed summary + takeaways
  'notes',           // 3 — topic-wise notes
  'flashcards_quiz', // 4 — flashcards + MCQ quiz
]

// camelCase field -> snake_case column, for fields the two don't share verbatim.
const COLUMN = {
  userId: 'user_id',
  mimeType: 'mime_type',
  sourceUrl: 'source_url',
  sourceTitle: 'source_title',
  sourceAuthor: 'source_author',
  rateLimited: 'rate_limited',
  createdAt: 'created_at',
}

const JSON_FIELDS = new Set(['summary', 'notes', 'flashcards', 'quiz'])

export async function createLecture({ id, userId, title, subject, semester, filename, mimeType, size, sourceUrl }) {
  const date = new Date().toISOString().slice(0, 10)
  const createdAt = Date.now()

  await pool.query(
    `INSERT INTO lectures
       (id, user_id, title, subject, semester, filename, mime_type, size, source_url, date, duration, status, step, created_at)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)`,
    [id, userId, title, subject, semester, filename, mimeType, size, sourceUrl || null, date, '—', 'processing', 0, createdAt]
  )

  return getLecture(id)
}

export async function getLecture(id) {
  const { rows } = await pool.query('SELECT * FROM lectures WHERE id = $1', [id])
  return rows[0] ? mapLecture(rows[0]) : null
}

export async function updateLecture(id, patch) {
  const keys = Object.keys(patch)
  if (keys.length === 0) return getLecture(id)

  const setClauses = keys.map((key, i) => `${COLUMN[key] || key} = $${i + 2}`)
  const values = keys.map((key) => {
    const value = patch[key]
    return JSON_FIELDS.has(key) && value != null ? JSON.stringify(value) : value
  })

  const { rows } = await pool.query(
    `UPDATE lectures SET ${setClauses.join(', ')} WHERE id = $1 RETURNING *`,
    [id, ...values]
  )
  return rows[0] ? mapLecture(rows[0]) : null
}

export async function listLectures(userId) {
  const { rows } = await pool.query(
    'SELECT * FROM lectures WHERE user_id = $1 ORDER BY created_at DESC',
    [userId]
  )
  return rows.map(mapLecture)
}

export async function getStats(userId) {
  const { rows } = await pool.query('SELECT * FROM lectures WHERE user_id = $1', [userId])
  const all = rows.map(mapLecture)
  const completed = all.filter((l) => l.status === 'completed')
  return {
    totalLectures:     all.length,
    notesGenerated:    completed.reduce((n, l) => n + (l.notes?.length || 0), 0),
    flashcardsCreated: completed.reduce((n, l) => n + (l.flashcards?.length || 0), 0),
    quizzesGenerated:  completed.length, // one quiz per processed lecture
  }
}

function mapLecture(row) {
  return {
    id: row.id,
    userId: row.user_id,
    title: row.title,
    subject: row.subject,
    semester: row.semester,
    filename: row.filename,
    mimeType: row.mime_type,
    size: row.size == null ? 0 : Number(row.size),
    sourceUrl: row.source_url,
    sourceTitle: row.source_title,
    sourceAuthor: row.source_author,
    date: row.date,
    duration: row.duration,
    status: row.status,
    step: row.step,
    error: row.error,
    rateLimited: row.rate_limited,
    transcript: row.transcript,
    summary: row.summary,
    notes: row.notes,
    flashcards: row.flashcards,
    quiz: row.quiz,
    createdAt: Number(row.created_at),
  }
}

import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { mkdirSync } from 'fs'

import lecturesRouter from './src/routes/lectures.js'
import statsRouter    from './src/routes/stats.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname  = dirname(__filename)

const PORT = process.env.PORT || 3001
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || 'http://localhost:5173'

// Make sure ./uploads exists
mkdirSync(join(__dirname, 'uploads'), { recursive: true })

const app = express()

app.use(cors({ origin: FRONTEND_ORIGIN, credentials: true }))
app.use(express.json({ limit: '2mb' }))
app.use(morgan('dev'))

app.get('/api/health', (_req, res) => res.json({ ok: true, ts: Date.now() }))

app.use('/api/lectures', lecturesRouter)
app.use('/api/stats',    statsRouter)

// 404
app.use((req, res) => res.status(404).json({ error: 'Not found', path: req.path }))

// Error handler
app.use((err, _req, res, _next) => {
  console.error('[error]', err)
  res.status(err.status || 500).json({ error: err.message || 'Server error' })
})

app.listen(PORT, () => {
  const transcribeModel = process.env.GROQ_TRANSCRIBE_MODEL || 'whisper-large-v3-turbo'
  const chatModel       = process.env.GROQ_CHAT_MODEL       || 'llama-3.3-70b-versatile'
  const keyOk = !!process.env.GROQ_API_KEY
  console.log(`\n  AutoNote AI backend listening on http://localhost:${PORT}`)
  console.log(`  CORS allowed for ${FRONTEND_ORIGIN}`)
  console.log(`  Transcribe:   ${transcribeModel}`)
  console.log(`  Chat model:   ${chatModel}`)
  console.log(`  Groq key:     ${keyOk ? 'loaded ✓' : 'MISSING ✗  — add GROQ_API_KEY to .env'}`)
  console.log('')
})

import { unlink } from 'fs/promises'
import { compressForWhisper } from './audio.js'
import { transcribeAudio, generateStudyMaterial } from './groq.js'
import { downloadYouTubeAudio } from './downloader.js'
import { updateLecture, getLecture } from './store.js'

// Kick off the pipeline. Caller does not await — UI polls /status.
export function startProcessing(lectureId, source) {
  process(lectureId, source).catch(async (err) => {
    console.error(`[processor] lecture ${lectureId} failed:`, err.message)
    await updateLecture(lectureId, {
      status: 'failed',
      error: err.message,
      rateLimited: !!err.rateLimited,
    })
  })
}

// `source` is either { kind: 'file', filePath } or { kind: 'url', url }.
async function process(lectureId, source) {
  const lecture = await getLecture(lectureId)
  if (!lecture) throw new Error('Lecture not found')

  // ─── Step 1 — get audio onto disk ──────────────────────────────────────────
  // For URL sources this means downloading from YouTube; for file sources it's
  // already on disk from multer. Either way, we end up with an input path.
  await updateLecture(lectureId, { step: 1 })

  let inputPath
  let downloadedPath = null      // tracked separately so we can clean it up

  if (source.kind === 'url') {
    const dl = await downloadYouTubeAudio(source.url)
    inputPath = downloadedPath = dl.path
    // Stamp the duration we got from YouTube straight away so it's available
    // even if the user navigates between pages mid-pipeline.
    await updateLecture(lectureId, {
      duration: formatDuration(dl.durationSeconds),
      sourceTitle: dl.title,
      sourceAuthor: dl.author,
    })
  } else {
    inputPath = source.filePath
  }

  // ─── Compress to a Whisper-friendly mono 32 kbps MP3 ───────────────────────
  const { path: audioPath, didCompress } = await compressForWhisper(inputPath)

  // ─── Step 2 — transcribe with Groq Whisper ─────────────────────────────────
  await updateLecture(lectureId, { step: 2 })
  const transcript = await transcribeAudio(audioPath)

  if (!transcript || transcript.trim().length < 20) {
    throw new Error('Transcription returned empty text. Is there clear speech in the file?')
  }

  // ─── Steps 3–4 — Llama generates summary + notes + flashcards + quiz ───────
  await updateLecture(lectureId, { step: 3 })

  const ticker = setInterval(() => {
    getLecture(lectureId).then((cur) => {
      if (cur && cur.step < 4) return updateLecture(lectureId, { step: cur.step + 1 })
    }).catch((err) => console.error(`[processor] ticker update failed for ${lectureId}:`, err.message))
  }, 6000)

  let result
  try {
    result = await generateStudyMaterial({ transcript, lecture })
  } finally {
    clearInterval(ticker)
  }

  // ─── Step 5 — done ─────────────────────────────────────────────────────────
  await updateLecture(lectureId, {
    status:     'completed',
    step:       5,
    duration:   result.durationLabel || lecture.duration,
    transcript,
    summary:    result.summary,
    notes:      result.notes,
    flashcards: result.flashcards,
    quiz:       result.quiz,
  })

  // Cleanup local files (best-effort).
  if (source.kind === 'file') unlink(inputPath).catch(() => {})
  if (downloadedPath)        unlink(downloadedPath).catch(() => {})
  if (didCompress && audioPath !== inputPath) unlink(audioPath).catch(() => {})
}

function formatDuration(seconds) {
  if (!seconds) return '—'
  const mins = Math.round(seconds / 60)
  if (mins < 60) return `${mins} min`
  const h = Math.floor(mins / 60)
  const m = mins % 60
  return m === 0 ? `${h}h` : `${h}h ${m}m`
}

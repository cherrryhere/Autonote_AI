import { Router } from 'express'
import { nanoid } from 'nanoid'
import { upload } from '../middleware/upload.js'
import { createLecture, getLecture, listLectures, STEPS } from '../services/store.js'
import { startProcessing } from '../services/processor.js'
import { isSupportedUrl, getYouTubeInfo } from '../services/downloader.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()

router.use(requireAuth)

// POST /api/lectures — multipart file upload + start processing
router.post('/', upload.single('file'), async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded.' })

    const { title, subject, semester } = req.body
    if (!title || !subject || !semester) {
      return res.status(400).json({ error: 'title, subject, and semester are required.' })
    }

    const id = nanoid(10)
    const lecture = await createLecture({
      id,
      userId: req.userId,
      title,
      subject,
      semester,
      filename: req.file.filename,
      mimeType: req.file.mimetype,
      size:     req.file.size,
    })

    startProcessing(id, { kind: 'file', filePath: req.file.path })

    res.status(202).json({ id: lecture.id, status: lecture.status, step: lecture.step })
  } catch (err) { next(err) }
})

// POST /api/lectures/url — process a YouTube URL
router.post('/url', async (req, res, next) => {
  try {
    const { url, title, subject, semester } = req.body || {}

    if (!url)      return res.status(400).json({ error: 'url is required.' })
    if (!subject)  return res.status(400).json({ error: 'subject is required.' })
    if (!semester) return res.status(400).json({ error: 'semester is required.' })

    if (!isSupportedUrl(url)) {
      return res.status(400).json({ error: 'Provide a valid http(s) URL.' })
    }

    // If the user didn't provide a title, fetch it from YouTube.
    let finalTitle = title
    if (!finalTitle) {
      try {
        const info = await getYouTubeInfo(url)
        finalTitle = info.title
      } catch {
        finalTitle = 'Untitled YouTube lecture'
      }
    }

    const id = nanoid(10)
    const lecture = await createLecture({
      id,
      userId: req.userId,
      title:    finalTitle,
      subject,
      semester,
      filename: null,
      mimeType: 'audio/mp4',
      size:     0,
      sourceUrl: url,
    })

    startProcessing(id, { kind: 'url', url })

    res.status(202).json({ id: lecture.id, status: lecture.status, step: lecture.step })
  } catch (err) { next(err) }
})

// GET /api/lectures/url-info?url=… — preview YouTube metadata before submitting
router.get('/url-info', async (req, res, next) => {
  try {
    const url = req.query.url
    if (!url || !isSupportedUrl(url)) {
      return res.status(400).json({ error: 'Provide a valid ?url=' })
    }
    const info = await getYouTubeInfo(url)
    res.json(info)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

// GET /api/lectures — recent first (strips heavy fields)
router.get('/', async (req, res, next) => {
  try {
    const lectures = await listLectures(req.userId)
    const list = lectures.map(({ transcript: _t, notes: _n, summary: _s, flashcards: _f, quiz: _q, ...meta }) => meta)
    res.json({ lectures: list })
  } catch (err) { next(err) }
})

// GET /api/lectures/:id/status — lightweight progress endpoint for polling
router.get('/:id/status', async (req, res, next) => {
  try {
    const lecture = await getLecture(req.params.id)
    if (!lecture || lecture.userId !== req.userId) return res.status(404).json({ error: 'Lecture not found.' })
    res.json({
      id:       lecture.id,
      status:   lecture.status,
      step:     lecture.step,
      stepName: STEPS[lecture.step] || 'done',
      error:    lecture.error,
    })
  } catch (err) { next(err) }
})

// GET /api/lectures/:id — full lecture record
router.get('/:id', async (req, res, next) => {
  try {
    const lecture = await getLecture(req.params.id)
    if (!lecture || lecture.userId !== req.userId) return res.status(404).json({ error: 'Lecture not found.' })
    res.json(lecture)
  } catch (err) { next(err) }
})

export default router

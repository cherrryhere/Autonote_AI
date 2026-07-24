import multer from 'multer'
import { fileURLToPath } from 'url'
import { dirname, extname, join } from 'path'
import { nanoid } from 'nanoid'

const __filename = fileURLToPath(import.meta.url)
const __dirname  = dirname(__filename)
const UPLOAD_DIR = join(__dirname, '..', '..', 'uploads')

const ALLOWED_MIMES = new Set([
  'audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/x-wav', 'audio/wave',
  'video/mp4',  'video/quicktime',
])

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOAD_DIR),
  filename:    (_req, file, cb) => cb(null, `${nanoid(10)}${extname(file.originalname)}`),
})

export const upload = multer({
  storage,
  limits: { fileSize: 500 * 1024 * 1024 }, // 500 MB
  fileFilter: (_req, file, cb) => {
    if (ALLOWED_MIMES.has(file.mimetype)) return cb(null, true)
    cb(new Error(`Unsupported file type: ${file.mimetype}. Use MP3, WAV, MP4, or MOV.`))
  },
})

import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { promises as fs } from 'fs'
import { nanoid } from 'nanoid'
import ffmpegPath from '@ffmpeg-installer/ffmpeg'
import ffmpeg from 'fluent-ffmpeg'

ffmpeg.setFfmpegPath(ffmpegPath.path)

const __filename = fileURLToPath(import.meta.url)
const __dirname  = dirname(__filename)
const UPLOAD_DIR = join(__dirname, '..', '..', 'uploads')

// Groq Whisper free-tier hard cap (25 MB). Compress everything to be well under.
const GROQ_WHISPER_MAX_BYTES = 25 * 1024 * 1024

// Compress audio/video to a tiny mono MP3 suitable for Whisper.
// 32 kbps mono ≈ 14 MB per hour — under the 25 MB cap for ~1.5h of lecture.
// Whisper is robust to low-bitrate audio for speech, so quality stays good.
export async function compressForWhisper(srcPath) {
  const stat = await fs.stat(srcPath)
  // If the file is already a small audio file, skip the conversion.
  if (stat.size < GROQ_WHISPER_MAX_BYTES && /\.mp3$/i.test(srcPath)) {
    return { path: srcPath, didCompress: false, sizeBytes: stat.size }
  }

  const outPath = join(UPLOAD_DIR, `${nanoid(10)}.mp3`)

  await new Promise((resolve, reject) => {
    ffmpeg(srcPath)
      .noVideo()
      .audioChannels(1)
      .audioFrequency(16000)        // Whisper's native sample rate
      .audioBitrate('32k')          // tiny but speech-intelligible
      .audioCodec('libmp3lame')
      .format('mp3')
      .on('end', resolve)
      .on('error', reject)
      .save(outPath)
  })

  const outStat = await fs.stat(outPath)
  if (outStat.size > GROQ_WHISPER_MAX_BYTES) {
    throw new Error(
      `Compressed audio is ${(outStat.size / 1024 / 1024).toFixed(1)} MB — ` +
      `still over Groq Whisper's 25 MB free-tier limit. ` +
      `Try a shorter lecture (under ~90 minutes).`
    )
  }
  return { path: outPath, didCompress: true, sizeBytes: outStat.size }
}

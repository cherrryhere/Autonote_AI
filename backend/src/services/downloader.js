import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { promises as fs } from 'fs'
import { nanoid } from 'nanoid'
import youtubeDlDefault, { create as createYoutubeDl } from 'youtube-dl-exec'

// If YT_DLP_PATH is set in .env, use that binary (handy when the postinstall
// download is blocked by GitHub rate limits or corporate proxies).
// Otherwise fall back to the binary fetched by the package on `npm install`.
const youtubeDl = process.env.YT_DLP_PATH
  ? createYoutubeDl(process.env.YT_DLP_PATH)
  : youtubeDlDefault

const __filename = fileURLToPath(import.meta.url)
const __dirname  = dirname(__filename)
const UPLOAD_DIR = join(__dirname, '..', '..', 'uploads')

// 3 hours — refuse anything obviously a livestream or movie-length file.
const MAX_DURATION_SECONDS = 3 * 60 * 60

// Accept any http(s) URL — yt-dlp supports ~1000 sites (YouTube, Vimeo,
// SoundCloud, direct media URLs, etc.). If the site isn't supported, the
// metadata call below returns a clear error.
export function isSupportedUrl(url) {
  if (!url) return false
  try {
    const u = new URL(String(url).trim())
    return u.protocol === 'http:' || u.protocol === 'https:'
  } catch { return false }
}

// Back-compat alias — older callers used this name.
export const isYouTubeUrl = isSupportedUrl

// Fetches title + duration without downloading the audio.
export async function getYouTubeInfo(url) {
  if (!isSupportedUrl(url)) throw new Error('Not a valid URL.')
  try {
    const info = await youtubeDl(url, {
      dumpSingleJson:      true,
      noWarnings:          true,
      noPlaylist:          true,
      skipDownload:        true,
      noCheckCertificates: true,
    })
    return {
      title:           info.title || 'Untitled',
      author:          info.uploader || info.channel || null,
      durationSeconds: info.duration ? Math.round(info.duration) : 0,
      thumbnail:       info.thumbnail || (info.thumbnails?.[0]?.url ?? null),
    }
  } catch (err) {
    throw friendlyError(err)
  }
}

// Downloads the best audio-only track to <UPLOAD_DIR>/<nanoid>.<ext>.
// We pick a flexible output template so yt-dlp picks the right extension
// (m4a/webm/opus depending on what's available) — ffmpeg re-encodes downstream.
export async function downloadYouTubeAudio(url) {
  if (!isSupportedUrl(url)) throw new Error('Not a valid URL.')

  let info
  try {
    info = await youtubeDl(url, {
      dumpSingleJson:      true,
      noWarnings:          true,
      noPlaylist:          true,
      skipDownload:        true,
      noCheckCertificates: true,
    })
  } catch (err) {
    throw friendlyError(err)
  }

  const durationSeconds = info.duration ? Math.round(info.duration) : 0
  if (info.is_live || info.was_live) {
    throw new Error('Live streams are not supported. Please use a recorded video.')
  }
  if (durationSeconds > MAX_DURATION_SECONDS) {
    throw new Error(
      `Video is ${(durationSeconds / 3600).toFixed(1)}h long — over the ${MAX_DURATION_SECONDS / 3600}h cap. ` +
      `Please use a shorter lecture.`
    )
  }

  const stem = nanoid(10)
  // %(ext)s lets yt-dlp pick the container it gets back.
  const outputTemplate = join(UPLOAD_DIR, `${stem}.%(ext)s`)

  try {
    await youtubeDl(url, {
      output:              outputTemplate,
      format:              'bestaudio/best',
      noPlaylist:          true,
      noWarnings:          true,
      noCheckCertificates: true,
      // Useful when YouTube tightens bot detection — pretend to be a real browser.
      addHeader: ['user-agent:Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'],
    })
  } catch (err) {
    throw friendlyError(err)
  }

  // yt-dlp filled in %(ext)s — find what it actually wrote.
  const downloaded = await findDownloadedFile(stem)
  if (!downloaded) {
    throw new Error('yt-dlp finished but no audio file was found on disk.')
  }

  return {
    path:            downloaded,
    title:           info.title || 'Untitled',
    author:          info.uploader || info.channel || null,
    durationSeconds,
    mimeType:        guessMime(downloaded),
  }
}

async function findDownloadedFile(stem) {
  const entries = await fs.readdir(UPLOAD_DIR)
  const match = entries.find((name) => name.startsWith(stem + '.'))
  return match ? join(UPLOAD_DIR, match) : null
}

function guessMime(filePath) {
  if (/\.m4a$/i.test(filePath))  return 'audio/mp4'
  if (/\.mp3$/i.test(filePath))  return 'audio/mpeg'
  if (/\.webm$/i.test(filePath)) return 'audio/webm'
  if (/\.opus$/i.test(filePath)) return 'audio/opus'
  return 'audio/mp4'
}

function friendlyError(err) {
  const m = String(err?.stderr || err?.message || err)
  if (/private video/i.test(m))                              return new Error('This video is private.')
  if (/sign in|age.?restricted/i.test(m))                    return new Error('Video requires sign-in (age-restricted).')
  if (/video unavailable|not available/i.test(m))            return new Error('Video is unavailable in this region or has been removed.')
  if (/HTTP Error 403/i.test(m))                             return new Error('YouTube blocked the request (403). Try again in a minute.')
  if (/HTTP Error 429/i.test(m))                             return new Error('YouTube is rate-limiting the IP. Wait a few minutes and retry.')
  if (/Unsupported URL|No video formats found/i.test(m))     return new Error('That URL isn\'t supported. Use YouTube, Vimeo, or a direct audio/video link.')
  if (/ENOENT|spawn.*ENOENT|Could not find yt-dlp/i.test(m)) return new Error('yt-dlp binary not found. Run `npm install` in the backend folder again.')
  // Default — surface the real error, trimmed.
  const trimmed = m.split('\n').slice(0, 2).join(' ').trim()
  return new Error(`Download failed: ${trimmed}`)
}

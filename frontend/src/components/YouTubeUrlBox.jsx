import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Youtube, CheckCircle2, Loader2, AlertCircle, X, Clock, User } from 'lucide-react'
import { api } from '../api/client.js'

// Loose check — yt-dlp on the backend supports YouTube, Vimeo, SoundCloud, and
// direct media URLs. Anything that parses as an http(s) URL is worth trying.
function looksLikeUrl(value) {
  try {
    const u = new URL(String(value).trim())
    return u.protocol === 'http:' || u.protocol === 'https:'
  } catch { return false }
}

export default function YouTubeUrlBox({ value, onChange, onTitleSuggested }) {
  const [info, setInfo]       = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState(null)
  const debounceRef           = useRef(null)

  // Debounced metadata fetch when the URL changes.
  useEffect(() => {
    setError(null)
    setInfo(null)

    if (!value) return
    if (!looksLikeUrl(value)) {
      setError('That doesn\'t look like a valid URL.')
      return
    }

    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(async () => {
      setLoading(true)
      try {
        const data = await api.fetchYouTubeInfo(value.trim())
        setInfo(data)
        onTitleSuggested?.(data.title)
      } catch (err) {
        setError(err.message || 'Could not fetch video info.')
      } finally {
        setLoading(false)
      }
    }, 600)

    return () => clearTimeout(debounceRef.current)
  }, [value]) // eslint-disable-line react-hooks/exhaustive-deps

  const formatDuration = (s) => {
    if (!s) return '—'
    const m = Math.round(s / 60)
    if (m < 60) return `${m} min`
    return `${Math.floor(m / 60)}h ${m % 60}m`
  }

  return (
    <div className="w-full">
      <div className="rounded-3xl border-2 border-dashed border-slate-300 bg-slate-50/60 px-6 py-10 sm:py-12 transition-colors hover:border-brand-400 hover:bg-brand-50/40">
        <div className="flex flex-col items-center text-center mb-5">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-rose-500 to-red-600 grid place-items-center shadow-soft mb-4">
            <Youtube className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-xl font-bold text-slate-800">Paste a YouTube URL</h3>
          <p className="text-sm text-slate-500 mt-1">Lecture playlists, recorded classes, or any video with clear speech</p>
        </div>

        <div className="max-w-xl mx-auto">
          <div className="relative">
            <input
              type="url"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder="https://www.youtube.com/watch?v=..."
              className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm
                         placeholder:text-slate-400 pr-10
                         focus:outline-none focus:ring-2 focus:ring-brand-200 focus:border-brand-300
                         transition-colors"
            />
            {value && (
              <button
                type="button"
                onClick={() => { onChange(''); setInfo(null); setError(null) }}
                aria-label="Clear URL"
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-rose-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <AnimatePresence mode="wait">
            {loading && (
              <motion.div
                key="loading"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mt-3 flex items-center gap-2 text-xs text-slate-500"
              >
                <Loader2 className="w-3.5 h-3.5 animate-spin" /> Fetching video info…
              </motion.div>
            )}

            {error && !loading && (
              <motion.div
                key="error"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mt-3 flex items-start gap-2 text-xs text-rose-600 bg-rose-50 border border-rose-100 rounded-lg px-3 py-2"
              >
                <AlertCircle className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                <span>{error}</span>
              </motion.div>
            )}

            {info && !loading && !error && (
              <motion.div
                key="info"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mt-3 flex items-start gap-3 bg-white border border-emerald-100 rounded-xl p-3 shadow-sm"
              >
                {info.thumbnail && (
                  <img
                    src={info.thumbnail}
                    alt=""
                    className="w-20 h-20 object-cover rounded-lg shrink-0"
                  />
                )}
                <div className="min-w-0 flex-1 text-left">
                  <div className="flex items-start gap-2">
                    <p className="font-semibold text-slate-800 truncate flex-1">{info.title}</p>
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  </div>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-xs text-slate-500">
                    {info.author && (
                      <span className="inline-flex items-center gap-1">
                        <User className="w-3 h-3" /> {info.author}
                      </span>
                    )}
                    <span className="inline-flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {formatDuration(info.durationSeconds)}
                    </span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

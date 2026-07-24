import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Sparkles, BookOpen, GraduationCap, Tag, Wand2, Loader2,
  AlertCircle, Upload, Youtube,
} from 'lucide-react'
import PageHeader from '../components/PageHeader.jsx'
import UploadBox from '../components/UploadBox.jsx'
import YouTubeUrlBox from '../components/YouTubeUrlBox.jsx'
import ProcessingFlow from '../components/ProcessingFlow.jsx'
import Button from '../components/Button.jsx'
import { processingSteps } from '../data/sampleData.js'
import { api, currentLectureId } from '../api/client.js'

// Translate raw backend errors into something a student can act on.
function formatError(raw) {
  const msg = String(raw || '')
  if (!msg) return 'Something went wrong. Make sure the backend is running.'
  if (/rate limit|too many requests|429/i.test(msg)) {
    return 'Groq rate limit hit. Please wait ~30 seconds and try again.'
  }
  if (/too large|file size|25 MB/i.test(msg)) {
    return 'Audio is too long for the free tier (25 MB Whisper cap). Try a shorter lecture (under ~90 minutes).'
  }
  if (/ECONNREFUSED|fetch failed|Failed to fetch|NetworkError|Bad Gateway/i.test(msg)) {
    return 'Backend isn\'t reachable. Open a second terminal and run "npm run dev" inside the backend folder.'
  }
  if (/GROQ_API_KEY/i.test(msg)) {
    return 'Groq API key is missing. Add GROQ_API_KEY to backend/.env and restart the backend.'
  }
  if (/empty text|clear speech/i.test(msg)) {
    return 'Transcription came back empty. Make sure the file has clear speech audio.'
  }
  if (/private video|sign in|unavailable|YouTube/i.test(msg)) {
    return msg // already user-friendly from downloader.js
  }
  return msg
}

const SOURCES = [
  { id: 'file', label: 'Upload File',  icon: Upload  },
  { id: 'url',  label: 'From YouTube', icon: Youtube },
]

export default function UploadLecture() {
  const navigate = useNavigate()
  const [source, setSource]           = useState('file')
  const [file, setFile]               = useState(null)
  const [url, setUrl]                 = useState('')
  const [title, setTitle]             = useState('')
  const [subject, setSubject]         = useState('')
  const [semester, setSemester]       = useState('')
  const [activeStep, setActiveStep]   = useState(0)
  const [isProcessing, setProcessing] = useState(false)
  const [error, setError]             = useState(null)

  // Title is optional for URL flow — backend can pull it from YouTube metadata.
  const sourceProvided = source === 'file' ? !!file : !!url
  const canSubmit = sourceProvided && subject && semester && (source === 'url' || title)

  const handleGenerate = async () => {
    if (!canSubmit) return
    setError(null)
    setProcessing(true)
    setActiveStep(0)

    try {
      // 1. Kick off processing on the backend.
      const { id } = source === 'file'
        ? await api.uploadLecture({ file, title, subject, semester })
        : await api.uploadLectureFromUrl({ url, title, subject, semester })

      currentLectureId.set(id)

      // 2. Poll status every 2s until completed or failed.
      const poll = async () => {
        try {
          const status = await api.getStatus(id)
          setActiveStep(status.step)

          if (status.status === 'failed') {
            setError(formatError(status.error))
            setProcessing(false)
            return
          }
          if (status.status === 'completed') {
            setTimeout(() => navigate(`/notes?id=${id}`), 600)
            return
          }
          setTimeout(poll, 2000)
        } catch (err) {
          setError(formatError(err.message))
          setProcessing(false)
        }
      }
      poll()
    } catch (err) {
      console.error(err)
      setError(formatError(err.message))
      setProcessing(false)
    }
  }

  return (
    <>
      <PageHeader
        eyebrow="Upload"
        title="Upload your lecture"
        subtitle="Drop in a file or paste a YouTube link — AutoNote AI handles the rest."
      />

      {/* Hero gradient banner */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl bg-brand-gradient p-7 sm:p-9 mb-6 text-white shadow-soft"
      >
        <div className="pointer-events-none absolute -top-12 -right-12 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
        <div className="pointer-events-none absolute -bottom-12 -left-12 w-64 h-64 bg-white/10 rounded-full blur-3xl" />

        <div className="relative grid sm:grid-cols-3 gap-4 items-center">
          <div className="sm:col-span-2">
            <span className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur text-xs font-semibold px-3 py-1 rounded-full">
              <Sparkles className="w-3.5 h-3.5" /> Powered by Whisper + Llama 3.3
            </span>
            <h2 className="mt-3 text-2xl sm:text-3xl font-extrabold leading-tight">
              Notes, summaries, flashcards, and quizzes — generated automatically.
            </h2>
            <p className="mt-2 text-white/90 text-sm max-w-xl">
              Upload MP3, WAV, MP4, or MOV (up to 500 MB), or paste any YouTube lecture URL.
            </p>
          </div>
          <motion.div
            animate={{ rotate: [0, 6, 0, -6, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
            className="hidden sm:grid place-items-center"
          >
            <div className="w-28 h-28 rounded-3xl bg-white/15 backdrop-blur grid place-items-center border border-white/20">
              <Wand2 className="w-14 h-14 text-white" />
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Upload form */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Source switcher */}
          <div className="inline-flex bg-slate-100 rounded-xl p-1">
            {SOURCES.map((s) => {
              const isActive = source === s.id
              return (
                <button
                  key={s.id}
                  onClick={() => { setSource(s.id); setError(null) }}
                  className={`relative inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg transition
                              ${isActive ? 'text-white' : 'text-slate-600 hover:text-slate-900'}`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="source-tab"
                      className="absolute inset-0 bg-brand-gradient rounded-lg shadow-soft"
                      transition={{ type: 'spring', stiffness: 360, damping: 30 }}
                    />
                  )}
                  <span className="relative inline-flex items-center gap-2">
                    <s.icon className="w-4 h-4" /> {s.label}
                  </span>
                </button>
              )
            })}
          </div>

          {/* Source input — file dropzone OR YouTube URL */}
          <AnimatePresence mode="wait">
            <motion.div
              key={source}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
            >
              {source === 'file'
                ? <UploadBox onFile={setFile} />
                : <YouTubeUrlBox
                    value={url}
                    onChange={setUrl}
                    onTitleSuggested={(t) => { if (!title) setTitle(t) }}
                  />}
            </motion.div>
          </AnimatePresence>

          {/* Lecture details */}
          <div className="bg-white rounded-3xl p-6 shadow-card border border-slate-100">
            <h3 className="text-lg font-bold text-slate-800 mb-4">Lecture details</h3>

            <div className="grid sm:grid-cols-2 gap-4">
              <Field
                icon={BookOpen}
                label={source === 'url' ? 'Lecture title (optional — auto-fills from YouTube)' : 'Lecture title'}
                placeholder="e.g. Introduction to Neural Networks"
                value={title}
                onChange={setTitle}
              />
              <Field
                icon={Tag}
                label="Subject"
                placeholder="e.g. Deep Learning"
                value={subject}
                onChange={setSubject}
              />
              <Field
                icon={GraduationCap}
                label="Semester / Branch"
                placeholder="e.g. Sem 6 — CSE"
                value={semester}
                onChange={setSemester}
                className="sm:col-span-2"
              />
            </div>

            {error && (
              <div className="mt-4 flex items-start gap-2 bg-rose-50 border border-rose-100 text-rose-700 px-4 py-3 rounded-xl text-sm">
                <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="mt-6 flex flex-col sm:flex-row sm:items-center gap-3">
              <Button onClick={handleGenerate} disabled={!canSubmit || isProcessing} size="lg" className="sm:w-auto">
                {isProcessing
                  ? <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Generating…
                    </>
                  : <>
                      <Sparkles className="w-4 h-4" />
                      Generate Notes
                    </>}
              </Button>
              {!canSubmit && (
                <p className="text-xs text-slate-500">
                  {source === 'file'
                    ? 'Add a file and fill in all fields to continue.'
                    : 'Paste a YouTube URL and fill in subject + semester to continue.'}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Pipeline preview */}
        <aside className="bg-white rounded-3xl p-6 shadow-card border border-slate-100 h-fit">
          <h3 className="text-lg font-bold text-slate-800 mb-4">What happens next?</h3>
          <ol className="space-y-4">
            {processingSteps.map((step, i) => (
              <li key={step.id} className="flex gap-3">
                <div className={`mt-0.5 w-7 h-7 rounded-lg grid place-items-center text-xs font-bold shrink-0
                                ${i <= activeStep && isProcessing
                                  ? 'bg-brand-gradient text-white'
                                  : 'bg-slate-100 text-slate-500'}`}>
                  {i + 1}
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-800">
                    {i === 0 && source === 'url' ? 'Download Lecture' : step.title}
                  </p>
                  <p className="text-xs text-slate-500">
                    {i === 0 && source === 'url' ? 'Fetch the audio from YouTube' : step.description}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </aside>
      </div>

      {/* Inline pipeline animation */}
      <AnimatePresence>
        {isProcessing && (
          <motion.section
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="mt-8"
          >
            <div className="flex items-center gap-2 mb-3">
              <Loader2 className="w-4 h-4 text-brand-600 animate-spin" />
              <h3 className="text-lg font-bold text-slate-800">Processing your lecture…</h3>
            </div>
            <ProcessingFlow steps={processingSteps} activeStep={activeStep} />
          </motion.section>
        )}
      </AnimatePresence>
    </>
  )
}

function Field({ icon: Icon, label, placeholder, value, onChange, className = '' }) {
  return (
    <label className={`block ${className}`}>
      <span className="text-xs font-semibold text-slate-700">{label}</span>
      <div className="mt-1.5 relative">
        {Icon && <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />}
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-3 py-2.5 text-sm
                     placeholder:text-slate-400
                     focus:outline-none focus:ring-2 focus:ring-brand-200 focus:border-brand-300 focus:bg-white
                     transition-colors"
        />
      </div>
    </label>
  )
}

import { useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { UploadCloud, FileAudio, FileVideo, X, CheckCircle2 } from 'lucide-react'

const ACCEPTED = '.mp3,.wav,.mp4,.mov,audio/*,video/*'

export default function UploadBox({ onFile }) {
  const [isDragging, setIsDragging] = useState(false)
  const [file, setFile] = useState(null)
  const inputRef = useRef(null)

  const handleFile = (f) => {
    if (!f) return
    setFile(f)
    onFile?.(f)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)
    const f = e.dataTransfer.files?.[0]
    handleFile(f)
  }

  const formatSize = (bytes) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  const isVideo = file && /\.(mp4|mov)$/i.test(file.name)

  return (
    <div className="w-full">
      <motion.div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        animate={{ scale: isDragging ? 1.02 : 1 }}
        className={`relative cursor-pointer rounded-3xl border-2 border-dashed
                    ${isDragging ? 'border-brand-500 bg-brand-50/60' : 'border-slate-300 bg-slate-50/60'}
                    px-6 py-12 sm:py-16 transition-colors
                    hover:border-brand-400 hover:bg-brand-50/40`}
      >
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPTED}
          className="hidden"
          onChange={(e) => handleFile(e.target.files?.[0])}
        />

        <AnimatePresence mode="wait">
          {!file ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              className="flex flex-col items-center text-center"
            >
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                className="w-20 h-20 rounded-2xl bg-brand-gradient grid place-items-center shadow-soft mb-5"
              >
                <UploadCloud className="w-10 h-10 text-white" />
              </motion.div>

              <h3 className="text-xl font-bold text-slate-800">Drop your lecture file here</h3>
              <p className="text-sm text-slate-500 mt-1">or click anywhere in this box to browse</p>

              <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
                {['MP3', 'WAV', 'MP4', 'MOV'].map((ext) => (
                  <span key={ext} className="text-xs font-bold text-brand-700 bg-white border border-brand-100 px-3 py-1.5 rounded-full shadow-sm">
                    {ext}
                  </span>
                ))}
              </div>
              <p className="text-[11px] text-slate-400 mt-4">Max file size: 500 MB</p>
            </motion.div>
          ) : (
            <motion.div
              key="filled"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              className="flex items-center gap-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-14 h-14 rounded-2xl bg-brand-gradient grid place-items-center shadow-soft shrink-0">
                {isVideo
                  ? <FileVideo className="w-7 h-7 text-white" />
                  : <FileAudio className="w-7 h-7 text-white" />}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-slate-800 truncate">{file.name}</p>
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                </div>
                <p className="text-xs text-slate-500 mt-0.5">{formatSize(file.size)} • Ready to process</p>

                <div className="mt-3 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 1 }}
                    className="h-full bg-brand-gradient"
                  />
                </div>
              </div>

              <button
                onClick={(e) => { e.stopPropagation(); setFile(null); onFile?.(null) }}
                className="p-2 rounded-xl hover:bg-slate-100 text-slate-500 hover:text-rose-600"
                aria-label="Remove file"
              >
                <X className="w-5 h-5" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}

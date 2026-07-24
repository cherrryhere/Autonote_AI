import { useSearchParams } from 'react-router-dom'
import { Download, Printer, Share2, BookOpen, Loader2 } from 'lucide-react'
import PageHeader from '../components/PageHeader.jsx'
import NoteCard from '../components/NoteCard.jsx'
import Badge from '../components/Badge.jsx'
import Button from '../components/Button.jsx'
import { generatedNotes } from '../data/sampleData.js'
import { useLecture } from '../hooks/useLecture.js'

export default function GeneratedNotes() {
  const [params] = useSearchParams()
  const id = params.get('id')
  const { lecture, loading } = useLecture(id)

  // Use real notes if available, fall back to sample data for the design demo.
  const notes = lecture?.notes?.length ? lecture.notes : generatedNotes
  const title    = lecture?.title    || 'Introduction to Neural Networks'
  const subject  = lecture?.subject  || 'Deep Learning'
  const duration = lecture?.duration || '52 min'
  const semester = lecture?.semester || 'Sem 6 — CSE'

  // TODO: hook up real download — generate a PDF from `notes` via the backend.
  const handleDownload = () => {
    const text = notes.map((n, i) =>
      `Topic ${i + 1}: ${n.topic}\n\nKey points:\n${n.points.map((p) => `• ${p}`).join('\n')}\n`
    ).join('\n---\n\n')
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${title.replace(/\s+/g, '_')}_notes.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  if (loading) return <LoadingState />

  return (
    <>
      <PageHeader
        eyebrow={lecture ? 'Generated' : 'Demo notes'}
        title="Lecture Notes"
        subtitle="Topic-wise notes auto-generated from your lecture. Review, study, or download."
      >
        <Button variant="ghost" onClick={() => window.print()}>
          <Printer className="w-4 h-4" /> Print
        </Button>
        <Button variant="ghost">
          <Share2 className="w-4 h-4" /> Share
        </Button>
        <Button onClick={handleDownload}>
          <Download className="w-4 h-4" /> Download
        </Button>
      </PageHeader>

      {/* Lecture meta */}
      <div className="bg-white rounded-2xl p-5 shadow-card border border-slate-100 mb-6 flex flex-wrap items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-brand-gradient grid place-items-center shadow-soft">
          <BookOpen className="w-6 h-6 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="font-bold text-slate-800 truncate">{title}</h2>
          <p className="text-sm text-slate-500">{subject} · {duration} · {semester}</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge tone="success">Processed</Badge>
          <Badge tone="violet">{notes.length} topics</Badge>
        </div>
      </div>

      {/* Notes grid */}
      <div className="grid lg:grid-cols-2 gap-5">
        {notes.map((note, i) => (
          <NoteCard key={note.id ?? i} note={note} index={i} />
        ))}
      </div>
    </>
  )
}

function LoadingState() {
  return (
    <div className="flex items-center justify-center py-32 text-slate-500">
      <Loader2 className="w-5 h-5 animate-spin mr-2" /> Loading your notes…
    </div>
  )
}

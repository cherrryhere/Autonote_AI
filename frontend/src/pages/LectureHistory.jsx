import { useEffect, useMemo, useState } from 'react'
import { Search, Filter, Loader2 } from 'lucide-react'
import PageHeader from '../components/PageHeader.jsx'
import LectureHistoryCard from '../components/LectureHistoryCard.jsx'
import { lectureHistory as fallbackHistory } from '../data/sampleData.js'
import { api } from '../api/client.js'

const FILTERS = [
  { id: 'all',       label: 'All'       },
  { id: 'processed', label: 'Processed' },
  { id: 'pending',   label: 'Pending'   },
]

export default function LectureHistory() {
  const [query, setQuery]     = useState('')
  const [filter, setFilter]   = useState('all')
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    api.listLectures()
      .then((list) => {
        if (cancelled) return
        // Map backend "completed" -> "processed" so the badge component matches.
        const normalised = list.map((l) => ({
          ...l,
          status: l.status === 'completed' ? 'processed' : l.status === 'failed' ? 'pending' : l.status,
        }))
        setHistory(normalised.length ? normalised : fallbackHistory)
      })
      .catch(() => { if (!cancelled) setHistory(fallbackHistory) })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [])

  const filtered = useMemo(() => {
    return history.filter((l) => {
      const matchesFilter = filter === 'all' || l.status === filter
      const q = query.trim().toLowerCase()
      const matchesQuery = !q ||
        l.title.toLowerCase().includes(q) ||
        l.subject.toLowerCase().includes(q)
      return matchesFilter && matchesQuery
    })
  }, [query, filter, history])

  return (
    <>
      <PageHeader
        eyebrow="Library"
        title="Lecture History"
        subtitle="All your processed lectures in one place. Search, filter, or jump back into any of them."
      />

      {/* Toolbar */}
      <div className="bg-white rounded-2xl shadow-card border border-slate-100 p-4 mb-6 flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            type="text"
            placeholder="Search lectures by title or subject…"
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm
                       placeholder:text-slate-400
                       focus:outline-none focus:ring-2 focus:ring-brand-200 focus:border-brand-300 focus:bg-white"
          />
        </div>

        <div className="flex items-center gap-1 bg-slate-100 rounded-xl p-1">
          <Filter className="w-4 h-4 text-slate-400 ml-2 mr-1 hidden sm:block" />
          {FILTERS.map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition
                          ${filter === f.id
                            ? 'bg-white text-brand-700 shadow-sm'
                            : 'text-slate-600 hover:text-slate-900'}`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      {loading ? (
        <div className="flex items-center justify-center py-16 text-slate-500">
          <Loader2 className="w-5 h-5 animate-spin mr-2" /> Loading lectures…
        </div>
      ) : filtered.length > 0 ? (
        <div className="space-y-3">
          {filtered.map((l, i) => (
            <LectureHistoryCard key={l.id} lecture={l} index={i} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-card border border-slate-100 p-12 text-center">
          <p className="text-slate-500">No lectures match your search.</p>
        </div>
      )}
    </>
  )
}

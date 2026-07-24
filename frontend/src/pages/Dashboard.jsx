import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Mic, FileText, Layers, HelpCircle, Plus, ArrowRight, Sparkles, Clock } from 'lucide-react'
import * as Icons from 'lucide-react'
import PageHeader from '../components/PageHeader.jsx'
import StatCard from '../components/StatCard.jsx'
import LectureHistoryCard from '../components/LectureHistoryCard.jsx'
import { dashboardStats, lectureHistory as fallbackHistory, processingSteps, userProfile } from '../data/sampleData.js'
import { api } from '../api/client.js'

const accents = ['brand', 'blue', 'violet', 'emerald']
const STAT_META = [
  { key: 'totalLectures',     label: 'Total Lectures',     icon: 'Mic'        },
  { key: 'notesGenerated',    label: 'Notes Generated',    icon: 'FileText'   },
  { key: 'flashcardsCreated', label: 'Flashcards Created', icon: 'Layers'     },
  { key: 'quizzesGenerated',  label: 'Quizzes Generated',  icon: 'HelpCircle' },
]

export default function Dashboard() {
  const [stats, setStats]     = useState(null)
  const [recent, setRecent]   = useState([])
  const [loaded, setLoaded]   = useState(false)

  useEffect(() => {
    let cancelled = false

    Promise.all([api.getStats(), api.listLectures()])
      .then(([liveStats, lectures]) => {
        if (cancelled) return
        // Show live data only if there's any. Otherwise use the sample data.
        if (lectures.length > 0) {
          setStats(liveStats)
          setRecent(lectures.slice(0, 4).map((l) => ({
            ...l,
            status: l.status === 'completed' ? 'processed' : l.status === 'failed' ? 'pending' : l.status,
          })))
        } else {
          setStats(null)
          setRecent(fallbackHistory.slice(0, 4))
        }
      })
      .catch(() => {
        if (cancelled) return
        // Backend unreachable — fall back to demo data so the dashboard still looks alive.
        setStats(null)
        setRecent(fallbackHistory.slice(0, 4))
      })
      .finally(() => { if (!cancelled) setLoaded(true) })

    return () => { cancelled = true }
  }, [])

  // Build the cards array with live values when available, otherwise demo values.
  const statCards = stats
    ? STAT_META.map((m, i) => ({
        ...m,
        value: stats[m.key] ?? 0,
        trend: dashboardStats[i].trend,
      }))
    : dashboardStats

  return (
    <>
      <PageHeader
        eyebrow={`Welcome back, ${userProfile.name.split(' ')[0]}`}
        title="Your Study Dashboard"
        subtitle="Track your lectures, generated notes, and study streaks at a glance."
      >
        <Link to="/upload" className="btn-ghost">
          <Plus className="w-4 h-4" /> New Upload
        </Link>
        <Link to="/notes" className="btn-primary">
          <FileText className="w-4 h-4" /> View Latest Notes
        </Link>
      </PageHeader>

      {/* Stats */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {statCards.map((s, i) => {
          const Icon = Icons[s.icon] || Sparkles
          return (
            <StatCard
              key={s.label}
              label={s.label}
              value={s.value}
              trend={s.trend}
              icon={Icon}
              accent={accents[i % accents.length]}
              delay={i * 0.06}
            />
          )
        })}
      </section>

      {/* Hero CTA + Quick actions */}
      <section className="grid lg:grid-cols-3 gap-5 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-2 relative overflow-hidden rounded-3xl bg-brand-gradient p-7 text-white shadow-soft"
        >
          <div className="pointer-events-none absolute -top-16 -right-16 w-64 h-64 bg-white/10 rounded-full blur-3xl" />

          <span className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur text-xs font-semibold px-3 py-1 rounded-full">
            <Sparkles className="w-3.5 h-3.5" /> AI Assistant
          </span>

          <h2 className="relative mt-3 text-2xl sm:text-3xl font-extrabold leading-tight">
            Got a 90-minute lecture? <br /> Get a 5-minute summary.
          </h2>
          <p className="relative mt-2 text-white/90 max-w-md text-sm">
            Drop any audio or video and AutoNote AI will hand you back structured notes, flashcards, and a quiz.
          </p>

          <div className="relative mt-6 flex flex-wrap items-center gap-3">
            <Link to="/upload" className="bg-white text-brand-700 font-semibold px-5 py-2.5 rounded-xl hover:scale-[1.02] transition shadow">
              Upload Lecture <ArrowRight className="inline w-4 h-4 ml-1" />
            </Link>
            <Link to="/history" className="bg-white/10 hover:bg-white/20 backdrop-blur text-white font-semibold px-5 py-2.5 rounded-xl">
              View History
            </Link>
          </div>
        </motion.div>

        <div className="grid grid-cols-2 gap-3">
          {[
            { to: '/notes',      icon: FileText,   label: 'Notes' },
            { to: '/flashcards', icon: Layers,     label: 'Flashcards' },
            { to: '/quiz',       icon: HelpCircle, label: 'Quiz' },
            { to: '/summary',    icon: Mic,        label: 'Summary' },
          ].map(({ to, icon: I, label }, i) => (
            <motion.div
              key={to}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
            >
              <Link
                to={to}
                className="group h-full flex flex-col items-start justify-between rounded-2xl bg-white p-4 border border-slate-100 shadow-card hover:-translate-y-1 transition"
              >
                <div className="w-10 h-10 rounded-xl bg-brand-50 grid place-items-center text-brand-600 group-hover:bg-brand-gradient group-hover:text-white transition">
                  <I className="w-5 h-5" />
                </div>
                <span className="mt-3 font-semibold text-slate-800 text-sm">{label}</span>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Recent lectures + Pipeline glance */}
      <section className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-bold text-slate-800">Recent Lectures</h3>
            <Link to="/history" className="text-sm font-semibold text-brand-700 hover:text-brand-800">
              View all
            </Link>
          </div>
          <div className="space-y-3">
            {!loaded ? (
              <div className="h-24 rounded-2xl bg-slate-100 animate-pulse" />
            ) : recent.map((l, i) => (
              <LectureHistoryCard key={l.id} lecture={l} index={i} />
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-bold text-slate-800 mb-3">Processing Pipeline</h3>
          <div className="bg-white rounded-2xl shadow-card border border-slate-100 p-5 space-y-3">
            {processingSteps.map((step) => {
              const I = Icons[step.icon] || Sparkles
              return (
                <div key={step.id} className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-brand-50 text-brand-600 grid place-items-center shrink-0">
                    <I className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-800">{step.title}</p>
                    <p className="text-xs text-slate-500">{step.description}</p>
                  </div>
                </div>
              )
            })}
            <div className="pt-3 border-t border-slate-100 flex items-center gap-2 text-xs text-slate-500">
              <Clock className="w-3.5 h-3.5" />
              <span>Avg. processing time: <span className="font-semibold text-slate-700">~2 min</span></span>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

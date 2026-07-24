import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, ListChecks, Copy, Check, BookOpen, Loader2 } from 'lucide-react'
import PageHeader from '../components/PageHeader.jsx'
import Badge from '../components/Badge.jsx'
import Button from '../components/Button.jsx'
import { summaryData } from '../data/sampleData.js'
import { useLecture } from '../hooks/useLecture.js'

const TABS = [
  { id: 'short',    label: 'Short Summary'    },
  { id: 'detailed', label: 'Detailed Summary' },
]

export default function Summary() {
  const [params] = useSearchParams()
  const id = params.get('id')
  const { lecture, loading } = useLecture(id)

  const [tab, setTab] = useState('short')
  const [copied, setCopied] = useState(false)

  const data  = lecture?.summary || summaryData
  const title = lecture?.title   || 'Introduction to Neural Networks'

  const handleCopy = () => {
    const text = tab === 'short' ? data.short : data.detailed
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32 text-slate-500">
        <Loader2 className="w-5 h-5 animate-spin mr-2" /> Loading summary…
      </div>
    )
  }

  return (
    <>
      <PageHeader
        eyebrow="Summary"
        title="Lecture Summary"
        subtitle="Get the gist in 30 seconds, or read the full breakdown when you have time."
      >
        <Button variant="ghost" onClick={handleCopy}>
          {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
          {copied ? 'Copied' : 'Copy'}
        </Button>
      </PageHeader>

      <div className="grid lg:grid-cols-3 gap-5">
        {/* Main summary */}
        <div className="lg:col-span-2 bg-white rounded-3xl shadow-card border border-slate-100 p-6 sm:p-8">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-xl bg-brand-gradient grid place-items-center shadow-soft">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="font-bold text-slate-800">{title}</h2>
              <p className="text-xs text-slate-500">AI-generated summary · Reviewed by you</p>
            </div>
          </div>

          {/* Tabs */}
          <div className="inline-flex bg-slate-100 rounded-xl p-1 mb-5">
            {TABS.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`relative px-4 py-1.5 text-sm font-semibold rounded-lg transition
                            ${tab === t.id ? 'text-white' : 'text-slate-600 hover:text-slate-900'}`}
              >
                {tab === t.id && (
                  <motion.span
                    layoutId="summary-tab"
                    className="absolute inset-0 bg-brand-gradient rounded-lg shadow-soft"
                    transition={{ type: 'spring', stiffness: 360, damping: 30 }}
                  />
                )}
                <span className="relative">{t.label}</span>
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={tab}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
              className="prose prose-slate max-w-none"
            >
              {(tab === 'short' ? [data.short] : data.detailed.split('\n\n')).map((p, i) => (
                <p key={i} className="text-slate-700 leading-relaxed mb-4 last:mb-0">{p}</p>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Key takeaways */}
        <aside className="bg-white rounded-3xl shadow-card border border-slate-100 p-6 h-fit">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 grid place-items-center">
              <ListChecks className="w-5 h-5 text-emerald-600" />
            </div>
            <h3 className="font-bold text-slate-800">Key Takeaways</h3>
          </div>

          <ul className="space-y-3">
            {data.takeaways.map((t, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.06 }}
                className="flex gap-3"
              >
                <span className="mt-0.5 w-6 h-6 rounded-lg bg-brand-50 text-brand-700 grid place-items-center text-xs font-bold shrink-0">
                  {i + 1}
                </span>
                <span className="text-sm text-slate-700 leading-relaxed">{t}</span>
              </motion.li>
            ))}
          </ul>

          <div className="mt-5 p-4 rounded-2xl bg-soft-gradient border border-brand-100">
            <Badge tone="brand" icon={BookOpen}>Pro tip</Badge>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              Skim the takeaways first, then dive into the detailed summary. You'll retain ~30% more.
            </p>
          </div>
        </aside>
      </div>
    </>
  )
}

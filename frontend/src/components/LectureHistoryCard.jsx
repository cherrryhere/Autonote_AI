import { motion } from 'framer-motion'
import { Calendar, Clock, BookOpen, ChevronRight, Loader2, CheckCircle2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import Badge from './Badge.jsx'

export default function LectureHistoryCard({ lecture, index = 0 }) {
  const isProcessed = lecture.status === 'processed'

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ y: -2 }}
      className="bg-white rounded-2xl p-5 shadow-card border border-slate-100 flex flex-col sm:flex-row sm:items-center gap-4"
    >
      <div className="w-12 h-12 rounded-2xl bg-brand-gradient grid place-items-center shadow-soft shrink-0">
        <BookOpen className="w-6 h-6 text-white" />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-2 mb-1">
          <h3 className="font-semibold text-slate-800 truncate">{lecture.title}</h3>
          {isProcessed
            ? <Badge tone="success" icon={CheckCircle2}>Processed</Badge>
            : <Badge tone="warning" icon={Loader2}>Pending</Badge>}
        </div>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
          <span className="font-medium text-slate-600">{lecture.subject}</span>
          <span className="inline-flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" /> {lecture.date}
          </span>
          <span className="inline-flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" /> {lecture.duration}
          </span>
        </div>
      </div>

      <Link
        to={isProcessed ? `/notes?id=${lecture.id}` : '#'}
        className={`inline-flex items-center gap-1.5 text-sm font-semibold rounded-xl px-4 py-2 transition
                    ${isProcessed
                      ? 'text-brand-700 bg-brand-50 hover:bg-brand-100'
                      : 'text-slate-400 bg-slate-100 cursor-not-allowed pointer-events-none'}`}
      >
        View Notes
        <ChevronRight className="w-4 h-4" />
      </Link>
    </motion.div>
  )
}

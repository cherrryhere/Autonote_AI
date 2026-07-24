import { motion } from 'framer-motion'
import { BookOpen, Lightbulb, Sigma } from 'lucide-react'

export default function NoteCard({ note, index = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08 }}
      className="bg-white rounded-2xl p-6 shadow-card border border-slate-100"
    >
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 rounded-xl bg-brand-gradient grid place-items-center shadow-soft">
          <BookOpen className="w-5 h-5 text-white" />
        </div>
        <div>
          <p className="text-[11px] font-bold tracking-wider text-brand-600">TOPIC {index + 1}</p>
          <h3 className="text-lg font-bold text-slate-800 leading-tight">{note.topic}</h3>
        </div>
      </div>

      {/* Important points */}
      <section className="mb-5">
        <h4 className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
          <Lightbulb className="w-4 h-4 text-amber-500" />
          Important Points
        </h4>
        <ul className="space-y-2">
          {note.points.map((p, i) => (
            <li key={i} className="flex gap-2 text-sm text-slate-600 leading-relaxed">
              <span className="mt-2 w-1.5 h-1.5 rounded-full bg-brand-500 shrink-0" />
              <span>{p}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Definitions */}
      {note.definitions?.length > 0 && (
        <section className="mb-5">
          <h4 className="text-sm font-semibold text-slate-700 mb-2">Definitions</h4>
          <div className="space-y-2">
            {note.definitions.map((d, i) => (
              <div key={i} className="bg-brand-50/60 border border-brand-100 rounded-xl p-3">
                <p className="text-sm font-semibold text-brand-700">{d.term}</p>
                <p className="text-xs text-slate-600 mt-0.5">{d.meaning}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Formulas */}
      {note.formulas?.length > 0 && (
        <section>
          <h4 className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
            <Sigma className="w-4 h-4 text-violet-500" />
            Key Formulas
          </h4>
          <div className="flex flex-wrap gap-2">
            {note.formulas.map((f, i) => (
              <code key={i} className="text-sm font-mono bg-slate-900 text-emerald-300 px-3 py-1.5 rounded-lg">
                {f}
              </code>
            ))}
          </div>
        </section>
      )}
    </motion.div>
  )
}

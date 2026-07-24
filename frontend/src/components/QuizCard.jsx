import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, X } from 'lucide-react'

export default function QuizCard({ question, index, total, onAnswer }) {
  const [selected, setSelected] = useState(null)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = () => {
    if (selected === null) return
    setSubmitted(true)
    const correct = selected === question.answerIndex
    onAnswer?.(correct)
  }

  return (
    <motion.div
      key={question.id}
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -14 }}
      className="bg-white rounded-3xl p-6 sm:p-8 shadow-card border border-slate-100"
    >
      <div className="flex items-center justify-between mb-5">
        <span className="text-xs font-bold tracking-wider text-brand-600">
          QUESTION {index + 1} / {total}
        </span>
        <div className="w-32 h-1.5 bg-slate-100 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-brand-gradient"
            initial={{ width: 0 }}
            animate={{ width: `${((index + 1) / total) * 100}%` }}
            transition={{ duration: 0.4 }}
          />
        </div>
      </div>

      <h3 className="text-xl sm:text-2xl font-bold text-slate-800 leading-snug mb-6">
        {question.question}
      </h3>

      <div className="space-y-3">
        {question.options.map((opt, i) => {
          const isSelected = selected === i
          const isCorrect  = i === question.answerIndex
          const showState  = submitted && (isSelected || isCorrect)

          let stateClass = 'border-slate-200 hover:border-brand-300 hover:bg-brand-50/40'
          if (submitted) {
            if (isCorrect)              stateClass = 'border-emerald-300 bg-emerald-50 text-emerald-800'
            else if (isSelected)        stateClass = 'border-rose-300 bg-rose-50 text-rose-800'
            else                        stateClass = 'border-slate-200 opacity-60'
          } else if (isSelected) {
            stateClass = 'border-brand-400 bg-brand-50 text-brand-800'
          }

          return (
            <button
              key={i}
              disabled={submitted}
              onClick={() => setSelected(i)}
              className={`w-full text-left flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${stateClass}`}
            >
              <div className={`w-7 h-7 rounded-lg grid place-items-center text-xs font-bold shrink-0
                              ${isSelected || (submitted && isCorrect)
                                ? 'bg-brand-gradient text-white'
                                : 'bg-slate-100 text-slate-600'}`}>
                {String.fromCharCode(65 + i)}
              </div>
              <span className="text-sm font-medium flex-1">{opt}</span>
              <AnimatePresence>
                {showState && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className={`shrink-0 w-6 h-6 rounded-full grid place-items-center
                                ${isCorrect ? 'bg-emerald-500' : 'bg-rose-500'} text-white`}
                  >
                    {isCorrect ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          )
        })}
      </div>

      {!submitted && (
        <button
          onClick={handleSubmit}
          disabled={selected === null}
          className="mt-6 w-full sm:w-auto btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Submit Answer
        </button>
      )}

      {submitted && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={`mt-6 text-sm font-semibold ${selected === question.answerIndex ? 'text-emerald-600' : 'text-rose-600'}`}
        >
          {selected === question.answerIndex
            ? 'Correct! Great work.'
            : `Incorrect. The correct answer is "${question.options[question.answerIndex]}".`}
        </motion.p>
      )}
    </motion.div>
  )
}

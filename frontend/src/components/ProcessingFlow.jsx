import { motion } from 'framer-motion'
import * as Icons from 'lucide-react'

export default function ProcessingFlow({ steps, activeStep = 0 }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      {steps.map((step, idx) => {
        const Icon = Icons[step.icon] || Icons.Sparkles
        const isActive   = idx === activeStep
        const isComplete = idx < activeStep

        return (
          <motion.div
            key={step.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.08 }}
            className={`relative bg-white rounded-2xl p-5 border transition-all
                        ${isActive   ? 'border-brand-300 shadow-soft ring-2 ring-brand-100' : ''}
                        ${isComplete ? 'border-emerald-200 bg-emerald-50/40' : 'border-slate-100 shadow-card'}`}
          >
            <div className="flex items-center gap-3 mb-3">
              <div className={`w-10 h-10 rounded-xl grid place-items-center
                              ${isComplete
                                ? 'bg-emerald-500 text-white'
                                : isActive
                                  ? 'bg-brand-gradient text-white shadow-soft'
                                  : 'bg-slate-100 text-slate-500'}`}>
                {isComplete
                  ? <Icons.Check className="w-5 h-5" />
                  : <Icon className="w-5 h-5" />}
              </div>
              <span className="text-xs font-bold text-slate-400">STEP {idx + 1}</span>
            </div>

            <h4 className="font-semibold text-slate-800 text-sm">{step.title}</h4>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">{step.description}</p>

            {isActive && (
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="absolute bottom-0 left-0 h-1 bg-brand-gradient rounded-b-2xl"
              />
            )}
          </motion.div>
        )
      })}
    </div>
  )
}

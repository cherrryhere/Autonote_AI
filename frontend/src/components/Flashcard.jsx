import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { RotateCw, Lightbulb, HelpCircle } from 'lucide-react'

export default function Flashcard({ card }) {
  const [flipped, setFlipped] = useState(false)

  // Reset flip when card changes
  useEffect(() => { setFlipped(false) }, [card?.id])

  return (
    <div className="perspective w-full">
      <motion.div
        onClick={() => setFlipped((v) => !v)}
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.6, ease: 'easeInOut' }}
        className="preserve-3d relative w-full aspect-[5/3] cursor-pointer select-none"
      >
        {/* Front */}
        <div className="absolute inset-0 backface-hidden rounded-3xl bg-brand-gradient text-white p-8 shadow-soft flex flex-col">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur px-2.5 py-1 rounded-full text-[11px] font-semibold">
              <HelpCircle className="w-3.5 h-3.5" /> Question
            </span>
            <RotateCw className="w-4 h-4 opacity-70" />
          </div>
          <div className="flex-1 grid place-items-center text-center px-2">
            <p className="text-2xl sm:text-3xl font-bold leading-snug">{card.question}</p>
          </div>
          <p className="text-center text-[11px] opacity-80">Click to flip</p>
        </div>

        {/* Back */}
        <div className="absolute inset-0 backface-hidden rotate-y-180 rounded-3xl bg-white border border-slate-100 p-8 shadow-card flex flex-col">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-full text-[11px] font-semibold">
              <Lightbulb className="w-3.5 h-3.5" /> Answer
            </span>
            <RotateCw className="w-4 h-4 text-slate-400" />
          </div>
          <div className="flex-1 grid place-items-center text-center px-2">
            <p className="text-lg sm:text-xl font-medium text-slate-800 leading-relaxed">{card.answer}</p>
          </div>
          <p className="text-center text-[11px] text-slate-400">Click to flip back</p>
        </div>
      </motion.div>
    </div>
  )
}

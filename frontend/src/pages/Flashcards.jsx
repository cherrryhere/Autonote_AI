import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, Shuffle, RotateCcw, Loader2 } from 'lucide-react'
import PageHeader from '../components/PageHeader.jsx'
import Flashcard from '../components/Flashcard.jsx'
import Button from '../components/Button.jsx'
import { flashcards as fallbackCards } from '../data/sampleData.js'
import { useLecture } from '../hooks/useLecture.js'

const shuffle = (arr) => {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export default function Flashcards() {
  const [params] = useSearchParams()
  const id = params.get('id')
  const { lecture, loading } = useLecture(id)

  const sourceCards = lecture?.flashcards?.length ? lecture.flashcards : fallbackCards
  const [cards, setCards] = useState(sourceCards)
  const [index, setIndex] = useState(0)

  // Reset cards when lecture data arrives
  useEffect(() => {
    setCards(sourceCards)
    setIndex(0)
  }, [lecture?.id]) // eslint-disable-line react-hooks/exhaustive-deps

  const total = cards.length
  const card  = cards[index]

  const next  = () => setIndex((i) => (i + 1) % total)
  const prev  = () => setIndex((i) => (i - 1 + total) % total)
  const reset = () => { setCards(sourceCards); setIndex(0) }
  const shuf  = () => { setCards(shuffle(sourceCards)); setIndex(0) }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32 text-slate-500">
        <Loader2 className="w-5 h-5 animate-spin mr-2" /> Loading flashcards…
      </div>
    )
  }

  return (
    <>
      <PageHeader
        eyebrow={`Card ${index + 1} of ${total}`}
        title="Flashcards"
        subtitle="Active recall is the fastest way to learn. Tap a card to flip."
      >
        <Button variant="ghost" onClick={shuf}>
          <Shuffle className="w-4 h-4" /> Shuffle
        </Button>
        <Button variant="ghost" onClick={reset}>
          <RotateCcw className="w-4 h-4" /> Reset
        </Button>
      </PageHeader>

      <div className="max-w-3xl mx-auto">
        <Flashcard card={card} />

        {/* Progress dots */}
        <div className="mt-6 flex items-center justify-center gap-1.5">
          {cards.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              aria-label={`Go to card ${i + 1}`}
              className={`h-2 rounded-full transition-all ${
                i === index ? 'w-8 bg-brand-gradient' : 'w-2 bg-slate-200 hover:bg-slate-300'
              }`}
            />
          ))}
        </div>

        {/* Controls */}
        <div className="mt-6 flex items-center justify-between gap-3">
          <Button variant="ghost" onClick={prev}>
            <ChevronLeft className="w-4 h-4" /> Previous
          </Button>

          <div className="text-center">
            <p className="text-2xl font-extrabold gradient-text">{index + 1} <span className="text-slate-300">/</span> {total}</p>
            <p className="text-xs text-slate-500 mt-0.5">Cards reviewed</p>
          </div>

          <Button onClick={next}>
            Next <ChevronRight className="w-4 h-4" />
          </Button>
        </div>

        {/* Tip */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center text-xs text-slate-500 mt-8"
        >
          Tip: also try the keyboard arrows on a real device. Coming soon.
        </motion.p>
      </div>
    </>
  )
}

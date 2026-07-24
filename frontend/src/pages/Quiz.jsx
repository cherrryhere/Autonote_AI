import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Trophy, RotateCcw, ArrowRight, Loader2 } from 'lucide-react'
import PageHeader from '../components/PageHeader.jsx'
import QuizCard from '../components/QuizCard.jsx'
import Button from '../components/Button.jsx'
import { quizQuestions as fallbackQuestions } from '../data/sampleData.js'
import { useLecture } from '../hooks/useLecture.js'

export default function Quiz() {
  const [params] = useSearchParams()
  const id = params.get('id')
  const { lecture, loading } = useLecture(id)

  const questions = lecture?.quiz?.length ? lecture.quiz : fallbackQuestions

  const [index, setIndex]       = useState(0)
  const [score, setScore]       = useState(0)
  const [answered, setAnswered] = useState(false)
  const [done, setDone]         = useState(false)

  const total = questions.length
  const question = questions[index]

  const handleAnswer = (correct) => {
    setAnswered(true)
    if (correct) setScore((s) => s + 1)
  }

  const handleNext = () => {
    if (index + 1 >= total) {
      setDone(true)
    } else {
      setIndex((i) => i + 1)
      setAnswered(false)
    }
  }

  const restart = () => {
    setIndex(0)
    setScore(0)
    setAnswered(false)
    setDone(false)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32 text-slate-500">
        <Loader2 className="w-5 h-5 animate-spin mr-2" /> Loading quiz…
      </div>
    )
  }

  const percent = Math.round((score / total) * 100)
  const grade =
    percent >= 80 ? { label: 'Excellent', tone: 'emerald' } :
    percent >= 60 ? { label: 'Good',      tone: 'brand'   } :
    percent >= 40 ? { label: 'Keep going',tone: 'amber'   } :
                    { label: 'Review needed', tone: 'rose' }

  return (
    <>
      <PageHeader
        eyebrow="Practice"
        title="Quiz"
        subtitle="Test what you've learnt. Auto-generated MCQs based on your lecture."
      >
        <Button variant="ghost" onClick={restart}>
          <RotateCcw className="w-4 h-4" /> Restart
        </Button>
      </PageHeader>

      <div className="max-w-3xl mx-auto">
        <AnimatePresence mode="wait">
          {!done ? (
            <motion.div key={`q-${index}`}>
              <QuizCard
                question={question}
                index={index}
                total={total}
                onAnswer={handleAnswer}
              />

              {answered && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6 flex justify-end"
                >
                  <Button onClick={handleNext} size="lg">
                    {index + 1 >= total ? 'See Results' : 'Next Question'}
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </motion.div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="results"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-3xl p-8 sm:p-10 shadow-card border border-slate-100 text-center"
            >
              <div className="w-20 h-20 mx-auto rounded-2xl bg-brand-gradient grid place-items-center shadow-soft mb-5">
                <Trophy className="w-10 h-10 text-white" />
              </div>

              <p className="text-xs font-bold tracking-wider text-brand-600">QUIZ COMPLETE</p>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-2">
                You scored <span className="gradient-text">{score}</span> / {total}
              </h2>
              <p className="text-slate-600 mt-2">{percent}% — {grade.label}</p>

              {/* Score bar */}
              <div className="mt-6 max-w-md mx-auto">
                <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percent}%` }}
                    transition={{ duration: 0.8 }}
                    className="h-full bg-brand-gradient"
                  />
                </div>
              </div>

              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <Button variant="ghost" onClick={restart}>
                  <RotateCcw className="w-4 h-4" /> Try Again
                </Button>
                <Button onClick={() => window.location.assign('/flashcards' + (id ? `?id=${id}` : ''))}>
                  Review Flashcards <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  )
}

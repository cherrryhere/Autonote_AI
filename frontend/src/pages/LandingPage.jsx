import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Sparkles, Mic, FileText, Layers, HelpCircle, ArrowRight,
  Upload, BookOpen, Zap, ShieldCheck, GraduationCap, Star,
} from 'lucide-react'

const features = [
  { icon: Mic,        title: 'Speech-to-Text',         desc: 'High-accuracy transcription of any lecture audio or video, in any classroom accent.' },
  { icon: Sparkles,   title: 'AI Summarisation',       desc: 'Long lectures distilled into short, detailed, and topic-wise notes — instantly.' },
  { icon: Layers,     title: 'Auto Flashcards',        desc: 'Active-recall flashcards generated from each topic, perfect for spaced repetition.' },
  { icon: HelpCircle, title: 'Practice Quizzes',       desc: 'MCQs auto-generated to test your understanding before the next exam.' },
  { icon: FileText,   title: 'Downloadable Notes',     desc: 'Export clean PDF notes ready to print, share, or stash in your study folder.' },
  { icon: ShieldCheck,title: 'Private & Secure',       desc: 'Your lectures stay yours. End-to-end encrypted storage and processing.' },
]

const stats = [
  { value: '50K+',  label: 'Lectures processed' },
  { value: '120K+', label: 'Notes generated' },
  { value: '4.9★',  label: 'Student rating' },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-soft-gradient">
      {/* Nav */}
      <header className="sticky top-0 z-30 backdrop-blur-xl bg-white/70 border-b border-white/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-brand-gradient grid place-items-center shadow-soft">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-extrabold gradient-text">AutoNote AI</span>
          </Link>

          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600">
            <a href="#features" className="hover:text-brand-700">Features</a>
            <a href="#how"      className="hover:text-brand-700">How it works</a>
            <a href="#testimonials" className="hover:text-brand-700">Reviews</a>
          </nav>

          <div className="flex items-center gap-3">
            <Link to="/login" className="hidden sm:inline-flex btn-ghost">Sign In</Link>
            <Link to="/signup" className="btn-primary">
              Get Started <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        {/* Decorative blobs */}
        <div className="pointer-events-none absolute -top-40 -left-32 w-96 h-96 rounded-full bg-violet-300/40 blur-3xl" />
        <div className="pointer-events-none absolute -top-20 -right-32 w-96 h-96 rounded-full bg-blue-300/40 blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-24 lg:pt-24 lg:pb-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-flex items-center gap-2 bg-white border border-brand-100 text-brand-700 text-xs font-semibold px-3 py-1.5 rounded-full shadow-sm">
                <Sparkles className="w-3.5 h-3.5" />
                Powered by GPT + Whisper
              </span>

              <h1 className="mt-5 text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.05]">
                Turn lectures into <span className="gradient-text">study-ready</span> notes in minutes.
              </h1>

              <p className="mt-5 text-lg text-slate-600 max-w-xl leading-relaxed">
                Upload audio or video from any class — AutoNote AI transcribes, summarises, and builds flashcards
                and quizzes so you can focus on learning, not typing.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Link to="/upload" className="btn-primary text-base">
                  Upload Your First Lecture <ArrowRight className="w-4 h-4" />
                </Link>
                <Link to="/dashboard" className="btn-ghost text-base">
                  Explore Dashboard
                </Link>
              </div>

              <div className="mt-10 flex items-center gap-8">
                {stats.map((s) => (
                  <div key={s.label}>
                    <p className="text-2xl font-extrabold text-slate-900">{s.value}</p>
                    <p className="text-xs text-slate-500 font-medium">{s.label}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Hero visual */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="relative"
            >
              <div className="relative bg-white rounded-3xl shadow-soft border border-slate-100 p-6 sm:p-8">
                <div className="flex items-center gap-2 mb-5">
                  <span className="w-3 h-3 rounded-full bg-rose-400" />
                  <span className="w-3 h-3 rounded-full bg-amber-400" />
                  <span className="w-3 h-3 rounded-full bg-emerald-400" />
                  <span className="ml-3 text-xs text-slate-400 font-medium">autonote.ai/notes</span>
                </div>

                <div className="space-y-4">
                  <div className="bg-soft-gradient rounded-2xl p-5 border border-brand-100">
                    <p className="text-[11px] font-bold text-brand-700 mb-1">TOPIC 1</p>
                    <p className="font-semibold text-slate-800">Introduction to Neural Networks</p>
                  </div>

                  <div className="space-y-2">
                    {[
                      'Layers of neurons connected via weighted edges.',
                      'Trained using backpropagation and gradient descent.',
                      'Powering image, speech, and language models today.',
                    ].map((t, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 + i * 0.15 }}
                        className="flex gap-2 text-sm text-slate-600"
                      >
                        <span className="mt-2 w-1.5 h-1.5 rounded-full bg-brand-500 shrink-0" />
                        <span>{t}</span>
                      </motion.div>
                    ))}
                  </div>

                  <div className="grid grid-cols-3 gap-2 pt-2">
                    {[
                      { icon: FileText, label: 'Notes' },
                      { icon: Layers,   label: 'Cards' },
                      { icon: HelpCircle, label: 'Quiz'  },
                    ].map(({ icon: I, label }) => (
                      <div key={label} className="bg-slate-50 rounded-xl p-3 text-center border border-slate-100">
                        <I className="w-4 h-4 text-brand-600 mx-auto mb-1" />
                        <p className="text-[11px] font-semibold text-slate-700">{label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Floating chips */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute -top-4 -right-4 bg-white rounded-2xl shadow-card border border-slate-100 p-3 flex items-center gap-2"
              >
                <div className="w-9 h-9 rounded-xl bg-emerald-100 grid place-items-center">
                  <Zap className="w-4 h-4 text-emerald-600" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-800">Notes ready</p>
                  <p className="text-[10px] text-slate-500">in 42 seconds</p>
                </div>
              </motion.div>

              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 5, repeat: Infinity }}
                className="absolute -bottom-4 -left-4 bg-white rounded-2xl shadow-card border border-slate-100 p-3 flex items-center gap-2"
              >
                <div className="w-9 h-9 rounded-xl bg-violet-100 grid place-items-center">
                  <GraduationCap className="w-4 h-4 text-violet-600" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-800">A+ score</p>
                  <p className="text-[10px] text-slate-500">avg. quiz result</p>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <p className="text-xs font-bold tracking-wider text-brand-600 mb-2">FEATURES</p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">Everything you need to study smarter</h2>
          <p className="mt-3 text-slate-600">Stop scribbling. Stop missing details. Let AutoNote AI do the heavy lifting.</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="bg-white rounded-2xl p-6 shadow-card border border-slate-100"
            >
              <div className="w-11 h-11 rounded-xl bg-brand-gradient grid place-items-center shadow-soft mb-4">
                <f.icon className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-bold text-slate-800">{f.title}</h3>
              <p className="text-sm text-slate-600 mt-1.5 leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <p className="text-xs font-bold tracking-wider text-brand-600 mb-2">HOW IT WORKS</p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">From recording to revision in 3 steps</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          {[
            { icon: Upload,   title: '1. Upload',   desc: 'Drag-drop your MP3, WAV, MP4, or MOV — up to 500 MB per file.' },
            { icon: Sparkles, title: '2. Process',  desc: 'AutoNote AI transcribes and summarises with state-of-the-art models.' },
            { icon: BookOpen, title: '3. Study',    desc: 'Read notes, flip flashcards, take quizzes, or download PDFs.' },
          ].map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="bg-white rounded-2xl p-6 shadow-card border border-slate-100 text-center"
            >
              <div className="w-14 h-14 mx-auto rounded-2xl bg-brand-gradient grid place-items-center shadow-soft mb-4">
                <s.icon className="w-7 h-7 text-white" />
              </div>
              <h3 className="font-bold text-slate-800">{s.title}</h3>
              <p className="text-sm text-slate-600 mt-2 leading-relaxed">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <p className="text-xs font-bold tracking-wider text-brand-600 mb-2">LOVED BY STUDENTS</p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">Built for late-night study sessions</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          {[
            { name: 'Aanya R.',   role: 'CSE, 6th sem', quote: 'Cut my revision time in half. The flashcards are gold.' },
            { name: 'Rahul M.',   role: 'EEE, 4th sem', quote: 'Finally — readable notes from 2-hour rambling lectures.' },
            { name: 'Priya S.',   role: 'Pre-med',      quote: 'The auto-quizzes feel like having a tutor on speed dial.' },
          ].map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="bg-white rounded-2xl p-6 shadow-card border border-slate-100"
            >
              <div className="flex gap-0.5 mb-3">
                {[...Array(5)].map((_, k) => <Star key={k} className="w-4 h-4 text-amber-400 fill-amber-400" />)}
              </div>
              <p className="text-slate-700 leading-relaxed">"{t.quote}"</p>
              <div className="mt-4 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-brand-gradient grid place-items-center text-white text-sm font-bold">
                  {t.name[0]}
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-800">{t.name}</p>
                  <p className="text-xs text-slate-500">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="relative overflow-hidden rounded-3xl bg-brand-gradient p-10 sm:p-14 text-center shadow-soft">
          <div className="pointer-events-none absolute -top-20 -right-20 w-72 h-72 rounded-full bg-white/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-20 -left-20 w-72 h-72 rounded-full bg-white/10 blur-3xl" />

          <h2 className="relative text-3xl sm:text-4xl font-extrabold text-white">
            Ready to ace your next semester?
          </h2>
          <p className="relative mt-3 text-white/90 max-w-xl mx-auto">
            Join thousands of students who study less, learn more, and sleep better with AutoNote AI.
          </p>
          <Link to="/signup" className="relative inline-flex items-center gap-2 mt-7 bg-white text-brand-700 font-semibold px-6 py-3 rounded-xl hover:scale-[1.02] active:scale-[0.99] transition-transform shadow-lg">
            Start for Free <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-slate-500">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-brand-600" />
            <span className="font-semibold text-slate-700">AutoNote AI</span>
            <span>© 2026</span>
          </div>
          <p>Made for students, by students.</p>
        </div>
      </footer>
    </div>
  )
}

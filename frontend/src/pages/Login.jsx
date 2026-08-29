import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Sparkles, Mail, Lock, ArrowRight, Loader2, AlertCircle, Eye, EyeOff } from 'lucide-react'
import { useAuth } from '../context/AuthContext.jsx'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || '/dashboard'

  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [submitting, setSubmitting]     = useState(false)
  const [error, setError]               = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setSubmitting(true)
    try {
      await login(email, password)
      navigate(from, { replace: true })
    } catch (err) {
      setError(err.message || 'Could not sign in.')
      setSubmitting(false)
    }
  }

  return (
    <AuthShell>
      <h1 className="text-2xl font-extrabold text-slate-900">Welcome back</h1>
      <p className="mt-1.5 text-sm text-slate-500">Sign in to keep studying where you left off.</p>

      <form onSubmit={handleSubmit} className="mt-7 space-y-4">
        <Field
          icon={Mail}
          type="email"
          label="Email"
          placeholder="you@university.edu"
          value={email}
          onChange={setEmail}
          autoComplete="email"
          required
        />
        <Field
          icon={Lock}
          type={showPassword ? 'text' : 'password'}
          label="Password"
          placeholder="••••••••"
          value={password}
          onChange={setPassword}
          autoComplete="current-password"
          required
          trailing={
            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              className="text-slate-400 hover:text-slate-600"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          }
        />

        {error && (
          <div className="flex items-start gap-2 bg-rose-50 border border-rose-100 text-rose-700 px-4 py-3 rounded-xl text-sm">
            <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <motion.button
          whileHover={submitting ? {} : { scale: 1.02 }}
          whileTap={submitting ? {} : { scale: 0.98 }}
          type="submit"
          disabled={submitting}
          className="w-full btn-primary py-3 text-base disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {submitting
            ? <><Loader2 className="w-4 h-4 animate-spin" /> Signing in…</>
            : <>Sign In <ArrowRight className="w-4 h-4" /></>}
        </motion.button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-500">
        New to AutoNote AI?{' '}
        <Link to="/signup" className="font-semibold text-brand-700 hover:text-brand-800">
          Create an account
        </Link>
      </p>
    </AuthShell>
  )
}

export function AuthShell({ children }) {
  return (
    <div className="min-h-screen bg-soft-gradient grid place-items-center px-4 py-12">
      <div className="pointer-events-none absolute -top-40 -left-32 w-96 h-96 rounded-full bg-violet-300/40 blur-3xl" />
      <div className="pointer-events-none absolute -top-20 -right-32 w-96 h-96 rounded-full bg-blue-300/40 blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative w-full max-w-md"
      >
        <Link to="/" className="flex items-center justify-center gap-2.5 mb-8">
          <div className="w-10 h-10 rounded-xl bg-brand-gradient grid place-items-center shadow-soft">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="text-lg font-extrabold gradient-text">AutoNote AI</span>
        </Link>

        <div className="bg-white rounded-3xl shadow-card border border-slate-100 p-7 sm:p-9">
          {children}
        </div>
      </motion.div>
    </div>
  )
}

export function Field({ icon: Icon, label, type = 'text', placeholder, value, onChange, trailing, ...rest }) {
  return (
    <label className="block">
      <span className="text-xs font-semibold text-slate-700">{label}</span>
      <div className="mt-1.5 relative">
        {Icon && <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />}
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 text-sm
                     placeholder:text-slate-400
                     focus:outline-none focus:ring-2 focus:ring-brand-200 focus:border-brand-300 focus:bg-white
                     transition-colors ${Icon ? 'pl-10' : 'pl-3.5'} ${trailing ? 'pr-10' : 'pr-3.5'}`}
          {...rest}
        />
        {trailing && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">{trailing}</div>
        )}
      </div>
    </label>
  )
}

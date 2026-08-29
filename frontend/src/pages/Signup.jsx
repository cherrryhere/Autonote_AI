import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { User, Mail, Lock, ArrowRight, Loader2, AlertCircle, Eye, EyeOff } from 'lucide-react'
import { useAuth } from '../context/AuthContext.jsx'
import { AuthShell, Field } from './Login.jsx'

export default function Signup() {
  const { signup } = useAuth()
  const navigate = useNavigate()

  const [name, setName]         = useState('')
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [submitting, setSubmitting]     = useState(false)
  const [error, setError]               = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)

    if (password.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }

    setSubmitting(true)
    try {
      await signup(name, email, password)
      navigate('/dashboard', { replace: true })
    } catch (err) {
      setError(err.message || 'Could not create your account.')
      setSubmitting(false)
    }
  }

  return (
    <AuthShell>
      <h1 className="text-2xl font-extrabold text-slate-900">Create your account</h1>
      <p className="mt-1.5 text-sm text-slate-500">Start turning lectures into study-ready notes.</p>

      <form onSubmit={handleSubmit} className="mt-7 space-y-4">
        <Field
          icon={User}
          label="Full name"
          placeholder="Aanya Rao"
          value={name}
          onChange={setName}
          autoComplete="name"
          required
        />
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
          placeholder="At least 8 characters"
          value={password}
          onChange={setPassword}
          autoComplete="new-password"
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
            ? <><Loader2 className="w-4 h-4 animate-spin" /> Creating account…</>
            : <>Get Started <ArrowRight className="w-4 h-4" /></>}
        </motion.button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-500">
        Already have an account?{' '}
        <Link to="/login" className="font-semibold text-brand-700 hover:text-brand-800">
          Sign in
        </Link>
      </p>
    </AuthShell>
  )
}

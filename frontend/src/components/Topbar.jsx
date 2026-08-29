import { useNavigate } from 'react-router-dom'
import { Bell, Search, Menu, LogOut } from 'lucide-react'
import { userProfile } from '../data/sampleData.js'
import { useAuth } from '../context/AuthContext.jsx'

function initials(name) {
  return name
    .split(' ')
    .map((p) => p[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

export default function Topbar({ onMenuClick }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const name   = user?.name || userProfile.name
  const detail = user?.email || userProfile.branch
  const avatar = user ? initials(user.name) : userProfile.avatar

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-xl border-b border-slate-200/70">
      <div className="flex items-center justify-between gap-4 px-4 sm:px-6 py-3">
        {/* Mobile menu */}
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-lg hover:bg-slate-100"
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5 text-slate-700" />
        </button>

        {/* Search */}
        <div className="flex-1 max-w-xl">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search lectures, notes, flashcards…"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm
                         placeholder:text-slate-400
                         focus:outline-none focus:ring-2 focus:ring-brand-200 focus:border-brand-300 focus:bg-white
                         transition-colors"
            />
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          <button className="relative p-2.5 rounded-xl hover:bg-slate-100 transition" aria-label="Notifications">
            <Bell className="w-5 h-5 text-slate-700" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white" />
          </button>

          <div className="hidden sm:block h-8 w-px bg-slate-200" />

          <div className="flex items-center gap-3">
            <div className="hidden sm:block text-right">
              <p className="text-sm font-semibold text-slate-800 leading-tight">{name}</p>
              <p className="text-xs text-slate-500">{detail}</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-brand-gradient text-white grid place-items-center font-bold shadow-soft">
              {avatar}
            </div>
            <button
              onClick={handleLogout}
              className="p-2.5 rounded-xl hover:bg-slate-100 transition text-slate-500 hover:text-rose-600"
              aria-label="Sign out"
              title="Sign out"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}

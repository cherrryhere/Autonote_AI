import { NavLink } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  LayoutDashboard,
  Upload,
  FileText,
  BookOpen,
  Layers,
  HelpCircle,
  History,
  Settings,
  Sparkles,
} from 'lucide-react'

const navItems = [
  { to: '/dashboard',   icon: LayoutDashboard, label: 'Dashboard'    },
  { to: '/upload',      icon: Upload,          label: 'Upload'       },
  { to: '/notes',       icon: FileText,        label: 'Notes'        },
  { to: '/summary',     icon: BookOpen,        label: 'Summary'      },
  { to: '/flashcards',  icon: Layers,          label: 'Flashcards'   },
  { to: '/quiz',        icon: HelpCircle,      label: 'Quiz'         },
  { to: '/history',     icon: History,         label: 'History'      },
  { to: '/settings',    icon: Settings,        label: 'Settings'     },
]

export default function Sidebar({ open, onClose }) {
  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-30 bg-slate-900/40 backdrop-blur-sm lg:hidden"
        />
      )}

      <aside
        className={`fixed lg:sticky top-0 left-0 z-40 h-screen w-64 shrink-0
                    bg-white border-r border-slate-200/70
                    transform transition-transform duration-300 ease-out
                    ${open ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}
      >
        <div className="h-full flex flex-col p-5">
          {/* Brand */}
          <NavLink to="/" className="flex items-center gap-2.5 mb-8 group">
            <div className="w-10 h-10 rounded-xl bg-brand-gradient flex items-center justify-center shadow-soft">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-extrabold gradient-text leading-none">AutoNote AI</h1>
              <p className="text-[11px] text-slate-500 font-medium">Smart lecture notes</p>
            </div>
          </NavLink>

          {/* Nav */}
          <nav className="flex-1 space-y-1">
            {navItems.map((item, idx) => (
              <motion.div
                key={item.to}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.04 }}
              >
                <NavLink
                  to={item.to}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `nav-link ${isActive ? 'nav-link-active' : ''}`
                  }
                >
                  <item.icon className="w-[18px] h-[18px]" />
                  <span>{item.label}</span>
                </NavLink>
              </motion.div>
            ))}
          </nav>

          {/* Upgrade card */}
          <div className="mt-6 p-4 rounded-2xl bg-brand-gradient text-white shadow-soft">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4" />
              <p className="text-sm font-semibold">Pro Plan</p>
            </div>
            <p className="text-xs opacity-90 mb-3">Unlock unlimited lectures, longer audio uploads, and PDF exports.</p>
            <button className="w-full bg-white/20 hover:bg-white/30 backdrop-blur text-xs font-semibold py-2 rounded-lg transition">
              Upgrade
            </button>
          </div>
        </div>
      </aside>
    </>
  )
}

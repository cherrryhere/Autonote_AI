import { motion } from 'framer-motion'
import { TrendingUp } from 'lucide-react'

export default function StatCard({ label, value, trend, icon: Icon, accent = 'brand', delay = 0 }) {
  const accents = {
    brand:   'from-indigo-500 to-violet-500',
    blue:    'from-blue-500 to-cyan-500',
    violet:  'from-violet-500 to-purple-500',
    emerald: 'from-emerald-500 to-teal-500',
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      whileHover={{ y: -4 }}
      className="relative overflow-hidden bg-white rounded-2xl p-5 shadow-card border border-slate-100"
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${accents[accent]} grid place-items-center shadow-soft`}>
          {Icon && <Icon className="w-5 h-5 text-white" />}
        </div>
        {trend && (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">
            <TrendingUp className="w-3 h-3" />
            {trend}
          </span>
        )}
      </div>

      <p className="text-sm text-slate-500 font-medium">{label}</p>
      <p className="text-3xl font-extrabold text-slate-900 mt-1 tracking-tight">{value}</p>

      {/* Decorative blob */}
      <div className={`pointer-events-none absolute -right-10 -bottom-10 w-32 h-32 rounded-full bg-gradient-to-br ${accents[accent]} opacity-10 blur-2xl`} />
    </motion.div>
  )
}

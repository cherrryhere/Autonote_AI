const tones = {
  brand:   'bg-brand-50 text-brand-700 border-brand-100',
  success: 'bg-emerald-50 text-emerald-700 border-emerald-100',
  warning: 'bg-amber-50 text-amber-700 border-amber-100',
  danger:  'bg-rose-50 text-rose-700 border-rose-100',
  slate:   'bg-slate-100 text-slate-700 border-slate-200',
  violet:  'bg-violet-50 text-violet-700 border-violet-100',
}

export default function Badge({ children, tone = 'brand', icon: Icon, className = '' }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${tones[tone]} ${className}`}
    >
      {Icon && <Icon className="w-3.5 h-3.5" />}
      {children}
    </span>
  )
}

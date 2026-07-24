import { motion } from 'framer-motion'

const variants = {
  primary: 'bg-brand-gradient text-white shadow-soft hover:shadow-lg',
  ghost:   'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-300',
  danger:  'bg-rose-500 text-white shadow-soft hover:bg-rose-600',
  subtle:  'bg-brand-50 text-brand-700 hover:bg-brand-100',
}

const sizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-5 py-2.5 text-sm',
  lg: 'px-6 py-3 text-base',
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  type = 'button',
  onClick,
  disabled = false,
  ...rest
}) {
  return (
    <motion.button
      whileHover={disabled ? {} : { scale: 1.02 }}
      whileTap={disabled ? {} : { scale: 0.98 }}
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center justify-center gap-2 rounded-xl font-semibold
                  transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed
                  ${variants[variant]} ${sizes[size]} ${className}`}
      {...rest}
    >
      {children}
    </motion.button>
  )
}

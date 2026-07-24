import { useState } from 'react'
import { Mail, User, GraduationCap, Building2, Bell, Moon, Lock, Save } from 'lucide-react'
import PageHeader from '../components/PageHeader.jsx'
import Button from '../components/Button.jsx'
import Badge from '../components/Badge.jsx'
import { userProfile } from '../data/sampleData.js'

export default function Settings() {
  const [profile, setProfile] = useState(userProfile)
  const [notifications, setNotifications] = useState({
    emailSummary: true,
    quizReminder: true,
    weeklyReport: false,
  })
  const [darkMode, setDarkMode] = useState(false)

  const update = (key, value) => setProfile((p) => ({ ...p, [key]: value }))

  // TODO: PATCH /api/user when backend is ready.
  const save = (e) => {
    e.preventDefault()
    alert('Demo: settings saved locally. Backend hook-up coming soon.')
  }

  return (
    <>
      <PageHeader
        eyebrow="Account"
        title="Settings & Profile"
        subtitle="Manage how AutoNote AI works for you."
      />

      {/* Profile card */}
      <section className="bg-white rounded-3xl shadow-card border border-slate-100 p-6 sm:p-8 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-5 mb-6">
          <div className="w-20 h-20 rounded-3xl bg-brand-gradient grid place-items-center text-white text-2xl font-extrabold shadow-soft">
            {profile.avatar}
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-slate-800">{profile.name}</h2>
            <p className="text-sm text-slate-500">{profile.email}</p>
            <div className="mt-2 flex flex-wrap gap-2">
              <Badge tone="brand">{profile.branch}</Badge>
              <Badge tone="violet">{profile.semester}</Badge>
              <Badge tone="success">Pro Plan</Badge>
            </div>
          </div>
          <Button variant="ghost">Change Photo</Button>
        </div>

        <form onSubmit={save} className="grid sm:grid-cols-2 gap-4">
          <Field icon={User}          label="Full name"        value={profile.name}     onChange={(v) => update('name',     v)} />
          <Field icon={Mail}          label="Email"            value={profile.email}    onChange={(v) => update('email',    v)} type="email" />
          <Field icon={GraduationCap} label="Branch"           value={profile.branch}   onChange={(v) => update('branch',   v)} />
          <Field icon={GraduationCap} label="Semester"         value={profile.semester} onChange={(v) => update('semester', v)} />
          <Field icon={Building2}     label="College"          value={profile.college}  onChange={(v) => update('college',  v)} className="sm:col-span-2" />

          <div className="sm:col-span-2 flex justify-end">
            <Button type="submit">
              <Save className="w-4 h-4" /> Save Changes
            </Button>
          </div>
        </form>
      </section>

      {/* Preferences */}
      <section className="grid lg:grid-cols-2 gap-5">
        {/* Notifications */}
        <div className="bg-white rounded-3xl shadow-card border border-slate-100 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Bell className="w-5 h-5 text-brand-600" />
            <h3 className="font-bold text-slate-800">Notifications</h3>
          </div>
          <div className="space-y-3">
            <Toggle
              label="Lecture summary emails"
              description="Get an email when your notes are ready."
              checked={notifications.emailSummary}
              onChange={(v) => setNotifications((n) => ({ ...n, emailSummary: v }))}
            />
            <Toggle
              label="Quiz reminders"
              description="Daily nudge to review yesterday's lecture."
              checked={notifications.quizReminder}
              onChange={(v) => setNotifications((n) => ({ ...n, quizReminder: v }))}
            />
            <Toggle
              label="Weekly study report"
              description="A Sunday digest of your progress."
              checked={notifications.weeklyReport}
              onChange={(v) => setNotifications((n) => ({ ...n, weeklyReport: v }))}
            />
          </div>
        </div>

        {/* Appearance + Security */}
        <div className="space-y-5">
          <div className="bg-white rounded-3xl shadow-card border border-slate-100 p-6">
            <div className="flex items-center gap-2 mb-4">
              <Moon className="w-5 h-5 text-brand-600" />
              <h3 className="font-bold text-slate-800">Appearance</h3>
            </div>
            <Toggle
              label="Dark mode"
              description="Easier on the eyes during late-night study sessions."
              checked={darkMode}
              onChange={setDarkMode}
            />
            <p className="text-xs text-slate-400 mt-3">Dark theme rolling out soon.</p>
          </div>

          <div className="bg-white rounded-3xl shadow-card border border-slate-100 p-6">
            <div className="flex items-center gap-2 mb-4">
              <Lock className="w-5 h-5 text-brand-600" />
              <h3 className="font-bold text-slate-800">Security</h3>
            </div>
            <div className="space-y-3">
              <Button variant="ghost" className="w-full justify-start">Change password</Button>
              <Button variant="ghost" className="w-full justify-start">Enable two-factor auth</Button>
              <Button variant="danger" className="w-full">Delete account</Button>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

function Field({ icon: Icon, label, value, onChange, type = 'text', className = '' }) {
  return (
    <label className={`block ${className}`}>
      <span className="text-xs font-semibold text-slate-700">{label}</span>
      <div className="mt-1.5 relative">
        {Icon && <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />}
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-3 py-2.5 text-sm
                     focus:outline-none focus:ring-2 focus:ring-brand-200 focus:border-brand-300 focus:bg-white"
        />
      </div>
    </label>
  )
}

function Toggle({ label, description, checked, onChange }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="min-w-0">
        <p className="text-sm font-semibold text-slate-800">{label}</p>
        {description && <p className="text-xs text-slate-500">{description}</p>}
      </div>
      <button
        type="button"
        onClick={() => onChange(!checked)}
        role="switch"
        aria-checked={checked}
        className={`relative inline-flex h-6 w-11 shrink-0 rounded-full transition
                    ${checked ? 'bg-brand-gradient' : 'bg-slate-200'}`}
      >
        <span
          className={`inline-block h-5 w-5 mt-0.5 rounded-full bg-white shadow transition-transform
                      ${checked ? 'translate-x-5' : 'translate-x-0.5'}`}
        />
      </button>
    </div>
  )
}

import { useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import Sidebar from './Sidebar.jsx'
import Topbar from './Topbar.jsx'

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()

  // Include both pathname and query string.
  //
  // Example:
  // /notes?id=abc
  // /notes?id=xyz
  //
  // These should be treated as two different page states.
  const pageKey = `${location.pathname}${location.search}`

  return (
    <div className="min-h-screen bg-soft-gradient">
      <div className="flex">
        <Sidebar
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        <main className="flex-1 min-w-0">
          <Topbar
            onMenuClick={() => setSidebarOpen(true)}
          />

          {/*
            Do not wrap the React Router Outlet in AnimatePresence.

            AnimatePresence with mode="wait" can conflict with
            React Router route changes because the Outlet changes
            before the previous animated route has completely exited.

            A normal motion.div gives us the page-enter animation
            without risking a blank routed page.
          */}
          <motion.div
            key={pageKey}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.25,
              ease: 'easeOut',
            }}
            className="
              px-4
              sm:px-6
              lg:px-8
              py-6
              lg:py-8
              max-w-7xl
              mx-auto
            "
          >
            <Outlet />
          </motion.div>
        </main>
      </div>
    </div>
  )
}
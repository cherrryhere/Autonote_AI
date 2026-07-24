import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout.jsx'
import LandingPage from './pages/LandingPage.jsx'
import Dashboard from './pages/Dashboard.jsx'
import UploadLecture from './pages/UploadLecture.jsx'
import GeneratedNotes from './pages/GeneratedNotes.jsx'
import Summary from './pages/Summary.jsx'
import Flashcards from './pages/Flashcards.jsx'
import Quiz from './pages/Quiz.jsx'
import LectureHistory from './pages/LectureHistory.jsx'
import Settings from './pages/Settings.jsx'

export default function App() {
  return (
    <Routes>
      {/* Public landing route — has its own layout */}
      <Route path="/" element={<LandingPage />} />

      {/* App shell with sidebar + topbar */}
      <Route element={<Layout />}>
        <Route path="/dashboard"  element={<Dashboard />} />
        <Route path="/upload"     element={<UploadLecture />} />
        <Route path="/notes"      element={<GeneratedNotes />} />
        <Route path="/summary"    element={<Summary />} />
        <Route path="/flashcards" element={<Flashcards />} />
        <Route path="/quiz"       element={<Quiz />} />
        <Route path="/history"    element={<LectureHistory />} />
        <Route path="/settings"   element={<Settings />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

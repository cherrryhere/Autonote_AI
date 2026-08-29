import { useEffect, useState } from 'react'
import { api, currentLectureId } from '../api/client.js'

const POLL_INTERVAL = 1500

// Loads the most recent lecture (or a specific one).
//
// If the lecture is still being processed, this hook automatically
// polls the backend until processing completes.
//
// Returns:
// {
//   lecture,
//   loading,
//   error,
//   isFallback
// }
export function useLecture(idOverride) {
  const [lecture, setLecture] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false
    let timer = null

    const id = idOverride || currentLectureId.get()

    if (!id) {
      setLecture(null)
      setLoading(false)
      setError(null)

      return () => {}
    }

    setLoading(true)
    setError(null)

    async function loadInitialLecture() {
      try {
        const data = await api.getLecture(id)

        if (cancelled) return

        setLecture(data)

        // Already finished — nothing else to poll.
        if (data.status === 'completed') {
          setLoading(false)
          return
        }

        // Processing already failed.
        if (data.status === 'failed') {
          setError(
            data.error ||
            'Lecture processing failed.'
          )
          setLoading(false)
          return
        }

        // Still processing.
        // Keep the page in its loading state and watch the backend.
        pollStatus()
      } catch (err) {
        if (cancelled) return

        setError(err.message)
        setLoading(false)
      }
    }

    async function pollStatus() {
      if (cancelled) return

      try {
        const status = await api.getStatus(id)

        if (cancelled) return

        // ─────────────────────────────────────────────
        // Processing completed
        // ─────────────────────────────────────────────
        if (status.status === 'completed') {
          const completedLecture = await api.getLecture(id)

          if (cancelled) return

          setLecture(completedLecture)
          setError(null)
          setLoading(false)

          return
        }

        // ─────────────────────────────────────────────
        // Processing failed
        // ─────────────────────────────────────────────
        if (status.status === 'failed') {
          let failedLecture = null

          try {
            failedLecture = await api.getLecture(id)
          } catch {
            // Ignore secondary fetch failure.
          }

          if (cancelled) return

          if (failedLecture) {
            setLecture(failedLecture)
          }

          setError(
            status.error ||
            failedLecture?.error ||
            'Lecture processing failed.'
          )

          setLoading(false)

          return
        }

        // ─────────────────────────────────────────────
        // Still processing
        // ─────────────────────────────────────────────
        timer = setTimeout(
          pollStatus,
          POLL_INTERVAL
        )
      } catch (err) {
        if (cancelled) return

        setError(err.message)
        setLoading(false)
      }
    }

    loadInitialLecture()

    return () => {
      cancelled = true

      if (timer) {
        clearTimeout(timer)
      }
    }
  }, [idOverride])

  return {
    lecture,
    loading,
    error,
    isFallback: !lecture && !loading,
  }
}
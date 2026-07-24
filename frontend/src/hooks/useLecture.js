import { useEffect, useState } from 'react'
import { api, currentLectureId } from '../api/client.js'

// Loads the most recent lecture (or a specific one).
// Returns { lecture, loading, error, isFallback }.
// `isFallback` is true when no backend lecture exists — caller should use sample data.
export function useLecture(idOverride) {
  const [lecture, setLecture] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState(null)

  useEffect(() => {
    let cancelled = false
    const id = idOverride || currentLectureId.get()

    if (!id) { setLoading(false); return }

    api.getLecture(id)
      .then((data) => { if (!cancelled) setLecture(data) })
      .catch((e)   => { if (!cancelled) setError(e.message) })
      .finally(()  => { if (!cancelled) setLoading(false) })

    return () => { cancelled = true }
  }, [idOverride])

  return {
    lecture,
    loading,
    error,
    isFallback: !lecture && !loading,
  }
}

import { useEffect, useRef } from 'react'

// Re-run `fn` on an interval and whenever the tab/window regains focus, so
// dashboards reflect status changes made by other roles (citizen submits,
// government verifies, university/industry collaborates) in near-real-time.
export function usePolling(fn, ms = 8000) {
  const saved = useRef(fn)
  saved.current = fn
  useEffect(() => {
    const tick = () => { try { saved.current?.() } catch { /* ignore */ } }
    const id = setInterval(tick, ms)
    const onFocus = () => { if (!document.hidden) tick() }
    window.addEventListener('focus', onFocus)
    document.addEventListener('visibilitychange', onFocus)
    return () => {
      clearInterval(id)
      window.removeEventListener('focus', onFocus)
      document.removeEventListener('visibilitychange', onFocus)
    }
  }, [ms])
}

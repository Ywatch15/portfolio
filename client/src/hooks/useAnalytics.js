import { useEffect } from 'react'

export default function useAnalytics() {
  useEffect(() => {
    // fire and forget; ignore failures
    fetch('/api/analytics/visit', { method: 'POST' }).catch(() => {})
  }, [])
}

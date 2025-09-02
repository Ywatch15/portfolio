import { useEffect, useState } from 'react'

const SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY

export function useRecaptcha() {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (!SITE_KEY) return
    const id = 'recaptcha-script'
    if (document.getElementById(id)) {
      setReady(true)
      return
    }
    const s = document.createElement('script')
    s.id = id
    s.src = `https://www.google.com/recaptcha/api.js?render=${encodeURIComponent(SITE_KEY)}`
    s.async = true
    s.defer = true
    s.onload = () => setReady(true)
    s.onerror = () => setReady(false)
    document.head.appendChild(s)
    return () => {
      // keep script for reuse; do not remove
    }
  }, [])

  async function getToken(action = 'contact') {
    if (!SITE_KEY || !window.grecaptcha || !ready) return ''
    try {
      await window.grecaptcha.ready()
      const token = await window.grecaptcha.execute(SITE_KEY, { action })
      return token || ''
    } catch {
      return ''
    }
  }

  return { ready, getToken, hasKey: Boolean(SITE_KEY) }
}

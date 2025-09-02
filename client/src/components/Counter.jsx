import { useEffect, useRef, useState } from 'react'

export default function Counter({ to = 0, duration = 1200 }) {
  const [val, setVal] = useState(0)
  const raf = useRef(0)
  useEffect(() => {
    if (typeof window === 'undefined') return
    const prefersReduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) { setVal(to); return }
    const start = performance.now()
    const step = (t) => {
      const p = Math.min(1, (t - start) / duration)
      setVal(Math.round(p * to))
      if (p < 1) raf.current = requestAnimationFrame(step)
    }
    raf.current = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf.current)
  }, [to, duration])
  return <span aria-label={`${to}`}>{val.toLocaleString()}</span>
}

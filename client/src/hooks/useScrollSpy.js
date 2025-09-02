import { useEffect, useState } from 'react'

const defaultOptions = { rootMargin: '-30% 0px -60% 0px', threshold: 0 }
export default function useScrollSpy(ids = [], options = defaultOptions) {
  const [active, setActive] = useState('')
  const key = Array.isArray(ids) ? ids.join(',') : ''
  useEffect(() => {
    if (!ids.length || typeof window === 'undefined') return
    const elements = ids
      .map((id) => document.getElementById(id))
      .filter(Boolean)
    if (!elements.length) return
    const io = new IntersectionObserver((entries) => {
      const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)
      if (visible[0]?.target?.id) setActive(visible[0].target.id)
    }, options)
    elements.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [ids, key, options])
  return active
}

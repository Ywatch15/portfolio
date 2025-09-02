import { motion as Motion } from 'framer-motion'

export default function AnimateIn({ as: As = 'div', children, delay = 0, className = '', ...rest }) {
  const variants = {
    hidden: { opacity: 0, y: 16 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1], delay } },
  }
  const disable = typeof window !== 'undefined' && (
    (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) ||
    (window.location && new URLSearchParams(window.location.search).has('noanim'))
  )
  if (disable) {
    const PlainTag = As
    return <PlainTag className={className} {...rest}>{children}</PlainTag>
  }
  const map = { div: Motion.div, p: Motion.p, h1: Motion.h1, h2: Motion.h2, h3: Motion.h3, section: Motion.section, span: Motion.span, li: Motion.li }
  const Comp = map[As] || Motion.div
  return (
    <Comp
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ amount: 0.2, once: true }}
      variants={variants}
      {...rest}
    >
      {children}
    </Comp>
  )
}

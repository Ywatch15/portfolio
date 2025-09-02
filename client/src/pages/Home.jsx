import { lazy, Suspense, useEffect, useState } from 'react'
import { motion as Motion } from 'framer-motion'
import AnimateIn from '../components/AnimateIn.jsx'
import Counter from '../components/Counter.jsx'
import ProjectCard from '../components/ProjectCard.jsx'
import { getProjects } from '../utils/api.js'
import ContactForm from '../components/ContactForm.jsx'
import { hero, about, skills, experience, achievements, fallbackProjects } from '../content/site.js'

const HeroScene = lazy(() => import('./_HeroScene.jsx'))

export default function Home() {
  return (
    <div>
      <section aria-labelledby="hero-title" className="relative overflow-hidden">
        {/* Background R3F */}
        <div className="absolute inset-0 -z-10" aria-hidden="true">
          <Suspense fallback={<div className="h-[60vh]" />}> 
            <HeroScene />
          </Suspense>
        </div>
        {/* Glow gradients */}
  <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 h-72 w-[48rem] bg-gradient-to-r from-indigo-600/30 via-fuchsia-500/20 to-teal-400/30 blur-3xl -z-10" />
  <div aria-hidden="true" className="pointer-events-none absolute right-12 top-24 h-28 w-28 rounded-full bg-indigo-500/20 blur-xl float-slow" />
  <div aria-hidden="true" className="pointer-events-none absolute left-10 bottom-10 h-20 w-20 rounded-full bg-fuchsia-500/20 blur-xl float-slow" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-24 pb-20 min-h-[70vh] grid place-items-center text-center">
          <div>
            <Motion.h1
              id="hero-title"
              className="text-5xl sm:text-6xl font-extrabold bg-gradient-to-r from-indigo-400 via-fuchsia-400 to-teal-300 bg-clip-text text-transparent tracking-tight"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            >
              {hero.name}
            </Motion.h1>
            <Motion.p className="mt-3 text-lg text-neutral-300" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2, duration: 0.6 }}>
              {hero.tagline}
            </Motion.p>
            <div className="mt-8">
              <div className="flex items-center justify-center gap-3">
                <a href="#projects" aria-label="Scroll to Projects section" className="inline-flex items-center gap-2 px-5 py-3 rounded bg-indigo-600 text-white hover:bg-indigo-500 focus-visible:outline outline-2 outline-offset-2 outline-indigo-400 shadow-lg shadow-indigo-600/30 nav-link">
                  {hero.ctaPrimary}
                </a>
                <a href="/api/resume/download" aria-label="Download resume PDF" className="inline-flex items-center gap-2 px-5 py-3 rounded border border-neutral-600 hover:bg-neutral-800 focus-visible:outline outline-2 outline-offset-2 outline-indigo-400 backdrop-blur-sm nav-link">
                  {hero.ctaSecondary}
                </a>
              </div>
            </div>
            <p className="mt-4 text-sm text-neutral-400">Tip: Use the navigation links above to jump to a section.</p>
          </div>
        </div>
      </section>

      <section id="about" aria-labelledby="about-title" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <AnimateIn as="h2" id="about-title" className="text-2xl font-semibold">About</AnimateIn>
        <AnimateIn as="p" className="mt-4 text-neutral-300 max-w-3xl" delay={0.05}>
          {about}
        </AnimateIn>
      </section>

      <section id="projects" aria-labelledby="projects-title" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <AnimateIn as="h2" id="projects-title" className="text-2xl font-semibold">Projects</AnimateIn>
  <ProjectsList />
      </section>

      <section id="skills" aria-labelledby="skills-title" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <AnimateIn as="h2" id="skills-title" className="text-2xl font-semibold">Skills</AnimateIn>
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {skills.map((s, i) => (
            <AnimateIn key={s.name} className="p-4 rounded border border-neutral-800 bg-gradient-to-br from-neutral-900 to-neutral-950" delay={i * 0.04}>
              <div className="flex items-center justify-between">
                <span className="font-medium">{s.name}</span>
                <span className="text-sm text-neutral-400">{s.lvl}%</span>
              </div>
              <div className="mt-3 h-2 rounded bg-neutral-800 overflow-hidden">
                <Motion.div className="h-full bg-gradient-to-r from-indigo-500 via-fuchsia-500 to-teal-500" initial={{ width: 0 }} whileInView={{ width: `${s.lvl}%` }} transition={{ duration: 0.9, delay: 0.1 }} viewport={{ once: true }} />
              </div>
            </AnimateIn>
          ))}
        </div>
      </section>

      <section id="experience" aria-labelledby="experience-title" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <AnimateIn as="h2" id="experience-title" className="text-2xl font-semibold">Experience</AnimateIn>
        <div className="mt-6 relative pl-6 before:absolute before:left-2 before:top-0 before:bottom-0 before:w-px before:bg-neutral-800">
          {experience.map((e, i) => (
            <AnimateIn key={i} className="relative pl-4 pb-6">
              <span className="absolute left-[-6px] top-1 h-3 w-3 rounded-full bg-gradient-to-r from-indigo-500 to-fuchsia-500" aria-hidden="true" />
              <div className="font-medium">{e.role} • {e.org}</div>
              <div className="text-sm text-neutral-400">{e.when}</div>
              <p className="mt-2 text-neutral-300">{e.desc}</p>
            </AnimateIn>
          ))}
        </div>
      </section>

      <section id="achievements" aria-labelledby="achievements-title" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <AnimateIn as="h2" id="achievements-title" className="text-2xl font-semibold">Achievements</AnimateIn>
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {achievements.map((a, i) => (
            <AnimateIn key={a.label} className="p-5 rounded border border-neutral-800 bg-neutral-900/60" delay={i * 0.06}>
              <Motion.div className="text-4xl font-extrabold bg-gradient-to-r from-indigo-400 to-teal-300 bg-clip-text text-transparent"
                     initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ duration: 0.6 }} viewport={{ once: true }}>
                <Counter to={a.n} />
              </Motion.div>
              <div className="mt-2 text-neutral-300">{a.label}</div>
            </AnimateIn>
          ))}
        </div>
      </section>

      <section id="contact" aria-labelledby="contact-title" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <AnimateIn as="h2" id="contact-title" className="text-2xl font-semibold">Contact</AnimateIn>
        <p className="mt-4 text-neutral-300">Submit the form to send a message. I’ll reply within 3 business days.</p>
        <div className="mt-6">
          <ContactForm />
        </div>
      </section>
    </div>
  )
}

function ProjectsList() {
  const [state, setState] = useState({ loading: true, error: '', items: [] })

  useEffect(() => {
    let mounted = true
    getProjects()
      .then((items) => mounted && setState({ loading: false, error: '', items }))
      .catch(() => {
        if (mounted) setState({ loading: false, error: 'Showing mock data (API not available yet).', items: fallbackProjects })
      })
    return () => { mounted = false }
  }, [])

  return (
    <div className="mt-4">
      <div aria-live="polite" className="sr-only">
        {state.loading ? 'Loading projects…' : state.error ? state.error : `${state.items.length} projects loaded`}
      </div>
      {state.loading ? (
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-40 rounded-lg bg-neutral-800 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {state.items.map((p, i) => (
            <ProjectCard key={i} project={p} />
          ))}
        </div>
      )}
      {state.error && <p className="mt-3 text-sm text-amber-400">{state.error}</p>}
    </div>
  )
}

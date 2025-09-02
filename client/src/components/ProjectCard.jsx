import { useState } from 'react'
import { motion as Motion } from 'framer-motion'
import Modal from './Modal.jsx'

export default function ProjectCard({ project }) {
  const [open, setOpen] = useState(false)
  return (
  <Motion.div className="group [perspective:1000px]" initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
      <div className="gradient-border rounded-lg">
        <div className="relative rounded-lg glass-pane p-4 transition-transform duration-300 [transform-style:preserve-3d] group-hover:[transform:rotateY(6deg)] focus-within:[transform:rotateY(6deg)] shadow-lg shadow-black/20">
        <h3 className="text-lg font-semibold text-white">{project.title}</h3>
        <p className="mt-2 text-sm text-neutral-300">{project.shortDesc}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {project.tech?.map((t) => (
            <span key={t} className="text-xs px-2 py-1 rounded bg-indigo-600/20 text-indigo-300 border border-indigo-600/30">{t}</span>
          ))}
        </div>
        <div className="mt-4 flex gap-3">
          {project.liveUrl && (
            <a href={project.liveUrl} target="_blank" rel="noreferrer" className="px-3 py-2 rounded bg-indigo-600 text-white hover:bg-indigo-500 focus-visible:outline outline-2 outline-offset-2 outline-indigo-400" aria-label={`Open live demo for ${project.title}`}>Live Demo</a>
          )}
          <button onClick={() => setOpen(true)} className="px-3 py-2 rounded bg-neutral-800 text-neutral-100 hover:bg-neutral-700 focus-visible:outline outline-2 outline-offset-2 outline-indigo-400" aria-label={`Open case study for ${project.title}`}>Case Study</button>
        </div>
        </div>
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title={`${project.title} — Case Study`}>
        <div className="space-y-3 text-neutral-200">
          <p>{project.longDesc || 'Detailed case study coming soon.'}</p>
          {project.metrics?.length ? (
            <ul className="list-disc pl-5">
              {project.metrics.map((m, i) => (
                <li key={i}>{m}</li>
              ))}
            </ul>
          ) : null}
        </div>
      </Modal>
  </Motion.div>
  )
}

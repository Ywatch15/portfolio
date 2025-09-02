import { useState } from 'react'
import { Link } from 'react-router-dom'
import useScrollSpy from '../hooks/useScrollSpy'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const active = useScrollSpy(['about','projects','skills','experience','achievements','contact'])
  const navItems = [
    { href: '#about', label: 'About' },
    { href: '#projects', label: 'Projects' },
    { href: '#skills', label: 'Skills' },
    { href: '#experience', label: 'Experience' },
    { href: '#achievements', label: 'Achievements' },
    { href: '#contact', label: 'Contact' },
  ]
  return (
    <header className="sticky top-0 z-40 backdrop-blur supports-[backdrop-filter]:bg-neutral-900/60 bg-neutral-900/80 border-b border-neutral-800">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-14 items-center justify-between">
          <Link to="/" className="font-semibold tracking-tight text-white" aria-label="Go to homepage">
            Sundram <span className="text-indigo-400">Pathak</span>
          </Link>
          <nav className="hidden md:flex gap-6" aria-label="Primary">
            {navItems.map((item) => {
              const isActive = active && `#${active}` === item.href
              return (
                <a key={item.href} href={item.href} className={`nav-link text-sm ${isActive ? 'text-white is-active' : 'text-neutral-300'} hover:text-white focus-visible:outline outline-2 outline-offset-2 rounded outline-indigo-500`}>
                  {item.label}
                </a>
              )
            })}
          </nav>
          <button aria-expanded={open} aria-controls="mobile-nav" onClick={() => setOpen((v) => !v)}
            className="md:hidden inline-flex items-center gap-2 px-3 py-2 rounded bg-indigo-600 text-white hover:bg-indigo-500 focus-visible:outline outline-2 outline-offset-2 outline-indigo-400"
          >
            <span>{open ? 'Close' : 'Menu'}</span>
          </button>
        </div>
      </div>
      <div id="mobile-nav" hidden={!open} className="md:hidden border-t border-neutral-800" role="dialog" aria-label="Mobile navigation">
        <div className="px-4 py-3 space-y-2">
          {navItems.map((item) => (
            <a key={item.href} href={item.href} onClick={() => setOpen(false)} className="block px-3 py-2 rounded text-neutral-100 bg-neutral-800 hover:bg-neutral-700 focus-visible:outline outline-2 outline-offset-2 outline-indigo-500">
              {item.label}
            </a>
          ))}
        </div>
      </div>
    </header>
  )
}

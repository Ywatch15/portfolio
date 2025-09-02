import { useId, useRef, useState } from 'react'
import { motion as Motion } from 'framer-motion'
import { postContact } from '../utils/api.js'
import { useRecaptcha } from '../hooks/useRecaptcha.js'

export default function ContactForm() {
  const formId = useId()
  const liveRef = useRef(null)
  const [state, setState] = useState({ sending: false, success: '', error: '', fields: { name: '', email: '', subject: '', message: '' } })
  const { ready: recaptchaReady, getToken, hasKey } = useRecaptcha()

  function setField(field, value) {
    setState((s) => ({ ...s, fields: { ...s.fields, [field]: value } }))
  }

  function validate() {
    const { name, email, message } = state.fields
    if (!name.trim()) return 'Please enter your name.'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Please enter a valid email address.'
    if (!message.trim()) return 'Please enter a message.'
    return ''
  }

  async function onSubmit(e) {
    e.preventDefault()
    const v = validate()
    if (v) {
      setState((s) => ({ ...s, error: v, success: '' }))
      liveRef.current?.focus()
      return
    }
    setState((s) => ({ ...s, sending: true, error: '', success: '' }))

    let recaptchaToken = ''
    if (hasKey && recaptchaReady) {
      recaptchaToken = await getToken('contact')
    }
    try {
      const payload = { ...state.fields, recaptchaToken }
      const res = await postContact(payload)
      const stored = Boolean(res?.stored)
      setState((s) => ({ ...s, sending: false, success: stored ? 'Thanks — your message has been sent. I’ll reply within 3 business days.' : 'Thanks — your message was received. I’ll follow up soon.', fields: { name: '', email: '', subject: '', message: '' } }))
      liveRef.current?.focus()
    } catch (err) {
      setState((s) => ({ ...s, sending: false, error: err.message || 'Could not send message. Please try again later.' }))
      liveRef.current?.focus()
    }
  }

  return (
    <form onSubmit={onSubmit} aria-describedby={`${formId}-live`} className="max-w-2xl">
      <div id={`${formId}-live`} ref={liveRef} tabIndex={-1} aria-live="polite" className="sr-only">
        {state.error || state.success || (state.sending ? 'Sending your message…' : '')}
      </div>

      <div className="grid gap-4">
        <label className="block">
          <span className="text-sm text-neutral-200">Name</span>
          <input
            name="name"
            value={state.fields.name}
            onChange={(e) => setField('name', e.target.value)}
            required
            className="mt-1 w-full rounded bg-neutral-900 border border-neutral-700 px-3 py-2 text-neutral-100 placeholder-neutral-500 focus-visible:outline outline-2 outline-offset-2 outline-indigo-500"
            placeholder="Your full name"
            aria-invalid={Boolean(state.error && !state.fields.name)}
          />
        </label>

        <label className="block">
          <span className="text-sm text-neutral-200">Email</span>
          <input
            type="email"
            name="email"
            value={state.fields.email}
            onChange={(e) => setField('email', e.target.value)}
            required
            className="mt-1 w-full rounded bg-neutral-900 border border-neutral-700 px-3 py-2 text-neutral-100 placeholder-neutral-500 focus-visible:outline outline-2 outline-offset-2 outline-indigo-500"
            placeholder="you@example.com"
          />
        </label>

        <label className="block">
          <span className="text-sm text-neutral-200">Subject (optional)</span>
          <input
            name="subject"
            value={state.fields.subject}
            onChange={(e) => setField('subject', e.target.value)}
            className="mt-1 w-full rounded bg-neutral-900 border border-neutral-700 px-3 py-2 text-neutral-100 placeholder-neutral-500 focus-visible:outline outline-2 outline-offset-2 outline-indigo-500"
            placeholder="What’s this about?"
          />
        </label>

        <label className="block">
          <span className="text-sm text-neutral-200">Message</span>
          <textarea
            name="message"
            value={state.fields.message}
            onChange={(e) => setField('message', e.target.value)}
            required
            rows={6}
            className="mt-1 w-full rounded bg-neutral-900 border border-neutral-700 px-3 py-2 text-neutral-100 placeholder-neutral-500 focus-visible:outline outline-2 outline-offset-2 outline-indigo-500"
            placeholder="How can I help?"
          />
        </label>

        <p className="text-xs text-neutral-400">Privacy: Your message is used only to contact you back and is not shared.</p>
        {!hasKey && (
          <p className="text-xs text-amber-400">Note: reCAPTCHA is not configured. Add VITE_RECAPTCHA_SITE_KEY in your client env to enable spam protection.</p>
        )}

  <Motion.button whileTap={{ scale: 0.98 }} type="submit" disabled={state.sending} className="inline-flex items-center gap-2 px-5 py-3 rounded bg-indigo-600 text-white hover:bg-indigo-500 disabled:opacity-60 focus-visible:outline outline-2 outline-offset-2 outline-indigo-400" aria-label="Send your message">
          {state.sending ? 'Sending…' : 'Send Message'}
  </Motion.button>

        {state.error && <p role="status" className="text-sm text-amber-400">{state.error}</p>}
        {state.success && <p role="status" className="text-sm text-emerald-400">{state.success}</p>}
      </div>
    </form>
  )
}

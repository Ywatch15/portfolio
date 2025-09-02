import { Router } from 'express'
import crypto from 'crypto'
import Contact from '../models/Contact.js'
import { sendContactEmail } from '../email.js'
import { connectDB, isConnected } from '../db.js'

const router = Router()

const ok = (data) => ({ success: true, data, error: null })
const fail = (message, code = 'BAD_REQUEST') => ({ success: false, data: null, error: { code, message } })

function hashIp(ip) {
  try {
    return crypto.createHash('sha256').update(ip || '').digest('hex').slice(0, 16)
  } catch {
    return ''
  }
}

router.post('/contact', async (req, res) => {
  const { name, email, subject = '', message, recaptchaToken } = req.body || {}
  if (!name || !email || !message) return res.status(400).json(fail('Name, email, and message are required'))
  if (typeof name !== 'string' || typeof email !== 'string' || typeof message !== 'string') {
    return res.status(400).json(fail('Invalid payload'))
  }

  // Optional: verify reCAPTCHA v3 token
  if (recaptchaToken && process.env.RECAPTCHA_SECRET) {
    try {
      const params = new URLSearchParams()
      params.set('secret', process.env.RECAPTCHA_SECRET)
      params.set('response', recaptchaToken)
      const verifyUrl = process.env.RECAPTCHA_VERIFY_URL || 'https://www.google.com/recaptcha/api/siteverify'
      const r = await fetch(verifyUrl, { method: 'POST', body: params })
      const j = await r.json()
      if (!j.success) {
        return res.status(400).json(fail('reCAPTCHA verification failed', 'RECAPTCHA_FAILED'))
      }
    } catch (e) {
      return res.status(400).json(fail('reCAPTCHA verification error', 'RECAPTCHA_ERROR'))
    }
  }

  const doc = {
    name: name.trim(),
    email: email.trim().toLowerCase(),
    subject: (subject || '').trim(),
    message: message.trim(),
    ipHash: hashIp(req.ip),
    userAgent: req.get('user-agent') || '',
  }

  try {
    await connectDB()
    if (!isConnected()) {
      // DB not configured; accept the request but do not persist
      // attempt to email even if not stored
      try {
        if (process.env.SMTP_HOST || process.env.SMTP_USER) {
          await sendContactEmail({
            to: process.env.CONTACT_TO || process.env.SMTP_USER,
            from: process.env.CONTACT_FROM,
            name: doc.name,
            email: doc.email,
            subject: doc.subject,
            message: doc.message,
          })
        }
      } catch {}
      return res.status(202).json(ok({ stored: false, emailed: Boolean(process.env.SMTP_HOST || process.env.SMTP_USER) }))
    }
    const saved = await Contact.create(doc)
    try {
      if (process.env.SMTP_HOST || process.env.SMTP_USER) {
        await sendContactEmail({
          to: process.env.CONTACT_TO || process.env.SMTP_USER,
          from: process.env.CONTACT_FROM,
          name: doc.name,
          email: doc.email,
          subject: doc.subject,
          message: doc.message,
        })
      }
    } catch {}
    return res.status(201).json(ok({ stored: true, id: saved._id }))
  } catch (err) {
    req.log?.error?.(err, 'Contact create failed')
    return res.status(500).json(fail('Could not submit message', 'INTERNAL_ERROR'))
  }
})

export default router

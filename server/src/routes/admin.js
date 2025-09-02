import { Router } from 'express'
import rateLimit from 'express-rate-limit'
import { verifyAdmin, signTokens, requireAuth } from '../auth.js'
import Contact from '../models/Contact.js'
import { connectDB } from '../db.js'
import Metric from '../models/Metric.js'

const router = Router()
const ok = (data) => ({ success: true, data, error: null })
const fail = (message, code = 'BAD_REQUEST') => ({ success: false, data: null, error: { code, message } })

const loginLimiter = rateLimit({ windowMs: 60_000, max: 10 })

router.post('/admin/login', loginLimiter, async (req, res) => {
  const { username, password } = req.body || {}
  if (!username || !password) return res.status(400).json(fail('Username and password required'))
  const user = await verifyAdmin(username, password)
  if (!user) return res.status(401).json(fail('Invalid credentials', 'UNAUTHORIZED'))
  const tokens = signTokens(user)
  return res.json(ok(tokens))
})

router.post('/admin/refresh-token', async (req, res) => {
  const { refreshToken } = req.body || {}
  if (!refreshToken) return res.status(400).json(fail('Missing refresh token'))
  try {
    const payload = (await import('jsonwebtoken')).default.verify(refreshToken, process.env.JWT_SECRET)
    if (payload.type !== 'refresh') throw new Error('Invalid')
    const tokens = signTokens({ _id: payload.sub, role: 'admin' })
    return res.json(ok(tokens))
  } catch {
    return res.status(401).json(fail('Invalid refresh token', 'UNAUTHORIZED'))
  }
})

router.get('/contact', requireAuth, async (req, res) => {
  const page = Math.max(1, Number(req.query.page || 1))
  const limit = Math.min(50, Math.max(1, Number(req.query.limit || 10)))
  await connectDB()
  const [items, total] = await Promise.all([
    Contact.find().sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean(),
    Contact.countDocuments(),
  ])
  return res.json(ok({ items, page, limit, total }))
})

router.get('/admin/metrics', requireAuth, async (req, res) => {
  await connectDB()
  const m = await Metric.findOne({ key: 'resumeDownloads' }).lean()
  return res.json(ok({ resumeDownloads: m?.value || 0 }))
})

// Mark contact as read
router.patch('/contact/:id/read', requireAuth, async (req, res) => {
  await connectDB()
  const { id } = req.params
  const doc = await Contact.findByIdAndUpdate(id, { $set: { read: true } }, { new: true }).lean()
  if (!doc) return res.status(404).json(fail('Contact not found', 'NOT_FOUND'))
  return res.json(ok(doc))
})

export default router

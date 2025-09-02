import express from 'express'
import helmet from 'helmet'
import cors from 'cors'
import rateLimit from 'express-rate-limit'
import pino from 'pino'
import pinoHttp from 'pino-http'
import { config } from './config.js'
import contactRouter from './routes/contact.js'
import adminRouter from './routes/admin.js'
import { connectDB, isConnected } from './db.js'
import Metric from './models/Metric.js'
import AnalyticsEvent from './models/AnalyticsEvent.js'
import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'

const logger = pino({ level: process.env.LOG_LEVEL || 'info' })
export const app = express()

// Basic security and parsing
app.use(helmet())
app.use(cors({
  origin: (origin, cb) => {
    if (!origin) return cb(null, true) // allow curl/postman
    // If no FRONTEND_ORIGIN set, allow all (useful on Vercel previews)
    if (!config.frontendOrigin || (Array.isArray(config.frontendOrigin) && !config.frontendOrigin.length)) {
      return cb(null, true)
    }
    const ok = Array.isArray(config.frontendOrigin)
      ? config.frontendOrigin.includes(origin)
      : origin === config.frontendOrigin
    cb(ok ? null : new Error('CORS blocked'), ok)
  },
  credentials: true,
}))
app.use(express.json({ limit: '1mb' }))
app.use(express.urlencoded({ extended: false }))
app.use(pinoHttp({ logger, genReqId: (req) => req.headers['x-request-id'] || Math.random().toString(36).slice(2) }))

// Rate limit basic public routes
const publicLimiter = rateLimit({ windowMs: 60_000, max: 120 })
app.use('/api/', publicLimiter)

// JSON envelope helper
const ok = (data) => ({ success: true, data, error: null })
const fail = (message, code = 'BAD_REQUEST') => ({ success: false, data: null, error: { code, message } })

// Health & status
app.get('/api/health', (req, res) => res.status(200).json(ok({ status: 'ok' })))
app.get('/api/status', (req, res) => res.status(200).json(ok({ uptime: process.uptime(), env: config.env })))

// Projects stub
const sampleProjects = [
  { id: 'resume-analyzer', title: 'Resume Analyzer', shortDesc: 'AI-assisted resume analysis tool', tech: ['React','Node','AI'], liveUrl: 'https://01resumeanalyzer06.netlify.app/' },
]
app.get('/api/projects', (req, res) => res.json(ok(sampleProjects)))
app.get('/api/projects/:id', (req, res) => {
  const p = sampleProjects.find(x => x.id === req.params.id)
  if (!p) return res.status(404).json(fail('Project not found', 'NOT_FOUND'))
  res.json(ok(p))
})

// Analytics summary stub
app.get('/api/analytics/summary', async (req, res) => {
  try {
    await connectDB()
    if (!isConnected()) return res.json(ok({ visits: 0, unique: 0 }))
    const visits = await AnalyticsEvent.countDocuments({ type: 'visit' })
    return res.json(ok({ visits, unique: visits }))
  } catch (e) {
    req.log?.error?.(e, 'analytics summary error')
    return res.json(ok({ visits: 0, unique: 0 }))
  }
})

// Resume download endpoint: increments counter and streams file if present
app.get('/api/resume/download', async (req, res) => {
  try {
    await connectDB()
    if (isConnected()) {
      await Metric.updateOne({ key: 'resumeDownloads' }, { $inc: { value: 1 } }, { upsert: true })
    }
  } catch (e) {
    req.log?.warn?.({ err: e }, 'failed to increment resume metric')
  }

  // Resolve to server/public/resume.pdf regardless of process.cwd()
  const __dirname = path.dirname(fileURLToPath(import.meta.url))
  const resumePath = path.resolve(__dirname, '..', 'public', 'resume.pdf')
  if (fs.existsSync(resumePath)) {
    res.setHeader('Content-Type', 'application/pdf')
    res.setHeader('Content-Disposition', 'attachment; filename="resume.pdf"')
    fs.createReadStream(resumePath).pipe(res)
  } else {
    res.status(200).json(ok({ message: 'Resume not bundled; metric counted' }))
  }
})

// Lightweight analytics capture
app.post('/api/analytics/visit', async (req, res) => {
  try {
    await connectDB()
    if (isConnected()) {
      const ua = req.headers['user-agent'] || ''
      const ip = (req.headers['x-forwarded-for'] || req.socket?.remoteAddress || '').toString()
      const ipHash = await (await import('crypto')).createHash('sha256').update(ip).digest('hex').slice(0, 16)
      await AnalyticsEvent.create({ type: 'visit', ua, ipHash })
    }
  } catch (e) {
    req.log?.warn?.({ err: e }, 'failed to store analytics event')
  }
  res.json(ok({ stored: isConnected() }))
})

// Contact route with a dedicated rate limit
const contactLimiter = rateLimit({ windowMs: 60_000, max: 5 })
app.use('/api', contactLimiter, contactRouter)
app.use('/api', adminRouter)

// Error handler
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  req.log?.error?.({ err }, 'Unhandled error')
  res.status(500).json(fail('Internal Server Error', 'INTERNAL_ERROR'))
})

export default app

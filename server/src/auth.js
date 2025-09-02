import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import AdminUser from './models/AdminUser.js'
import { connectDB } from './db.js'

export function signTokens(user) {
  const accessToken = jwt.sign({ sub: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '15m' })
  const refreshToken = jwt.sign({ sub: user._id, type: 'refresh' }, process.env.JWT_SECRET, { expiresIn: '7d' })
  return { accessToken, refreshToken }
}

export function requireAuth(req, res, next) {
  const header = req.get('authorization') || ''
  const [, token] = header.split(' ')
  if (!token) return res.status(401).json({ success: false, data: null, error: { code: 'UNAUTHORIZED', message: 'Missing token' } })
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET)
    req.user = payload
    next()
  } catch {
    return res.status(401).json({ success: false, data: null, error: { code: 'UNAUTHORIZED', message: 'Invalid token' } })
  }
}

export async function verifyAdmin(username, password) {
  await connectDB()
  const user = await AdminUser.findOne({ username: username.toLowerCase().trim() })
  if (!user) return null
  const ok = await bcrypt.compare(password, user.passwordHash)
  return ok ? user : null
}

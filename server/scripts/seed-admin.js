import bcrypt from 'bcrypt'
import { connectDB } from '../src/db.js'
import AdminUser from '../src/models/AdminUser.js'

const username = process.argv[2] || 'admin'
const password = Math.random().toString(36).slice(2, 10)

await connectDB()
const existing = await AdminUser.findOne({ username })
if (existing) {
  console.log(`Admin user '${username}' already exists.`)
  process.exit(0)
}
const passwordHash = await bcrypt.hash(password, 10)
await AdminUser.create({ username, passwordHash })
console.log(`Admin created. Username: ${username}  Password: ${password}`)
process.exit(0)

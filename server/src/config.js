import dotenv from 'dotenv'
dotenv.config()

const frontendOrigins = (process.env.FRONTEND_ORIGIN || 'http://localhost:5173')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean)

export const config = {
  env: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT || 4000),
  mongoUri: process.env.MONGO_URI || '',
  frontendOrigin: frontendOrigins,
  jwtSecret: process.env.JWT_SECRET || 'dev_secret',
}

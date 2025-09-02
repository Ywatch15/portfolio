import mongoose from 'mongoose'
import { config } from './config.js'

let connectionPromise = null

export function connectDB() {
  if (connectionPromise) return connectionPromise
  if (!config.mongoUri) {
    console.warn('[db] MONGO_URI not set. Running without database connection.')
    connectionPromise = Promise.resolve(null)
    return connectionPromise
  }
  mongoose.set('strictQuery', true)
  connectionPromise = mongoose
    .connect(config.mongoUri, { dbName: 'portfolio' })
    .then((m) => {
      console.log('[db] Connected to MongoDB')
      return m
    })
    .catch((err) => {
      console.error('[db] Mongo connection error:', err.message)
      throw err
    })
  return connectionPromise
}

export function isConnected() {
  return mongoose.connection?.readyState === 1
}

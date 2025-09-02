// Vercel serverless entry: connect Express app to Vercel function
import { createServer } from 'http'
import { parse } from 'url'

let cached

export default async function handler(req, res) {
  if (!cached) {
    const mod = await import('../server/src/app.js')
    const app = mod.default || mod.app || mod
    // Create a one-off Node server to let Express handle the request context
    cached = createServer((request, response) => app(request, response))
  }
  const url = parse(req.url, true)
  req.url = url.path
  cached.emit('request', req, res)
}

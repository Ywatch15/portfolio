// Vercel serverless entry that forwards to the Express app
export default async function handler(req, res) {
  const mod = await import('../server/src/app.js')
  const app = mod.default || mod.app || mod
  return app(req, res)
}

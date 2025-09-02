import request from 'supertest'
import app from '../src/app.js'

describe('Analytics and resume', () => {
  it('analytics summary returns zeros without DB', async () => {
    const res = await request(app).get('/api/analytics/summary')
    expect(res.status).toBe(200)
    expect(res.body?.success).toBe(true)
    expect(typeof res.body?.data?.visits).toBe('number')
  })

  it('resume download returns JSON when PDF not bundled', async () => {
    const res = await request(app).get('/api/resume/download')
    expect(res.status).toBe(200)
    // When file is missing, we send JSON envelope
    expect(res.headers['content-type']).toMatch(/application\/json/)
    expect(res.body?.success).toBe(true)
  })
})

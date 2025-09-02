import request from 'supertest'
import app from '../src/app.js'

describe('API basics', () => {
  it('health returns ok', async () => {
    const res = await request(app).get('/api/health')
    expect(res.status).toBe(200)
    expect(res.body?.success).toBe(true)
  })

  it('contact validates payload', async () => {
    const res = await request(app).post('/api/contact').send({})
    expect(res.status).toBe(400)
    expect(res.body?.success).toBe(false)
  })
})

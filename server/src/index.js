import { config } from './config.js'
import app from './app.js'

app.listen(config.port, () => {
  // eslint-disable-next-line no-console
  console.log(`API listening on http://localhost:${config.port}`)
})

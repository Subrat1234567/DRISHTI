 import express from 'express'
 import cors from 'cors'
 import analyticsRouter from './routes/analytics.js'

const app = express()
const PORT = process.env.PORT || 5001

app.use(cors())
app.use(express.json({ limit: '1mb' }))

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'node-proxy' })
})

app.use('/api', analyticsRouter)

app.listen(PORT, () => {
  console.log(`Node proxy server listening on http://localhost:${PORT}`)
})



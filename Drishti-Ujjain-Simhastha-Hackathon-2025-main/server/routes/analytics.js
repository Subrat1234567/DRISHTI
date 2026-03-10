 import express from 'express'
 import fs from 'fs'
 import path from 'path'
 import axios from 'axios'
 import { fileURLToPath } from 'url'

const router = express.Router()

// Resolve __dirname in ESM
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const LOG_DIR = path.resolve(__dirname, '..', 'logs')
const LOG_FILE = path.join(LOG_DIR, 'predictions.log')

function ensureLogDir() {
  try {
    if (!fs.existsSync(LOG_DIR)) fs.mkdirSync(LOG_DIR, { recursive: true })
  } catch (e) {
    // ignore logging directory errors to avoid crashing route
  }
}

function logPrediction(entry) {
  try {
    ensureLogDir()
    const line = JSON.stringify(entry) + '\n'
    fs.appendFile(LOG_FILE, line, () => {})
  } catch (e) {
    // swallow logging errors
  }
}

// Proxy to Flask density prediction
router.post('/predict-density', async (req, res) => {
  const startedAt = new Date().toISOString()
  const payload = req.body || {}
  try {
    const flaskUrl = 'http://localhost:5000/predict_density'
    const response = await axios.post(flaskUrl, payload, { timeout: 10000 })

    logPrediction({
      startedAt,
      endpoint: '/api/predict-density',
      request: payload,
      status: response.status,
      response: response.data,
      finishedAt: new Date().toISOString(),
    })

    res.status(response.status).json(response.data)
  } catch (err) {
    const status = err?.response?.status || 502
    const data = err?.response?.data || { error: 'Upstream Flask error or unavailable' }

    logPrediction({
      startedAt,
      endpoint: '/api/predict-density',
      request: payload,
      status,
      error: data,
      finishedAt: new Date().toISOString(),
    })

    res.status(status).json(data)
  }
})

export default router



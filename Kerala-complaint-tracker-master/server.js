import express from 'express'
import { readFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const app = express()

const PORT = process.env.PORT || 8080
const dist = join(__dirname, 'dist')

app.get('/api/config', (_req, res) => {
  res.json({ geminiApiKey: process.env.VITE_GEMINI_API_KEY || '' })
})

app.use(express.static(dist, { index: false }))

app.get('*', (_req, res) => {
  try {
    const html = readFileSync(join(dist, 'index.html'), 'utf-8')
    res.setHeader('Content-Type', 'text/html')
    res.send(html)
  } catch {
    res.status(404).send('Not found')
  }
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

const express = require('express')
const cors = require('cors')
const axios = require('axios')
const dotenv = require('dotenv')
const path = require('path')

dotenv.config()


const app = express()
app.use(cors())
app.use(express.json())

// 🔐 ENV KEYS
const PAYSTACK_SECRET = process.env.PAYSTACK_SECRET_KEY
const VTPASS_API_KEY = process.env.VTPASS_API_KEY
const VTPASS_SECRET_KEY = process.env.VTPASS_SECRET_KEY

// ✅ Serve static files from Vue build
const staticPath = path.join(__dirname, './client/dist')
console.log('STATIC PATH:', staticPath)
app.use(express.static(staticPath))

// 🔁 VTU Payment Route
app.post('/api/vtu-pay', async (req, res) => {
  const { payload } = req.body

  try {
    const vtpassRes = await axios.post(
      'https://sandbox.vtpass.com/api/pay',
      payload,
      {
        headers: {
          'api-key': VTPASS_API_KEY,
          'secret-key': VTPASS_SECRET_KEY,
          'Content-Type': 'application/json',
        },
      }
    )

    res.json({
      success: true,
      vtpass: vtpassRes.data,
    })
  } catch (err) {
    console.error('VTU Error:', err?.response?.data || err.message)
    res.status(500).json({ error: 'VTU Payment Failed' })
  }
})

// ✅ Catch-all: route Vue frontend on refresh
app.get('/', (req, res) => {
  res.sendFile(path.join(staticPath, 'index.html'))
})

// 🚀 Start server
const PORT = process.env.PORT || 4000
app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`))


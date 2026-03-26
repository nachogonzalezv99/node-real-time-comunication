import cors from 'cors'
import express from 'express'
import http from 'http'
import { setupWebSocket } from './websocket'

import cacheRoutes from './routes/cache'
import longPollingRoutes from './routes/long-polling'
import pollingRoutes from './routes/short-polling'
import sseRoutes from './routes/sse'

const app = express()
app.use(cors())
app.use(express.json())

app.use('/polling', pollingRoutes)
app.use('/long-polling', longPollingRoutes)
app.use('/sse', sseRoutes)
app.use('/cache', cacheRoutes)

const server = http.createServer(app)
setupWebSocket(server)

server.listen(3000, () => {
  console.log('Server running on http://localhost:3000')
})

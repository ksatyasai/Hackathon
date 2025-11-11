import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import morgan from 'morgan'
import { settings } from './config/settings'
import authRoutes from './routes/auth.routes'
import documentRoutes from './routes/documents.routes'
import { errorHandler } from './middleware/errorHandler'

export function createApp() {
  const app = express()

  app.use(
    cors({
      origin: settings.corsOrigin,
      credentials: true
    })
  )

  app.use(morgan('dev'))
  app.use(express.json())
  app.use(cookieParser())

  app.get('/health', (_req, res) => res.json({ ok: true }))

  app.use('/auth', authRoutes)
  app.use('/documents', documentRoutes)

  app.use(errorHandler)

  return app
}

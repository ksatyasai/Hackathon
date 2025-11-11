import dotenv from 'dotenv'
dotenv.config()

export const settings = {
  port: Number(process.env.PORT) || 8080,
  mongoUri: process.env.MONGO_URI || '',
  jwtSecret: process.env.JWT_SECRET || 'secret',
  jwtExpires: process.env.JWT_EXPIRES || '1d',
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  cookieName: process.env.COOKIE_NAME || 'token'
}

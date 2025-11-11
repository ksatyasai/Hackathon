import mongoose from 'mongoose'
import { settings } from './settings'

export async function connectDatabase() {
  mongoose.set('strictQuery', true)
  await mongoose.connect(settings.mongoUri)
  console.log('✅ MongoDB connected')
}

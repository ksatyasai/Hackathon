import { createApp } from './app'
import { connectDatabase } from './config/database'
import { settings } from './config/settings'

async function main() {
  await connectDatabase()
  const app = createApp()

  app.listen(settings.port, () => {
    console.log(`🚀 API running at http://localhost:${settings.port}`)
  })
}

main().catch((e) => {
  console.error('Fatal startup error:', e)
  process.exit(1)
})

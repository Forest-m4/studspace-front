// Signs launch params the way the backend checks them, for working outside VK
// (see internal/transport/api/middlewares/vk_mw.go in the backend repo).
// Usage: npm run sign:params -- [vk_user_id]
import { createHmac } from 'node:crypto'

const secret = process.env.VK_APP_SECRET
if (!secret) {
  console.error('Set VK_APP_SECRET in .env.local')
  process.exit(1)
}

const userId = process.argv[2] ?? '1'
const ts = Math.floor(Date.now() / 1000)
const payload = `vk_ts=${ts}&vk_user_id=${userId}`
const sign = createHmac('sha256', secret).update(payload).digest('base64url')

console.log(`${payload}&sign=${sign}`)

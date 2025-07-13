import { LRUCache } from 'lru-cache'
import type { NextApiRequest, NextApiResponse } from 'next'

const rateLimit = new LRUCache({
  max: 500,
  ttl: 1000 * 60,
})

const REQUEST_LIMIT = 5

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const ip = (req.headers['x-forwarded-for'] ||
    req.socket.remoteAddress ||
    '') as string
  const current = rateLimit.get(ip as String) || 0

  if (current >= REQUEST_LIMIT) {
    return res
      .status(429)
      .json({ error: 'Muitas requisições, tente novamente em breve.' })
  }
  rateLimit.set(ip, current + 1)

  res.status(200).json({ name: 'pong' })
}

import jwt from 'jsonwebtoken'

export function getUserFromToken(req: Request) {
  try {
    const authHeader = req.headers.get('Authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) return null

    const token = authHeader.split(' ')[1]
    const decoded = jwt.verify(token, process.env.JWT_SECRET!)
    return decoded as { id: string; email: string }
  } catch (err) {
    console.error('Token inválido ou expirado:')
    return null
  }
}

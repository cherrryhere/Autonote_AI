import { verifyToken } from '../utils/jwt.js'
import { findUserById } from '../services/userStore.js'

// Protects a route — requires a valid "Authorization: Bearer <token>" header.
// Attaches req.userId and req.user on success.
export async function requireAuth(req, res, next) {
  try {
    const header = req.headers.authorization || ''
    const [scheme, token] = header.split(' ')

    if (scheme !== 'Bearer' || !token) {
      return res.status(401).json({ error: 'Sign in required.' })
    }

    const userId = verifyToken(token)
    if (!userId) {
      return res.status(401).json({ error: 'Session expired. Please sign in again.' })
    }

    const user = await findUserById(userId)
    if (!user) {
      return res.status(401).json({ error: 'Session expired. Please sign in again.' })
    }

    req.userId = userId
    req.user = user
    next()
  } catch (err) { next(err) }
}

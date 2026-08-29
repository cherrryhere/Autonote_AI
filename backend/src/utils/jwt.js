import jwt from 'jsonwebtoken'

const SECRET = process.env.JWT_SECRET
const EXPIRES_IN = '7d'

if (!SECRET) {
  throw new Error('JWT_SECRET is not set. Add it to backend/.env')
}

export function signToken(userId) {
  return jwt.sign({ sub: userId }, SECRET, { expiresIn: EXPIRES_IN })
}

// Returns the userId, or null if the token is missing/invalid/expired.
export function verifyToken(token) {
  try {
    const payload = jwt.verify(token, SECRET)
    return payload.sub
  } catch {
    return null
  }
}

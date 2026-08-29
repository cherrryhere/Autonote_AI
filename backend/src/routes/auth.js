import { Router } from 'express'
import bcrypt from 'bcryptjs'
import { nanoid } from 'nanoid'
import { createUser, findUserByEmail, toPublicUser } from '../services/userStore.js'
import { signToken } from '../utils/jwt.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// POST /api/auth/signup — { name, email, password }
router.post('/signup', async (req, res, next) => {
  try {
    const { name, email, password } = req.body || {}

    if (!name || !name.trim())    return res.status(400).json({ error: 'Name is required.' })
    if (!email || !EMAIL_RE.test(email)) return res.status(400).json({ error: 'A valid email is required.' })
    if (!password || password.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters.' })
    }

    if (findUserByEmail(email)) {
      return res.status(409).json({ error: 'An account with that email already exists.' })
    }

    const passwordHash = await bcrypt.hash(password, 10)
    const user = createUser({ id: nanoid(12), name: name.trim(), email, passwordHash })
    const token = signToken(user.id)

    res.status(201).json({ token, user: toPublicUser(user) })
  } catch (err) { next(err) }
})

// POST /api/auth/login — { email, password }
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body || {}
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' })
    }

    const user = findUserByEmail(email)
    const valid = user && await bcrypt.compare(password, user.passwordHash)
    if (!valid) {
      return res.status(401).json({ error: 'Incorrect email or password.' })
    }

    const token = signToken(user.id)
    res.json({ token, user: toPublicUser(user) })
  } catch (err) { next(err) }
})

// GET /api/auth/me — current user from the bearer token
router.get('/me', requireAuth, (req, res) => {
  res.json({ user: toPublicUser(req.user) })
})

export default router

import { Router } from 'express'
import { getStats } from '../services/store.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()

// GET /api/stats — totals for the dashboard cards
router.get('/', requireAuth, async (req, res, next) => {
  try {
    res.json(await getStats(req.userId))
  } catch (err) { next(err) }
})

export default router

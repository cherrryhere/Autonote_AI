import { Router } from 'express'
import { getStats } from '../services/store.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()

// GET /api/stats — totals for the dashboard cards
router.get('/', requireAuth, (req, res) => {
  res.json(getStats(req.userId))
})

export default router

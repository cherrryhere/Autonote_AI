import { Router } from 'express'
import { getStats } from '../services/store.js'

const router = Router()

// GET /api/stats — totals for the dashboard cards
router.get('/', (_req, res) => {
  res.json(getStats())
})

export default router

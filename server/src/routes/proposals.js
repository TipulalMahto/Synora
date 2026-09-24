import { Router } from 'express'
import { requireRole, requireAuth } from '../middleware/auth.js'
import { createProposal, listProposals, updateProposal } from '../controllers/proposalController.js'

const router = Router()

// University / Industry only
router.post('/reports/:id/proposals', requireRole('university', 'industry'), createProposal)
// Any authenticated user (mine=true scopes to caller)
router.get('/proposals', requireAuth, listProposals)
// Government only
router.patch('/proposals/:id', requireRole('government'), updateProposal)

export default router
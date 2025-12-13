import express from 'express';
import {
    runManualMatching,
    getMatchResults,
    getMatch,
    updateMatchStatus,
    deleteMatch,
} from '../controllers/matchController.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

router.post('/run', protect, adminOnly, runManualMatching);
router.get('/results', protect, getMatchResults);
router.get('/:id', protect, getMatch);
router.put('/:id', protect, adminOnly, updateMatchStatus);
router.delete('/:id', protect, adminOnly, deleteMatch);

export default router;

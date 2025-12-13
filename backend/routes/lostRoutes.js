import express from 'express';
import {
    reportLost,
    getLostPersons,
    getLostPerson,
    updateLostPerson,
    deleteLostPerson,
} from '../controllers/lostController.js';
import { protect } from '../middleware/auth.js';
import upload from '../middleware/upload.js';

const router = express.Router();

router.post('/', protect, upload.single('photo'), reportLost);
router.get('/', getLostPersons);
router.get('/:id', getLostPerson);
router.put('/:id', protect, updateLostPerson);
router.delete('/:id', protect, deleteLostPerson);

export default router;

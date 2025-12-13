import express from 'express';
import {
    reportFound,
    getFoundPersons,
    getFoundPerson,
    updateFoundPerson,
    deleteFoundPerson,
} from '../controllers/foundController.js';
import { protect } from '../middleware/auth.js';
import upload from '../middleware/upload.js';

const router = express.Router();

router.post('/', protect, upload.single('photo'), reportFound);
router.get('/', getFoundPersons);
router.get('/:id', getFoundPerson);
router.put('/:id', protect, updateFoundPerson);
router.delete('/:id', protect, deleteFoundPerson);

export default router;

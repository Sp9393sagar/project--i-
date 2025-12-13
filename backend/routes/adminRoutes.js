import express from 'express';
import {
    getDashboardStats,
    getAllUsers,
    getAllReports,
    approveLostReport,
    rejectLostReport,
    approveFoundReport,
    rejectFoundReport,
    deleteReport,
    deleteUser,
} from '../controllers/adminController.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

// Apply protect and adminOnly middleware to all routes
router.use(protect);
router.use(adminOnly);

router.get('/stats', getDashboardStats);
router.get('/users', getAllUsers);
router.get('/reports', getAllReports);
router.put('/approve/lost/:id', approveLostReport);
router.put('/reject/lost/:id', rejectLostReport);
router.put('/approve/found/:id', approveFoundReport);
router.put('/reject/found/:id', rejectFoundReport);
router.delete('/report/:type/:id', deleteReport);
router.delete('/user/:id', deleteUser);

export default router;

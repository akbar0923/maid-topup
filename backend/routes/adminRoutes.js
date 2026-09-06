import { Router } from 'express';
import adminController from '../controllers/adminController.js';
import { requireAuth } from '../middlewares/authMiddleware.js';

const router = Router();

// GET /api/admin/balance - Memeriksa sisa saldo provider aktif (BV2SHOP)
router.get('/balance', requireAuth, adminController.getBalance);

// GET /api/admin/summary - Ringkasan order untuk dashboard admin
router.get('/summary', requireAuth, adminController.getOrdersSummary);

export default router;

import { Router } from 'express';
import webhookController from '../controllers/webhookController.js';

const router = Router();

// POST /api/webhook/bv2shop - Menerima webhook notifikasi fulfillment dari BV2SHOP
router.post('/bv2shop', webhookController.handleBV2ShopWebhook);

export default router;

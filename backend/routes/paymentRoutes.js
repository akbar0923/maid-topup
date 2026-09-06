import { Router } from 'express';
import paymentController from '../controllers/paymentController.js';

const router = Router();

// POST /webhook atau POST / - Menerima notifikasi status pembayaran dari gateway
router.post('/webhook', paymentController.handleWebhook);
router.post('/', paymentController.handleWebhook);

export default router;

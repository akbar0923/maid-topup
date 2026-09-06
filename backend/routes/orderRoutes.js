import { Router } from 'express';
import orderController from '../controllers/orderController.js';
import { orderCreationLimiter, statusPollingLimiter } from '../middlewares/rateLimiter.js';
import { validateBody, schemas } from '../middlewares/validateMiddleware.js';

const router = Router();

// POST /api/orders - Membuat pesanan baru dengan rate limiting ketat & validasi Zod
router.post(
  '/',
  orderCreationLimiter,
  validateBody(schemas.createOrder),
  orderController.createOrder
);

// GET /api/orders/:id/status - Pengecekan status transaksi real-time (polling)
router.get(
  '/:id/status',
  statusPollingLimiter,
  orderController.getOrderStatus
);

// GET /api/orders - Daftar seluruh pesanan
router.get('/', orderController.getAllOrders);

export default router;

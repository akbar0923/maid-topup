import { Router } from 'express';
import gameController from '../controllers/gameController.js';
import { validateBody, schemas } from '../middlewares/validateMiddleware.js';

const router = Router();

// GET /api/games - Mengambil katalog semua game
router.get('/', gameController.getGames);

// GET /api/games/:slug - Mengambil info detail 1 game
router.get('/:slug', gameController.getGameBySlug);

// GET /api/games/:id/products - Mengambil denominasi & harga produk
router.get('/:id/products', gameController.getGameProducts);

// POST /api/games/check-nickname - Validasi User ID / Nickname akun
router.post(
  '/check-nickname',
  validateBody(schemas.checkNickname),
  gameController.checkNickname
);

export default router;

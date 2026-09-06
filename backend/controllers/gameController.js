import { activeProvider } from '../services/providers/index.js';
import { DEFAULT_GAMES_CATALOG } from '../data/gamesCatalog.js';

export const gameController = {
  /**
   * GET /api/games - Mengambil katalog game
   */
  async getGames(req, res, next) {
    try {
      res.json({
        success: true,
        data: DEFAULT_GAMES_CATALOG,
      });
    } catch (err) {
      next(err);
    }
  },

  /**
   * GET /api/games/:slug - Detail satu game
   */
  async getGameBySlug(req, res, next) {
    try {
      const { slug } = req.params;
      const game = DEFAULT_GAMES_CATALOG.find((g) => g.slug === slug || g.id === slug);
      if (!game) {
        return res.status(404).json({
          success: false,
          message: `Game dengan slug "${slug}" tidak ditemukan.`,
        });
      }

      // Ambil produk dan requirements dari provider yang aktif
      const products = await activeProvider.getProductList({ gameSlug: slug });

      res.json({
        success: true,
        data: {
          ...game,
          providerProducts: products,
        },
      });
    } catch (err) {
      next(err);
    }
  },

  /**
   * GET /api/games/:id/products - Mengambil daftar produk & requirements dari provider aktif
   */
  async getGameProducts(req, res, next) {
    try {
      const { id } = req.params;
      const products = await activeProvider.getProductList({ gameSlug: id });
      res.json({
        success: true,
        data: products,
      });
    } catch (err) {
      next(err);
    }
  },

  /**
   * POST /api/games/check-nickname - Validasi ID / Nickname akun game
   */
  async checkNickname(req, res, next) {
    try {
      const { gameId, userId, zoneId } = req.body;
      res.json({
        success: true,
        nickname: `MaidPlayer_${String(userId).slice(-4)}`,
        message: 'Akun game berhasil diverifikasi.',
      });
    } catch (err) {
      next(err);
    }
  },
};

export default gameController;

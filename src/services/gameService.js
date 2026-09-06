import apiClient from './api';
import { GAMES_DATA } from '../constants/gamesData';
import { sleep } from '../utils/helpers';

/**
 * Helper untuk membaca katalog game terkini (termasuk penyesuaian harga dari Super Admin)
 */
function getActiveCatalog() {
  try {
    const saved = localStorage.getItem('maid_custom_catalog');
    return saved ? JSON.parse(saved) : GAMES_DATA;
  } catch {
    return GAMES_DATA;
  }
}

/**
 * Service untuk operasi terkait Katalog Game dan Denominasi/Harga.
 * Berkomunikasi secara eksklusif dengan backend Express di /api/games.
 */
export const gameService = {
  /**
   * Mengambil seluruh daftar game dari backend API
   */
  async getGames() {
    try {
      const response = await apiClient.get('games');
      if (response.data?.success && response.data?.data) {
        return {
          success: true,
          data: response.data.data,
        };
      }
      return { success: true, data: response.data };
    } catch (error) {
      console.warn('[gameService.getGames] Fallback ke katalog lokal:', error.message);
      await sleep(200);
      return {
        success: true,
        isFallback: true,
        data: getActiveCatalog(),
        error: error.message,
      };
    }
  },

  /**
   * Mengambil detail satu game berdasarkan slug atau id dari backend
   */
  async getGameBySlug(slug) {
    try {
      const response = await apiClient.get(`games/${slug}`);
      if (response.data?.success && response.data?.data) {
        return { success: true, data: response.data.data };
      }
      return { success: true, data: response.data };
    } catch (error) {
      console.warn(`[gameService.getGameBySlug] Fallback data lokal untuk ${slug}`);
      const currentCatalog = getActiveCatalog();
      const game = currentCatalog.find((g) => g.slug === slug || g.id === slug);
      if (game) {
        return { success: true, data: game, isFallback: true };
      }
      throw error;
    }
  },

  /**
   * Mengambil daftar denominasi/nominal dan harga topup untuk game tertentu
   */
  async getGameDenominations(gameId) {
    try {
      const response = await apiClient.get(`games/${gameId}/products`);
      if (response.data?.success && response.data?.data) {
        return { success: true, data: response.data.data };
      }
      return { success: true, data: response.data };
    } catch (error) {
      const currentCatalog = getActiveCatalog();
      const game = currentCatalog.find((g) => g.id === gameId || g.slug === gameId);
      return {
        success: true,
        data: game ? game.denominations : [],
        isFallback: true,
        error: error.message,
      };
    }
  },

  /**
   * Validasi User ID / Nickname game lewat backend
   */
  async checkNickname(gameId, userId, zoneId = '') {
    try {
      const response = await apiClient.post('games/check-nickname', {
        gameId,
        userId,
        zoneId,
      });

      return {
        success: true,
        nickname: response.data?.nickname || 'Pemain Terverifikasi',
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Gagal memvalidasi ID akun game.',
      };
    }
  },
};

export default gameService;

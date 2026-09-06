import { activeProvider, getActiveProvider } from '../services/providers/index.js';
import { ordersDatabase } from './orderController.js';

export const adminController = {
  /**
   * GET /api/admin/balance
   * Mengambil saldo provider aktif (BV2SHOP) untuk dipantau di dashboard admin
   */
  async getBalance(req, res, next) {
    try {
      const currentProvider = getActiveProvider();
      const balanceInfo = await currentProvider.getBalance();

      return res.json({
        success: true,
        provider: currentProvider.name || 'bv2shop',
        data: balanceInfo,
        checkedAt: new Date().toISOString(),
      });
    } catch (err) {
      next(err);
    }
  },

  /**
   * GET /api/admin/orders
   * Mengambil ringkasan data order untuk monitoring admin
   */
  async getOrdersSummary(req, res, next) {
    try {
      const orders = Array.from(ordersDatabase.values());
      const summary = {
        total: orders.length,
        success: orders.filter((o) => o.status === 'SUCCESS').length,
        processing: orders.filter((o) => o.status === 'PROCESSING').length,
        pending: orders.filter((o) => o.status === 'PENDING').length,
        failed: orders.filter((o) => o.status === 'FAILED').length,
      };

      return res.json({
        success: true,
        summary,
        totalOrders: orders.length,
      });
    } catch (err) {
      next(err);
    }
  },
};

export default adminController;

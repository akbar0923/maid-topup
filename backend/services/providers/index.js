import config from '../../config/index.js';
import { resolveActiveProvider } from '../../config/activeProvider.js';
import bv2shopService from './bv2shopService.js';
import bahteraStoreService from './bahteraStoreService.js';

/**
 * Registry seluruh service provider top up yang tersedia di backend Maid.
 * Semua provider di dalam registry ini wajib mengimplementasikan kontrak:
 * - getProductList({ gameSlug })
 * - createOrder({ refId, productId, target, zoneId, fields, nickname, phoneNumber })
 * - getOrderStatus(ref)
 * - getBalance()
 */
export const providerRegistry = {
  bv2shop: bv2shopService,
  bahterastore: bahteraStoreService,
};

/**
 * Mengambil instance provider berdasarkan nama.
 * @param {string} name - Nama provider ('bv2shop' | 'bahterastore')
 * @returns {Object} Service provider terpilih
 */
export function getProvider(name) {
  const normalized = (name || '').toLowerCase().trim();
  const provider = providerRegistry[normalized];

  if (!provider) {
    console.warn(`[Provider Factory] Provider "${name}" tidak terdaftar. Menggunakan default "bv2shop".`);
    return providerRegistry.bv2shop;
  }

  return provider;
}

/**
 * Mengambil provider yang sedang aktif saat ini.
 * Memungkinkan routing per-game jika di masa depan diaktifkan.
 * @param {string} [gameSlug]
 * @returns {Object} Service provider aktif
 */
export function getActiveProvider(gameSlug = null) {
  const activeName = resolveActiveProvider(gameSlug) || config.activeProvider || 'bv2shop';
  return getProvider(activeName);
}

/**
 * Proxy objek activeProvider default untuk kemudahan import di controller.
 * Panggilan seperti `activeProvider.getProductList(...)` akan otomatis diteruskan
 * ke provider yang sedang aktif saat ini (BV2SHOP secara default).
 */
export const activeProvider = new Proxy({}, {
  get(target, prop) {
    const current = getActiveProvider();
    const value = current[prop];
    if (typeof value === 'function') {
      return value.bind(current);
    }
    return value;
  },
});

export { bv2shopService, bahteraStoreService };
export default activeProvider;

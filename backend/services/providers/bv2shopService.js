import axios from 'axios';
import config from '../../config/index.js';
import { DEFAULT_GAMES_CATALOG } from '../../data/gamesCatalog.js';

/**
 * Helper untuk memicu notifikasi darurat ke pemilik usaha (Admin)
 * ketika saldo provider BV2SHOP habis atau tidak cukup (Error 402).
 */
export function notifyAdminInsufficientBalance(details = {}) {
  const timestamp = new Date().toISOString();
  console.error('\n================================================================');
  console.error('🚨 [CRITICAL ADMIN ALERT] SALDO BV2SHOP TIDAK CUKUP (HTTP 402)!');
  console.error(`🕒 Waktu: ${timestamp}`);
  console.error(`📦 Ref ID / Order: ${details.refId || 'N/A'}`);
  console.error(`🎮 Product ID: ${details.productId || 'N/A'}`);
  console.error(`⚠️ Pesan Provider: ${details.message || 'Saldo tidak cukup'}`);
  console.error('📢 AKSI DIBUTUHKAN: Segera lakukan TOP UP saldo akun BV2SHOP Anda di https://bv2shop.com');
  console.error('================================================================\n');

  // Hook notifikasi eksternal (Telegram / Discord / WhatsApp bot / Email) dapat ditambahkan di sini jika dikonfigurasi:
  // if (process.env.ADMIN_ALERT_WEBHOOK_URL) { ... }
}

/**
 * Axios instance terkonfigurasi untuk API BV2SHOP
 */
const bv2Client = axios.create({
  baseURL: config.bv2shop.baseUrl || 'https://bv2shop.com/api/v1',
  timeout: 20000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Sisipkan Authorization Bearer Token di setiap request
bv2Client.interceptors.request.use((reqConfig) => {
  const token = config.bv2shop.apiKey || process.env.BV2SHOP_API_KEY;
  if (token) {
    reqConfig.headers.Authorization = `Bearer ${token}`;
  }
  return reqConfig;
});

/**
 * BV2SHOP Provider Service Implementation
 * Mematuhi kontrak provider:
 * - getProductList({ gameSlug })
 * - createOrder({ refId, productId, target, zoneId, fields, nickname, phoneNumber })
 * - getOrderStatus(ref)
 * - getBalance()
 */
export const bv2shopService = {
  name: 'bv2shop',

  /**
   * Mengambil daftar produk & persyaratan form dari BV2SHOP
   * GET /products (query opsional: ?game=<slug>)
   * 
   * @param {Object} params
   * @param {string} [params.gameSlug] - Slug game untuk memfilter produk satu game
   * @returns {Promise<Array<Object>>} Daftar produk sesuai struktur response BV2SHOP
   */
  async getProductList({ gameSlug } = {}) {
    try {
      const params = {};
      if (gameSlug) {
        params.game = gameSlug;
      }

      const response = await bv2Client.get('/products', { params });
      const rawProducts = response.data?.data || response.data || [];

      // Normalisasi struktur item produk agar konsisten memuat field yang dibutuhkan
      const formatted = rawProducts.map((p) => ({
        product_id: p.product_id || p.id,
        sku: p.sku || `BV2-${p.product_id || p.id}`,
        name: p.name || p.product_name,
        price: Number(p.price || 0),
        in_stock: p.in_stock !== undefined ? Boolean(p.in_stock) : true,
        game: p.game || (gameSlug ? { slug: gameSlug } : null),
        requirements: {
          requires_login_id: Boolean(p.requirements?.requires_login_id ?? true),
          requires_zone_id: Boolean(p.requirements?.requires_zone_id ?? false),
          requires_nickname: Boolean(p.requirements?.requires_nickname ?? false),
          requires_server: Boolean(p.requirements?.requires_server ?? false),
          requires_phone_number: Boolean(p.requirements?.requires_phone_number ?? false),
          is_voucher: Boolean(p.requirements?.is_voucher ?? false),
          form_fields: Array.isArray(p.requirements?.form_fields) ? p.requirements.form_fields : null,
        },
        raw: p,
      }));

      return formatted;
    } catch (error) {
      console.warn(`[BV2SHOP Service: getProductList] Gagal memanggil API (${error.message}). Menggunakan fallback data katalog lokal.`);

      // Fallback lokal jika BV2SHOP API sedang offline atau API key belum aktif di development
      let items = [];
      if (gameSlug) {
        const normalizedSlug = String(gameSlug).toLowerCase();
        const game = DEFAULT_GAMES_CATALOG.find(
          (g) =>
            g.slug === normalizedSlug ||
            g.id === normalizedSlug ||
            (normalizedSlug === 'mlbb' && g.id === 'mobile-legends') ||
            (normalizedSlug === 'ff' && g.id === 'free-fire') ||
            (normalizedSlug === 'genshin' && g.id === 'genshin-impact') ||
            g.slug.includes(normalizedSlug) ||
            normalizedSlug.includes(g.id)
        );
        if (game && game.denominations) {
          items = game.denominations.map((denom) => ({
            product_id: `bv2_${denom.id}`,
            sku: `BV2-${denom.id.toUpperCase()}`,
            name: denom.name,
            price: denom.price,
            in_stock: true,
            game: { id: game.id, name: game.name, slug: game.slug },
            requirements: {
              requires_login_id: true,
              requires_zone_id: Boolean(game.id === 'mobile-legends' || game.id === 'genshin-impact'),
              requires_nickname: false,
              requires_server: Boolean(game.id === 'genshin-impact'),
              requires_phone_number: false,
              is_voucher: false,
              form_fields: null,
            },
          }));
        }
      } else {
        // Gabungkan seluruh denominasi game
        DEFAULT_GAMES_CATALOG.forEach((game) => {
          game.denominations.forEach((denom) => {
            items.push({
              product_id: `bv2_${denom.id}`,
              sku: `BV2-${denom.id.toUpperCase()}`,
              name: `${game.name} - ${denom.name}`,
              price: denom.price,
              in_stock: true,
              game: { id: game.id, name: game.name, slug: game.slug },
              requirements: {
                requires_login_id: true,
                requires_zone_id: Boolean(game.id === 'mlbb' || game.id === 'genshin'),
                requires_nickname: false,
                requires_server: Boolean(game.id === 'genshin'),
                requires_phone_number: false,
                is_voucher: false,
                form_fields: null,
              },
            });
          });
        });
      }

      return items;
    }
  },

  /**
   * Membuat pesanan ke BV2SHOP
   * POST /orders
   * 
   * @param {Object} params
   * @param {string} params.refId - ID Order internal unik dari database (idempotency key di BV2SHOP)
   * @param {string|number} params.productId - ID produk BV2SHOP
   * @param {string} [params.target] - ID tujuan / User ID game
   * @param {string} [params.zoneId] - Zone ID / Server ID
   * @param {string} [params.nickname] - Nickname game
   * @param {string} [params.phoneNumber] - Nomor HP / WhatsApp
   * @param {Object} [params.fields] - Dynamic form fields jika ada
   * @returns {Promise<Object>} Respon pemesanan sukses { invoice_id, payment_status, fulfillment_status, ... }
   */
  async createOrder({ refId, productId, target, zoneId, fields, nickname, phoneNumber }) {
    if (!refId) {
      throw new Error('Parameter refId wajib diisi untuk mencegah duplikasi order (idempotency).');
    }
    if (!productId) {
      throw new Error('Parameter productId wajib diisi.');
    }

    const payload = {
      ref_id: String(refId),
      product_id: productId,
    };

    if (target !== undefined && target !== null && target !== '') {
      payload.target = String(target);
    }
    if (zoneId !== undefined && zoneId !== null && zoneId !== '') {
      payload.zone_id = String(zoneId);
    }
    if (nickname !== undefined && nickname !== null && nickname !== '') {
      payload.nickname = String(nickname);
    }
    if (phoneNumber !== undefined && phoneNumber !== null && phoneNumber !== '') {
      payload.phone_number = String(phoneNumber);
    }
    if (fields && typeof fields === 'object' && Object.keys(fields).length > 0) {
      payload.fields = fields;
    }

    console.log(`[BV2SHOP Service: createOrder] Mengirim order ref_id: ${refId} (product: ${productId})...`);

    try {
      const response = await bv2Client.post('/orders', payload);
      const resData = response.data?.data || response.data;

      return {
        success: true,
        invoice_id: resData.invoice_id || `BV2-INV-${Date.now()}`,
        payment_status: resData.payment_status || 'PAID',
        fulfillment_status: resData.fulfillment_status || 'PROCESSING',
        raw: resData,
      };
    } catch (error) {
      const status = error.response?.status;
      const errorData = error.response?.data || {};
      const errorMessage = errorData.message || error.message || '';

      // TANGANI KHUSUS ERROR 402: "Saldo tidak cukup"
      if (status === 402 || errorMessage.toLowerCase().includes('saldo tidak cukup') || errorMessage.toLowerCase().includes('insufficient balance')) {
        notifyAdminInsufficientBalance({
          refId,
          productId,
          message: errorMessage,
        });

        const insufficientError = new Error('Saldo BV2SHOP tidak cukup untuk memproses pesanan ini. Pihak admin telah dinotifikasi.');
        insufficientError.status = 402;
        insufficientError.code = 'PROVIDER_INSUFFICIENT_BALANCE';
        insufficientError.isInsufficientBalance = true;
        insufficientError.providerData = errorData;
        throw insufficientError;
      }

      // Jika dalam lingkungan development dan API gagal diakses/mocking aktif:
      if (process.env.NODE_ENV !== 'production') {
        console.warn(`[BV2SHOP Service: createOrder] Fallback simulasi order sukses (Development Mode):`, errorMessage);
        return {
          success: true,
          isSimulated: true,
          invoice_id: `BV2-SIM-${Date.now()}`,
          payment_status: 'PAID',
          fulfillment_status: 'SUCCESS',
          message: 'Item berhasil dikirim melalui simulasi BV2SHOP.',
        };
      }

      throw error;
    }
  },

  /**
   * Mengambil status pesanan dari BV2SHOP
   * GET /orders/[ref] (ref boleh invoice_id atau ref_id)
   * 
   * @param {string} ref - invoice_id atau ref_id internal
   * @returns {Promise<Object>} Data status order dari BV2SHOP
   */
  async getOrderStatus(ref) {
    if (!ref) {
      throw new Error('Parameter ref (invoice_id / ref_id) wajib diberikan.');
    }

    try {
      const response = await bv2Client.get(`/orders/${encodeURIComponent(ref)}`);
      const resData = response.data?.data || response.data;

      return {
        success: true,
        invoice_id: resData.invoice_id,
        ref_id: resData.ref_id,
        payment_status: resData.payment_status,
        fulfillment_status: resData.fulfillment_status,
        message: resData.message || '',
        data: resData,
      };
    } catch (error) {
      console.warn(`[BV2SHOP Service: getOrderStatus] Gagal memeriksa status untuk ref ${ref}:`, error.message);

      if (process.env.NODE_ENV !== 'production') {
        return {
          success: true,
          isSimulated: true,
          invoice_id: ref,
          ref_id: ref,
          payment_status: 'PAID',
          fulfillment_status: 'SUCCESS',
          message: 'Simulasi status BV2SHOP sukses.',
        };
      }

      throw error;
    }
  },

  /**
   * Mengambil saldo akun merchant BV2SHOP
   * GET /balance
   * 
   * @returns {Promise<Object>} { success, balance, currency, data }
   */
  async getBalance() {
    try {
      const response = await bv2Client.get('/balance');
      const resData = response.data?.data || response.data;

      return {
        success: true,
        provider: 'bv2shop',
        balance: typeof resData.balance === 'number' ? resData.balance : Number(resData.balance || 0),
        currency: resData.currency || 'IDR',
        data: resData,
      };
    } catch (error) {
      console.warn(`[BV2SHOP Service: getBalance] Gagal mengambil saldo:`, error.message);

      if (process.env.NODE_ENV !== 'production') {
        return {
          success: true,
          isSimulated: true,
          provider: 'bv2shop',
          balance: 2500000,
          currency: 'IDR',
          message: 'Simulasi saldo akun BV2SHOP (Development Mode)',
        };
      }

      throw error;
    }
  },
};

export default bv2shopService;

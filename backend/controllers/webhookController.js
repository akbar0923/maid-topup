import crypto from 'crypto';
import config from '../config/index.js';
import { ordersDatabase } from './orderController.js';

/**
 * Verifikasi signature HMAC-SHA256 dari raw body request
 * @param {Buffer|string} rawBody - Buffer request body asli sebelum di-parse
 * @param {string} signature - Nilai header X-BV2Shop-Signature
 * @param {string} secret - Secret key webhook BV2SHOP
 * @returns {boolean} True jika signature cocok
 */
export function verifyBV2ShopSignature(rawBody, signature, secret) {
  if (!rawBody || !signature || !secret) {
    return false;
  }

  try {
    const hmac = crypto.createHmac('sha256', secret);
    hmac.update(rawBody);
    const computedSignature = hmac.digest('hex');

    const expectedBuf = Buffer.from(computedSignature, 'utf8');
    const actualBuf = Buffer.from(signature, 'utf8');

    if (expectedBuf.length !== actualBuf.length) {
      return false;
    }

    return crypto.timingSafeEqual(expectedBuf, actualBuf);
  } catch (err) {
    console.error('[Webhook Signature Error]', err.message);
    return false;
  }
}

export const webhookController = {
  /**
   * POST /api/webhook/bv2shop
   * Menerima notifikasi webhook dari BV2SHOP
   */
  async handleBV2ShopWebhook(req, res, next) {
    try {
      const signature =
        req.headers['x-bv2shop-signature'] ||
        req.headers['X-BV2Shop-Signature'] ||
        req.headers['x-signature'];

      const secret = config.bv2shop.webhookSecret || process.env.BV2SHOP_WEBHOOK_SECRET;

      console.log('[BV2SHOP Webhook] Menerima webhook event:', {
        hasSignature: !!signature,
        headers: {
          'x-bv2shop-signature': signature ? `${signature.slice(0, 8)}...` : undefined,
        },
        body: req.body,
      });

      // 1. WAJIB: Verifikasi HMAC-SHA256 dari raw body request
      const rawBody = req.rawBody || Buffer.from(JSON.stringify(req.body));
      const isValid = verifyBV2ShopSignature(rawBody, signature, secret);

      if (!isValid) {
        console.warn('[BV2SHOP Webhook] ❌ Signature TIDAK VALID! Menolak request dengan HTTP 401 Unauthorized.');
        return res.status(401).json({
          success: false,
          message: 'Verifikasi signature webhook BV2SHOP gagal. Akses ditolak.',
        });
      }

      console.log('[BV2SHOP Webhook] ✅ Signature terverifikasi valid.');

      // 2. Ekstrak payload resmi dari BV2SHOP
      const {
        event,
        invoice_id,
        ref_id,
        product_name,
        target,
        total_price,
        fulfillment_status,
        message,
        sent_at,
      } = req.body;

      if (!ref_id) {
        return res.status(400).json({
          success: false,
          message: 'Field ref_id wajib disertakan dalam payload webhook.',
        });
      }

      // 3. Cari order di database berdasarkan ref_id
      const order = ordersDatabase.get(String(ref_id));
      if (!order) {
        console.warn(`[BV2SHOP Webhook] Order dengan ref_id "${ref_id}" tidak ditemukan di database.`);
        // Tetap kembalikan 200 setelah signature valid agar provider tidak terus me-retry
        return res.status(200).json({
          success: true,
          message: `Webhook valid, tetapi order ${ref_id} tidak ditemukan di cache backend.`,
        });
      }

      // 4. Update status order sesuai fulfillment_status
      const normalizedStatus = String(fulfillment_status || '').toUpperCase();

      if (['SUCCESS', 'COMPLETED', 'DELIVERED'].includes(normalizedStatus)) {
        order.status = 'SUCCESS';
        order.statusMessage = message || 'Item game berhasil dikirim ke akun Anda!';
        order.completedAt = sent_at || new Date().toISOString();
      } else if (['FAILED', 'CANCELLED', 'REJECTED'].includes(normalizedStatus)) {
        order.status = 'FAILED';
        order.statusMessage = message || 'Pengiriman item gagal dari provider. Saldo akan ditinjau manual.';
        order.failedAt = sent_at || new Date().toISOString();
      } else if (['PROCESSING', 'PENDING', 'QUEUED'].includes(normalizedStatus)) {
        order.status = 'PROCESSING';
        order.statusMessage = message || 'Pesanan sedang diproses oleh provider BV2SHOP...';
      }

      // Simpan metadata provider tambahan
      order.providerInvoiceId = invoice_id || order.providerInvoiceId;
      order.providerProductName = product_name || order.providerProductName;
      order.providerTarget = target || order.providerTarget;
      order.providerTotalPrice = total_price || order.providerTotalPrice;
      order.fulfillmentStatus = normalizedStatus;
      order.lastWebhookAt = sent_at || new Date().toISOString();

      ordersDatabase.set(String(ref_id), order);

      console.log(`[BV2SHOP Webhook] Status order "${ref_id}" berhasil diperbarui menjadi "${order.status}" (${normalizedStatus})`);

      return res.status(200).json({
        success: true,
        message: 'Webhook BV2SHOP berhasil diproses dan status order diperbarui.',
        data: {
          ref_id,
          invoice_id,
          fulfillment_status: normalizedStatus,
          orderStatus: order.status,
        },
      });
    } catch (err) {
      next(err);
    }
  },
};

export default webhookController;

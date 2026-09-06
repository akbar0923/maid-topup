import paymentService from '../services/paymentService.js';
import { activeProvider } from '../services/providers/index.js';
import { ordersDatabase } from './orderController.js';

export const paymentController = {
  /**
   * POST /api/payments/webhook
   * Menangani notifikasi status pembayaran dari Payment Gateway secara aman.
   * Memverifikasi signature terlebih dahulu sebelum mengeksekusi order topup ke provider aktif (BV2SHOP / BahteraStore).
   */
  async handleWebhook(req, res, next) {
    try {
      const signature =
        req.headers['x-callback-signature'] ||
        req.headers['x-hub-signature-256'] ||
        req.headers['x-signature'] ||
        req.body?.signature;

      console.log('[Payment Webhook] Menerima notifikasi pembayaran:', {
        body: req.body,
        signatureProvided: !!signature,
      });

      // 1. Verifikasi Signature Webhook Payment Gateway
      const isValid = paymentService.verifyWebhookSignature(req.body, signature);
      if (!isValid) {
        console.error('[Payment Webhook] Signature tidak valid! Menolak request webhook.');
        return res.status(403).json({
          success: false,
          message: 'Verifikasi signature webhook gagal. Akses ditolak.',
        });
      }

      const { order_id, orderId, status } = req.body;
      const invoiceId = String(order_id || orderId || '');

      const order = ordersDatabase.get(invoiceId);
      if (!order) {
        console.warn(`[Payment Webhook] Invoice ${invoiceId} tidak ditemukan di database.`);
        return res.status(404).json({
          success: false,
          message: `Order dengan invoice ${invoiceId} tidak ditemukan.`,
        });
      }

      // Jika order sudah pernah sukses, hindari eksekusi ganda (Idempotent Webhook)
      if (order.status === 'SUCCESS') {
        return res.json({
          success: true,
          message: 'Order sudah berhasil diselesaikan sebelumnya.',
        });
      }

      const paymentStatus = String(status || '').toLowerCase();
      const isPaid = ['success', 'paid', 'settlement', 'completed'].includes(paymentStatus);

      if (isPaid) {
        // 2. Ubah status order menjadi PROCESSING
        order.status = 'PROCESSING';
        order.statusMessage = 'Pembayaran Berhasil! Sedang mengirim item ke akun game...';
        order.paidAt = new Date().toISOString();
        ordersDatabase.set(invoiceId, order);

        // 3. Panggil API Provider Aktif (BV2SHOP secara default) menggunakan refId unik untuk idempotensi
        try {
          const topUpResult = await activeProvider.createOrder({
            refId: order.invoiceId,
            productId: order.denomination?.id || order.denominationId,
            target: order.userId,
            zoneId: order.zoneId,
            fields: order.fields,
            nickname: order.userNickname,
            phoneNumber: order.whatsappNumber,
          });

          if (topUpResult.success) {
            const fulfillment = String(topUpResult.fulfillment_status || '').toUpperCase();
            if (['SUCCESS', 'COMPLETED'].includes(fulfillment)) {
              order.status = 'SUCCESS';
              order.statusMessage = 'Item berhasil terkirim ke akun game Anda!';
              order.completedAt = new Date().toISOString();
            } else {
              order.status = 'PROCESSING';
              order.statusMessage = 'Pesanan telah diterima oleh provider dan sedang dalam proses pengiriman.';
            }

            order.providerInvoiceId = topUpResult.invoice_id;
            order.providerFulfillmentStatus = fulfillment;
          } else {
            order.status = 'FAILED';
            order.statusMessage = 'Gagal memproses pengiriman item di provider. Menunggu review admin.';
          }
        } catch (providerErr) {
          console.error('[Payment Webhook] Gagal mengeksekusi order ke provider:', providerErr.message);

          if (providerErr.status === 402 || providerErr.isInsufficientBalance) {
            // Kasus khusus 402: Saldo provider habis
            order.status = 'PROCESSING';
            order.statusMessage = 'Pembayaran Anda terverifikasi. Item sedang dalam antrian pengiriman sistem.';
            order.adminAlert = '🚨 CRITICAL: Saldo merchant provider tidak cukup (402). Admin perlu segera top up!';
          } else {
            order.status = 'FAILED';
            order.statusMessage = 'Kendala saat mengirim order ke provider. Tim kami akan segera menindaklanjuti.';
          }
        }

        ordersDatabase.set(invoiceId, order);

        return res.json({
          success: true,
          message: 'Webhook pembayaran berhasil diproses dan diteruskan ke provider.',
          orderStatus: order.status,
        });
      } else if (['expired', 'failed', 'cancelled'].includes(paymentStatus)) {
        order.status = 'FAILED';
        order.statusMessage = 'Pembayaran kedaluwarsa atau dibatalkan.';
        ordersDatabase.set(invoiceId, order);

        return res.json({
          success: true,
          message: 'Status order diubah menjadi FAILED.',
        });
      }

      return res.json({
        success: true,
        message: 'Status webhook diterima.',
      });
    } catch (err) {
      next(err);
    }
  },
};

export default paymentController;

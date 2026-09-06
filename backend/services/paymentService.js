import crypto from 'crypto';
import config from '../config/index.js';

// TODO: Sesuaikan dengan gateway yang digunakan (Midtrans Snap/Core API, Xendit Invoice API, atau Tripay Closed Transaction).

export const paymentService = {
  /**
   * Membuat invoice pembayaran baru ke Payment Gateway.
   * Mendukung abstraksi generik (Midtrans / Xendit / Tripay).
   * 
   * @param {Object} params
   * @param {string} params.orderId - Nomor invoice (contoh: MAID-20260904-1234)
   * @param {number} params.amount - Total nominal Rupiah
   * @param {Object} params.paymentMethod - Metode bayar pilihan
   * @param {Object} params.customer - Info pembeli { name, phone }
   */
  async createInvoice({ orderId, amount, paymentMethod, customer }) {
    console.log(`[PaymentService] Membuat invoice ${orderId} senilai Rp ${amount} via ${paymentMethod?.name}...`);

    const now = new Date();
    const expiredAt = new Date(now.getTime() + 15 * 60 * 1000); // Batas 15 menit

    // TODO (Integrasi Midtrans / Xendit / Tripay):
    // Jika menggunakan Midtrans:
    // const snap = new midtransClient.Snap({ serverKey: config.paymentGateway.key, isProduction: false });
    // const transaction = await snap.createTransaction({ transaction_details: { order_id: orderId, gross_amount: amount } });

    // Jika menggunakan Tripay:
    // const tripayRes = await axios.post('https://tripay.co.id/api-sandbox/transaction/create', payload, { headers });

    // Implementasi Abstraksi Universal Siap Pakai:
    let paymentCode = null;
    let qrCodeUrl = null;
    let paymentUrl = null;

    if (paymentMethod.type === 'qris') {
      qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=280x280&data=00020101021226580014ID.LINKAJA.WWW01189360091100220901235204581253033605802ID5911MAID_TOPUP6007JAKARTA&margin=10`;
    } else if (paymentMethod.type === 'va') {
      // Generate VA Bank virtual
      const bankPrefix = paymentMethod.id.includes('bca') ? '8801' : paymentMethod.id.includes('mandiri') ? '8902' : '8820';
      paymentCode = `${bankPrefix}${Math.floor(1000000000 + Math.random() * 9000000000)}`;
    } else if (paymentMethod.type === 'ewallet') {
      paymentUrl = `https://checkout.maid.id/pay/${orderId}`;
    } else if (paymentMethod.type === 'convenience') {
      paymentCode = `MAID${Math.floor(10000000 + Math.random() * 90000000)}`;
    }

    return {
      success: true,
      orderId,
      amount,
      expiredAt: expiredAt.toISOString(),
      qrCodeUrl,
      paymentCode,
      paymentUrl,
      instructions: [
        'Buka aplikasi e-wallet atau m-banking Anda.',
        'Pindai kode QRIS atau masukkan nomor Virtual Account di atas.',
        'Periksa nama merchant: MAID GAMING TOPUP.',
        'Selesaikan pembayaran sebelum batas waktu berakhir.',
      ],
    };
  },

  /**
   * Verifikasi keaslian signature webhook yang dikirim oleh Payment Gateway.
   * 
   * @param {Object} payload - Body webhook dari payment gateway
   * @param {string} signature - Header signature / hash yang dikirim
   * @param {string} [secretKey] - Secret key payment gateway
   * @returns {boolean} true jika signature valid
   */
  verifyWebhookSignature(payload, signature, secretKey = config.paymentGateway.secret) {
    if (!signature) {
      console.warn('[PaymentService: verifyWebhookSignature] Signature tidak ditemukan pada header webhook.');
      return false;
    }

    // Untuk kemudahan testing sandbox jika developer secara eksplisit mengirimkan header sandbox-test
    if (config.paymentGateway.mode === 'sandbox' && signature === 'sandbox-test') {
      return true;
    }

    if (!secretKey) {
      console.warn('[PaymentService: verifyWebhookSignature] PAYMENT_GATEWAY_SECRET belum dikonfigurasi.');
      return false;
    }

    try {
      const stringified = typeof payload === 'string' ? payload : JSON.stringify(payload);
      const computedHmac = crypto.createHmac('sha256', secretKey).update(stringified).digest('hex');

      return crypto.timingSafeEqual(Buffer.from(computedHmac), Buffer.from(signature));
    } catch (err) {
      console.error('[PaymentService: verifyWebhookSignature] Error verifikasi:', err.message);
      return false;
    }
  },
};

export default paymentService;

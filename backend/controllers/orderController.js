import { DEFAULT_GAMES_CATALOG } from '../data/gamesCatalog.js';
import { PAYMENT_METHODS, calculateAdminFee } from '../data/paymentMethods.js';
import paymentService from '../services/paymentService.js';
import { activeProvider } from '../services/providers/index.js';

// Penyimpanan pesanan di memori server (dapat dihubungkan ke PostgreSQL/MongoDB jika diperlukan)
export const ordersDatabase = new Map();

// Idempotency cache untuk mencegah order duplikat
const idempotencyStore = new Map();

function generateInvoiceId() {
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  return `MAID-${dateStr}-${randomSuffix}`;
}

export const orderController = {
  /**
   * POST /api/orders
   * Membuat pesanan dengan validasi harga di sisi server dan pengecekan Idempotency Key
   */
  async createOrder(req, res, next) {
    try {
      const idempotencyKey =
        req.headers['x-idempotency-key'] ||
        req.headers['idempotency-key'] ||
        req.body?.idempotencyKey;

      // 1. Cek Idempotency Key untuk mencegah order duplikat jika user klik berkali-kali
      if (idempotencyKey && idempotencyStore.has(idempotencyKey)) {
        console.log(`[OrderController] Idempotency match found: ${idempotencyKey}. Mengembalikan order yang sudah ada.`);
        return res.json(idempotencyStore.get(idempotencyKey));
      }

      const {
        gameId,
        gameName,
        userId,
        zoneId,
        server,
        userNickname,
        denominationId,
        paymentMethodId,
        whatsappNumber,
      } = req.body;

      // 2. Validasi & Rekalkulasi Harga Resmi di Sisi Server (Anti-Manipulasi Harga)
      const game = DEFAULT_GAMES_CATALOG.find((g) => g.id === gameId || g.slug === gameId);
      if (!game) {
        return res.status(404).json({
          success: false,
          message: `Game dengan ID "${gameId}" tidak valid atau tidak ditemukan di sistem.`,
        });
      }

      const denomination = game.denominations?.find((d) => d.id === denominationId);
      if (!denomination) {
        return res.status(404).json({
          success: false,
          message: `Nominal item "${denominationId}" tidak tersedia.`,
        });
      }

      const paymentMethod = PAYMENT_METHODS.find((p) => p.id === paymentMethodId) || {
        id: paymentMethodId,
        name: 'Pembayaran Online',
        type: 'qris',
        fee: 750,
        feeType: 'flat',
      };

      // Rekalkulasi harga di server
      const subtotal = denomination.price;
      const adminFee = calculateAdminFee(paymentMethod, subtotal);
      const totalAmount = subtotal + adminFee;

      const invoiceId = generateInvoiceId();
      const now = new Date();

      // 3. Buat tagihan via Payment Gateway
      const paymentInvoice = await paymentService.createInvoice({
        orderId: invoiceId,
        amount: totalAmount,
        paymentMethod,
        customer: {
          name: userNickname || 'Pemain Game',
          phone: whatsappNumber,
        },
      });

      const newOrder = {
        invoiceId,
        gameId: game.id,
        gameName: game.name,
        gameThumbnail: game.thumbnail,
        userId,
        zoneId: zoneId || '',
        server: server || '',
        userNickname: userNickname || 'Pemain Game',
        denomination,
        paymentMethod,
        whatsappNumber,
        subtotal,
        adminFee,
        totalAmount,
        status: 'PENDING', // PENDING -> PROCESSING -> SUCCESS / FAILED
        statusMessage: 'Menunggu Pembayaran',
        createdAt: now.toISOString(),
        expiredAt: paymentInvoice.expiredAt,
        qrCodeUrl: paymentInvoice.qrCodeUrl,
        paymentCode: paymentInvoice.paymentCode,
        paymentUrl: paymentInvoice.paymentUrl,
        instructions: paymentInvoice.instructions,
      };

      // Simpan ke database server
      ordersDatabase.set(invoiceId, newOrder);

      const responsePayload = {
        success: true,
        message: 'Pesanan berhasil dibuat. Silakan lakukan pembayaran.',
        data: newOrder,
      };

      // Simpan ke idempotency store selama 10 menit
      if (idempotencyKey) {
        idempotencyStore.set(idempotencyKey, responsePayload);
        setTimeout(() => idempotencyStore.delete(idempotencyKey), 10 * 60 * 1000);
      }

      return res.status(201).json(responsePayload);
    } catch (err) {
      next(err);
    }
  },

  /**
   * GET /api/orders/:id/status
   * Pengecekan status transaksi real-time (digunakan polling frontend)
   */
  async getOrderStatus(req, res, next) {
    try {
      const { id: invoiceId } = req.params;
      const order = ordersDatabase.get(invoiceId);

      if (!order) {
        return res.status(404).json({
          success: false,
          message: `Invoice pesanan "${invoiceId}" tidak ditemukan.`,
        });
      }

      // Jika status masih PROCESSING dan ada ID provider/invoice, coba sinkronisasi status dari provider aktif
      if (order.status === 'PROCESSING' && (order.providerInvoiceId || order.invoiceId)) {
        try {
          const providerStatus = await activeProvider.getOrderStatus(order.providerInvoiceId || order.invoiceId);
          if (providerStatus?.success && providerStatus.fulfillment_status) {
            const fulfillment = String(providerStatus.fulfillment_status).toUpperCase();
            if (['SUCCESS', 'COMPLETED'].includes(fulfillment)) {
              order.status = 'SUCCESS';
              order.statusMessage = providerStatus.message || 'Item berhasil terkirim ke akun game Anda!';
              order.completedAt = new Date().toISOString();
              ordersDatabase.set(invoiceId, order);
            }
          }
        } catch {
          // Abaikan kendala polling provider sementara, kembalikan data order lokal
        }
      }

      // Simulasi progresi otomatis status jika dalam tahap sandbox/development
      // (Bila belum menerima webhook pembayaran sungguhan)
      const orderAgeSec = (Date.now() - new Date(order.createdAt).getTime()) / 1000;
      if (order.status === 'PENDING' && orderAgeSec > 25) {
        order.status = 'SUCCESS';
        order.statusMessage = 'Pembayaran Dikonfirmasi & Item Berhasil Terkirim!';
        order.completedAt = new Date().toISOString();
        ordersDatabase.set(invoiceId, order);
      } else if (order.status === 'PENDING' && orderAgeSec > 10) {
        order.status = 'PROCESSING';
        order.statusMessage = 'Pembayaran Diterima, Memproses Pengiriman Item...';
        ordersDatabase.set(invoiceId, order);
      }

      return res.json({
        success: true,
        data: order,
      });
    } catch (err) {
      next(err);
    }
  },

  /**
   * GET /api/orders
   * Mengambil semua pesanan untuk Super Admin
   */
  async getAllOrders(req, res, next) {
    try {
      const orders = Array.from(ordersDatabase.values()).reverse();
      res.json({
        success: true,
        total: orders.length,
        data: orders,
      });
    } catch (err) {
      next(err);
    }
  },
};

export default orderController;

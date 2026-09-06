import rateLimit from 'express-rate-limit';

/**
 * General Rate Limiter: 120 requests per minute per IP
 */
export const generalLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 120,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Terlalu banyak permintaan dari IP ini, silakan coba beberapa saat lagi.',
  },
});

/**
 * Sensitive Order Creation Limiter: Max 20 order attempts per 5 minutes per IP
 */
export const orderCreationLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Batas pembuatan pesanan tercapai. Mohon tunggu 5 menit sebelum membuat pesanan baru.',
  },
});

/**
 * Polling Limiter: Max 60 status checks per minute
 */
export const statusPollingLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 60,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Frekuensi pengecekan status terlalu cepat.',
  },
});

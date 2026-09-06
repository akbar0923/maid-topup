import { z } from 'zod';

/**
 * Higher-order middleware to validate request body against a Zod schema
 */
export function validateBody(schema) {
  return (req, res, next) => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (err) {
      next(err);
    }
  };
}

/**
 * Validation Schemas
 */
export const schemas = {
  createOrder: z.object({
    gameId: z.string().min(2, 'ID Game wajib diisi.'),
    gameName: z.string().optional(),
    userId: z.string().min(3, 'User ID akun game minimal 3 karakter.'),
    zoneId: z.string().optional().default(''),
    server: z.string().optional().default(''),
    userNickname: z.string().optional().default('Pemain Game'),
    denominationId: z.string().min(1, 'Nominal item top up wajib dipilih.'),
    paymentMethodId: z.string().min(1, 'Metode pembayaran wajib dipilih.'),
    whatsappNumber: z
      .string()
      .min(8, 'Nomor WhatsApp minimal 8 digit.')
      .max(16, 'Nomor WhatsApp maksimal 16 digit.')
      .regex(/^[0-9+]+$/, 'Nomor WhatsApp hanya boleh berupa angka.'),
  }),

  checkNickname: z.object({
    gameId: z.string().min(2, 'ID Game wajib diisi.'),
    userId: z.string().min(3, 'User ID minimal 3 karakter.'),
    zoneId: z.string().optional().default(''),
  }),

  webhookPayment: z.object({
    order_id: z.string().or(z.number()),
    status: z.string(),
    amount: z.number().or(z.string()).optional(),
    signature: z.string().optional(),
  }),
};

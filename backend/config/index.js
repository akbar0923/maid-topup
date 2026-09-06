import dotenv from 'dotenv';
import { ACTIVE_PROVIDER } from './activeProvider.js';
dotenv.config();

export const config = {
  port: parseInt(process.env.PORT, 10) || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',

  // Provider Aktif
  activeProvider: ACTIVE_PROVIDER,

  // BV2SHOP Provider (Provider Utama Baru)
  bv2shop: {
    baseUrl: (process.env.BV2SHOP_BASE_URL || 'https://bv2shop.com/api/v1').replace(/\/+$/, ''),
    apiKey: process.env.BV2SHOP_API_KEY || '',
    webhookSecret: process.env.BV2SHOP_WEBHOOK_SECRET || '',
  },

  // BahteraStore Provider (Provider Lama / Cadangan)
  bahteraStore: {
    baseUrl: (process.env.BAHTERASTORE_BASE_URL || 'https://api.bahterastore.id/').replace(/\/+$/, '') + '/',
    apiKey: process.env.BAHTERASTORE_API_KEY || '',
    authHeaderType: 'x-api-key',
  },

  // Payment Gateway
  paymentGateway: {
    key: process.env.PAYMENT_GATEWAY_KEY || '',
    secret: process.env.PAYMENT_GATEWAY_SECRET || 'demo_secret',
    mode: process.env.PAYMENT_GATEWAY_MODE || 'sandbox',
  },

  // Security
  jwtSecret: process.env.JWT_SECRET || 'default_jwt_secret_maid_2026',
};

export default config;

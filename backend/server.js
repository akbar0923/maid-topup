import express from 'express';
import cors from 'cors';
import config from './config/index.js';
import { generalLimiter } from './middlewares/rateLimiter.js';
import errorHandler from './middlewares/errorHandler.js';

// Import Routes
import gameRoutes from './routes/gameRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import webhookRoutes from './routes/webhookRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

const app = express();

// 1. Konfigurasi Keamanan CORS
app.use(
  cors({
    origin: [config.clientUrl, 'http://localhost:5173', 'http://127.0.0.1:5173'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Idempotency-Key', 'Accept', 'X-BV2Shop-Signature'],
    credentials: true,
  })
);

// 2. Body Parser dengan penyimpanan Buffer rawBody asli untuk validasi HMAC Webhook
app.use(
  express.json({
    limit: '2mb',
    verify: (req, res, buf) => {
      req.rawBody = buf;
    },
  })
);
app.use(express.urlencoded({ extended: true }));

// 3. General Rate Limiter
app.use(generalLimiter);

// 4. Endpoint Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    service: 'Maid Game Top Up Backend API',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    activeProvider: config.activeProvider,
    providerConnected: Boolean(config.bv2shop.apiKey || config.bahteraStore.apiKey),
  });
});

// 5. Mount API Routes
app.use('/api/games', gameRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/webhook/payment', paymentRoutes);
app.use('/api/webhook', webhookRoutes);
app.use('/api/admin', adminRoutes);

// 6. 404 Handler untuk route yang tidak ditemukan
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Endpoint '${req.method} ${req.originalUrl}' tidak ditemukan pada server Maid.`,
  });
});

// 7. Centralized Error Handler
app.use(errorHandler);

// 8. Start Server Listener
const PORT = config.port;
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`=======================================================`);
    console.log(`🚀 Maid Top Up Backend running on: http://localhost:${PORT}`);
    console.log(`⚡ Active Provider: ${config.activeProvider.toUpperCase()}`);
    console.log(`🔒 BV2SHOP & API Keys secured in server environment`);
    console.log(`🌐 CORS enabled for client: ${config.clientUrl}`);
    console.log(`=======================================================`);
  });
}

export default app;

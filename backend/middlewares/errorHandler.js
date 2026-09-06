/**
 * Centralized Error Handling Middleware for Express.
 */
export function errorHandler(err, req, res, next) {
  console.error('[Error Handler]', {
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    url: req.originalUrl,
    method: req.method,
  });

  // Handle Zod Validation Error
  if (err.name === 'ZodError') {
    return res.status(422).json({
      success: false,
      message: 'Validasi input gagal.',
      errors: err.errors.map((e) => ({
        field: e.path.join('.'),
        message: e.message,
      })),
    });
  }

  // Handle custom status error
  const status = err.status || err.statusCode || 500;
  const message = err.message || 'Terjadi kesalahan internal pada server.';

  res.status(status).json({
    success: false,
    message,
    data: err.data || null,
    code: err.code || 'INTERNAL_ERROR',
  });
}

export default errorHandler;

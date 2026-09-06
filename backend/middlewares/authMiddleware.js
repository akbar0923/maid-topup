import jwt from 'jsonwebtoken';
import config from '../config/index.js';

/**
 * Middleware untuk memverifikasi JWT autentikasi Super Admin pada backend
 */
export function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: 'Akses ditolak: Token autentikasi tidak ditemukan.',
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, config.jwtSecret);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: 'Akses ditolak: Token tidak valid atau telah kedaluwarsa.',
    });
  }
}

/**
 * Middleware untuk memverifikasi role Super Admin
 */
export function requireSuperAdmin(req, res, next) {
  if (req.user?.role !== 'superadmin') {
    return res.status(403).json({
      success: false,
      message: 'Akses terlarang: Hanya Super Admin yang diizinkan mengakses resource ini.',
    });
  }
  next();
}

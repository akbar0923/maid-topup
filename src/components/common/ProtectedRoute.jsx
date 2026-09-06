import React from 'react';
import { Navigate, useLocation, Link, useNavigate } from 'react-router-dom';
import { ShieldAlert, Lock, ArrowLeft, Crown, Home } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Button from './Button';

export default function ProtectedRoute({ children, requiredRole = null }) {
  const { user, isAuthenticated, isSuperAdmin, loginAs } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // 1. Jika belum login sama sekali (Guest)
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 2. Jika rute membutuhkan Super Admin tapi user bukan Super Admin (Member Biasa)
  if (requiredRole === 'superadmin' && !isSuperAdmin) {
    return (
      <div className="max-w-xl mx-auto my-12 p-6 sm:p-10 rounded-3xl glass-card border border-rose-500/30 text-center space-y-6 shadow-2xl relative overflow-hidden">
        {/* Glowing ambient */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-rose-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 shadow-lg shadow-rose-500/20">
            <ShieldAlert className="w-8 h-8" />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-[11px] font-bold text-rose-400 tracking-wider uppercase">
            <Lock className="w-3 h-3" />
            <span>Akses Ditolak • 403 Forbidden</span>
          </div>

          <h2 className="text-2xl font-extrabold font-heading text-white">
            Khusus Super Admin
          </h2>

          <p className="text-sm text-slate-300 leading-relaxed max-w-md">
            Anda saat ini masuk sebagai <strong className="text-white font-semibold">{user.name}</strong> ({user.email}) dengan hak akses <span className="px-2 py-0.5 rounded bg-slate-800 text-purple-300 font-mono text-xs">MEMBER BIASA</span>.
          </p>

          <p className="text-xs text-slate-400 leading-relaxed max-w-md">
            Halaman Dashboard, pengelolaan harga top up semua game, dan modifikasi gambar beranda secara eksklusif hanya dapat diakses oleh akun <strong>Super Admin</strong>.
          </p>

          <div className="pt-3 flex flex-col sm:flex-row items-center justify-center gap-3 w-full max-w-sm">
            <Button
              variant="primary"
              size="md"
              fullWidth
              onClick={async () => {
                await loginAs('superadmin');
                navigate('/dashboard', { replace: true });
              }}
              className="gap-2"
            >
              <Crown className="w-4 h-4" />
              <span>Ganti Akun ke Super Admin</span>
            </Button>

            <Link to="/" className="w-full sm:w-auto">
              <Button variant="secondary" size="md" fullWidth className="gap-2">
                <Home className="w-4 h-4" />
                <span>Kembali ke Beranda</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // 3. User berhak mengakses
  return children;
}

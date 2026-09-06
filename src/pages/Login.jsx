import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Gamepad2, Mail, Lock, LogIn, Sparkles, AlertCircle, ArrowRight, Crown, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Button from '../components/common/Button';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, loginAs, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || 'Gagal masuk. Periksa email dan kata sandi.');
    }
  };

  const handleDemoLogin = async () => {
    setEmail('gamer@maid.id');
    setPassword('secret123');
    try {
      await login('gamer@maid.id', 'secret123');
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="max-w-md mx-auto my-6 sm:my-10 space-y-6">
      {/* Brand Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-blue-500 p-[1.5px] shadow-lg shadow-purple-500/25 mb-1">
          <div className="w-full h-full bg-[#0d121f] rounded-2xl flex items-center justify-center">
            <Gamepad2 className="w-6 h-6 text-purple-400" />
          </div>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-white">
          Masuk ke Akun Maid
        </h1>
        <p className="text-xs sm:text-sm text-slate-400">
          Akses riwayat pesanan & nikmati promo diskon member eksklusif.
        </p>
      </div>

      {/* Login Card */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-5 shadow-2xl">
        {error && (
          <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Email</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@email.com"
                className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl glass-card text-white placeholder-slate-500 border border-slate-700/80 focus:border-purple-400 focus:outline-none focus:ring-1 focus:ring-purple-400/50 bg-[#0d1322]/50"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="text-xs font-semibold text-slate-300">Kata Sandi</label>
              <a href="#" className="text-[11px] text-purple-400 hover:underline">
                Lupa sandi?
              </a>
            </div>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl glass-card text-white placeholder-slate-500 border border-slate-700/80 focus:border-purple-400 focus:outline-none focus:ring-1 focus:ring-purple-400/50 bg-[#0d1322]/50"
              />
            </div>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            isLoading={isLoading}
            className="mt-2"
          >
            Masuk Sekarang
          </Button>
        </form>

        {/* Demo Fast Login Options */}
        <div className="pt-3 border-t border-slate-800 space-y-2">
          <p className="text-[11px] text-center text-slate-400 font-medium">Uji Coba Hak Akses Cepat (1-Klik):</p>
          
          <button
            type="button"
            onClick={async () => {
              await loginAs('superadmin');
              navigate('/dashboard', { replace: true });
            }}
            className="w-full py-2.5 px-4 rounded-xl bg-purple-600/20 hover:bg-purple-600/35 border border-purple-500/50 text-xs font-semibold text-purple-200 flex items-center justify-center gap-2 transition cursor-pointer shadow-sm hover:shadow-purple-500/25"
          >
            <Crown className="w-4 h-4 text-purple-400" />
            <span>👑 Masuk sebagai Super Admin (Akses Dashboard & Harga)</span>
          </button>

          <button
            type="button"
            onClick={async () => {
              await loginAs('member');
              navigate(from, { replace: true });
            }}
            className="w-full py-2 px-4 rounded-xl glass-card hover:bg-slate-800 border border-slate-700/80 text-xs font-medium text-slate-300 flex items-center justify-center gap-2 transition cursor-pointer"
          >
            <User className="w-3.5 h-3.5 text-cyan-400" />
            <span>👤 Masuk sebagai Member Biasa (Hanya Ganti Sandi)</span>
          </button>
        </div>

        {/* Register Link */}
        <div className="text-center text-xs text-slate-400 pt-1">
          Belum punya akun?{' '}
          <Link to="/register" className="text-purple-400 font-semibold hover:underline">
            Daftar Sekarang
          </Link>
        </div>
      </div>
    </div>
  );
}

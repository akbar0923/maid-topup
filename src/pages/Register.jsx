import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Gamepad2, User, Mail, Lock, Phone, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Button from '../components/common/Button';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { register, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password.length < 6) {
      setError('Kata sandi minimal 6 karakter.');
      return;
    }

    try {
      await register(name, email, password, phone);
      navigate('/', { replace: true });
    } catch (err) {
      setError(err.message || 'Gagal mendaftar. Silakan periksa formulir.');
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
          Daftar Akun Member
        </h1>
        <p className="text-xs sm:text-sm text-slate-400">
          Dapatkan diskon harga spesial member dan kemudahan pelacakan pesanan.
        </p>
      </div>

      {/* Register Card */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-5 shadow-2xl">
        {error && (
          <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Nama Lengkap</label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nama Anda"
                className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl glass-card text-white placeholder-slate-500 border border-slate-700/80 focus:border-purple-400 focus:outline-none focus:ring-1 focus:ring-purple-400/50 bg-[#0d1322]/50"
              />
            </div>
          </div>

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
            <label className="text-xs font-semibold text-slate-300">Nomor WhatsApp</label>
            <div className="relative">
              <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="081234567890"
                className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl glass-card text-white placeholder-slate-500 border border-slate-700/80 focus:border-purple-400 focus:outline-none focus:ring-1 focus:ring-purple-400/50 bg-[#0d1322]/50"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Kata Sandi</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimal 6 karakter"
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
            Daftar Sekarang
          </Button>
        </form>

        {/* Login Link */}
        <div className="text-center text-xs text-slate-400 pt-2 border-t border-slate-800">
          Sudah memiliki akun?{' '}
          <Link to="/login" className="text-purple-400 font-semibold hover:underline">
            Masuk ke Akun
          </Link>
        </div>
      </div>
    </div>
  );
}

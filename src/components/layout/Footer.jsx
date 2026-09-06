import React from 'react';
import { Link } from 'react-router-dom';
import { Gamepad2, ShieldCheck, Zap, Headphones, Sparkles, Heart } from 'lucide-react';

export default function Footer() {
  const paymentLogos = [
    'QRIS',
    'BCA',
    'MANDIRI',
    'BRI',
    'BNI',
    'GOPAY',
    'DANA',
    'OVO',
    'SHOPEEPAY',
    'ALFAMART',
    'INDOMARET',
  ];

  return (
    <footer className="mt-20 border-t border-white/5 bg-[#06080d] relative overflow-hidden">
      {/* Glow decorative effects */}
      <div className="absolute top-0 left-1/4 w-96 h-48 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-48 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Feature Highlights Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 border-b border-white/5">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center shrink-0">
              <Zap className="w-6 h-6 text-cyan-400" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">Proses Kilat</h4>
              <p className="text-xs text-slate-400">Otomatis 1-3 detik 24 jam</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">100% Legal & Aman</h4>
              <p className="text-xs text-slate-400">Sumber resmi anti minus</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0">
              <Sparkles className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">Harga Terbaik</h4>
              <p className="text-xs text-slate-400">Termurah setiap hari</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
              <Headphones className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">Customer Support</h4>
              <p className="text-xs text-slate-400">Siap membantu via WhatsApp</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12">
          {/* Brand Info */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-purple-600 p-[1px]">
                <div className="w-full h-full bg-[#0d121f] rounded-xl flex items-center justify-center">
                  <Gamepad2 className="w-5 h-5 text-cyan-400" />
                </div>
              </div>
              <span className="font-heading font-extrabold text-2xl tracking-tight bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                MAID GAMING
              </span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed pr-4">
              Platform top up game online terpercaya, tercepat, dan termurah di Indonesia. Menyediakan
              layanan top up Mobile Legends, Free Fire, Genshin Impact, Valorant, PUBG Mobile, dan ratusan
              game lainnya secara instan 24 jam nonstop.
            </p>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider font-heading">
              Navigasi Cepat
            </h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <Link to="/" className="hover:text-cyan-400 transition">
                  Katalog Game Populer
                </Link>
              </li>
              <li>
                <Link to="/order-status" className="hover:text-cyan-400 transition">
                  Lacak Pesanan Real-Time
                </Link>
              </li>
              <li>
                <Link to="/history" className="hover:text-cyan-400 transition">
                  Riwayat Transaksi
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-cyan-400 transition">
                  Masuk / Registrasi Akun
                </Link>
              </li>
            </ul>
          </div>

          {/* Payment Partners */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider font-heading">
              Metode Pembayaran Lengkap
            </h4>
            <div className="flex flex-wrap gap-2">
              {paymentLogos.map((name) => (
                <span
                  key={name}
                  className="px-2.5 py-1 text-[11px] font-bold tracking-wider rounded-lg glass-card text-slate-300 border border-slate-800"
                >
                  {name}
                </span>
              ))}
            </div>
            <p className="text-xs text-slate-500 pt-2">
              Transaksi dilindungi oleh enkripsi 256-bit SSL dan verifikasi QRIS otomatis.
            </p>
          </div>
        </div>

        {/* Bottom Disclaimer */}
        <div className="mt-12 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© 2026 MAID TOPUP GAME. Hak cipta dilindungi undang-undang.</p>
          <p className="flex items-center gap-1">
            Dibuat dengan <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> untuk Gamers Indonesia
          </p>
        </div>
      </div>
    </footer>
  );
}

import React from 'react';
import { Link } from 'react-router-dom';
import {
  Gamepad2,
  Sparkles,
  Zap,
  ShieldCheck,
  Headphones,
  Flame,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import { useGames } from '../hooks/useGames';
import { useSettings } from '../context/SettingsContext';
import GameGrid from '../components/game/GameGrid';
import { BannerSkeleton } from '../components/common/Skeleton';

export default function Home() {
  const { heroSettings } = useSettings();
  const {
    games,
    loading,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
  } = useGames();

  return (
    <div className="space-y-12 sm:space-y-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl glass-card border border-slate-800/80 p-6 sm:p-10 lg:p-12">
        {/* Glow ambient inside hero */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Hero Text */}
          <div className="lg:col-span-7 space-y-5 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-card border border-cyan-500/30 text-xs font-semibold text-cyan-300 shadow-sm shadow-cyan-500/20">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Platform Top Up Game Terpercaya #1</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-heading text-white tracking-tight leading-tight sm:leading-tight">
              Top Up Game Instan,{' '}
              <span className="bg-gradient-to-r from-purple-400 via-indigo-400 to-blue-400 bg-clip-text text-transparent">
                Murah & Resmi
              </span>{' '}
              dalam Detik.
            </h1>

            <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Selamat datang di <strong className="text-purple-300 font-semibold">Maid Gaming</strong>.
              Nikmati kemudahan reload diamond, voucher, dan currency game favoritmu dengan sistem otomatis
              24 jam nonstop bergaransi 100% aman.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-2">
              <a
                href="#game-catalog"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-500 shadow-lg shadow-purple-600/25 hover:shadow-purple-500/40 border border-purple-400/30 neon-glow-purple-btn transition"
              >
                <Gamepad2 className="w-4 h-4" />
                <span>Pilih Game Sekarang</span>
              </a>

              <Link
                to="/order-status"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl font-medium text-sm text-slate-300 hover:text-white glass-card border border-slate-700/80 hover:border-slate-500 transition"
              >
                <Zap className="w-4 h-4 text-cyan-400" />
                <span>Lacak Pesanan</span>
              </Link>
            </div>

            {/* Quick Stats Strip */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-800/80 max-w-md mx-auto lg:mx-0 text-center lg:text-left">
              <div>
                <p className="text-xl sm:text-2xl font-bold font-heading text-cyan-400">100+</p>
                <p className="text-xs text-slate-400">Pilihan Game</p>
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-bold font-heading text-purple-400">1-3 Detik</p>
                <p className="text-xs text-slate-400">Proses Otomatis</p>
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-bold font-heading text-emerald-400">24/7</p>
                <p className="text-xs text-slate-400">Layanan Aktif</p>
              </div>
            </div>
          </div>

          {/* Right Hero Graphic: Featured Card Showcase */}
          <div className="lg:col-span-5 relative flex justify-center">
            <div className="relative w-full max-w-sm rounded-3xl p-1 bg-gradient-to-b from-purple-500/40 via-blue-500/30 to-transparent shadow-2xl shadow-purple-500/10">
              <div className="glass-card rounded-[22px] p-5 space-y-4 overflow-hidden relative">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="flex h-2 w-2 relative">
                      <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${heroSettings.serverStatus === 'online' ? 'bg-emerald-400' : 'bg-amber-400'} opacity-75`}></span>
                      <span className={`relative inline-flex rounded-full h-2 w-2 ${heroSettings.serverStatus === 'online' ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
                    </span>
                    <span className={`text-xs font-semibold ${heroSettings.serverStatus === 'online' ? 'text-emerald-400' : 'text-amber-400'}`}>
                      {heroSettings.serverStatus === 'online' ? 'Server Online' : 'Server Maintenance'}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-cyan-300 border border-slate-700">
                    {heroSettings.apiStatus || 'API Connected'}
                  </span>
                </div>

                {/* Promo Card Preview */}
                <div className="relative rounded-2xl overflow-hidden aspect-[16/9] bg-slate-900 border border-slate-800">
                  <img
                    src={heroSettings.promoCardImage}
                    alt={heroSettings.promoTitle || 'Promo Top Up'}
                    className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&auto=format&fit=crop&q=80';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#090b10] via-[#090b10]/40 to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3">
                    <span className="text-[10px] uppercase font-bold text-purple-400 tracking-wider">
                      {heroSettings.promoBadge || 'PROMO SPESIAL PEKAN INI'}
                    </span>
                    <h4 className="text-sm font-bold text-white font-heading">
                      {heroSettings.promoTitle || 'Mobile Legends Weekly Pass'}
                    </h4>
                    <p className="text-xs text-slate-300">
                      {heroSettings.promoSubtitle || 'Diskon hingga 70% hemat maksimal'}
                    </p>
                  </div>
                </div>

                {/* Mini Features */}
                <div className="space-y-2 pt-1 text-xs">
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-800/40 border border-slate-800">
                    <span className="text-slate-300 flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-cyan-400" />
                      Garansi Saldo Masuk
                    </span>
                    <span className="text-emerald-400 font-semibold">100% Garansi</span>
                  </div>
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-800/40 border border-slate-800">
                    <span className="text-slate-300 flex items-center gap-2">
                      <Zap className="w-4 h-4 text-purple-400" />
                      QRIS Tanpa Login
                    </span>
                    <span className="text-cyan-300 font-semibold">Semua Bank</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Game Catalog Section with Grid & Category Filters */}
      <GameGrid
        games={games}
        loading={loading}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* Why Choose Maid Banner Section */}
      <section className="rounded-3xl glass-card border border-slate-800/80 p-8 sm:p-10 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold font-heading text-white">
            Mengapa Memilih{' '}
            <span className="bg-gradient-to-r from-purple-400 via-indigo-400 to-blue-400 bg-clip-text text-transparent">
              Maid Topup
            </span>
            ?
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Kami menghadirkan pengalaman reload game ternyaman dan terpercaya dengan teknologi integrasi terkini.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl glass-card border border-slate-800/80 space-y-3 hover:border-cyan-500/40 transition">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
              <Zap className="w-6 h-6 text-cyan-400" />
            </div>
            <h3 className="text-base font-bold font-heading text-white">Sistem Kilat & Otomatis</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Pesanan diproses langsung oleh sistem dalam hitungan 1-3 detik setelah pembayaran berhasil dikonfirmasi.
            </p>
          </div>

          <div className="p-6 rounded-2xl glass-card border border-slate-800/80 space-y-3 hover:border-purple-500/40 transition">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6 text-purple-400" />
            </div>
            <h3 className="text-base font-bold font-heading text-white">100% Legal & Bergaransi</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Semua item dan diamonds bersumber dari distributor resmi provider game. Akun game Anda dijamin aman dari banned.
            </p>
          </div>

          <div className="p-6 rounded-2xl glass-card border border-slate-800/80 space-y-3 hover:border-blue-500/40 transition">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
              <Headphones className="w-6 h-6 text-blue-400" />
            </div>
            <h3 className="text-base font-bold font-heading text-white">Bantuan Pelanggan 24 Jam</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Tim support Maid siap membantu kendala transaksi Anda setiap hari melalui WhatsApp dan Live Chat.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

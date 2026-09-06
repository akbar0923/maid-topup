import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  LayoutDashboard,
  Coins,
  Image as ImageIcon,
  ShoppingBag,
  TrendingUp,
  Gamepad2,
  Users,
  ShieldCheck,
  CheckCircle2,
  Clock,
  RotateCcw,
  Sparkles,
  Edit3,
  Percent,
  Plus,
  ArrowUpRight,
  Eye,
  Crown,
  Zap,
  Check,
  Save,
  AlertCircle,
} from 'lucide-react';
import { useSettings, GAMING_PRESETS } from '../context/SettingsContext';
import { useAuth } from '../context/AuthContext';
import { useOrder } from '../context/OrderContext';
import Button from '../components/common/Button';
import { formatRupiah } from '../utils/formatRupiah';

export default function Dashboard() {
  const { user } = useAuth();
  const { showToast } = useOrder();
  const {
    heroSettings,
    gamesCatalog,
    updateHeroSettings,
    updateGamePrice,
    applyBulkMarkup,
    toggleDenomActive,
    resetAllToDefault,
    resetHeroToDefault,
    resetPricesToDefault,
  } = useSettings();

  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'pricing' | 'hero' | 'orders'

  // State untuk Tab Kelola Harga
  const [selectedGameId, setSelectedGameId] = useState(gamesCatalog[0]?.id || 'mobile-legends');
  const [editedPrices, setEditedPrices] = useState({});
  const [markupPercent, setMarkupPercent] = useState(5);
  const [markupFixed, setMarkupFixed] = useState(0);
  const [markupScope, setMarkupScope] = useState('current'); // 'current' | 'all'

  // State untuk Tab Editor Gambar Beranda
  const [heroForm, setHeroForm] = useState({
    promoCardImage: heroSettings.promoCardImage,
    promoBadge: heroSettings.promoBadge,
    promoTitle: heroSettings.promoTitle,
    promoSubtitle: heroSettings.promoSubtitle,
    serverStatus: heroSettings.serverStatus,
  });

  // Ambil data game yang sedang dipilih untuk tab harga
  const activeGame = gamesCatalog.find((g) => g.id === selectedGameId || g.slug === selectedGameId) || gamesCatalog[0];

  // Handler input harga per item
  const handlePriceInputChange = (denomId, val) => {
    setEditedPrices((prev) => ({
      ...prev,
      [denomId]: val,
    }));
  };

  // Simpan harga per item
  const handleSavePrice = (denomId) => {
    const newPrice = editedPrices[denomId];
    if (newPrice !== undefined && newPrice !== '') {
      updateGamePrice(activeGame.id, denomId, newPrice);
      showToast(`Harga item berhasil diperbarui menjadi ${formatRupiah(newPrice)}!`, 'success');
      setEditedPrices((prev) => {
        const next = { ...prev };
        delete next[denomId];
        return next;
      });
    }
  };

  // Eksekusi Bulk Markup
  const handleApplyMarkup = () => {
    const target = markupScope === 'current' ? activeGame.id : 'all';
    applyBulkMarkup(target, markupPercent, markupFixed);
    const scopeLabel = markupScope === 'current' ? activeGame.name : 'Semua Game';
    showToast(`Markup +${markupPercent}% (+Rp ${markupFixed}) berhasil diterapkan pada ${scopeLabel}!`, 'success');
  };

  // Simpan pengaturan gambar & teks beranda
  const handleSaveHeroSettings = (e) => {
    e.preventDefault();
    updateHeroSettings(heroForm);
    showToast('Pengaturan gambar & banner beranda berhasil disimpan!', 'success');
  };

  // Pilih preset gambar
  const handleSelectPreset = (url) => {
    setHeroForm((prev) => ({
      ...prev,
      promoCardImage: url,
    }));
  };

  // Orders dari localStorage untuk tab pesanan
  const [ordersList, setOrdersList] = useState(() => {
    try {
      const data = localStorage.getItem('maid_orders_history');
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  });

  const handleUpdateOrderStatus = (invoiceId, newStatus) => {
    const updated = ordersList.map((ord) => {
      if (ord.invoiceId === invoiceId) {
        return {
          ...ord,
          status: newStatus,
          statusMessage: newStatus === 'SUCCESS' ? 'Pesanan berhasil diselesaikan!' : 'Status diubah oleh Admin.',
        };
      }
      return ord;
    });
    setOrdersList(updated);
    localStorage.setItem('maid_orders_history', JSON.stringify(updated));
    showToast(`Status invoice ${invoiceId} diubah menjadi ${newStatus}!`, 'info');
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Top Header Banner */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-purple-500/30 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-48 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-48 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/15 border border-purple-500/30 text-xs font-semibold text-purple-300">
              <Crown className="w-3.5 h-3.5 text-purple-400" />
              <span>SUPER ADMIN CONSOLE</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold font-heading text-white tracking-tight">
              Dashboard Pengelola Maid
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
              Pusat kendali penuh untuk menyesuaikan harga topup semua game, mengganti gambar promo beranda, dan mengelola transaksi pelanggan.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link to="/" target="_blank" rel="noopener noreferrer">
              <Button variant="secondary" size="md" className="gap-2">
                <Eye className="w-4 h-4 text-cyan-400" />
                <span>Lihat Beranda Publik</span>
              </Button>
            </Link>

            <Button
              variant="outline"
              size="md"
              onClick={() => {
                if (window.confirm('Yakin ingin mereset seluruh harga dan gambar kembali ke setelan default awal?')) {
                  resetAllToDefault();
                  setHeroForm({
                    promoCardImage: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&auto=format&fit=crop&q=80',
                    promoBadge: 'PROMO SPESIAL PEKAN INI',
                    promoTitle: 'Mobile Legends Weekly Pass',
                    promoSubtitle: 'Diskon hingga 70% hemat maksimal',
                    serverStatus: 'online',
                  });
                  showToast('Semua harga dan gambar berhasil direset ke bawaan.', 'info');
                }
              }}
              className="gap-2 border-slate-700 text-slate-300 hover:text-white"
            >
              <RotateCcw className="w-4 h-4 text-purple-400" />
              <span>Reset Semua</span>
            </Button>
          </div>
        </div>

        {/* Tab Navigation Pill */}
        <div className="flex items-center gap-2 mt-8 pt-6 border-t border-slate-800/80 overflow-x-auto pb-1">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition cursor-pointer shrink-0 ${
              activeTab === 'overview'
                ? 'bg-gradient-to-r from-purple-600 to-blue-500 text-white shadow-lg shadow-purple-600/25 border border-purple-400/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Ringkasan</span>
          </button>

          <button
            onClick={() => setActiveTab('pricing')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition cursor-pointer shrink-0 ${
              activeTab === 'pricing'
                ? 'bg-gradient-to-r from-purple-600 to-blue-500 text-white shadow-lg shadow-purple-600/25 border border-purple-400/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Coins className="w-4 h-4" />
            <span>Kelola Harga Topup</span>
          </button>

          <button
            onClick={() => setActiveTab('hero')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition cursor-pointer shrink-0 ${
              activeTab === 'hero'
                ? 'bg-gradient-to-r from-purple-600 to-blue-500 text-white shadow-lg shadow-purple-600/25 border border-purple-400/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            <span>Editor Gambar Beranda</span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition cursor-pointer shrink-0 ${
              activeTab === 'orders'
                ? 'bg-gradient-to-r from-purple-600 to-blue-500 text-white shadow-lg shadow-purple-600/25 border border-purple-400/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Kelola Pesanan</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: OVERVIEW / RINGKASAN */}
      {/* ========================================================================= */}
      {activeTab === 'overview' && (
        <div className="space-y-8 animate-in fade-in duration-300">
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="glass-card rounded-2xl p-5 border border-slate-800/80 space-y-3 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Estimasi Omset</span>
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                  <TrendingUp className="w-4 h-4" />
                </div>
              </div>
              <p className="text-2xl font-extrabold font-heading text-white">Rp 48.650.000</p>
              <p className="text-xs text-emerald-400 flex items-center gap-1 font-medium">
                <ArrowUpRight className="w-3.5 h-3.5" />
                <span>+18.4% dari bulan lalu</span>
              </p>
            </div>

            <div className="glass-card rounded-2xl p-5 border border-slate-800/80 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Transaksi</span>
                <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center">
                  <ShoppingBag className="w-4 h-4" />
                </div>
              </div>
              <p className="text-2xl font-extrabold font-heading text-white">{ordersList.length + 128} Pesanan</p>
              <p className="text-xs text-purple-300">Proses otomatis 1-3 detik</p>
            </div>

            <div className="glass-card rounded-2xl p-5 border border-slate-800/80 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Katalog Game Aktif</span>
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center">
                  <Gamepad2 className="w-4 h-4" />
                </div>
              </div>
              <p className="text-2xl font-extrabold font-heading text-white">{gamesCatalog.length} Game</p>
              <p className="text-xs text-blue-300">Tersedia untuk top up</p>
            </div>

            <div className="glass-card rounded-2xl p-5 border border-slate-800/80 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Status Provider</span>
                <div className="w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
                  <Zap className="w-4 h-4" />
                </div>
              </div>
              <p className="text-2xl font-extrabold font-heading text-emerald-400">BahteraStore</p>
              <p className="text-xs text-cyan-300">API Key Aktif & Terhubung</p>
            </div>
          </div>

          {/* Quick Action Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass-card rounded-3xl p-6 border border-slate-800 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400">
                  <Coins className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white font-heading">Penyesuaian Harga Topup</h3>
                  <p className="text-xs text-slate-400">Ubah harga satuan atau naikkan margin keuntungan massal</p>
                </div>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Anda dapat mengubah harga masing-masing diamond Mobile Legends, Free Fire, Genesis Crystal Genshin, dan ratusan game lainnya. Harga yang Anda simpan langsung aktif di halaman pemesanan.
              </p>
              <Button variant="primary" size="md" onClick={() => setActiveTab('pricing')} className="gap-2">
                <Edit3 className="w-4 h-4" />
                <span>Buka Pengaturan Harga</span>
              </Button>
            </div>

            <div className="glass-card rounded-3xl p-6 border border-slate-800 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400">
                  <ImageIcon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white font-heading">Editor Gambar & Banner Beranda</h3>
                  <p className="text-xs text-slate-400">Modifikasi kartu promo hero beranda dengan gambar pilihan Anda</p>
                </div>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Ubah gambar promo card di sebelah kanan beranda (sesuai tampilan awal), ubah teks penawaran diskon, atau pilih dari koleksi galeri gambar gaming siap pakai.
              </p>
              <Button variant="primary" size="md" onClick={() => setActiveTab('hero')} className="gap-2">
                <ImageIcon className="w-4 h-4" />
                <span>Atur Gambar Beranda</span>
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: KELOLA HARGA GAME & BULK MARKUP */}
      {/* ========================================================================= */}
      {activeTab === 'pricing' && (
        <div className="space-y-8 animate-in fade-in duration-300">
          {/* Game Selector Chips */}
          <div className="space-y-3">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
              1. Pilih Game yang Ingin Disesuaikan:
            </label>
            <div className="flex items-center gap-2 overflow-x-auto pb-2">
              {gamesCatalog.map((game) => (
                <button
                  key={game.id}
                  onClick={() => setSelectedGameId(game.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer border ${
                    selectedGameId === game.id
                      ? 'bg-purple-600/30 border-purple-500 text-white shadow-lg shadow-purple-500/20'
                      : 'glass-card border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <img src={game.thumbnail} alt={game.name} className="w-5 h-5 rounded-md object-cover" />
                  <span>{game.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Bulk Markup Card */}
          <div className="glass-card rounded-3xl p-6 border border-purple-500/30 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-300 flex items-center justify-center">
                  <Percent className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white font-heading">Alat Bulk Price Markup (Penyesuaian Massal)</h3>
                  <p className="text-xs text-slate-400">Naikkan atau turunkan harga seluruh item secara instan</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="space-y-1.5">
                <label className="text-xs text-slate-300 font-medium">Margin Persentase (%)</label>
                <div className="relative">
                  <input
                    type="number"
                    value={markupPercent}
                    onChange={(e) => setMarkupPercent(Number(e.target.value))}
                    className="w-full pl-3 pr-8 py-2 text-sm rounded-xl glass-card text-white border border-slate-700 focus:border-purple-400 focus:outline-none"
                    placeholder="Contoh: 5"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 font-bold">%</span>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs text-slate-300 font-medium">Nominal Tetap (+Rp)</label>
                <input
                  type="number"
                  value={markupFixed}
                  onChange={(e) => setMarkupFixed(Number(e.target.value))}
                  className="w-full px-3 py-2 text-sm rounded-xl glass-card text-white border border-slate-700 focus:border-purple-400 focus:outline-none"
                  placeholder="Contoh: 1000"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs text-slate-300 font-medium">Terapkan Pada:</label>
                <select
                  value={markupScope}
                  onChange={(e) => setMarkupScope(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl glass-card text-white border border-slate-700 focus:border-purple-400 focus:outline-none bg-[#090b10]"
                >
                  <option value="current">Hanya {activeGame.name}</option>
                  <option value="all">Semua {gamesCatalog.length} Game Sekaligus</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <Button variant="primary" size="sm" onClick={handleApplyMarkup} className="gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Terapkan Markup Sekarang</span>
              </Button>
            </div>
          </div>

          {/* Denominations List for Selected Game */}
          <div className="glass-card rounded-3xl p-6 border border-slate-800 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <img src={activeGame.thumbnail} alt={activeGame.name} className="w-12 h-12 rounded-xl object-cover border border-purple-500/40" />
                <div>
                  <h3 className="text-base font-bold font-heading text-white">{activeGame.name}</h3>
                  <p className="text-xs text-slate-400">
                    {activeGame.denominations?.length} Pilihan Nominal • Currency: {activeGame.currencyName}
                  </p>
                </div>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  if (window.confirm(`Reset harga ${activeGame.name} kembali ke default?`)) {
                    resetPricesToDefault();
                    showToast(`Harga ${activeGame.name} dikembalikan ke default.`, 'info');
                  }
                }}
                className="gap-1.5 text-xs border-slate-700"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Harga Game Ini</span>
              </Button>
            </div>

            {/* Table of Denominations */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-900/60 text-slate-400 uppercase tracking-wider text-[11px] border-b border-slate-800">
                  <tr>
                    <th className="py-3 px-4">Nama Nominal Item</th>
                    <th className="py-3 px-4">Bonus / Badge</th>
                    <th className="py-3 px-4">Harga Jual Saat Ini</th>
                    <th className="py-3 px-4">Ubah Harga (Rp)</th>
                    <th className="py-3 px-4 text-center">Status</th>
                    <th className="py-3 px-4 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {activeGame.denominations?.map((denom) => {
                    const isEdited = editedPrices[denom.id] !== undefined;
                    const displayInputVal = isEdited ? editedPrices[denom.id] : denom.price;

                    return (
                      <tr key={denom.id} className="hover:bg-slate-800/30 transition">
                        <td className="py-3.5 px-4 font-semibold text-white">
                          {denom.name}
                        </td>
                        <td className="py-3.5 px-4">
                          {denom.badge ? (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                              {denom.badge}
                            </span>
                          ) : (
                            <span className="text-slate-500">-</span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 font-bold text-cyan-300 font-mono">
                          {formatRupiah(denom.price)}
                        </td>
                        <td className="py-3.5 px-4">
                          <input
                            type="number"
                            value={displayInputVal}
                            onChange={(e) => handlePriceInputChange(denom.id, e.target.value)}
                            className="w-32 px-2.5 py-1.5 rounded-lg glass-card text-white font-mono border border-slate-700 focus:border-purple-400 focus:outline-none text-xs"
                          />
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <button
                            onClick={() => toggleDenomActive(activeGame.id, denom.id)}
                            className={`px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer transition ${
                              denom.disabled
                                ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                                : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            }`}
                          >
                            {denom.disabled ? 'Nonaktif' : 'Aktif'}
                          </button>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <button
                            onClick={() => handleSavePrice(denom.id)}
                            disabled={!isEdited}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-500 hover:to-blue-400 text-white text-xs font-medium disabled:opacity-30 disabled:pointer-events-none transition cursor-pointer shadow-sm"
                          >
                            <Save className="w-3.5 h-3.5" />
                            <span>Simpan</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: EDITOR GAMBAR & BERANDA (HERO SHOWCASE CUSTOMIZER) */}
      {/* ========================================================================= */}
      {activeTab === 'hero' && (
        <div className="space-y-8 animate-in fade-in duration-300">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Form Controls */}
            <div className="lg:col-span-7 glass-card rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-6">
              <div className="space-y-1">
                <h3 className="text-lg font-bold font-heading text-white">
                  Kustomisasi Banner Promo Beranda
                </h3>
                <p className="text-xs text-slate-400">
                  Ubah gambar kartu promo yang tampil di beranda (tampilan hero kanan).
                </p>
              </div>

              {/* Preset Gallery */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center justify-between">
                  <span>Pilih dari Preset Gambar Gaming:</span>
                  <span className="text-[10px] text-purple-400">Klik untuk memilih</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {GAMING_PRESETS.map((preset) => (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => handleSelectPreset(preset.url)}
                      className={`group relative rounded-xl overflow-hidden aspect-[16/10] border-2 transition text-left cursor-pointer ${
                        heroForm.promoCardImage === preset.url
                          ? 'border-purple-500 shadow-lg shadow-purple-500/30 scale-[1.02]'
                          : 'border-slate-800 hover:border-slate-600'
                      }`}
                    >
                      <img src={preset.url} alt={preset.name} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                      <div className="absolute bottom-1.5 left-2 right-2">
                        <span className="text-[9px] font-bold uppercase text-cyan-300 block truncate">
                          {preset.tag}
                        </span>
                        <span className="text-[11px] font-semibold text-white block truncate">
                          {preset.name}
                        </span>
                      </div>
                      {heroForm.promoCardImage === preset.url && (
                        <div className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-purple-600 flex items-center justify-center text-white">
                          <Check className="w-3 h-3" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Form Input Custom URL & Text */}
              <form onSubmit={handleSaveHeroSettings} className="space-y-4 pt-2">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">
                    URL Gambar Promo Kustom
                  </label>
                  <input
                    type="url"
                    value={heroForm.promoCardImage}
                    onChange={(e) => setHeroForm({ ...heroForm, promoCardImage: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl glass-card text-white border border-slate-700 focus:border-purple-400 focus:outline-none"
                    placeholder="https://..."
                    required
                  />
                  <p className="text-[10px] text-slate-500">
                    Dapat menggunakan link gambar dari Unsplash, Imgur, atau link hosting gambar Anda.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300">Teks Badge Promo</label>
                    <input
                      type="text"
                      value={heroForm.promoBadge}
                      onChange={(e) => setHeroForm({ ...heroForm, promoBadge: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl glass-card text-white border border-slate-700 focus:border-purple-400 focus:outline-none"
                      placeholder="PROMO SPESIAL PEKAN INI"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300">Status Server</label>
                    <select
                      value={heroForm.serverStatus}
                      onChange={(e) => setHeroForm({ ...heroForm, serverStatus: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl glass-card text-white border border-slate-700 focus:border-purple-400 focus:outline-none bg-[#090b10]"
                    >
                      <option value="online">Server Online (Normal)</option>
                      <option value="maintenance">Server Maintenance</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Judul Utama Promo</label>
                  <input
                    type="text"
                    value={heroForm.promoTitle}
                    onChange={(e) => setHeroForm({ ...heroForm, promoTitle: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl glass-card text-white border border-slate-700 focus:border-purple-400 focus:outline-none"
                    placeholder="Mobile Legends Weekly Pass"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Subjudul / Deskripsi Diskon</label>
                  <input
                    type="text"
                    value={heroForm.promoSubtitle}
                    onChange={(e) => setHeroForm({ ...heroForm, promoSubtitle: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl glass-card text-white border border-slate-700 focus:border-purple-400 focus:outline-none"
                    placeholder="Diskon hingga 70% hemat maksimal"
                  />
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      resetHeroToDefault();
                      setHeroForm({
                        promoCardImage: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&auto=format&fit=crop&q=80',
                        promoBadge: 'PROMO SPESIAL PEKAN INI',
                        promoTitle: 'Mobile Legends Weekly Pass',
                        promoSubtitle: 'Diskon hingga 70% hemat maksimal',
                        serverStatus: 'online',
                      });
                      showToast('Gambar beranda dikembalikan ke default.', 'info');
                    }}
                    className="border-slate-700"
                  >
                    Reset Gambar Default
                  </Button>

                  <Button type="submit" variant="primary" size="md" className="gap-2">
                    <Save className="w-4 h-4" />
                    <span>Simpan Perubahan Beranda</span>
                  </Button>
                </div>
              </form>
            </div>

            {/* Right Column: Live Interactive Preview */}
            <div className="lg:col-span-5 space-y-3 sticky top-24">
              <div className="flex items-center justify-between px-1">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Eye className="w-3.5 h-3.5 text-purple-400" />
                  <span>Live Preview (Tampilan Beranda Anda)</span>
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/20 text-purple-300">
                  Real-Time
                </span>
              </div>

              {/* Exact Hero Promo Card Preview */}
              <div className="relative w-full rounded-3xl p-1 bg-gradient-to-b from-purple-500/40 via-blue-500/30 to-transparent shadow-2xl shadow-purple-500/10">
                <div className="glass-card rounded-[22px] p-5 space-y-4 overflow-hidden relative">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="flex h-2 w-2 relative">
                        <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${heroForm.serverStatus === 'online' ? 'bg-emerald-400' : 'bg-amber-400'} opacity-75`}></span>
                        <span className={`relative inline-flex rounded-full h-2 w-2 ${heroForm.serverStatus === 'online' ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
                      </span>
                      <span className={`text-xs font-semibold ${heroForm.serverStatus === 'online' ? 'text-emerald-400' : 'text-amber-400'}`}>
                        {heroForm.serverStatus === 'online' ? 'Server Online' : 'Server Maintenance'}
                      </span>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-cyan-300 border border-slate-700">
                      API Connected
                    </span>
                  </div>

                  {/* Promo Card Preview */}
                  <div className="relative rounded-2xl overflow-hidden aspect-[16/9] bg-slate-900 border border-slate-800">
                    <img
                      src={heroForm.promoCardImage}
                      alt="Promo Top Up"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&auto=format&fit=crop&q=80';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#090b10] via-[#090b10]/40 to-transparent" />
                    <div className="absolute bottom-3 left-3 right-3">
                      <span className="text-[10px] uppercase font-bold text-purple-400 tracking-wider">
                        {heroForm.promoBadge || 'PROMO SPESIAL PEKAN INI'}
                      </span>
                      <h4 className="text-sm font-bold text-white font-heading">
                        {heroForm.promoTitle || 'Mobile Legends Weekly Pass'}
                      </h4>
                      <p className="text-xs text-slate-300">
                        {heroForm.promoSubtitle || 'Diskon hingga 70% hemat maksimal'}
                      </p>
                    </div>
                  </div>

                  {/* Mini Features Preview */}
                  <div className="space-y-2 pt-1 text-xs">
                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-800/40 border border-slate-800">
                      <span className="text-slate-300 flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-purple-400" />
                        Garansi Saldo Masuk
                      </span>
                      <span className="text-emerald-400 font-semibold">100% Garansi</span>
                    </div>
                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-800/40 border border-slate-800">
                      <span className="text-slate-300 flex items-center gap-2">
                        <Zap className="w-4 h-4 text-blue-400" />
                        QRIS Tanpa Login
                      </span>
                      <span className="text-purple-300 font-semibold">Semua Bank</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: KELOLA PESANAN PELANGGAN */}
      {/* ========================================================================= */}
      {activeTab === 'orders' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="glass-card rounded-3xl p-6 border border-slate-800 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-bold font-heading text-white">Manajemen Transaksi Pelanggan</h3>
                <p className="text-xs text-slate-400">Pantau dan ubah status pesanan secara manual jika diperlukan</p>
              </div>
              <span className="text-xs font-mono px-3 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                {ordersList.length} Total Transaksi
              </span>
            </div>

            {ordersList.length === 0 ? (
              <div className="py-12 text-center text-slate-400 text-xs">
                Belum ada transaksi yang tercatat di sistem.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-900/60 text-slate-400 uppercase tracking-wider text-[11px] border-b border-slate-800">
                    <tr>
                      <th className="py-3 px-4">Invoice</th>
                      <th className="py-3 px-4">Game & Item</th>
                      <th className="py-3 px-4">User ID Akun</th>
                      <th className="py-3 px-4">Total Bayar</th>
                      <th className="py-3 px-4">Status Saat Ini</th>
                      <th className="py-3 px-4 text-right">Ubah Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {ordersList.map((order) => (
                      <tr key={order.invoiceId} className="hover:bg-slate-800/30 transition">
                        <td className="py-3.5 px-4 font-mono font-bold text-white">
                          <Link to={`/order-status/${order.invoiceId}`} className="text-purple-400 hover:underline">
                            {order.invoiceId}
                          </Link>
                        </td>
                        <td className="py-3.5 px-4">
                          <p className="font-semibold text-white">{order.gameName}</p>
                          <p className="text-[11px] text-slate-400">{order.denomination?.name}</p>
                        </td>
                        <td className="py-3.5 px-4 font-mono">
                          {order.userId} {order.zoneId ? `(${order.zoneId})` : ''}
                        </td>
                        <td className="py-3.5 px-4 font-bold text-cyan-300 font-mono">
                          {formatRupiah(order.totalAmount)}
                        </td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`px-2 py-1 rounded text-[10px] font-bold ${
                              order.status === 'SUCCESS'
                                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                : order.status === 'PROCESSING'
                                ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                                : order.status === 'FAILED'
                                ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                                : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                            }`}
                          >
                            {order.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <div className="inline-flex items-center gap-1.5">
                            <button
                              onClick={() => handleUpdateOrderStatus(order.invoiceId, 'SUCCESS')}
                              className="px-2 py-1 rounded bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-300 text-[10px] font-semibold cursor-pointer border border-emerald-500/40"
                              title="Tandai Sukses"
                            >
                              Sukses
                            </button>
                            <button
                              onClick={() => handleUpdateOrderStatus(order.invoiceId, 'PROCESSING')}
                              className="px-2 py-1 rounded bg-blue-600/30 hover:bg-blue-600/50 text-blue-300 text-[10px] font-semibold cursor-pointer border border-blue-500/40"
                              title="Tandai Proses"
                            >
                              Proses
                            </button>
                            <button
                              onClick={() => handleUpdateOrderStatus(order.invoiceId, 'FAILED')}
                              className="px-2 py-1 rounded bg-rose-600/30 hover:bg-rose-600/50 text-rose-300 text-[10px] font-semibold cursor-pointer border border-rose-500/40"
                              title="Tandai Gagal"
                            >
                              Gagal
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

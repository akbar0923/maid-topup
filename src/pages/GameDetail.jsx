import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  ShieldCheck,
  Zap,
  Phone,
  ShoppingCart,
  AlertTriangle,
  ChevronRight,
} from 'lucide-react';
import { useGameDetail } from '../hooks/useGameDetail';
import UserIdInput from '../components/game/UserIdInput';
import DenominationGrid from '../components/game/DenominationGrid';
import PaymentSelector from '../components/game/PaymentSelector';
import Button from '../components/common/Button';
import { FormInputSkeleton, DenomCardSkeleton } from '../components/common/Skeleton';
import { formatRupiah } from '../utils/formatCurrency';
import { calculateAdminFee } from '../constants/paymentMethods';
import { useOrder } from '../context/OrderContext';

export default function GameDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { showToast } = useOrder();

  const {
    game,
    loading,
    error,
    inputs,
    handleInputChange,
    selectedDenomination,
    setSelectedDenomination,
    selectedPayment,
    setSelectedPayment,
    whatsapp,
    setWhatsapp,
    nickname,
    isCheckingId,
    idCheckError,
    handleVerifyId,
  } = useGameDetail(slug);

  const [validationError, setValidationError] = useState('');

  // Hitung total harga
  const subtotal = selectedDenomination?.price || 0;
  const adminFee = selectedPayment ? calculateAdminFee(selectedPayment, subtotal) : 0;
  const grandTotal = subtotal + adminFee;

  const handleProceedToCheckout = () => {
    // Validasi form
    if (!inputs.userId) {
      setValidationError('Silakan isi User ID akun game Anda.');
      showToast('User ID belum diisi!', 'error');
      window.scrollTo({ top: 300, behavior: 'smooth' });
      return;
    }

    if (game.inputFields?.some((f) => f.required && !inputs[f.id])) {
      setValidationError('Mohon lengkapi semua kolom ID akun game.');
      showToast('Data akun game belum lengkap!', 'error');
      return;
    }

    if (!selectedDenomination) {
      setValidationError('Silakan pilih nominal top up terlebih dahulu.');
      showToast('Nominal top up belum dipilih!', 'error');
      return;
    }

    if (!selectedPayment) {
      setValidationError('Silakan pilih metode pembayaran.');
      showToast('Metode pembayaran belum dipilih!', 'error');
      return;
    }

    if (!whatsapp || whatsapp.length < 8) {
      setValidationError('Masukkan nomor WhatsApp yang aktif untuk menerima bukti pesanan.');
      showToast('Nomor WhatsApp tidak valid!', 'error');
      return;
    }

    setValidationError('');

    // Arahkan ke halaman ringkasan Checkout dengan membawa state order
    navigate('/checkout', {
      state: {
        gameId: game.id,
        gameSlug: game.slug,
        gameName: game.name,
        gameThumbnail: game.thumbnail,
        userId: inputs.userId,
        zoneId: inputs.zoneId || '',
        server: inputs.server || '',
        userNickname: nickname || 'Pemain Game',
        denomination: selectedDenomination,
        paymentMethod: selectedPayment,
        whatsappNumber: whatsapp,
      },
    });
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-40 glass-card rounded-3xl skeleton-shimmer" />
        <FormInputSkeleton />
        <div className="glass-card rounded-2xl p-6 space-y-4">
          <DenomCardSkeleton />
        </div>
      </div>
    );
  }

  if (error || !game) {
    return (
      <div className="glass-card rounded-3xl p-10 text-center space-y-4 max-w-lg mx-auto my-12 border border-slate-800">
        <AlertTriangle className="w-12 h-12 text-rose-400 mx-auto" />
        <h2 className="text-xl font-bold font-heading text-white">Game Tidak Ditemukan</h2>
        <p className="text-sm text-slate-400">
          Maaf, halaman game yang Anda cari tidak tersedia atau sedang dalam pemeliharaan.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-500 text-slate-900 font-semibold text-sm hover:bg-cyan-400 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Beranda</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-24 md:pb-8">
      {/* Breadcrumb & Back Link */}
      <div className="flex items-center gap-2 text-xs text-slate-400">
        <Link to="/" className="hover:text-cyan-400 transition">
          Beranda
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-slate-200">{game.name}</span>
      </div>

      {/* Game Header Banner */}
      <section className="relative rounded-3xl overflow-hidden glass-card border border-slate-800 p-6 sm:p-8">
        <div className="absolute inset-0 z-0">
          <img
            src={game.banner || game.thumbnail}
            alt={game.name}
            className="w-full h-full object-cover object-center filter blur-md opacity-25 scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#090b10] via-[#090b10]/80 to-[#090b10]/60" />
        </div>

        <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <img
            src={game.thumbnail}
            alt={game.name}
            className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover shadow-2xl border-2 border-cyan-500/40 shrink-0"
          />
          <div className="space-y-2 text-center sm:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-xs font-semibold">
              <Zap className="w-3.5 h-3.5" />
              <span>Proses Instan Otomatis</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-white">
              {game.name}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              {game.description}
            </p>
            <p className="text-xs text-slate-400">
              Publisher: <span className="text-cyan-300 font-medium">{game.publisher}</span> • Layanan: 24 Jam
            </p>
          </div>
        </div>
      </section>

      {/* Main Order Steps Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Form Steps (8 Cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Step 1: User ID */}
          <UserIdInput
            inputFields={game.inputFields}
            inputs={inputs}
            onChange={handleInputChange}
            onVerify={handleVerifyId}
            isCheckingId={isCheckingId}
            nickname={nickname}
            idCheckError={idCheckError}
            idGuideTip={game.idGuideTip}
            idGuideImage={game.idGuideImage}
          />

          {/* Step 2: Denomination */}
          <DenominationGrid
            denominations={game.denominations}
            selectedDenomination={selectedDenomination}
            onSelect={(item) => {
              setSelectedDenomination(item);
              setValidationError('');
            }}
            currencyName={game.currencyName}
          />

          {/* Step 3: Payment Method */}
          <PaymentSelector
            selectedPayment={selectedPayment}
            onSelect={(payment) => {
              setSelectedPayment(payment);
              setValidationError('');
            }}
            subtotal={subtotal}
          />

          {/* Step 4: WhatsApp Contact */}
          <div className="glass-card rounded-2xl p-5 sm:p-6 border border-slate-800/80 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-xs font-bold text-white shadow-sm shadow-cyan-500/30">
                4
              </div>
              <h3 className="text-base sm:text-lg font-bold font-heading text-white">
                Nomor WhatsApp untuk Bukti Transaksi
              </h3>
            </div>
            <div className="relative">
              <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="tel"
                placeholder="Contoh: 081234567890"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl glass-card text-white placeholder-slate-500 border border-slate-700/80 focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400/50 bg-[#0d1322]/50"
              />
            </div>
            <p className="text-[11px] text-slate-400">
              Bukti pembayaran & update status pengiriman diamond akan dikirimkan otomatis ke nomor ini.
            </p>
          </div>

          {/* Validation Alert */}
          {validationError && (
            <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-medium flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{validationError}</span>
            </div>
          )}
        </div>

        {/* Right Column: Desktop Sticky Order Summary Card (4 Cols) */}
        <div className="hidden lg:block lg:col-span-4 sticky top-24 space-y-4">
          <div className="glass-card rounded-3xl p-6 border border-slate-800 space-y-5 shadow-xl">
            <h3 className="text-base font-bold font-heading text-white pb-3 border-b border-slate-800 flex items-center gap-2">
              <ShoppingCart className="w-4 h-4 text-purple-400" />
              Ringkasan Pesanan
            </h3>

            {/* Selected Game */}
            <div className="flex items-center gap-3">
              <img
                src={game.thumbnail}
                alt={game.name}
                className="w-12 h-12 rounded-xl object-cover border border-slate-700 shrink-0"
              />
              <div className="min-w-0">
                <h4 className="text-sm font-semibold text-white truncate">{game.name}</h4>
                <p className="text-xs text-slate-400">{game.publisher}</p>
              </div>
            </div>

            {/* Price Details */}
            <div className="space-y-2.5 text-xs pt-2 border-t border-slate-800">
              <div className="flex justify-between text-slate-300">
                <span>Item Pilihan:</span>
                <span className="font-semibold text-white text-right">
                  {selectedDenomination ? selectedDenomination.name : '-'}
                </span>
              </div>

              <div className="flex justify-between text-slate-300">
                <span>User ID Target:</span>
                <span className="font-mono text-cyan-300 text-right">
                  {inputs.userId || '-'}
                  {inputs.zoneId ? ` (${inputs.zoneId})` : ''}
                </span>
              </div>

              {nickname && (
                <div className="flex justify-between text-slate-300">
                  <span>Nickname:</span>
                  <span className="text-emerald-400 font-semibold">{nickname}</span>
                </div>
              )}

              <div className="flex justify-between text-slate-300">
                <span>Metode Bayar:</span>
                <span className="font-semibold text-white text-right">
                  {selectedPayment ? selectedPayment.name : '-'}
                </span>
              </div>

              <div className="flex justify-between text-slate-300">
                <span>Harga Produk:</span>
                <span>{formatRupiah(subtotal)}</span>
              </div>

              <div className="flex justify-between text-slate-300">
                <span>Biaya Admin:</span>
                <span>{formatRupiah(adminFee)}</span>
              </div>

              <div className="flex justify-between items-baseline pt-3 border-t border-slate-800 text-sm font-bold">
                <span className="text-slate-100">Total Pembayaran:</span>
                <span className="text-lg font-extrabold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent font-heading">
                  {formatRupiah(grandTotal)}
                </span>
              </div>
            </div>

            {/* Checkout Action Button */}
            <Button
              variant="primary"
              size="lg"
              fullWidth
              onClick={handleProceedToCheckout}
              disabled={!selectedDenomination || !selectedPayment || !inputs.userId}
            >
              Lanjut ke Pembayaran
            </Button>

            <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400 pt-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Jaminan Transaksi Aman & Terenkripsi</span>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sticky Bottom Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 p-4 backdrop-blur-xl bg-[#090b10]/95 border-t border-slate-800 shadow-2xl">
        <div className="flex items-center justify-between gap-4 max-w-md mx-auto">
          <div>
            <span className="text-[10px] text-slate-400 block uppercase font-medium">
              Total Pembayaran
            </span>
            <span className="text-lg font-extrabold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent font-heading">
              {formatRupiah(grandTotal)}
            </span>
          </div>

          <Button
            variant="primary"
            size="md"
            onClick={handleProceedToCheckout}
            disabled={!selectedDenomination || !selectedPayment || !inputs.userId}
            className="shrink-0 px-6 py-3"
          >
            Beli Sekarang
          </Button>
        </div>
      </div>
    </div>
  );
}

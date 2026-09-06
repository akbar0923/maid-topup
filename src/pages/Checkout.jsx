import React, { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  ShieldCheck,
  Zap,
  CheckCircle2,
  AlertTriangle,
  QrCode,
  Wallet,
  Landmark,
  CreditCard,
  Phone,
  User,
  Check,
} from 'lucide-react';
import Button from '../components/common/Button';
import { formatRupiah } from '../utils/formatCurrency';
import { calculateAdminFee } from '../constants/paymentMethods';
import { useOrder } from '../context/OrderContext';

export default function Checkout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { submitOrder, isSubmitting } = useOrder();

  const [agreementChecked, setAgreementChecked] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  // Ambil data order dari state navigasi
  const orderData = location.state;

  if (!orderData) {
    return (
      <div className="glass-card rounded-3xl p-10 text-center space-y-4 max-w-lg mx-auto my-12 border border-slate-800">
        <AlertTriangle className="w-12 h-12 text-amber-400 mx-auto" />
        <h2 className="text-xl font-bold font-heading text-white">Tidak Ada Pesanan Aktif</h2>
        <p className="text-sm text-slate-400">
          Silakan pilih game dan nominal top up terlebih dahulu sebelum mengakses halaman checkout.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-500 text-slate-900 font-semibold text-sm hover:bg-cyan-400 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Katalog Game</span>
        </Link>
      </div>
    );
  }

  const {
    gameId,
    gameSlug,
    gameName,
    gameThumbnail,
    userId,
    zoneId,
    server,
    userNickname,
    denomination,
    paymentMethod,
    whatsappNumber,
  } = orderData;

  const subtotal = denomination?.price || 0;
  const adminFee = calculateAdminFee(paymentMethod, subtotal);
  const totalAmount = subtotal + adminFee;

  const handleProcessPayment = async () => {
    if (!agreementChecked) {
      setErrorMsg('Mohon setujui syarat & ketentuan sebelum memproses pembayaran.');
      return;
    }

    setErrorMsg('');

    try {
      const createdOrder = await submitOrder({
        gameId,
        gameName,
        gameThumbnail,
        userId,
        zoneId,
        server,
        userNickname,
        denomination,
        paymentMethod,
        whatsappNumber,
      });

      // Arahkan langsung ke halaman Order Status real-time
      navigate(`/order-status/${createdOrder.invoiceId}`, { replace: true });
    } catch (err) {
      setErrorMsg(err.message || 'Gagal memproses pembayaran. Coba lagi.');
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 sm:space-y-8">
      {/* Navigation & Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali / Ubah Pesanan</span>
        </button>
        <span className="text-xs font-semibold text-purple-400 font-mono">LANGKAH TERAKHIR</span>
      </div>

      <div className="space-y-2">
        <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-white">
          Konfirmasi Pembayaran
        </h1>
        <p className="text-xs sm:text-sm text-slate-400">
          Periksa kembali detail akun dan item pilihan Anda sebelum menyelesaikan transaksi.
        </p>
      </div>

      {/* Main Checkout Summary Card */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-6 shadow-2xl">
        {/* Game & Item Chosen Box */}
        <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-800/40 border border-slate-700/60">
          <img
            src={gameThumbnail}
            alt={gameName}
            className="w-16 h-16 rounded-2xl object-cover border border-purple-500/40 shrink-0"
          />
          <div className="space-y-1">
            <h2 className="text-base sm:text-lg font-bold font-heading text-white">{gameName}</h2>
            <p className="text-sm font-semibold text-purple-400">{denomination.name}</p>
            {denomination.bonus > 0 && (
              <span className="text-xs text-emerald-400 font-medium">
                Termasuk bonus {denomination.bonus}
              </span>
            )}
          </div>
        </div>

        {/* Breakdown Details Grid */}
        <div className="space-y-3 text-xs sm:text-sm">
          <h3 className="text-xs uppercase tracking-wider font-bold text-slate-400">
            Detail Tujuan & Akun
          </h3>

          <div className="space-y-2 p-4 rounded-2xl bg-slate-900/50 border border-slate-800">
            <div className="flex justify-between py-1 border-b border-slate-800/80">
              <span className="text-slate-400">User ID:</span>
              <span className="font-mono font-semibold text-white">{userId}</span>
            </div>

            {zoneId && (
              <div className="flex justify-between py-1 border-b border-slate-800/80">
                <span className="text-slate-400">Zone / Server ID:</span>
                <span className="font-mono font-semibold text-white">{zoneId}</span>
              </div>
            )}

            {server && (
              <div className="flex justify-between py-1 border-b border-slate-800/80">
                <span className="text-slate-400">Server Wilayah:</span>
                <span className="font-semibold text-white">{server}</span>
              </div>
            )}

            <div className="flex justify-between py-1 border-b border-slate-800/80">
              <span className="text-slate-400">Nickname Akun:</span>
              <span className="font-semibold text-emerald-400">{userNickname}</span>
            </div>

            <div className="flex justify-between py-1">
              <span className="text-slate-400">WhatsApp Notifikasi:</span>
              <span className="font-mono font-medium text-slate-200">{whatsappNumber}</span>
            </div>
          </div>
        </div>

        {/* Payment & Price Summary */}
        <div className="space-y-3 text-xs sm:text-sm">
          <h3 className="text-xs uppercase tracking-wider font-bold text-slate-400">
            Rincian Biaya
          </h3>

          <div className="space-y-2.5 p-4 rounded-2xl bg-slate-900/50 border border-slate-800">
            <div className="flex justify-between py-1 border-b border-slate-800/80">
              <span className="text-slate-400">Metode Pembayaran:</span>
              <span className="font-semibold text-white">{paymentMethod.name}</span>
            </div>

            <div className="flex justify-between py-1 border-b border-slate-800/80">
              <span className="text-slate-400">Harga Produk:</span>
              <span className="font-semibold text-slate-200">{formatRupiah(subtotal)}</span>
            </div>

            <div className="flex justify-between py-1 border-b border-slate-800/80">
              <span className="text-slate-400">Biaya Layanan & Admin:</span>
              <span className="font-semibold text-slate-200">{formatRupiah(adminFee)}</span>
            </div>

            <div className="flex justify-between items-baseline pt-2 text-sm sm:text-base font-bold">
              <span className="text-slate-100">Total Tagihan:</span>
              <span className="text-xl sm:text-2xl font-extrabold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent font-heading">
                {formatRupiah(totalAmount)}
              </span>
            </div>
          </div>
        </div>

        {/* Agreement Checkbox */}
        <label className="flex items-start gap-3 p-3 rounded-xl glass-card border border-slate-800 cursor-pointer select-none text-xs text-slate-300">
          <input
            type="checkbox"
            checked={agreementChecked}
            onChange={(e) => setAgreementChecked(e.target.checked)}
            className="mt-0.5 w-4 h-4 rounded text-cyan-500 bg-slate-900 border-slate-700 focus:ring-cyan-400 focus:ring-offset-0"
          />
          <span>
            Saya mengonfirmasi bahwa data akun dan User ID yang diinput sudah sesuai dan benar. Saya
            menyetujui Syarat & Ketentuan transaksi di Maid Topup.
          </span>
        </label>

        {/* Error Notification */}
        {errorMsg && (
          <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-medium flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Action Button */}
        <div className="pt-2 space-y-3">
          <Button
            variant="primary"
            size="lg"
            fullWidth
            isLoading={isSubmitting}
            onClick={handleProcessPayment}
          >
            Bayar Sekarang ({formatRupiah(totalAmount)})
          </Button>

          <p className="text-center text-[11px] text-slate-400 flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Proses otomatis kilat 1-3 detik setelah pembayaran berhasil dikonfirmasi.</span>
          </p>
        </div>
      </div>
    </div>
  );
}

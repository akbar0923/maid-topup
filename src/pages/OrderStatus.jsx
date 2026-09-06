import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Clock,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Copy,
  QrCode,
  Landmark,
  ShieldCheck,
  Search,
  ExternalLink,
  ArrowRight,
  Sparkles,
  Check,
} from 'lucide-react';
import { usePolling } from '../hooks/usePolling';
import { StatusBadge } from '../components/common/Badge';
import Button from '../components/common/Button';
import { formatRupiah } from '../utils/formatCurrency';
import { formatDateTime, copyToClipboard } from '../utils/helpers';
import { useOrder } from '../context/OrderContext';
import { SkeletonBox } from '../components/common/Skeleton';

export default function OrderStatus() {
  const { invoiceId: paramInvoiceId } = useParams();
  const navigate = useNavigate();
  const { showToast } = useOrder();

  const [searchInvoice, setSearchInvoice] = useState(paramInvoiceId || '');
  const [activeInvoice, setActiveInvoice] = useState(paramInvoiceId || '');
  const [copiedField, setCopiedField] = useState('');

  // Polling Hook setiap 3 detik
  const {
    order,
    status,
    loading,
    error,
    pollCount,
    refetch,
    forceStatus,
  } = usePolling(activeInvoice, {
    interval: 3000,
    enabled: !!activeInvoice,
    onSuccess: () => {
      showToast('Status terbaru: Transaksi Berhasil!', 'success');
    },
  });

  // Countdown timer batas waktu pembayaran (15 menit)
  const [timeLeft, setTimeLeft] = useState(15 * 60);

  useEffect(() => {
    if (paramInvoiceId) {
      setActiveInvoice(paramInvoiceId);
      setSearchInvoice(paramInvoiceId);
    }
  }, [paramInvoiceId]);

  useEffect(() => {
    if (status === 'SUCCESS' || status === 'FAILED') return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [status]);

  const formatCountdown = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleCopy = async (text, fieldName) => {
    const success = await copyToClipboard(text);
    if (success) {
      setCopiedField(fieldName);
      showToast(`${fieldName} berhasil disalin!`, 'info');
      setTimeout(() => setCopiedField(''), 2000);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchInvoice.trim()) return;
    setActiveInvoice(searchInvoice.trim());
    navigate(`/order-status/${searchInvoice.trim()}`, { replace: true });
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 sm:space-y-8">
      {/* Header & Search Bar */}
      <div className="space-y-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-white">
            Status Pesanan Real-Time
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Status transaksi dipantau secara langsung menggunakan mekanisme background polling otomatis.
          </p>
        </div>

        {/* Search by Invoice Form */}
        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchInvoice}
              onChange={(e) => setSearchInvoice(e.target.value)}
              placeholder="Masukkan nomor invoice (contoh: MAID-20260903-XXXX)..."
              className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl glass-card text-white placeholder-slate-500 border border-slate-700/80 focus:border-purple-400 focus:outline-none focus:ring-1 focus:ring-purple-400/50"
            />
          </div>
          <Button type="submit" variant="primary" size="md">
            Lacak
          </Button>
        </form>
      </div>

      {/* Main Status Container */}
      {!activeInvoice ? (
        <div className="glass-card rounded-3xl p-10 text-center space-y-3 border border-slate-800">
          <Search className="w-10 h-10 text-cyan-400 mx-auto" />
          <h3 className="text-base font-semibold text-white">Lacak Transaksi Anda</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Ketik nomor invoice pesanan Anda di atas untuk memantau status pembayaran dan pengiriman
            item secara real-time.
          </p>
        </div>
      ) : loading && !order ? (
        <div className="glass-card rounded-3xl p-8 border border-slate-800 space-y-4">
          <SkeletonBox className="h-6 w-48 rounded" />
          <SkeletonBox className="h-32 w-full rounded-2xl" />
          <SkeletonBox className="h-10 w-full rounded-xl" />
        </div>
      ) : error || !order ? (
        <div className="glass-card rounded-3xl p-10 text-center space-y-4 border border-rose-500/20 bg-rose-500/5">
          <AlertCircle className="w-12 h-12 text-rose-400 mx-auto" />
          <h2 className="text-lg font-bold font-heading text-white">Pesanan Tidak Ditemukan</h2>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            {error || `Nomor invoice "${activeInvoice}" tidak terdaftar pada sistem.`}
          </p>
          <Link
            to="/history"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl glass-card text-xs font-medium text-cyan-400 hover:text-cyan-300"
          >
            <span>Lihat Daftar Riwayat Pesanan</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Status Progression Card */}
          <div className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-6 shadow-2xl relative overflow-hidden">
            {/* Ambient indicator */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400">Nomor Invoice:</span>
                  <button
                    onClick={() => handleCopy(order.invoiceId, 'Invoice')}
                    className="flex items-center gap-1.5 font-mono text-xs sm:text-sm font-bold text-cyan-400 hover:underline cursor-pointer"
                  >
                    <span>{order.invoiceId}</span>
                    {copiedField === 'Invoice' ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Dibuat pada: {formatDateTime(order.createdAt)}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <StatusBadge status={order.status} />
                <button
                  onClick={refetch}
                  title="Refresh status manual"
                  className="p-1.5 rounded-lg glass-card hover:bg-slate-800 text-slate-400 hover:text-white transition cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Stepper Visual Tracker */}
            <div className="py-2">
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                {/* Step 1 */}
                <div className="space-y-1.5">
                  <div className="w-8 h-8 rounded-full mx-auto flex items-center justify-center bg-cyan-500 text-slate-900 font-bold shadow-md shadow-cyan-500/30">
                    <Check className="w-4 h-4 stroke-[3]" />
                  </div>
                  <p className="font-semibold text-white">1. Pesanan Dibuat</p>
                </div>

                {/* Step 2 */}
                <div className="space-y-1.5">
                  <div
                    className={`w-8 h-8 rounded-full mx-auto flex items-center justify-center font-bold transition-all ${
                      order.status === 'PROCESSING' || order.status === 'SUCCESS'
                        ? 'bg-cyan-500 text-slate-900 shadow-md shadow-cyan-500/30'
                        : 'bg-amber-500/20 text-amber-300 border border-amber-500/40 animate-pulse'
                    }`}
                  >
                    {order.status === 'SUCCESS' ? (
                      <Check className="w-4 h-4 stroke-[3]" />
                    ) : (
                      '2'
                    )}
                  </div>
                  <p
                    className={`font-semibold ${
                      order.status === 'PROCESSING' || order.status === 'SUCCESS'
                        ? 'text-white'
                        : 'text-amber-300'
                    }`}
                  >
                    2. Pembayaran
                  </p>
                </div>

                {/* Step 3 */}
                <div className="space-y-1.5">
                  <div
                    className={`w-8 h-8 rounded-full mx-auto flex items-center justify-center font-bold transition-all ${
                      order.status === 'SUCCESS'
                        ? 'bg-emerald-500 text-slate-900 shadow-md shadow-emerald-500/30'
                        : 'bg-slate-800 text-slate-500 border border-slate-700'
                    }`}
                  >
                    {order.status === 'SUCCESS' ? (
                      <Check className="w-4 h-4 stroke-[3]" />
                    ) : (
                      '3'
                    )}
                  </div>
                  <p
                    className={`font-semibold ${
                      order.status === 'SUCCESS' ? 'text-emerald-400' : 'text-slate-500'
                    }`}
                  >
                    3. Item Masuk
                  </p>
                </div>
              </div>

              {/* Status Message Banner */}
              <div
                className={`mt-4 p-3 rounded-xl text-center text-xs font-semibold ${
                  order.status === 'SUCCESS'
                    ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                    : order.status === 'PROCESSING'
                    ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30'
                    : 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                }`}
              >
                {order.statusMessage || 'Menunggu konfirmasi pembayaran...'}
              </div>
            </div>

            {/* Payment Instructions & Code (If PENDING) */}
            {order.status === 'PENDING' && (
              <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase text-slate-400 tracking-wider">
                    Instruksi Pembayaran ({order.paymentMethod?.name})
                  </span>
                  <div className="flex items-center gap-1.5 text-xs text-amber-400 font-mono">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Sisa Waktu: {formatCountdown(timeLeft)}</span>
                  </div>
                </div>

                {/* QRIS Code */}
                {order.paymentMethod?.type === 'qris' && order.qrCodeUrl && (
                  <div className="flex flex-col items-center justify-center p-4 bg-white rounded-2xl max-w-xs mx-auto shadow-xl">
                    <img
                      src={order.qrCodeUrl}
                      alt="QRIS Pembayaran"
                      className="w-52 h-52 object-contain"
                    />
                    <p className="text-[11px] font-bold text-slate-900 mt-2 text-center">
                      Scan QRIS Menggunakan BCA, DANA, GoPay, ShopeePay, OVO, dll.
                    </p>
                  </div>
                )}

                {/* Virtual Account Number */}
                {order.paymentMethod?.type === 'va' && order.paymentCode && (
                  <div className="space-y-2">
                    <p className="text-xs text-slate-400">Nomor Virtual Account:</p>
                    <div className="flex items-center justify-between p-3 rounded-xl glass-card border border-slate-700 bg-slate-950">
                      <span className="font-mono text-base font-bold text-cyan-400">
                        {order.paymentCode}
                      </span>
                      <button
                        onClick={() => handleCopy(order.paymentCode, 'Nomor VA')}
                        className="px-3 py-1 text-xs font-semibold rounded-lg bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20 transition cursor-pointer"
                      >
                        {copiedField === 'Nomor VA' ? 'Tersalin' : 'Salin'}
                      </button>
                    </div>
                  </div>
                )}

                {/* Total Payment Amount */}
                <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-xs text-slate-300 font-medium">Jumlah yang Harus Dibayar:</span>
                  <div className="flex items-center gap-2">
                    <span className="text-base sm:text-lg font-bold text-cyan-400 font-heading">
                      {formatRupiah(order.totalAmount)}
                    </span>
                    <button
                      onClick={() => handleCopy(order.totalAmount, 'Nominal')}
                      className="p-1 text-slate-400 hover:text-cyan-400 transition"
                      title="Salin Nominal"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Order Details Breakdown */}
            <div className="space-y-3 pt-2 text-xs">
              <h4 className="font-bold text-slate-300 uppercase tracking-wider">Rincian Transaksi</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-2xl bg-slate-900/40 border border-slate-800">
                <div>
                  <span className="text-slate-500">Game:</span>
                  <p className="font-semibold text-slate-200">{order.gameName}</p>
                </div>
                <div>
                  <span className="text-slate-500">Item:</span>
                  <p className="font-semibold text-cyan-400">{order.denomination?.name}</p>
                </div>
                <div>
                  <span className="text-slate-500">User ID & Server:</span>
                  <p className="font-mono font-semibold text-slate-200">
                    {order.userId} {order.zoneId ? `(${order.zoneId})` : ''}
                  </p>
                </div>
                <div>
                  <span className="text-slate-500">Nickname Akun:</span>
                  <p className="font-semibold text-emerald-400">{order.userNickname}</p>
                </div>
              </div>
            </div>

            {/* Live Polling Info */}
            <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-800">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Background polling aktif (dicek {pollCount} kali)
              </span>
              <span>Provider: BahteraStore API Gateway</span>
            </div>
          </div>

          {/* SIMULATOR BAR FOR TESTING & REVIEW (Sangat membantu untuk review cepat) */}
          <div className="glass-card rounded-2xl p-4 border border-cyan-500/30 bg-cyan-950/20 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-cyan-300">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                <span>Panel Simulator Status (Untuk Testing & Review)</span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300">
                Development Mode
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Klik tombol di bawah untuk mencoba perubahan status real-time secara instan tanpa perlu transfer sungguhan:
            </p>
            <div className="flex flex-wrap gap-2 pt-1">
              <button
                type="button"
                onClick={() => forceStatus('SUCCESS')}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30 transition cursor-pointer"
              >
                ⚡ Simulasikan Pembayaran Berhasil
              </button>
              <button
                type="button"
                onClick={() => forceStatus('PROCESSING')}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 hover:bg-cyan-500/30 transition cursor-pointer"
              >
                ⏳ Simulasikan Sedang Diproses
              </button>
              <button
                type="button"
                onClick={() => forceStatus('FAILED')}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-rose-500/20 text-rose-300 border border-rose-500/40 hover:bg-rose-500/30 transition cursor-pointer"
              >
                ❌ Simulasikan Gagal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

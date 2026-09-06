import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  History,
  Search,
  ExternalLink,
  Zap,
  Gamepad2,
  Calendar,
  AlertCircle,
  Clock,
  CheckCircle2,
} from 'lucide-react';
import { orderService } from '../services/orderService';
import { StatusBadge } from '../components/common/Badge';
import { formatRupiah } from '../utils/formatCurrency';
import { formatDateTime } from '../utils/helpers';
import { TableRowSkeleton } from '../components/common/Skeleton';

export default function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');

  useEffect(() => {
    // Ambil riwayat order
    setLoading(true);
    const timer = setTimeout(() => {
      const local = orderService.getLocalOrders();
      setOrders(local);
      setLoading(false);
    }, 400);

    return () => clearTimeout(timer);
  }, []);

  const filteredOrders = orders.filter((o) => {
    const matchStatus = filterStatus === 'ALL' || o.status === filterStatus;
    const matchSearch =
      !search.trim() ||
      o.invoiceId?.toLowerCase().includes(search.toLowerCase()) ||
      o.gameName?.toLowerCase().includes(search.toLowerCase()) ||
      o.userId?.toLowerCase().includes(search.toLowerCase());

    return matchStatus && matchSearch;
  });

  const filterTabs = [
    { id: 'ALL', label: 'Semua' },
    { id: 'PENDING', label: 'Menunggu Bayar' },
    { id: 'PROCESSING', label: 'Diproses' },
    { id: 'SUCCESS', label: 'Berhasil' },
    { id: 'FAILED', label: 'Gagal' },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8">
      {/* Title & Description */}
      <div>
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
            <History className="w-4 h-4" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-white">
            Riwayat Transaksi
          </h1>
        </div>
        <p className="text-xs sm:text-sm text-slate-400 mt-1 pl-10.5">
          Daftar seluruh transaksi pembelian dan status reload game Anda di Maid Topup.
        </p>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {filterTabs.map((tab) => {
            const isActive = filterStatus === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setFilterStatus(tab.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-500 to-purple-600 text-white shadow-sm shadow-cyan-500/30'
                    : 'glass-card text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari invoice atau game..."
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl glass-card text-white placeholder-slate-500 border border-slate-700/80 focus:border-cyan-400 focus:outline-none"
          />
        </div>
      </div>

      {/* Order List Cards */}
      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <TableRowSkeleton key={i} />
          ))}
        </div>
      ) : filteredOrders.length > 0 ? (
        <div className="space-y-3">
          {filteredOrders.map((item) => (
            <Link
              key={item.invoiceId}
              to={`/order-status/${item.invoiceId}`}
              className="block glass-card rounded-2xl p-4 sm:p-5 border border-slate-800/80 hover:border-cyan-500/40 hover:bg-slate-800/40 transition-all duration-200 group"
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                {/* Left: Game & Invoice Details */}
                <div className="flex items-center gap-3.5">
                  <img
                    src={item.gameThumbnail}
                    alt={item.gameName}
                    className="w-12 h-12 rounded-xl object-cover border border-slate-700 shrink-0"
                  />
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors font-heading">
                        {item.gameName}
                      </h3>
                      <span className="text-[11px] font-mono text-cyan-400">
                        {item.denomination?.name}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-400">
                      <span className="font-mono">{item.invoiceId}</span>
                      <span>•</span>
                      <span>User ID: {item.userId}</span>
                      <span>•</span>
                      <span>{formatDateTime(item.createdAt)}</span>
                    </div>
                  </div>
                </div>

                {/* Right: Price, Status & Action */}
                <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto border-t sm:border-t-0 border-slate-800/80 pt-3 sm:pt-0">
                  <div className="text-left sm:text-right">
                    <p className="text-xs text-slate-400">Total Biaya</p>
                    <p className="text-sm font-bold text-cyan-400 font-heading">
                      {formatRupiah(item.totalAmount)}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <StatusBadge status={item.status} />
                    <ExternalLink className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 transition" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="glass-card rounded-3xl p-12 text-center space-y-4 border border-slate-800">
          <History className="w-12 h-12 text-slate-500 mx-auto" />
          <h3 className="text-base font-semibold text-white">Belum Ada Riwayat Transaksi</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            {search || filterStatus !== 'ALL'
              ? 'Tidak ada pesanan yang sesuai dengan filter pencarian.'
              : 'Anda belum memiliki transaksi pembelian diamond di platform Maid Topup.'}
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-medium text-xs shadow-md shadow-cyan-500/20 hover:opacity-90 transition"
          >
            <Gamepad2 className="w-4 h-4" />
            <span>Mulai Top Up Game</span>
          </Link>
        </div>
      )}
    </div>
  );
}

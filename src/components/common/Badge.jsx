import React from 'react';
import { Clock, CheckCircle2, AlertCircle, Sparkles, RefreshCw } from 'lucide-react';

export function StatusBadge({ status, className = '' }) {
  const normalized = status?.toUpperCase() || 'PENDING';

  switch (normalized) {
    case 'SUCCESS':
    case 'BERHASIL':
      return (
        <span
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shadow-[0_0_12px_-2px_rgba(16,185,129,0.3)] ${className}`}
        >
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Berhasil</span>
        </span>
      );

    case 'PROCESSING':
    case 'PROSES':
      return (
        <span
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 shadow-[0_0_12px_-2px_rgba(6,182,212,0.3)] ${className}`}
        >
          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
          <span>Diproses</span>
        </span>
      );

    case 'FAILED':
    case 'GAGAL':
    case 'EXPIRED':
      return (
        <span
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-500/15 text-rose-400 border border-rose-500/30 shadow-[0_0_12px_-2px_rgba(244,63,94,0.3)] ${className}`}
        >
          <AlertCircle className="w-3.5 h-3.5" />
          <span>Gagal / Kedaluwarsa</span>
        </span>
      );

    case 'PENDING':
    default:
      return (
        <span
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-300 border border-amber-500/30 shadow-[0_0_12px_-2px_rgba(245,158,11,0.3)] ${className}`}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>Menunggu Pembayaran</span>
        </span>
      );
  }
}

export function TagBadge({ text, variant = 'purple', size = 'sm', className = '' }) {
  const variantStyles = {
    purple: 'bg-purple-500/20 text-purple-300 border-purple-500/40 shadow-purple-500/20',
    cyan: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 shadow-cyan-500/20',
    hot: 'bg-rose-500/20 text-rose-300 border-rose-500/40 shadow-rose-500/20',
    gold: 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-amber-500/20',
  }[variant] || 'bg-purple-500/20 text-purple-300 border-purple-500/40 shadow-purple-500/20';

  const sizeStyles = size === 'xs' ? 'text-[10px] px-2 py-0.5' : 'text-xs px-2.5 py-1';

  return (
    <span
      className={`inline-flex items-center gap-1 font-semibold uppercase tracking-wider rounded-md border shadow-sm ${variantStyles} ${sizeStyles} ${className}`}
    >
      <Sparkles className="w-2.5 h-2.5" />
      {text}
    </span>
  );
}

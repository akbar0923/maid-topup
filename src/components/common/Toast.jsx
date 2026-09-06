import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { useOrder } from '../../context/OrderContext';

export default function Toast() {
  const { toast, hideToast } = useOrder();

  if (!toast) return null;

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />,
    info: <Info className="w-5 h-5 text-cyan-400 shrink-0" />,
  };

  const borders = {
    success: 'border-emerald-500/40 shadow-emerald-500/20',
    error: 'border-rose-500/40 shadow-rose-500/20',
    info: 'border-cyan-500/40 shadow-cyan-500/20',
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-sm w-full animate-bounce-short">
      <div
        className={`glass-card p-4 rounded-2xl border shadow-xl flex items-center gap-3 backdrop-blur-xl ${
          borders[toast.type] || borders.info
        }`}
      >
        {icons[toast.type] || icons.info}
        <p className="text-sm font-medium text-slate-100 flex-1">{toast.message}</p>
        <button
          onClick={hideToast}
          className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800/60 transition cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

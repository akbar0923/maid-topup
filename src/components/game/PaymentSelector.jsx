import React from 'react';
import { QrCode, Wallet, Landmark, Store, Check, Info } from 'lucide-react';
import { PAYMENT_CATEGORIES, calculateAdminFee } from '../../constants/paymentMethods';
import { formatRupiah } from '../../utils/formatCurrency';

export default function PaymentSelector({
  selectedPayment,
  onSelect,
  subtotal = 0,
}) {
  const categoryIcons = {
    qris: QrCode,
    ewallet: Wallet,
    va: Landmark,
    convenience: Store,
  };

  return (
    <div className="glass-card rounded-2xl p-5 sm:p-6 border border-slate-800/80 space-y-5">
      {/* Step Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-xs font-bold text-white shadow-sm shadow-cyan-500/30">
            3
          </div>
          <h3 className="text-base sm:text-lg font-bold font-heading text-white">
            Pilih Metode Pembayaran
          </h3>
        </div>
        <span className="text-xs text-slate-400 hidden sm:block">
          Semua transaksi otomatis terverifikasi
        </span>
      </div>

      {/* Categories Grouping */}
      <div className="space-y-4">
        {PAYMENT_CATEGORIES.map((category) => {
          const CatIcon = categoryIcons[category.id] || Wallet;

          return (
            <div key={category.id} className="space-y-2.5">
              {/* Category Label */}
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
                <CatIcon className="w-3.5 h-3.5 text-cyan-400" />
                <span>{category.name}</span>
              </div>

              {/* Methods Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                {category.methods.map((method) => {
                  const isSelected = selectedPayment?.id === method.id;
                  const fee = calculateAdminFee(method, subtotal);
                  const totalPrice = subtotal > 0 ? subtotal + fee : 0;

                  return (
                    <button
                      key={method.id}
                      type="button"
                      onClick={() => onSelect(method)}
                      className={`p-3.5 rounded-xl text-left transition-all duration-200 cursor-pointer flex items-center justify-between group ${
                        isSelected
                          ? 'glass-card-active border-cyan-400 shadow-md shadow-cyan-500/20 ring-1 ring-cyan-400'
                          : 'glass-card border-slate-800 hover:border-slate-700 hover:bg-slate-800/40'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {/* Radio indicator */}
                        <div
                          className={`w-4 h-4 rounded-full flex items-center justify-center border transition-all ${
                            isSelected
                              ? 'border-cyan-400 bg-cyan-500 text-slate-900'
                              : 'border-slate-600 bg-slate-800/50'
                          }`}
                        >
                          {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                        </div>

                        {/* Payment Info */}
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs sm:text-sm font-semibold text-slate-100 group-hover:text-cyan-300 transition-colors">
                              {method.name}
                            </span>
                            {method.badge && (
                              <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                                {method.badge}
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] text-slate-400 block mt-0.5">
                            Biaya: {method.feeType === 'percent' ? `${method.fee * 100}%` : formatRupiah(method.fee)}
                          </span>
                        </div>
                      </div>

                      {/* Total if selected or preview */}
                      {subtotal > 0 && (
                        <span className="text-xs font-bold text-cyan-400 font-heading">
                          {formatRupiah(totalPrice)}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

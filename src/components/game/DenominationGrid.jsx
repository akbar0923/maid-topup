import React from 'react';
import { Sparkles, Zap, Check } from 'lucide-react';
import { formatRupiah } from '../../utils/formatCurrency';
import { DenomCardSkeleton } from '../common/Skeleton';

export default function DenominationGrid({
  denominations = [],
  selectedDenomination,
  onSelect,
  loading = false,
  currencyName = 'Diamonds',
}) {
  return (
    <div className="glass-card rounded-2xl p-5 sm:p-6 border border-slate-800/80 space-y-4">
      {/* Step Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-xs font-bold text-white shadow-sm shadow-cyan-500/30">
            2
          </div>
          <h3 className="text-base sm:text-lg font-bold font-heading text-white">
            Pilih Nominal Top Up
          </h3>
        </div>
        <span className="text-xs text-cyan-400 font-medium hidden sm:block">
          Item resmi & terpercaya
        </span>
      </div>

      {/* Grid List */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {Array.from({ length: 8 }).map((_, i) => (
            <DenomCardSkeleton key={i} />
          ))}
        </div>
      ) : denominations.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {denominations.map((item) => {
            const isSelected = selectedDenomination?.id === item.id;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelect(item)}
                className={`relative text-left p-3.5 sm:p-4 rounded-2xl transition-all duration-300 flex flex-col justify-between cursor-pointer group ${
                  isSelected
                    ? 'glass-card-active border-cyan-400 shadow-lg shadow-cyan-500/20 ring-1 ring-cyan-400'
                    : 'glass-card border-slate-800/90 hover:border-slate-700 hover:bg-slate-800/50'
                }`}
              >
                {/* Badge if available */}
                {item.badge && (
                  <span className="absolute -top-2.5 right-2 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-sm">
                    {item.badge}
                  </span>
                )}

                {/* Item Details */}
                <div>
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-xs sm:text-sm font-bold text-slate-100 group-hover:text-cyan-300 transition-colors line-clamp-1">
                      {item.name}
                    </span>
                    {isSelected && (
                      <span className="w-4 h-4 rounded-full bg-cyan-500 text-[#090b10] flex items-center justify-center shrink-0">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </span>
                    )}
                  </div>
                  {item.bonus > 0 && (
                    <span className="text-[10px] font-semibold text-emerald-400 mt-0.5 block">
                      + Bonus {item.bonus} {currencyName}
                    </span>
                  )}
                </div>

                {/* Price */}
                <div className="pt-3 mt-auto flex items-baseline justify-between">
                  <span className="text-xs sm:text-sm font-extrabold text-cyan-400 font-heading">
                    {formatRupiah(item.price)}
                  </span>
                  <Zap
                    className={`w-3.5 h-3.5 transition-colors ${
                      isSelected ? 'text-cyan-400' : 'text-slate-600 group-hover:text-slate-400'
                    }`}
                  />
                </div>
              </button>
            );
          })}
        </div>
      ) : (
        <p className="text-xs text-slate-400 py-4 text-center">
          Tidak ada daftar nominal yang tersedia.
        </p>
      )}
    </div>
  );
}

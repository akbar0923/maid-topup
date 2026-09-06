import React from 'react';
import { Search, Sparkles, Swords, Crosshair, Flame, ShieldAlert, Gift } from 'lucide-react';
import GameCard from './GameCard';
import { GameCardSkeleton } from '../common/Skeleton';
import { GAME_CATEGORIES } from '../../constants/categories';

export default function GameGrid({
  games,
  loading,
  selectedCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
}) {
  const categoryIcons = {
    Sparkles: Sparkles,
    Swords: Swords,
    Crosshair: Crosshair,
    Flame: Flame,
    ShieldAlert: ShieldAlert,
    Gift: Gift,
  };

  return (
    <section id="game-catalog" className="space-y-6 sm:space-y-8">
      {/* Search Bar & Category Header */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Title */}
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-6 rounded-full bg-gradient-to-b from-cyan-400 to-purple-600" />
            <h2 className="text-xl sm:text-2xl font-bold font-heading text-white tracking-tight">
              Pilih Game Favorit
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 pl-4.5">
            Tersedia ratusan pilihan game dengan proses instan 24 jam nonstop
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Cari Mobile Legends, FF, Valorant..."
            className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl glass-card text-white placeholder-slate-400 border border-slate-700/80 focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400/50 transition"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white px-1.5 py-0.5 rounded bg-slate-800"
            >
              Hapus
            </button>
          )}
        </div>
      </div>

      {/* Category Pills (Scrollable on mobile) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {GAME_CATEGORIES.map((cat) => {
          const Icon = categoryIcons[cat.icon] || Sparkles;
          const isActive = selectedCategory === cat.id;

          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-medium whitespace-nowrap transition-all duration-200 cursor-pointer ${
                isActive
                  ? 'bg-gradient-to-r from-cyan-500 to-purple-600 text-white shadow-md shadow-cyan-500/25 border border-cyan-400/40'
                  : 'glass-card text-slate-300 hover:text-white hover:border-slate-600 border border-slate-800'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-cyan-400'}`} />
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Games Grid or Skeleton Loaders */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <GameCardSkeleton key={i} />
          ))}
        </div>
      ) : games.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
          {games.map((game) => (
            <GameCard key={game.id} game={game} />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="glass-card rounded-2xl p-8 sm:p-12 text-center border border-slate-800/80 space-y-3">
          <div className="w-16 h-16 rounded-full bg-slate-800/80 flex items-center justify-center mx-auto text-slate-400">
            <Search className="w-8 h-8" />
          </div>
          <h3 className="text-base font-semibold text-white">Game tidak ditemukan</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Tidak ada game dengan kata kunci "{searchQuery}". Coba gunakan kata kunci lain atau pilih
            kategori semua.
          </p>
          <button
            onClick={() => {
              onSearchChange('');
              onSelectCategory('all');
            }}
            className="inline-flex text-xs text-cyan-400 hover:underline pt-2 font-medium"
          >
            Reset Pencarian
          </button>
        </div>
      )}
    </section>
  );
}

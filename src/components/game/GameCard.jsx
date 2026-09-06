import React from 'react';
import { Link } from 'react-router-dom';
import { Zap, Sparkles } from 'lucide-react';
import { TagBadge } from '../common/Badge';

export default function GameCard({ game }) {
  const getBadgeVariant = (badge) => {
    switch (badge?.toUpperCase()) {
      case 'HOT':
        return 'hot';
      case 'PROMO':
        return 'gold';
      case 'BARU':
        return 'cyan';
      default:
        return 'purple';
    }
  };

  return (
    <Link
      to={`/game/${game.slug || game.id}`}
      className="group relative glass-card rounded-2xl p-2.5 sm:p-3 border border-slate-800/80 hover:border-purple-500/60 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-purple-500/20 flex flex-col justify-between overflow-hidden"
    >
      {/* Top Banner & Thumbnail Container */}
      <div className="relative aspect-[4/5] sm:aspect-square w-full rounded-xl overflow-hidden bg-slate-900">
        <img
          src={game.thumbnail}
          alt={game.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Gradient overlay on image */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#090b10] via-transparent to-transparent opacity-80 group-hover:opacity-50 transition-opacity" />

        {/* Subtle glow border inside on hover */}
        <div className="absolute inset-0 rounded-xl border border-transparent group-hover:border-purple-500/40 transition-colors pointer-events-none" />

        {/* Badge status (HOT, PROMO, etc) */}
        {game.badge && (
          <div className="absolute top-2.5 left-2.5 z-10">
            <TagBadge text={game.badge} variant={getBadgeVariant(game.badge)} size="xs" />
          </div>
        )}

        {/* Publisher Tag */}
        <div className="absolute bottom-2 left-2.5 right-2.5 z-10">
          <span className="text-[10px] font-medium text-purple-300/90 drop-shadow uppercase tracking-wider">
            {game.publisher}
          </span>
        </div>
      </div>

      {/* Game Details */}
      <div className="pt-2.5 sm:pt-3 px-1 flex flex-col flex-1 justify-between">
        <div>
          <h3 className="text-xs sm:text-sm font-bold text-slate-100 group-hover:text-purple-300 transition-colors line-clamp-1 font-heading">
            {game.name}
          </h3>
          <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">
            Top up {game.currencyName || 'Item'}
          </p>
        </div>

        {/* Action Button Strip with neon purple-to-blue gradient */}
        <div className="pt-2.5 mt-auto">
          <div className="w-full py-1.5 px-3 rounded-lg bg-slate-800/80 group-hover:bg-gradient-to-r group-hover:from-purple-600 group-hover:to-blue-500 text-slate-300 group-hover:text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-all duration-300 shadow-sm group-hover:shadow-purple-500/25">
            <Zap className="w-3.5 h-3.5 text-purple-400 group-hover:text-white transition-colors" />
            <span>Top Up</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

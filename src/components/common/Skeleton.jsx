import React from 'react';

/**
 * Komponen Skeleton Shimmer Dasar
 */
export function SkeletonBox({ className = '', rounded = 'rounded-lg' }) {
  return (
    <div
      className={`bg-slate-800/60 skeleton-shimmer border border-slate-700/20 ${rounded} ${className}`}
    />
  );
}

/**
 * Skeleton Loader untuk Game Card di Home
 */
export function GameCardSkeleton() {
  return (
    <div className="glass-card rounded-2xl p-3 sm:p-4 border border-slate-800/60 flex flex-col space-y-3">
      {/* Thumbnail */}
      <SkeletonBox className="w-full aspect-[4/5] sm:aspect-square rounded-xl" />
      
      {/* Game Name */}
      <div className="space-y-2 pt-1">
        <SkeletonBox className="h-4 w-4/5 rounded" />
        <SkeletonBox className="h-3 w-1/2 rounded" />
      </div>

      {/* Button placeholder */}
      <div className="pt-2 mt-auto">
        <SkeletonBox className="h-8 w-full rounded-lg" />
      </div>
    </div>
  );
}

/**
 * Skeleton Loader untuk Denominasi / Pilihan Nominal
 */
export function DenomCardSkeleton() {
  return (
    <div className="glass-card rounded-xl p-3 sm:p-4 border border-slate-800/60 flex flex-col justify-between h-24">
      <div className="space-y-2">
        <SkeletonBox className="h-4 w-3/4 rounded" />
        <SkeletonBox className="h-3 w-1/3 rounded" />
      </div>
      <div className="flex justify-between items-center pt-2">
        <SkeletonBox className="h-5 w-20 rounded" />
        <SkeletonBox className="h-4 w-8 rounded-full" />
      </div>
    </div>
  );
}

/**
 * Skeleton Loader untuk Hero / Promo Banner
 */
export function BannerSkeleton() {
  return (
    <div className="glass-card rounded-3xl p-6 sm:p-10 border border-slate-800/60 w-full min-h-[260px] flex flex-col justify-center space-y-4">
      <SkeletonBox className="h-6 w-32 rounded-full" />
      <SkeletonBox className="h-10 w-3/4 max-w-md rounded-lg" />
      <SkeletonBox className="h-4 w-2/3 max-w-sm rounded" />
      <div className="flex gap-3 pt-2">
        <SkeletonBox className="h-10 w-28 rounded-xl" />
        <SkeletonBox className="h-10 w-28 rounded-xl" />
      </div>
    </div>
  );
}

/**
 * Skeleton Loader untuk Form Input
 */
export function FormInputSkeleton() {
  return (
    <div className="glass-card rounded-2xl p-6 border border-slate-800/60 space-y-4">
      <SkeletonBox className="h-5 w-40 rounded" />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <SkeletonBox className="h-12 w-full rounded-xl" />
        <SkeletonBox className="h-12 w-full rounded-xl" />
      </div>
      <SkeletonBox className="h-3 w-3/4 rounded" />
    </div>
  );
}

/**
 * Skeleton Loader untuk Baris Riwayat Pesanan
 */
export function TableRowSkeleton() {
  return (
    <div className="glass-card rounded-xl p-4 border border-slate-800/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <SkeletonBox className="w-12 h-12 rounded-xl" />
        <div className="space-y-2">
          <SkeletonBox className="h-4 w-32 rounded" />
          <SkeletonBox className="h-3 w-24 rounded" />
        </div>
      </div>
      <div className="flex items-center gap-6 w-full sm:w-auto justify-between sm:justify-end">
        <SkeletonBox className="h-4 w-20 rounded" />
        <SkeletonBox className="h-7 w-24 rounded-full" />
      </div>
    </div>
  );
}

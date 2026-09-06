/**
 * Konfigurasi Provider Aktif Terpusat
 * 
 * Nilai ini menentukan service provider mana yang dipanggil oleh controller backend.
 * Nilai yang didukung:
 * - 'bv2shop' (Default & Utama)
 * - 'bahterastore' (Legacy / Alternatif)
 * 
 * Untuk beralih provider, cukup ubah nilai default di bawah ini atau set environment variable ACTIVE_PROVIDER.
 */

export const ACTIVE_PROVIDER = process.env.ACTIVE_PROVIDER || 'bv2shop';

/**
 * Resolver provider aktif (dapat diperluas untuk logic routing per-game di masa depan)
 * @param {string} [gameSlug] - Opsional slug game jika di masa depan routing per-game diaktifkan
 * @returns {string} Nama provider aktif ('bv2shop' | 'bahterastore')
 */
export function resolveActiveProvider(gameSlug = null) {
  // Contoh hook untuk routing per-game jika diperlukan nanti:
  // if (gameSlug === 'special-game') return 'bahterastore';
  return ACTIVE_PROVIDER;
}

export default ACTIVE_PROVIDER;

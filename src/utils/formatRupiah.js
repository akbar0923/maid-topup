/**
 * Utility otomatis untuk memformat angka menjadi format mata uang Rupiah Indonesia (IDR).
 * Maid Top Up System - utils/formatRupiah.js
 * 
 * Contoh pemakaian:
 * formatRupiah(50000) => "Rp 50.000"
 * formatRupiah(50000, false) => "50.000"
 * formatRupiah("125000") => "Rp 125.000"
 * 
 * @param {number|string} amount - Nilai nominal yang ingin diformat
 * @param {boolean} [withSymbol=true] - Menampilkan prefix 'Rp '
 * @returns {string} String Rupiah terformat rapi sesuai standar Indonesia
 */
export function formatRupiah(amount, withSymbol = true) {
  if (amount === undefined || amount === null || amount === '') {
    return withSymbol ? 'Rp 0' : '0';
  }

  // Bersihkan karakter non-angka jika input berupa string rupiah kotor
  let cleanValue = amount;
  if (typeof amount === 'string') {
    cleanValue = amount.replace(/[^0-9.-]+/g, '');
  }

  const numeric = Number(cleanValue);
  if (isNaN(numeric)) {
    return withSymbol ? 'Rp 0' : '0';
  }

  const rounded = Math.round(numeric);
  const formatted = new Intl.NumberFormat('id-ID', {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(rounded);

  return withSymbol ? `Rp ${formatted}` : formatted;
}

/**
 * Format nominal Rupiah dengan opsi desimal
 * @param {number|string} amount 
 * @param {number} decimals 
 * @returns {string}
 */
export function formatRupiahPrecise(amount, decimals = 2) {
  const numeric = Number(amount) || 0;
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(numeric);
}

/**
 * Mengubah string format Rupiah kembali menjadi angka murni
 * Contoh: "Rp 50.000" -> 50000
 * @param {string} rupiahStr 
 * @returns {number}
 */
export function parseRupiah(rupiahStr) {
  if (typeof rupiahStr !== 'string') return Number(rupiahStr) || 0;
  const cleaned = rupiahStr.replace(/[^0-9-]/g, '');
  return parseInt(cleaned, 10) || 0;
}

export default formatRupiah;

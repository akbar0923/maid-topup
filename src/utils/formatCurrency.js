import { formatRupiah, formatRupiahPrecise, parseRupiah } from './formatRupiah';

export { formatRupiah, formatRupiahPrecise, parseRupiah };

/**
 * Format nomor invoice / ID pesanan dengan prefix MAID
 * Contoh: generateInvoiceId() -> "MAID-20260903-8823"
 */
export function generateInvoiceId() {
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  return `MAID-${dateStr}-${randomSuffix}`;
}

export default formatRupiah;

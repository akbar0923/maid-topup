export const PAYMENT_METHODS = [
  { id: 'qris-fast', name: 'QRIS Instant 24 Jam', type: 'qris', fee: 750, feeType: 'flat' },
  { id: 'gopay', name: 'GoPay', type: 'ewallet', fee: 0.015, feeType: 'percent' },
  { id: 'dana', name: 'DANA', type: 'ewallet', fee: 0.015, feeType: 'percent' },
  { id: 'ovo', name: 'OVO', type: 'ewallet', fee: 0.015, feeType: 'percent' },
  { id: 'shopeepay', name: 'ShopeePay', type: 'ewallet', fee: 0.015, feeType: 'percent' },
  { id: 'bca-va', name: 'BCA Virtual Account', type: 'va', fee: 2500, feeType: 'flat' },
  { id: 'mandiri-va', name: 'Mandiri Virtual Account', type: 'va', fee: 2500, feeType: 'flat' },
  { id: 'bri-va', name: 'BRI (BRIVA)', type: 'va', fee: 2500, feeType: 'flat' },
  { id: 'bni-va', name: 'BNI Virtual Account', type: 'va', fee: 2500, feeType: 'flat' },
  { id: 'alfamart', name: 'Alfamart / Alfamidi', type: 'convenience', fee: 3500, feeType: 'flat' },
  { id: 'indomaret', name: 'Indomaret', type: 'convenience', fee: 3500, feeType: 'flat' },
];

export function calculateAdminFee(paymentMethod, subtotal) {
  if (!paymentMethod) return 0;
  if (paymentMethod.feeType === 'percent') {
    return Math.round(subtotal * paymentMethod.fee);
  }
  return paymentMethod.fee || 0;
}

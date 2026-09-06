export const PAYMENT_CATEGORIES = [
  {
    id: 'qris',
    name: 'QRIS (Semua Pembayaran)',
    description: 'Bisa bayar pakai GoPay, OVO, DANA, BCA, Mandiri, dll.',
    methods: [
      {
        id: 'qris-fast',
        name: 'QRIS Instant 24 Jam',
        provider: 'QRIS National',
        type: 'qris',
        fee: 750,
        feeType: 'flat', // flat atau percent
        isInstant: true,
        logo: 'https://images.unsplash.com/photo-1614680376593-902f749f7ffc?w=100&auto=format&fit=crop&q=60',
        badge: 'Otomatis Terverifikasi',
      },
    ],
  },
  {
    id: 'ewallet',
    name: 'E-Wallet',
    description: 'Pembayaran instan langsung dari aplikasi dompet digital',
    methods: [
      {
        id: 'gopay',
        name: 'GoPay',
        provider: 'Gojek',
        type: 'ewallet',
        fee: 0.015,
        feeType: 'percent',
        isInstant: true,
        badge: 'Instan',
      },
      {
        id: 'dana',
        name: 'DANA',
        provider: 'DANA Indonesia',
        type: 'ewallet',
        fee: 0.015,
        feeType: 'percent',
        isInstant: true,
        badge: 'Instan',
      },
      {
        id: 'ovo',
        name: 'OVO',
        provider: 'OVO',
        type: 'ewallet',
        fee: 0.015,
        feeType: 'percent',
        isInstant: true,
      },
      {
        id: 'shopeepay',
        name: 'ShopeePay',
        provider: 'Shopee',
        type: 'ewallet',
        fee: 0.015,
        feeType: 'percent',
        isInstant: true,
      },
    ],
  },
  {
    id: 'va',
    name: 'Virtual Account (Transfer Bank)',
    description: 'Bisa transfer melalui ATM, Mobile Banking, atau Internet Banking',
    methods: [
      {
        id: 'bca-va',
        name: 'BCA Virtual Account',
        provider: 'Bank Central Asia',
        type: 'va',
        fee: 2500,
        feeType: 'flat',
        isInstant: true,
        badge: '24 Jam',
      },
      {
        id: 'mandiri-va',
        name: 'Mandiri Virtual Account',
        provider: 'Bank Mandiri',
        type: 'va',
        fee: 2500,
        feeType: 'flat',
        isInstant: true,
      },
      {
        id: 'bri-va',
        name: 'BRI (BRIVA)',
        provider: 'Bank BRI',
        type: 'va',
        fee: 2500,
        feeType: 'flat',
        isInstant: true,
      },
      {
        id: 'bni-va',
        name: 'BNI Virtual Account',
        provider: 'Bank BNI',
        type: 'va',
        fee: 2500,
        feeType: 'flat',
        isInstant: true,
      },
    ],
  },
  {
    id: 'convenience',
    name: 'Minimarket (Retail)',
    description: 'Bayar tunai di gerai minimarket terdekat',
    methods: [
      {
        id: 'alfamart',
        name: 'Alfamart / Alfamidi',
        provider: 'Alfamart Retail',
        type: 'convenience',
        fee: 3500,
        feeType: 'flat',
        isInstant: false,
      },
      {
        id: 'indomaret',
        name: 'Indomaret',
        provider: 'Indomaret Group',
        type: 'convenience',
        fee: 3500,
        feeType: 'flat',
        isInstant: false,
      },
    ],
  },
];

/**
 * Hitung biaya admin berdasarkan metode pembayaran dan subtotal
 */
export function calculateAdminFee(paymentMethod, subtotal) {
  if (!paymentMethod) return 0;
  if (paymentMethod.feeType === 'percent') {
    return Math.round(subtotal * paymentMethod.fee);
  }
  return paymentMethod.fee || 0;
}

import crypto from 'crypto';
import { bv2shopService } from './services/providers/bv2shopService.js';
import { bahteraStoreService } from './services/providers/bahteraStoreService.js';
import { getProvider, getActiveProvider, activeProvider } from './services/providers/index.js';
import { verifyBV2ShopSignature } from './controllers/webhookController.js';
import config from './config/index.js';

let testsPassed = 0;
let testsFailed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  ✅ PASS: ${message}`);
    testsPassed++;
  } else {
    console.error(`  ❌ FAIL: ${message}`);
    testsFailed++;
  }
}

async function runTests() {
  console.log('\n======================================================');
  console.log('🧪 1. MEMERIKSA KONTRAK INTERFACE PROVIDER (BV2SHOP vs BAHTERASTORE)');
  console.log('======================================================');

  const requiredMethods = ['getProductList', 'createOrder', 'getOrderStatus', 'getBalance'];

  for (const method of requiredMethods) {
    assert(typeof bv2shopService[method] === 'function', `bv2shopService memiliki fungsi "${method}"`);
    assert(typeof bahteraStoreService[method] === 'function', `bahteraStoreService memiliki fungsi "${method}"`);
    assert(typeof activeProvider[method] === 'function', `activeProvider proxy memiliki fungsi "${method}"`);
  }

  console.log('\n======================================================');
  console.log('🧪 2. MENGUJI getProductList PADA BV2SHOP (Field requirements)');
  console.log('======================================================');

  const products = await bv2shopService.getProductList({ gameSlug: 'mlbb' });
  assert(Array.isArray(products) && products.length > 0, `bv2shopService.getProductList mengembalikan array produk (${products.length} item)`);

  const firstProduct = products[0];
  assert(firstProduct && firstProduct.product_id, `Produk memiliki field product_id (${firstProduct?.product_id})`);
  assert(firstProduct && firstProduct.sku, `Produk memiliki field sku (${firstProduct?.sku})`);
  assert(firstProduct && firstProduct.price !== undefined, `Produk memiliki field price (${firstProduct?.price})`);
  assert(firstProduct && firstProduct.requirements !== undefined, `Produk memiliki field requirements`);
  assert('requires_login_id' in firstProduct.requirements, `requirements memiliki requires_login_id`);
  assert('requires_zone_id' in firstProduct.requirements, `requirements memiliki requires_zone_id`);
  assert('requires_nickname' in firstProduct.requirements, `requirements memiliki requires_nickname`);
  assert('requires_server' in firstProduct.requirements, `requirements memiliki requires_server`);
  assert('requires_phone_number' in firstProduct.requirements, `requirements memiliki requires_phone_number`);
  assert('is_voucher' in firstProduct.requirements, `requirements memiliki is_voucher`);
  assert('form_fields' in firstProduct.requirements, `requirements memiliki form_fields`);

  console.log('\n======================================================');
  console.log('🧪 3. MENGUJI getBalance PADA BV2SHOP');
  console.log('======================================================');

  const balanceResult = await bv2shopService.getBalance();
  assert(balanceResult.success === true, `getBalance mengembalikan success: true`);
  assert(typeof balanceResult.balance === 'number', `getBalance mengembalikan balance bertipe number (${balanceResult.balance})`);
  assert(balanceResult.currency === 'IDR', `getBalance mengembalikan currency IDR`);

  console.log('\n======================================================');
  console.log('🧪 4. MENGUJI createOrder & IDEMPOTENSI (refId)');
  console.log('======================================================');

  const orderResult = await bv2shopService.createOrder({
    refId: 'MAID-TEST-12345',
    productId: firstProduct.product_id,
    target: '12345678',
    zoneId: '1234',
    nickname: 'TestPlayer',
    phoneNumber: '081234567890',
  });
  assert(orderResult.success === true, `createOrder mengembalikan success: true`);
  assert(orderResult.invoice_id, `createOrder mengembalikan invoice_id (${orderResult.invoice_id})`);

  console.log('\n======================================================');
  console.log('🧪 5. MENGUJI getOrderStatus PADA BV2SHOP');
  console.log('======================================================');

  const statusResult = await bv2shopService.getOrderStatus('MAID-TEST-12345');
  assert(statusResult.success === true, `getOrderStatus mengembalikan success: true`);
  assert(statusResult.fulfillment_status, `getOrderStatus mengembalikan fulfillment_status (${statusResult.fulfillment_status})`);

  console.log('\n======================================================');
  console.log('🧪 6. MENGUJI VERIFIKASI SIGNATURE HMAC-SHA256 DARI RAW BODY');
  console.log('======================================================');

  const secret = 'bv2_test_secret_key_2026';
  const rawBodyPayload = Buffer.from(JSON.stringify({
    event: 'order.completed',
    invoice_id: 'INV-BV2-9988',
    ref_id: 'MAID-20260906-1122',
    product_name: 'Mobile Legends 86 Diamonds',
    target: '12345678 (1234)',
    total_price: 19500,
    fulfillment_status: 'SUCCESS',
    message: 'Item berhasil dikirim ke akun.',
    sent_at: new Date().toISOString(),
  }));

  // Hitung signature valid
  const validSignature = crypto.createHmac('sha256', secret).update(rawBodyPayload).digest('hex');

  const isVerifiedValid = verifyBV2ShopSignature(rawBodyPayload, validSignature, secret);
  assert(isVerifiedValid === true, `Signature yang valid berhasil diverifikasi (HMAC-SHA256 cocok)`);

  const isVerifiedInvalidSig = verifyBV2ShopSignature(rawBodyPayload, 'invalid_fake_signature_hex_code_1234567890abcdef', secret);
  assert(isVerifiedInvalidSig === false, `Signature palsu ditolak (verifyBV2ShopSignature mengembalikan false)`);

  const tamperedRawBody = Buffer.from(JSON.stringify({
    event: 'order.completed',
    invoice_id: 'INV-BV2-9988',
    ref_id: 'MAID-20260906-1122',
    total_price: 1, // Manipulasi harga!
  }));
  const isVerifiedTampered = verifyBV2ShopSignature(tamperedRawBody, validSignature, secret);
  assert(isVerifiedTampered === false, `Payload yang dimanipulasi ditolak karena signature berbeda`);

  console.log('\n======================================================');
  console.log('🧪 7. MENGUJI PROVIDER SWITCHING (BV2SHOP <-> BAHTERASTORE)');
  console.log('======================================================');

  const active = getActiveProvider();
  assert(active.name === 'bv2shop', `Default active provider adalah "bv2shop"`);

  const bahtera = getProvider('bahterastore');
  assert(bahtera.name === 'bahterastore', `getProvider('bahterastore') mengembalikan BahteraStore service`);

  console.log('\n======================================================');
  console.log(`🏁 HASIL PENGUJIAN: ${testsPassed} PASSED, ${testsFailed} FAILED`);
  console.log('======================================================\n');

  if (testsFailed > 0) {
    process.exit(1);
  }
}

runTests().catch((err) => {
  console.error('Test execution error:', err);
  process.exit(1);
});

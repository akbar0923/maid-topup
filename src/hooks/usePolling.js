import { useState, useEffect, useRef, useCallback } from 'react';
import { orderService } from '../services/orderService';

/**
 * Custom hook untuk melakukan polling status pesanan secara real-time.
 * 
 * @param {string} invoiceId - Nomor invoice pesanan
 * @param {Object} options
 * @param {number} [options.interval=3000] - Interval polling dalam milidetik (default 3 detik)
 * @param {boolean} [options.enabled=true] - Status apakah polling aktif
 * @param {Function} [options.onSuccess] - Callback saat status berubah menjadi SUCCESS
 */
export function usePolling(invoiceId, options = {}) {
  const { interval = 3000, enabled = true, onSuccess } = options;

  const [order, setOrder] = useState(null);
  const [status, setStatus] = useState('PENDING');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pollCount, setPollCount] = useState(0);

  const timeoutRef = useRef(null);
  const isMountedRef = useRef(true);

  const fetchStatus = useCallback(async () => {
    if (!invoiceId) return;

    try {
      const response = await orderService.checkOrderStatus(invoiceId);
      if (!isMountedRef.current) return;

      if (response.success && response.data) {
        setOrder(response.data);
        setStatus(response.data.status);
        setError(null);

        if (response.data.status === 'SUCCESS' && onSuccess) {
          onSuccess(response.data);
        }
      } else {
        setError(response.message || 'Data pesanan tidak ditemukan.');
      }
    } catch (err) {
      if (isMountedRef.current) {
        setError(err.message || 'Gagal mengecek status transaksi.');
      }
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
        setPollCount((prev) => prev + 1);
      }
    }
  }, [invoiceId, onSuccess]);

  useEffect(() => {
    isMountedRef.current = true;

    // Ambil data pertama kali
    fetchStatus();

    // Setup polling interval jika masih status PENDING atau PROCESSING
    const shouldContinuePolling = enabled && status !== 'SUCCESS' && status !== 'FAILED';

    if (shouldContinuePolling) {
      timeoutRef.current = setInterval(() => {
        fetchStatus();
      }, interval);
    }

    return () => {
      isMountedRef.current = false;
      if (timeoutRef.current) {
        clearInterval(timeoutRef.current);
      }
    };
  }, [fetchStatus, enabled, status, interval]);

  // Method untuk paksa trigger status berubah (simulasi cepat untuk pengujian)
  const forceStatus = (targetStatus) => {
    const updated = orderService.forceUpdateStatus(invoiceId, targetStatus);
    if (updated) {
      setOrder(updated);
      setStatus(updated.status);
    }
  };

  return {
    order,
    status,
    loading,
    error,
    pollCount,
    refetch: fetchStatus,
    forceStatus,
  };
}

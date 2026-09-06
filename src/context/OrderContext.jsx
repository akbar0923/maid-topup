import React, { createContext, useContext, useState, useEffect } from 'react';
import { orderService } from '../services/orderService';

const OrderContext = createContext();

export function OrderProvider({ children }) {
  // Riwayat pesanan yang tersimpan
  const [orders, setOrders] = useState([]);
  // Status loading global untuk aksi order
  const [isSubmitting, setIsSubmitting] = useState(false);
  // Sistem Toast notifikasi sederhana & elegan
  const [toast, setToast] = useState(null);

  // Load orders history saat inisialisasi
  useEffect(() => {
    const local = orderService.getLocalOrders();
    setOrders(local);
  }, []);

  const showToast = (message, type = 'info', duration = 3500) => {
    setToast({ message, type, id: Date.now() });
    setTimeout(() => {
      setToast((prev) => (prev?.id ? null : prev));
    }, duration);
  };

  const hideToast = () => setToast(null);

  /**
   * Membuat transaksi baru
   */
  const submitOrder = async (orderPayload) => {
    setIsSubmitting(true);
    try {
      const result = await orderService.createOrder(orderPayload);
      if (result.success) {
        // Refresh riwayat order
        setOrders(orderService.getLocalOrders());
        showToast('Pesanan berhasil dibuat!', 'success');
        return result.data;
      }
      throw new Error(result.message || 'Gagal memproses pesanan.');
    } catch (error) {
      showToast(error.message || 'Terjadi kesalahan saat checkout.', 'error');
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  const refreshOrders = () => {
    setOrders(orderService.getLocalOrders());
  };

  return (
    <OrderContext.Provider
      value={{
        orders,
        isSubmitting,
        toast,
        showToast,
        hideToast,
        submitOrder,
        refreshOrders,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
}

export const useOrder = () => useContext(OrderContext);

import { useState, useEffect, useCallback } from 'react';
import { gameService } from '../services/gameService';

/**
 * Custom hook untuk memuat data detail satu game dan mengelola state form order.
 * 
 * @param {string} slug - Slug URL game
 */
export function useGameDetail(slug) {
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Form State
  const [inputs, setInputs] = useState({});
  const [selectedDenomination, setSelectedDenomination] = useState(null);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [whatsapp, setWhatsapp] = useState('');

  // Validasi ID / Cek Nickname state
  const [nickname, setNickname] = useState('');
  const [isCheckingId, setIsCheckingId] = useState(false);
  const [idCheckError, setIdCheckError] = useState('');

  const fetchDetail = useCallback(async () => {
    if (!slug) return;
    setLoading(true);
    setError(null);
    try {
      const result = await gameService.getGameBySlug(slug);
      setGame(result.data);
      // Inisialisasi default inputs
      const initialInputs = {};
      result.data.inputFields?.forEach((field) => {
        initialInputs[field.id] = field.type === 'select' && field.options?.[0] ? field.options[0].value : '';
      });
      setInputs(initialInputs);
      // Reset selected states
      setSelectedDenomination(null);
      setSelectedPayment(null);
    } catch (err) {
      setError(err.message || 'Game tidak ditemukan.');
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    fetchDetail();
  }, [fetchDetail]);

  const handleInputChange = (fieldId, value) => {
    setInputs((prev) => ({ ...prev, [fieldId]: value }));
    setNickname(''); // Reset nickname saat ID diubah
    setIdCheckError('');
  };

  // Verifikasi ID Akun Game
  const handleVerifyId = async () => {
    if (!game || !inputs.userId) {
      setIdCheckError('Masukkan User ID terlebih dahulu.');
      return;
    }
    setIsCheckingId(true);
    setIdCheckError('');
    try {
      const res = await gameService.checkNickname(game.id, inputs.userId, inputs.zoneId || '');
      if (res.success) {
        setNickname(res.nickname);
      } else {
        setIdCheckError(res.message);
      }
    } catch (err) {
      setIdCheckError('Gagal memverifikasi akun.');
    } finally {
      setIsCheckingId(false);
    }
  };

  return {
    game,
    loading,
    error,
    inputs,
    handleInputChange,
    selectedDenomination,
    setSelectedDenomination,
    selectedPayment,
    setSelectedPayment,
    whatsapp,
    setWhatsapp,
    nickname,
    isCheckingId,
    idCheckError,
    handleVerifyId,
    refetch: fetchDetail,
  };
}

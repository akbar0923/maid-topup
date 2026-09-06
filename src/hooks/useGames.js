import { useState, useEffect, useMemo, useCallback } from 'react';
import { gameService } from '../services/gameService';

/**
 * Custom hook untuk mengelola katalog game, filtering kategori, dan pencarian.
 */
export function useGames() {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const fetchGames = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await gameService.getGames();
      setGames(result.data || []);
    } catch (err) {
      setError(err.message || 'Gagal memuat daftar game.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGames();
  }, [fetchGames]);

  // Filter games berdasarkan kategori dan query pencarian
  const filteredGames = useMemo(() => {
    return games.filter((game) => {
      const matchCategory =
        selectedCategory === 'all' || game.category?.toLowerCase() === selectedCategory.toLowerCase();

      const matchSearch =
        !searchQuery.trim() ||
        game.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        game.publisher?.toLowerCase().includes(searchQuery.toLowerCase());

      return matchCategory && matchSearch;
    });
  }, [games, selectedCategory, searchQuery]);

  return {
    games: filteredGames,
    allGames: games,
    loading,
    error,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    refetch: fetchGames,
  };
}

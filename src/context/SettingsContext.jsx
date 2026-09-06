import React, { createContext, useContext, useState, useEffect } from 'react';
import { GAMES_DATA } from '../constants/gamesData';

const SettingsContext = createContext();

// Default Hero Settings persis seperti tampilan awal pada screenshot
export const DEFAULT_HERO_SETTINGS = {
  promoCardImage: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&auto=format&fit=crop&q=80',
  promoBadge: 'PROMO SPESIAL PEKAN INI',
  promoTitle: 'Mobile Legends Weekly Pass',
  promoSubtitle: 'Diskon hingga 70% hemat maksimal',
  serverStatus: 'online', // 'online' | 'maintenance'
  apiStatus: 'API Connected',
  guaranteeText: '100% Garansi',
  qrisText: 'Semua Bank',
};

// Preset Gambar Gaming Berkualitas Tinggi Siap Pakai
export const GAMING_PRESETS = [
  {
    id: 'mlbb-esports',
    name: 'Mobile Legends Esports',
    url: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&auto=format&fit=crop&q=80',
    tag: 'Esports Arena',
  },
  {
    id: 'genshin-anime',
    name: 'Fantasy RPG / Genshin',
    url: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800&auto=format&fit=crop&q=80',
    tag: 'Anime World',
  },
  {
    id: 'cyberpunk-neon',
    name: 'Neon Cyber Gaming',
    url: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=800&auto=format&fit=crop&q=80',
    tag: 'Cyber Neon',
  },
  {
    id: 'valorant-fps',
    name: 'Tactical Shooter / Valorant',
    url: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&auto=format&fit=crop&q=80',
    tag: 'Action Arena',
  },
  {
    id: 'battle-royale-ff',
    name: 'Battle Royale Arena',
    url: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=800&auto=format&fit=crop&q=80',
    tag: 'Survival FPS',
  },
];

export function SettingsProvider({ children }) {
  // Hero / Promo settings
  const [heroSettings, setHeroSettings] = useState(() => {
    try {
      const saved = localStorage.getItem('maid_hero_settings');
      return saved ? { ...DEFAULT_HERO_SETTINGS, ...JSON.parse(saved) } : DEFAULT_HERO_SETTINGS;
    } catch {
      return DEFAULT_HERO_SETTINGS;
    }
  });

  // Dynamic Game Catalog & Prices
  const [gamesCatalog, setGamesCatalog] = useState(() => {
    try {
      const saved = localStorage.getItem('maid_custom_catalog');
      return saved ? JSON.parse(saved) : GAMES_DATA;
    } catch {
      return GAMES_DATA;
    }
  });

  // Simpan heroSettings ke localStorage
  useEffect(() => {
    try {
      localStorage.setItem('maid_hero_settings', JSON.stringify(heroSettings));
    } catch (e) {
      console.error('Gagal menyimpan hero settings', e);
    }
  }, [heroSettings]);

  // Simpan gamesCatalog ke localStorage
  useEffect(() => {
    try {
      localStorage.setItem('maid_custom_catalog', JSON.stringify(gamesCatalog));
    } catch (e) {
      console.error('Gagal menyimpan catalog', e);
    }
  }, [gamesCatalog]);

  /**
   * Update pengaturan hero promo card (gambar, judul, badge, dll)
   */
  const updateHeroSettings = (newSettings) => {
    setHeroSettings((prev) => ({
      ...prev,
      ...newSettings,
    }));
  };

  /**
   * Update harga satuan item denominasi game
   */
  const updateGamePrice = (gameId, denomId, newPrice) => {
    const numericPrice = Math.max(0, Math.round(Number(newPrice) || 0));
    setGamesCatalog((prevCatalog) => {
      return prevCatalog.map((game) => {
        if (game.id !== gameId && game.slug !== gameId) return game;

        const updatedDenoms = game.denominations.map((denom) => {
          if (denom.id === denomId) {
            return {
              ...denom,
              price: numericPrice,
              isCustomPrice: true,
            };
          }
          return denom;
        });

        return {
          ...game,
          denominations: updatedDenoms,
        };
      });
    });
  };

  /**
   * Update info umum game (misal: thumbnail game di beranda, banner, deskripsi)
   */
  const updateGameInfo = (gameId, fields) => {
    setGamesCatalog((prevCatalog) => {
      return prevCatalog.map((game) => {
        if (game.id !== gameId && game.slug !== gameId) return game;
        return {
          ...game,
          ...fields,
        };
      });
    });
  };

  /**
   * Toggle status aktif/nonaktif item denominasi
   */
  const toggleDenomActive = (gameId, denomId) => {
    setGamesCatalog((prevCatalog) => {
      return prevCatalog.map((game) => {
        if (game.id !== gameId && game.slug !== gameId) return game;
        const updatedDenoms = game.denominations.map((denom) => {
          if (denom.id === denomId) {
            return {
              ...denom,
              disabled: !denom.disabled,
            };
          }
          return denom;
        });
        return { ...game, denominations: updatedDenoms };
      });
    });
  };

  /**
   * Bulk Price Markup: Menaikkan atau menurunkan harga seluruh game atau game tertentu
   * @param {string} targetGameId - 'all' atau ID game tertentu
   * @param {number} percentage - contoh: 5 untuk +5%, -3 untuk diskon 3%
   * @param {number} fixedAmount - contoh: 1000 untuk +Rp 1.000
   */
  const applyBulkMarkup = (targetGameId = 'all', percentage = 0, fixedAmount = 0) => {
    const pctMultiplier = 1 + (Number(percentage) || 0) / 100;
    const addFixed = Number(fixedAmount) || 0;

    setGamesCatalog((prevCatalog) => {
      return prevCatalog.map((game) => {
        if (targetGameId !== 'all' && game.id !== targetGameId && game.slug !== targetGameId) {
          return game;
        }

        const updatedDenoms = game.denominations.map((denom) => {
          const currentPrice = denom.price;
          const calculated = Math.round(currentPrice * pctMultiplier + addFixed);
          const finalPrice = Math.max(500, calculated);

          return {
            ...denom,
            price: finalPrice,
            isCustomPrice: true,
          };
        });

        return {
          ...game,
          denominations: updatedDenoms,
        };
      });
    });
  };

  /**
   * Reset seluruh konfigurasi (Gambar Beranda & Harga Game) kembali ke default awal
   */
  const resetAllToDefault = () => {
    setHeroSettings(DEFAULT_HERO_SETTINGS);
    setGamesCatalog(GAMES_DATA);
    localStorage.removeItem('maid_hero_settings');
    localStorage.removeItem('maid_custom_catalog');
  };

  /**
   * Reset hanya gambar beranda ke default
   */
  const resetHeroToDefault = () => {
    setHeroSettings(DEFAULT_HERO_SETTINGS);
    localStorage.removeItem('maid_hero_settings');
  };

  /**
   * Reset harga game ke default
   */
  const resetPricesToDefault = () => {
    setGamesCatalog(GAMES_DATA);
    localStorage.removeItem('maid_custom_catalog');
  };

  return (
    <SettingsContext.Provider
      value={{
        heroSettings,
        gamesCatalog,
        updateHeroSettings,
        updateGamePrice,
        updateGameInfo,
        toggleDenomActive,
        applyBulkMarkup,
        resetAllToDefault,
        resetHeroToDefault,
        resetPricesToDefault,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export const useSettings = () => useContext(SettingsContext);
export default SettingsContext;

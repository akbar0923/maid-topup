import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

// Akun Demo Standar
export const DEMO_ACCOUNTS = {
  superadmin: {
    id: 'usr_superadmin',
    name: 'Super Admin Maid',
    email: 'admin@maid.id',
    phone: '081299998888',
    avatar: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=150&auto=format&fit=crop&q=80',
    role: 'superadmin',
    joinedAt: '2026-01-01T00:00:00.000Z',
    password: 'admin123',
  },
  member: {
    id: 'usr_member',
    name: 'Gamer Maid Pro',
    email: 'gamer@maid.id',
    phone: '081234567890',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    role: 'member',
    joinedAt: '2026-03-01T00:00:00.000Z',
    password: 'secret123',
  },
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('maid_auth_user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      localStorage.setItem('maid_auth_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('maid_auth_user');
    }
  }, [user]);

  // Login dengan deteksi Super Admin vs Member Biasa
  const login = async (email, password) => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 500));

    if (!email || !password) {
      setIsLoading(false);
      throw new Error('Email dan kata sandi wajib diisi.');
    }

    const cleanEmail = email.trim().toLowerCase();

    // Cek apakah kredensial Super Admin
    if (cleanEmail === 'admin@maid.id' || cleanEmail.startsWith('admin')) {
      if (password !== 'admin123' && password !== 'secret123' && password.length < 4) {
        setIsLoading(false);
        throw new Error('Kata sandi Super Admin tidak valid.');
      }
      const adminUser = {
        ...DEMO_ACCOUNTS.superadmin,
        email: cleanEmail,
      };
      setUser(adminUser);
      setIsLoading(false);
      return adminUser;
    }

    // Default: Akun Member Biasa
    const memberUser = {
      id: 'usr_' + Date.now(),
      name: email.split('@')[0],
      email: cleanEmail,
      phone: '081234567890',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      role: 'member',
      joinedAt: new Date().toISOString(),
    };

    setUser(memberUser);
    setIsLoading(false);
    return memberUser;
  };

  // Login cepat untuk testing (Super Admin atau Member)
  const loginAs = async (targetRole = 'superadmin') => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 300));
    const targetUser = targetRole === 'superadmin' ? DEMO_ACCOUNTS.superadmin : DEMO_ACCOUNTS.member;
    setUser(targetUser);
    setIsLoading(false);
    return targetUser;
  };

  // Register sederhana (selalu mendaftar sebagai member biasa)
  const register = async (name, email, password, phone) => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 600));

    if (!name || !email || !password) {
      setIsLoading(false);
      throw new Error('Semua kolom pendaftaran wajib diisi.');
    }

    const newUser = {
      id: 'usr_' + Date.now(),
      name,
      email: email.trim().toLowerCase(),
      phone: phone || '',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      role: 'member', // Member biasa
      joinedAt: new Date().toISOString(),
    };

    setUser(newUser);
    setIsLoading(false);
    return newUser;
  };

  // Ganti Kata Sandi (tersedia untuk Member Biasa maupun Super Admin)
  const changePassword = async (oldPassword, newPassword) => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 500));

    if (!newPassword || newPassword.length < 6) {
      setIsLoading(false);
      throw new Error('Kata sandi baru minimal 6 karakter.');
    }

    // Simpan status pembaruan password di user
    setUser((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        passwordLastChanged: new Date().toISOString(),
      };
    });

    setIsLoading(false);
    return { success: true, message: 'Kata sandi berhasil diperbarui.' };
  };

  // Update profil umum
  const updateProfile = (updatedFields) => {
    setUser((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        ...updatedFields,
      };
    });
  };

  // Logout
  const logout = () => {
    setUser(null);
  };

  const isSuperAdmin = user?.role === 'superadmin';

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isSuperAdmin,
        isLoading,
        login,
        loginAs,
        register,
        changePassword,
        updateProfile,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
export default AuthContext;

import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Gamepad2,
  Search,
  History,
  ShieldCheck,
  User,
  LogOut,
  Menu,
  X,
  Sparkles,
  Zap,
  Crown,
  Settings,
  KeyRound,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function Navbar() {
  const { user, isAuthenticated, isSuperAdmin, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Daftar Navigasi Dasar
  const baseNavLinks = [
    { label: 'Beranda', path: '/', icon: Gamepad2 },
    { label: 'Lacak Pesanan', path: '/order-status', icon: Zap },
    { label: 'Riwayat Transaksi', path: '/history', icon: History },
  ];

  // Tambahkan link Dashboard HANYA JIKA user adalah SUPER ADMIN
  const navLinks = isSuperAdmin
    ? [
        ...baseNavLinks,
        { label: '👑 Dashboard', path: '/dashboard', icon: Crown, isSpecial: true },
      ]
    : baseNavLinks;

  const isActive = (path) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-[#090b10]/80 border-b border-white/5 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-4">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-3 group shrink-0">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-blue-500 p-[1.5px] shadow-lg shadow-purple-500/25 group-hover:shadow-purple-500/45 transition-all duration-300">
              <div className="w-full h-full bg-[#0d121f] rounded-2xl flex items-center justify-center">
                <Gamepad2 className="w-5 h-5 text-purple-400 group-hover:scale-110 transition-transform duration-300" />
              </div>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-heading font-extrabold text-xl tracking-tight bg-gradient-to-r from-purple-400 via-indigo-400 to-blue-400 bg-clip-text text-transparent">
                  MAID
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-purple-500/10 text-purple-300 border border-purple-500/30">
                  TOPUP
                </span>
              </div>
              <span className="text-[10px] text-slate-400 hidden sm:block tracking-wide">
                Instant Game Reloads
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const active = isActive(link.path);
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                    active
                      ? 'bg-gradient-to-r from-purple-500/20 to-blue-500/20 text-purple-300 border border-purple-500/40 shadow-sm shadow-purple-500/10'
                      : link.isSpecial
                      ? 'text-purple-300 hover:text-white bg-purple-600/10 hover:bg-purple-600/20 border border-purple-500/30'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${active ? 'text-purple-400' : link.isSpecial ? 'text-purple-400' : 'text-slate-400'}`} />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right Action: Auth / User Profile */}
          <div className="flex items-center gap-3">
            {/* Desktop Auth */}
            <div className="hidden sm:flex items-center gap-2">
              {isAuthenticated ? (
                <div className="relative">
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl glass-card hover:border-purple-500/40 transition cursor-pointer"
                  >
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-7 h-7 rounded-full object-cover border border-purple-500/40"
                    />
                    <div className="flex flex-col text-left">
                      <span className="text-xs font-semibold text-slate-200 leading-tight">{user.name}</span>
                      <span className="text-[10px] text-purple-400 uppercase font-mono font-bold leading-tight">
                        {isSuperAdmin ? 'Super Admin' : 'Member'}
                      </span>
                    </div>
                  </button>

                  {userDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-52 glass-card rounded-2xl p-2 border border-slate-700/80 shadow-2xl z-50 animate-in fade-in">
                      <div className="px-3 py-2 border-b border-slate-800 mb-1">
                        <p className="text-[11px] text-slate-400">Masuk sebagai</p>
                        <p className="text-xs font-semibold text-slate-200 truncate">{user.email}</p>
                        <span className="inline-block mt-1 px-1.5 py-0.5 rounded text-[9px] font-extrabold uppercase bg-purple-500/20 text-purple-300 border border-purple-500/30">
                          {isSuperAdmin ? '👑 Super Admin' : '🎮 Member Biasa'}
                        </span>
                      </div>

                      {/* Menu Khusus Super Admin */}
                      {isSuperAdmin && (
                        <Link
                          to="/dashboard"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-purple-300 hover:text-white hover:bg-purple-600/20 rounded-xl transition"
                        >
                          <Crown className="w-3.5 h-3.5 text-purple-400" />
                          Dashboard Pengelola
                        </Link>
                      )}

                      {/* Menu untuk Semua User yang Login */}
                      <Link
                        to="/settings"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800/80 rounded-xl transition"
                      >
                        <KeyRound className="w-3.5 h-3.5 text-purple-400" />
                        Pengaturan & Sandi
                      </Link>

                      <Link
                        to="/history"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800/80 rounded-xl transition"
                      >
                        <History className="w-3.5 h-3.5 text-cyan-400" />
                        Riwayat Transaksi
                      </Link>

                      <button
                        onClick={() => {
                          logout();
                          setUserDropdownOpen(false);
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-rose-400 hover:bg-rose-500/10 rounded-xl transition cursor-pointer"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        Keluar
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white rounded-xl hover:bg-slate-800/60 transition"
                  >
                    Masuk
                  </Link>
                  <Link
                    to="/register"
                    className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-500 rounded-xl hover:from-purple-500 hover:to-blue-400 shadow-md shadow-purple-600/25 border border-purple-400/30 neon-glow-purple-btn transition"
                  >
                    Daftar
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800/60 transition"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden glass-card border-b border-slate-800 px-4 pt-3 pb-6 space-y-3 animate-in slide-in-from-top-2 duration-200">
          <nav className="flex flex-col gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const active = isActive(link.path);
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition ${
                    active
                      ? 'bg-gradient-to-r from-purple-500/20 to-blue-500/20 text-purple-300 border border-purple-500/40'
                      : link.isSpecial
                      ? 'text-purple-300 bg-purple-600/10 border border-purple-500/30'
                      : 'text-slate-300 hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${link.isSpecial ? 'text-purple-400' : 'text-slate-400'}`} />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="pt-3 border-t border-slate-800/80">
            {isAuthenticated ? (
              <div className="space-y-2">
                <div className="flex items-center gap-3 px-3 py-2">
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-9 h-9 rounded-full object-cover border border-purple-500/40"
                  />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <p className="text-sm font-semibold text-white">{user.name}</p>
                      <span className="px-1.5 py-0.2 rounded text-[9px] font-bold uppercase bg-purple-500/20 text-purple-300">
                        {isSuperAdmin ? 'Super Admin' : 'Member'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400">{user.email}</p>
                  </div>
                </div>

                <Link
                  to="/settings"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-200 glass-card rounded-xl"
                >
                  <KeyRound className="w-4 h-4 text-purple-400" />
                  <span>Pengaturan Akun & Ganti Sandi</span>
                </Link>

                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-rose-500/15 text-rose-400 border border-rose-500/30 text-sm font-medium"
                >
                  <LogOut className="w-4 h-4" />
                  Keluar dari Akun
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center py-2.5 rounded-xl glass-card text-sm font-medium text-slate-200 hover:text-white"
                >
                  Masuk
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center py-2.5 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-500 text-sm font-medium text-white shadow-lg shadow-purple-600/25"
                >
                  Daftar
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

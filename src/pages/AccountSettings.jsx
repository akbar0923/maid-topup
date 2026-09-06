import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  User,
  Lock,
  Shield,
  KeyRound,
  CheckCircle2,
  AlertCircle,
  Crown,
  LayoutDashboard,
  Save,
  Clock,
  History,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useOrder } from '../context/OrderContext';
import Button from '../components/common/Button';

export default function AccountSettings() {
  const { user, isSuperAdmin, changePassword, updateProfile } = useAuth();
  const { showToast } = useOrder();

  // State Ganti Password
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isChangingPass, setIsChangingPass] = useState(false);
  const [passError, setPassError] = useState('');
  const [passSuccess, setPassSuccess] = useState('');

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPassError('');
    setPassSuccess('');

    if (!newPassword || newPassword.length < 6) {
      setPassError('Kata sandi baru minimal harus 6 karakter.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPassError('Konfirmasi kata sandi tidak cocok dengan kata sandi baru.');
      return;
    }

    setIsChangingPass(true);
    try {
      await changePassword(oldPassword, newPassword);
      setPassSuccess('Kata sandi Anda berhasil diperbarui!');
      showToast('Kata sandi berhasil diubah!', 'success');
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setPassError(err.message || 'Gagal mengubah kata sandi.');
    } finally {
      setIsChangingPass(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8 my-6 sm:my-10 animate-in fade-in duration-300">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-white">
          Pengaturan Akun
        </h1>
        <p className="text-xs sm:text-sm text-slate-400">
          Kelola informasi keamanan akun Anda dan lakukan pembaruan kata sandi.
        </p>
      </div>

      {/* Account Info Card */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-6 shadow-2xl">
        <div className="flex flex-col sm:flex-row items-center gap-5 pb-6 border-b border-slate-800">
          <img
            src={user.avatar}
            alt={user.name}
            className="w-20 h-20 rounded-2xl object-cover border-2 border-purple-500/40 shadow-lg shadow-purple-500/20"
          />
          <div className="space-y-1.5 text-center sm:text-left flex-1">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h2 className="text-lg sm:text-xl font-bold font-heading text-white">{user.name}</h2>
              {isSuperAdmin ? (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/40 text-[10px] font-extrabold tracking-wider">
                  <Crown className="w-3 h-3 text-purple-400" />
                  <span>SUPER ADMIN</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-[10px] font-bold tracking-wider">
                  <User className="w-3 h-3 text-cyan-400" />
                  <span>MEMBER BIASA</span>
                </span>
              )}
            </div>
            <p className="text-xs text-slate-300 font-mono">{user.email}</p>
            {user.phone && <p className="text-xs text-slate-400">{user.phone}</p>}
          </div>

          {/* Shortcut Khusus Super Admin */}
          {isSuperAdmin && (
            <Link to="/dashboard" className="shrink-0">
              <Button variant="primary" size="sm" className="gap-1.5 shadow-md shadow-purple-600/20">
                <LayoutDashboard className="w-3.5 h-3.5" />
                <span>Buka Dashboard</span>
              </Button>
            </Link>
          )}
        </div>

        {/* Info Hak Akses */}
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 text-xs text-slate-300 space-y-1">
          <p className="font-semibold text-white flex items-center gap-2">
            <Shield className="w-4 h-4 text-purple-400" />
            <span>Hak Akses Akun:</span>
          </p>
          {isSuperAdmin ? (
            <p className="text-slate-400 leading-relaxed">
              Anda memiliki hak akses penuh sebagai <strong>Super Admin</strong>. Anda dapat mengelola katalog game, mengatur harga topup, mengedit banner beranda, dan mengontrol semua pesanan di Dashboard.
            </p>
          ) : (
            <p className="text-slate-400 leading-relaxed">
              Anda masuk sebagai <strong>Member Biasa</strong>. Anda dapat melakukan transaksi reload game, melihat riwayat pesanan, dan memperbarui kata sandi akun Anda di formulir bawah ini.
            </p>
          )}
        </div>

        {/* Form Ganti Password */}
        <div className="space-y-4 pt-2">
          <div className="flex items-center gap-2 pb-2">
            <KeyRound className="w-4 h-4 text-purple-400" />
            <h3 className="text-sm font-bold font-heading text-white uppercase tracking-wider">
              Ganti Kata Sandi
            </h3>
          </div>

          {passError && (
            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{passError}</span>
            </div>
          )}

          {passSuccess && (
            <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{passSuccess}</span>
            </div>
          )}

          <form onSubmit={handleChangePassword} className="space-y-3.5">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Kata Sandi Saat Ini</label>
              <input
                type="password"
                required
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                placeholder="Masukkan kata sandi lama Anda"
                className="w-full px-4 py-2.5 text-xs rounded-xl glass-card text-white placeholder-slate-500 border border-slate-700 focus:border-purple-400 focus:outline-none focus:ring-1 focus:ring-purple-400/50"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Kata Sandi Baru</label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Minimal 6 karakter"
                  className="w-full px-4 py-2.5 text-xs rounded-xl glass-card text-white placeholder-slate-500 border border-slate-700 focus:border-purple-400 focus:outline-none focus:ring-1 focus:ring-purple-400/50"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Konfirmasi Kata Sandi Baru</label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Ulangi kata sandi baru"
                  className="w-full px-4 py-2.5 text-xs rounded-xl glass-card text-white placeholder-slate-500 border border-slate-700 focus:border-purple-400 focus:outline-none focus:ring-1 focus:ring-purple-400/50"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <Button
                type="submit"
                variant="primary"
                size="md"
                isLoading={isChangingPass}
                className="gap-2"
              >
                <Save className="w-4 h-4" />
                <span>Simpan Kata Sandi Baru</span>
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import GameDetail from './pages/GameDetail';
import Checkout from './pages/Checkout';
import OrderStatus from './pages/OrderStatus';
import OrderHistory from './pages/OrderHistory';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import AccountSettings from './pages/AccountSettings';
import ProtectedRoute from './components/common/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import { OrderProvider } from './context/OrderContext';
import { SettingsProvider } from './context/SettingsContext';

export default function App() {
  return (
    <AuthProvider>
      <SettingsProvider>
        <OrderProvider>
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/game/:slug" element={<GameDetail />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/order-status" element={<OrderStatus />} />
              <Route path="/order-status/:invoiceId" element={<OrderStatus />} />
              <Route path="/history" element={<OrderHistory />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Rute Khusus Pengaturan Akun (Member & Super Admin) */}
              <Route
                path="/settings"
                element={
                  <ProtectedRoute>
                    <AccountSettings />
                  </ProtectedRoute>
                }
              />

              {/* Rute Khusus SUPER ADMIN ONLY (Dashboard, Kelola Harga, Editor Gambar Beranda) */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute requiredRole="superadmin">
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              {/* Alias /admin diarahkan ke /dashboard */}
              <Route path="/admin" element={<Navigate to="/dashboard" replace />} />

              {/* Fallback route */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Layout>
        </OrderProvider>
      </SettingsProvider>
    </AuthProvider>
  );
}

import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import Toast from '../common/Toast';

export default function Layout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-[#090b10] text-slate-100 relative selection:bg-cyan-500/30 selection:text-cyan-300">
      {/* Background Ambient Glowing Orbs */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-indigo-900/15 via-purple-900/10 to-transparent blur-3xl pointer-events-none -z-10" />
      <div className="fixed top-20 -left-40 w-96 h-96 bg-cyan-600/10 rounded-full blur-[100px] pointer-events-none -z-10" />
      <div className="fixed top-80 -right-40 w-96 h-96 bg-purple-600/10 rounded-full blur-[100px] pointer-events-none -z-10" />

      {/* Navigation */}
      <Navbar />

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {children}
      </main>

      {/* Footer */}
      <Footer />

      {/* Global Toast */}
      <Toast />
    </div>
  );
}

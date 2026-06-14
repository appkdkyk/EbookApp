import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BookOpen, User, ShieldCheck, KeyRound, ChevronRight, X } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { executeGASAction } from '../lib/api';

export function LoginView() {
  const { setRole, showToast, setAdminPassword } = useStore();
  const [showAdminForm, setShowAdminForm] = useState(false);
  const [password, setPassword] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  const handleUserLogin = () => {
    setRole('user');
    showToast('Berhasil masuk sebagai Pengguna');
  };

  const handleAdminSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) return;
    
    setIsVerifying(true);
    try {
      const res = await executeGASAction('verifyAdmin', { password });
      if (res.success) {
        setAdminPassword(password);
        setRole('admin');
        showToast('Login Admin Berhasil!');
      } else {
        showToast(res.error || 'Password Admin salah!', 'error');
      }
    } catch (e) {
      showToast('Koneksi gagal', 'error');
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-tr from-slate-900 via-indigo-950 to-blue-900 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-blue-500/10 via-transparent to-transparent"></div>
      
      <AnimatePresence mode="wait">
        {!showAdminForm ? (
          <motion.div
            key="selection"
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            className="bg-white/95 backdrop-blur-md p-8 md:p-12 rounded-3xl shadow-2xl text-center max-w-md w-full mx-4 border border-white/20 relative z-10"
          >
            <div className="w-24 h-24 bg-gradient-to-tr from-indigo-600 to-blue-600 text-white rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-indigo-500/20 rotate-3 hover:rotate-0 transition-transform duration-300">
              <BookOpen className="w-12 h-12" />
            </div>
            <h1 className="text-3xl font-black text-slate-900 mb-2 tracking-tight">E-Book Portal</h1>
            <p className="text-slate-500 mb-8 font-medium">DEPO KERETA YOGYAKARTA</p>
            
            <div className="space-y-4">
              <button
                onClick={handleUserLogin}
                className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold py-4 px-6 rounded-2xl transition-all duration-200 flex items-center justify-center gap-3 text-base border border-slate-200"
              >
                <User className="w-5 h-5 text-slate-600" />
                Masuk Sebagai Pengguna
              </button>
              
              <button
                onClick={() => setShowAdminForm(true)}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 px-6 rounded-2xl transition-all duration-200 shadow-lg shadow-indigo-600/20 hover:shadow-indigo-600/40 flex items-center justify-center gap-3 text-base group"
              >
                <ShieldCheck className="w-5 h-5" />
                Masuk Sebagai Admin
                <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="admin-form"
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            className="bg-white/95 backdrop-blur-md p-8 md:p-12 rounded-3xl shadow-2xl text-center max-w-md w-full mx-4 border border-white/20 relative z-10"
          >
            <div className="w-20 h-20 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-rose-100 shadow-inner">
              <KeyRound className="w-10 h-10 animate-pulse" />
            </div>
            <h2 className="text-2xl font-black text-slate-900 mb-1 tracking-tight">Otentikasi Admin</h2>
            <p className="text-slate-500 mb-6 text-sm font-medium">Silakan masukkan password admin Anda</p>
            
            <form onSubmit={handleAdminSubmit} className="space-y-4 text-left">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <KeyRound className="w-4 h-4 text-slate-400" />
                  </div>
                  <input
                    type="password"
                    required
                    placeholder="Masukkan sandi..."
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-sm"
                  />
                </div>
              </div>
              
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowAdminForm(false);
                    setPassword('');
                  }}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3.5 rounded-xl transition-all text-sm text-center"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isVerifying}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-70 text-white font-bold py-3.5 rounded-xl transition-all shadow-md text-sm text-center flex items-center justify-center"
                >
                  {isVerifying ? 'Memverifikasi...' : 'Verifikasi'}
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
